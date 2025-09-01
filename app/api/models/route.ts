import { NextResponse } from 'next/server';
import { CivitaiAPI, ReplicateAPI, KlingAPI } from '@/lib/external-apis';
import { CacheService } from '@/lib/cache';
import { Model } from '@/lib/api-client';

export async function GET() {
  try {
    await CacheService.initializeTables();

    let models = await CacheService.getModels();
    
    if (!models) {
      const civitaiAPI = new CivitaiAPI();
      const replicateAPI = new ReplicateAPI();
      const klingAPI = new KlingAPI();

      const [civitaiModels, replicateModels, klingModels] = await Promise.all([
        civitaiAPI.getModels(15),
        replicateAPI.getModels(),
        klingAPI.getModels()
      ]);

      models = [
        ...civitaiModels,
        ...replicateModels,
        ...klingModels
      ];

      await CacheService.setModels(models);
    }

    return NextResponse.json({
      success: true,
      data: models
    });
  } catch (error) {
    console.error('Error fetching models:', error);
    
    const fallbackModels: Model[] = [
      { id: 'flux-sfw', name: 'Flux.1 SFW', type: 'image', provider: 'Black Forest Labs', description: 'Flux SFW', category: 'flux', version: '1.0' },
      { id: 'flux-nsfw', name: 'Flux.1 NSFW', type: 'image', provider: 'Black Forest Labs', description: 'Flux NSFW', category: 'flux', version: '1.0' },
      { id: 'sdxl-sfw', name: 'SDXL Base 1.0 SFW', type: 'image', provider: 'Stability AI', description: 'SDXL SFW', category: 'sdxl', version: '1.0' },
      { id: 'sdxl-nsfw', name: 'SDXL Base 1.0 NSFW', type: 'image', provider: 'Stability AI', description: 'SDXL NSFW', category: 'sdxl', version: '1.0' },
      { id: 'kling-v1.6', name: 'Kling AI v1.6', type: 'video', provider: 'Kling', description: 'Kling v1.6', category: 'video', version: '1.6' },
      { id: 'kling-v2.1', name: 'Kling AI v2.1', type: 'video', provider: 'Kling', description: 'Kling v2.1', category: 'video', version: '2.1' },
      { id: 'wan-2.2', name: 'WAN 2.2', type: 'video', provider: 'Wan', description: 'WAN 2.2 Video', category: 'video', version: '2.2' }
    ];
    
    return NextResponse.json({
      success: true,
      data: fallbackModels
    });
  }
}
