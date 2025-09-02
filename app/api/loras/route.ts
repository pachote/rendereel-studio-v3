import { NextResponse } from 'next/server';
import { CivitaiClient } from '@/lib/civitai';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const base = (searchParams.get('base') || 'all').toLowerCase();
    const category = (searchParams.get('category') || 'all').toLowerCase();

    const client = new CivitaiClient();

    const raw = await client.fetchAll({ types: 'LORA', perPage: 100, maxPages: 25 });
    const mapped = client.mapLoRAs(raw);

    const filtered = mapped.filter(l => {
      const baseOk = base === 'all' ? true : (l.tags || []).some(t => t.toLowerCase().includes(base));
      const cat = (l.category || '').toLowerCase();
      const categoryMatch = category === 'all' ? true : cat === category;
      return baseOk && categoryMatch;
    });

    return NextResponse.json({ success: true, count: filtered.length, data: filtered });
  } catch (error) {
    console.error('Error fetching LoRAs:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch LoRAs' }, { status: 500 });
  }
}
