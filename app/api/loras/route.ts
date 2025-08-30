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
      { id: 'anime-style', name: 'Anime Style', type: 'style', description: 'Anime art style enhancement', strength: 0.8, category: 'art-style', tags: ['anime', 'manga', 'japanese'] },
      { id: 'photorealistic', name: 'Photorealistic', type: 'style', description: 'Photorealistic enhancement', strength: 0.7, category: 'realism', tags: ['photo', 'realistic', 'detailed'] },
      { id: 'cyberpunk', name: 'Cyberpunk', type: 'theme', description: 'Cyberpunk aesthetic', strength: 0.9, category: 'theme', tags: ['cyberpunk', 'neon', 'futuristic'] },
      { id: 'fantasy-art', name: 'Fantasy Art', type: 'style', description: 'Fantasy art style', strength: 0.8, category: 'art-style', tags: ['fantasy', 'magical', 'medieval'] }
    ];
    
    return NextResponse.json({
      success: true,
      data: fallbackLoRAs
    });
  }
}
