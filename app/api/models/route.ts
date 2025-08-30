import { NextResponse } from 'next/server';

export interface Model {
  id: string;
  name: string;
  type: string;
  provider: string;
  description?: string;
  category?: string;
  version?: string;
}

const models: Model[] = [
  { id: '1', name: 'SDXL Base 1.0', type: 'image', provider: 'Stability AI', description: 'High-quality image generation', category: 'base', version: '1.0' },
  { id: '2', name: 'SDXL Turbo', type: 'image', provider: 'Stability AI', description: 'Fast image generation', category: 'turbo', version: '1.0' },
  { id: '3', name: 'SDXL Lightning', type: 'image', provider: 'Stability AI', description: 'Ultra-fast image generation', category: 'lightning', version: '1.0' },
  { id: '4', name: 'SD 1.5', type: 'image', provider: 'Stability AI', description: 'Classic stable diffusion', category: 'base', version: '1.5' },
  { id: '5', name: 'SD 2.1', type: 'image', provider: 'Stability AI', description: 'Improved stable diffusion', category: 'base', version: '2.1' },
  { id: '6', name: 'Flux Pro', type: 'image', provider: 'Black Forest Labs', description: 'Professional image generation', category: 'professional', version: '1.0' },
  { id: '7', name: 'Flux Dev', type: 'image', provider: 'Black Forest Labs', description: 'Development version of Flux', category: 'development', version: '1.0' },
  { id: '8', name: 'Flux Schnell', type: 'image', provider: 'Black Forest Labs', description: 'Fast Flux generation', category: 'fast', version: '1.0' },
  { id: '9', name: 'Runway Gen-3 Alpha', type: 'video', provider: 'Runway', description: 'Video generation model', category: 'alpha', version: '3.0' },
  { id: '10', name: 'Runway Gen-2', type: 'video', provider: 'Runway', description: 'Previous generation video model', category: 'stable', version: '2.0' },
  { id: '11', name: 'Kling AI', type: 'video', provider: 'Kling', description: 'Advanced video generation', category: 'advanced', version: '1.0' },
  { id: '12', name: 'Pika Labs 1.0', type: 'video', provider: 'Pika Labs', description: 'Creative video generation', category: 'creative', version: '1.0' },
  { id: '13', name: 'Stable Video Diffusion', type: 'video', provider: 'Stability AI', description: 'Video diffusion model', category: 'base', version: '1.0' },
  { id: '14', name: 'AnimateDiff', type: 'video', provider: 'Community', description: 'Animation generation', category: 'animation', version: '1.0' },
  { id: '15', name: 'DreamBooth SDXL', type: 'image', provider: 'Google', description: 'Personalized image generation', category: 'personalized', version: '1.0' },
  { id: '16', name: 'ControlNet SDXL', type: 'image', provider: 'Community', description: 'Controlled image generation', category: 'controlled', version: '1.0' },
  { id: '17', name: 'InstructPix2Pix', type: 'image', provider: 'Community', description: 'Instruction-based image editing', category: 'editing', version: '1.0' },
  { id: '18', name: 'DALL-E 3', type: 'image', provider: 'OpenAI', description: 'Advanced text-to-image', category: 'advanced', version: '3.0' },
  { id: '19', name: 'DALL-E 2', type: 'image', provider: 'OpenAI', description: 'Text-to-image generation', category: 'base', version: '2.0' },
  { id: '20', name: 'Midjourney v6', type: 'image', provider: 'Midjourney', description: 'Artistic image generation', category: 'artistic', version: '6.0' },
  { id: '21', name: 'Midjourney v5.2', type: 'image', provider: 'Midjourney', description: 'Previous Midjourney version', category: 'artistic', version: '5.2' },
  { id: '22', name: 'Firefly 2', type: 'image', provider: 'Adobe', description: 'Commercial-safe generation', category: 'commercial', version: '2.0' },
  { id: '23', name: 'Kandinsky 3.0', type: 'image', provider: 'Sber AI', description: 'Multilingual image generation', category: 'multilingual', version: '3.0' },
  { id: '24', name: 'DeepFloyd IF', type: 'image', provider: 'Stability AI', description: 'High-resolution generation', category: 'high-res', version: '1.0' },
  { id: '25', name: 'Waifu Diffusion', type: 'image', provider: 'Community', description: 'Anime-style generation', category: 'anime', version: '1.4' },
  { id: '26', name: 'Anything v5', type: 'image', provider: 'Community', description: 'Versatile anime model', category: 'anime', version: '5.0' },
  { id: '27', name: 'Realistic Vision v5', type: 'image', provider: 'Community', description: 'Photorealistic generation', category: 'realistic', version: '5.0' },
  { id: '28', name: 'DreamShaper v8', type: 'image', provider: 'Community', description: 'Artistic generation', category: 'artistic', version: '8.0' },
  { id: '29', name: 'Protogen x3.4', type: 'image', provider: 'Community', description: 'Sci-fi generation', category: 'sci-fi', version: '3.4' },
  { id: '30', name: 'OpenJourney v4', type: 'image', provider: 'Community', description: 'Open-source Midjourney alternative', category: 'open-source', version: '4.0' },
  { id: '31', name: 'Deliberate v2', type: 'image', provider: 'Community', description: 'Detailed generation', category: 'detailed', version: '2.0' },
  { id: '32', name: 'ChilloutMix', type: 'image', provider: 'Community', description: 'Relaxed style generation', category: 'lifestyle', version: '1.0' },
  { id: '33', name: 'AbyssOrangeMix3', type: 'image', provider: 'Community', description: 'Vibrant anime generation', category: 'anime', version: '3.0' },
  { id: '34', name: 'MeinaMix v11', type: 'image', provider: 'Community', description: 'High-quality anime', category: 'anime', version: '11.0' },
  { id: '35', name: 'RevAnimated v1.2.2', type: 'image', provider: 'Community', description: 'Reverse-engineered animation', category: 'animation', version: '1.2.2' },
  { id: '36', name: 'Epic Realism', type: 'image', provider: 'Community', description: 'Epic realistic scenes', category: 'realistic', version: '1.0' },
  { id: '37', name: 'Juggernaut XL v9', type: 'image', provider: 'Community', description: 'Powerful SDXL model', category: 'powerful', version: '9.0' },
  { id: '38', name: 'RealVisXL v4', type: 'image', provider: 'Community', description: 'Realistic SDXL model', category: 'realistic', version: '4.0' },
  { id: '39', name: 'DreamShaper XL', type: 'image', provider: 'Community', description: 'SDXL artistic model', category: 'artistic', version: '1.0' },
  { id: '40', name: 'Playground v2.5', type: 'image', provider: 'Playground AI', description: 'Versatile generation', category: 'versatile', version: '2.5' },
  { id: '41', name: 'Leonardo Diffusion XL', type: 'image', provider: 'Leonardo AI', description: 'Professional generation', category: 'professional', version: '1.0' },
  { id: '42', name: 'Stable Cascade', type: 'image', provider: 'Stability AI', description: 'Cascaded generation', category: 'advanced', version: '1.0' },
  { id: '43', name: 'PixArt-α', type: 'image', provider: 'PixArt', description: 'High-quality text-to-image', category: 'high-quality', version: '1.0' },
  { id: '44', name: 'SDXL-VAE', type: 'image', provider: 'Stability AI', description: 'Improved VAE for SDXL', category: 'enhancement', version: '1.0' },
  { id: '45', name: 'LCM-LoRA SDXL', type: 'image', provider: 'Community', description: 'Latent consistency model', category: 'fast', version: '1.0' },
  { id: '46', name: 'Turbo SDXL', type: 'image', provider: 'Community', description: 'Accelerated SDXL', category: 'turbo', version: '1.0' },
  { id: '47', name: 'InstantID', type: 'image', provider: 'Community', description: 'Identity-preserving generation', category: 'identity', version: '1.0' },
  { id: '48', name: 'PhotoMaker', type: 'image', provider: 'Community', description: 'Photo-realistic portraits', category: 'portrait', version: '1.0' },
  { id: '49', name: 'IP-Adapter', type: 'image', provider: 'Community', description: 'Image prompt adapter', category: 'adapter', version: '1.0' },
  { id: '50', name: 'T2I-Adapter', type: 'image', provider: 'Community', description: 'Text-to-image adapter', category: 'adapter', version: '1.0' },
];

for (let i = 51; i <= 500; i++) {
  const providers = ['Stability AI', 'Black Forest Labs', 'Runway', 'Community', 'OpenAI', 'Midjourney', 'Adobe', 'Replicate'];
  const types = ['image', 'video'];
  const categories = ['base', 'artistic', 'realistic', 'anime', 'professional', 'fast', 'experimental', 'specialized'];
  
  models.push({
    id: i.toString(),
    name: `Model ${i}`,
    type: types[Math.floor(Math.random() * types.length)],
    provider: providers[Math.floor(Math.random() * providers.length)],
    description: `Generated model ${i} for testing purposes`,
    category: categories[Math.floor(Math.random() * categories.length)],
    version: `${Math.floor(Math.random() * 5) + 1}.${Math.floor(Math.random() * 10)}`
  });
}

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      data: models
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch models' },
      { status: 500 }
    );
  }
}
