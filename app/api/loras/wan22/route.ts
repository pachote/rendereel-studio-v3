import { NextResponse } from 'next/server';
import { CivitaiClient } from '@/lib/civitai';

export async function GET() {
  try {
    const client = new CivitaiClient();
    const raw = await client.fetchAll({ types: 'LORA', perPage: 100, maxPages: 25 });
    const mapped = client.mapLoRAs(raw);
    const filtered = mapped.filter(l => l.name.toLowerCase().includes('wan'));

    return NextResponse.json({ success: true, count: filtered.length, data: filtered });
  } catch (error) {
    console.error('Error fetching WAN 2.2 LoRAs:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch WAN 2.2 LoRAs' }, { status: 500 });
  }
}