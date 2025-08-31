import { NextResponse } from 'next/server';
import { CivitaiClient } from '@/lib/civitai';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const base = (searchParams.get('base') || 'all').toLowerCase();

    const client = new CivitaiClient();

    const raw = await client.fetchAll({ types: 'Checkpoint', perPage: 100, maxPages: 25 });
    const mapped = client.mapModels(raw);

    const filtered = mapped.filter(m => {
      if (base === 'flux') return (m.category || '').toLowerCase() === 'flux';
      if (base === 'sdxl') return (m.category || '').toLowerCase() === 'sdxl';
      return true;
    });

    return NextResponse.json({ success: true, count: filtered.length, data: filtered });
  } catch (error) {
    console.error('Error fetching models:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch models' }, { status: 500 });
  }
}
