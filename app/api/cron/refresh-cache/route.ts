import { NextResponse } from 'next/server';
import { CacheService } from '@/lib/cache';
import { CivitaiAPI, ReplicateAPI, KlingAPI } from '@/lib/external-apis';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await CacheService.initializeTables();

    const civitaiAPI = new CivitaiAPI();
    const replicateAPI = new ReplicateAPI();
    const klingAPI = new KlingAPI();

    const [modelsFromCivitai, modelsFromReplicate, modelsFromKling, lorasFromCivitai] = await Promise.all([
      civitaiAPI.getModels(50),
      replicateAPI.getModels(),
      klingAPI.getModels(),
      civitaiAPI.getLoRAs(100)
    ]);

    const models = [
      ...modelsFromCivitai,
      ...modelsFromReplicate,
      ...modelsFromKling
    ];

    await Promise.all([
      CacheService.setModels(models),
      CacheService.setLoRAs(lorasFromCivitai)
    ]);

    return NextResponse.json({ success: true, models: models.length, loras: lorasFromCivitai.length });
  } catch (error) {
    console.error('Cron refresh error:', error);
    return NextResponse.json({ success: false, error: 'Failed to refresh cache' }, { status: 500 });
  }
}

