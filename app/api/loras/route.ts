import { NextResponse } from 'next/server';
import { CivitaiAPI } from '@/lib/external-apis';
import { CacheService } from '@/lib/cache';
import { LoRA } from '@/lib/api-client';

export async function GET() {
  try {
    await CacheService.initializeTables();

    let loras = await CacheService.getLoRAs();
    
    if (!loras) {
      const civitaiAPI = new CivitaiAPI();
      loras = await civitaiAPI.getLoRAs(20);
      await CacheService.setLoRAs(loras);
    }

    return NextResponse.json({
      success: true,
      data: loras
    });
  } catch (error) {
    console.error('Error fetching LoRAs:', error);
    
    const fallbackLoRAs: LoRA[] = [
      // Flux SFW/NSFW
      { id: 'flux-sfw-style', name: 'Flux SFW Style', type: 'style', description: 'Flux SFW style', strength: 0.8, category: 'flux', tags: ['flux', 'sfw'] },
      { id: 'flux-nsfw-style', name: 'Flux NSFW Style', type: 'style', description: 'Flux NSFW style', strength: 0.8, category: 'flux', tags: ['flux', 'nsfw'] },
      // SDXL SFW/NSFW
      { id: 'sdxl-sfw-photoreal', name: 'SDXL Photoreal SFW', type: 'style', description: 'SDXL photoreal', strength: 0.7, category: 'sdxl', tags: ['sdxl', 'sfw'] },
      { id: 'sdxl-nsfw-photoreal', name: 'SDXL Photoreal NSFW', type: 'style', description: 'SDXL photoreal NSFW', strength: 0.7, category: 'sdxl', tags: ['sdxl', 'nsfw'] },
      // WAN 2.2 video LoRAs
      { id: 'wan-2.2-sfw-motion', name: 'WAN 2.2 Motion SFW', type: 'motion', description: 'WAN motion sfw', strength: 0.6, category: 'wan', tags: ['wan 2.2', 'sfw'] },
      { id: 'wan-2.2-nsfw-motion', name: 'WAN 2.2 Motion NSFW', type: 'motion', description: 'WAN motion nsfw', strength: 0.6, category: 'wan', tags: ['wan 2.2', 'nsfw'] }
    ];
    
    return NextResponse.json({
      success: true,
      data: fallbackLoRAs
    });
  }
}
