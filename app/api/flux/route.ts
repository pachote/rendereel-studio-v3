import { NextRequest, NextResponse } from 'next/server';

const REPLICATE_API_BASE = 'https://api.replicate.com/v1';
const MODEL = 'black-forest-labs/flux-dev';

async function getLatestModelVersion(): Promise<string | null> {
	const apiKey = process.env.REPLICATE_API_TOKEN;
	if (!apiKey) return null;
	const res = await fetch(`${REPLICATE_API_BASE}/models/${MODEL}/versions`, {
		headers: {
			Authorization: `Bearer ${apiKey}`,
			'Content-Type': 'application/json',
		},
		cache: 'no-store',
	});
	if (!res.ok) return null;
	const data = await res.json();
	const latest = data?.results?.[0]?.id as string | undefined;
	return latest || null;
}

export async function POST(req: NextRequest) {
	try {
		const apiKey = process.env.REPLICATE_API_TOKEN;
		if (!apiKey) {
			return NextResponse.json({ error: 'Missing REPLICATE_API_TOKEN' }, { status: 500 });
		}

		const body = await req.json();
		const prompt: string = body?.prompt || '';
		const aspectRatio: string = body?.aspectRatio || '1:1';
		const steps: number = Math.max(1, Math.min(50, Number(body?.steps ?? 28)));
		const guidance: number = Math.max(1, Math.min(10, Number(body?.guidance ?? 4)));

		if (!prompt || prompt.trim().length < 3) {
			return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
		}

		// Map aspect ratio to dimensions
		let width = 1024;
		let height = 1024;
		switch (aspectRatio) {
			case '16:9':
				width = 1280; height = 720; break;
			case '3:2':
				width = 1152; height = 768; break;
			case '4:5':
				width = 896; height = 1120; break;
			default:
				width = 1024; height = 1024; break;
		}

		const version = await getLatestModelVersion();
		const payload: any = version
			? { version, input: { prompt, width, height, num_inference_steps: steps, guidance_scale: guidance } }
			: { model: MODEL, input: { prompt, width, height, num_inference_steps: steps, guidance_scale: guidance } };

		const res = await fetch(`${REPLICATE_API_BASE}/predictions`, {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${apiKey}`,
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(payload),
		});

		if (!res.ok) {
			const errText = await res.text();
			return NextResponse.json({ error: 'Replicate create failed', details: errText }, { status: 500 });
		}

		const data = await res.json();
		return NextResponse.json({ id: data.id, status: data.status });
	} catch (e: any) {
		return NextResponse.json({ error: 'Server error', details: e?.message }, { status: 500 });
	}
}

export async function GET(req: NextRequest) {
	try {
		const apiKey = process.env.REPLICATE_API_TOKEN;
		if (!apiKey) {
			return NextResponse.json({ error: 'Missing REPLICATE_API_TOKEN' }, { status: 500 });
		}
		const { searchParams } = new URL(req.url);
		const id = searchParams.get('id');
		if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

		const res = await fetch(`${REPLICATE_API_BASE}/predictions/${id}`, {
			headers: {
				Authorization: `Bearer ${apiKey}`,
				'Content-Type': 'application/json',
			},
			cache: 'no-store',
		});

		if (!res.ok) {
			const errText = await res.text();
			return NextResponse.json({ error: 'Replicate fetch failed', details: errText }, { status: 500 });
		}

		const data = await res.json();
		return NextResponse.json({
			id: data.id,
			status: data.status,
			output: data.output || null,
			error: data.error || null,
		});
	} catch (e: any) {
		return NextResponse.json({ error: 'Server error', details: e?.message }, { status: 500 });
	}
}

