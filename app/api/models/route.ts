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
        civitaiAPI.getModels(3000),
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
      { id: 'flux-dev', name: 'Flux.1 [dev]', type: 'image', provider: 'Black Forest Labs', description: 'Advanced diffusion model', category: 'flux', version: '1.0' },
      { id: 'sdxl-base', name: 'SDXL Base 1.0', type: 'image', provider: 'Stability AI', description: 'High-quality image generation', category: 'sdxl', version: '1.0' },
      { id: 'kling-v1', name: 'Kling AI v1.0', type: 'video', provider: 'Kling', description: 'Video generation model', category: 'video', version: '1.0' },
      { id: 'wan-2.2', name: 'Wan 2.2', type: 'image', provider: 'Community', description: 'Anime-style generation', category: 'anime', version: '2.2' }
    ];
    
    return NextResponse.json({
      success: true,
      data: fallbackModels
    });
  }
}
