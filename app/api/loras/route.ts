import { NextResponse } from 'next/server';

export interface LoRA {
  id: string;
  name: string;
  type: string;
  description?: string;
  strength?: number;
  category?: string;
  tags?: string[];
}

const loras: LoRA[] = [
  { id: '1', name: 'Anime Style', type: 'style', description: 'Anime art style', strength: 0.8, category: 'art-style', tags: ['anime', 'manga', 'japanese'] },
  { id: '2', name: 'Photorealistic', type: 'style', description: 'Photorealistic enhancement', strength: 0.7, category: 'realism', tags: ['photo', 'realistic', 'detailed'] },
  { id: '3', name: 'Cyberpunk', type: 'theme', description: 'Cyberpunk aesthetic', strength: 0.9, category: 'theme', tags: ['cyberpunk', 'neon', 'futuristic'] },
  { id: '4', name: 'Fantasy Art', type: 'style', description: 'Fantasy art style', strength: 0.8, category: 'art-style', tags: ['fantasy', 'magical', 'medieval'] },
  { id: '5', name: 'Portrait Enhancement', type: 'enhancement', description: 'Portrait quality improvement', strength: 0.6, category: 'enhancement', tags: ['portrait', 'face', 'quality'] },
  { id: '6', name: 'Oil Painting', type: 'style', description: 'Oil painting artistic style', strength: 0.75, category: 'art-style', tags: ['oil', 'painting', 'classical'] },
  { id: '7', name: 'Watercolor', type: 'style', description: 'Watercolor painting style', strength: 0.7, category: 'art-style', tags: ['watercolor', 'soft', 'artistic'] },
  { id: '8', name: 'Pencil Sketch', type: 'style', description: 'Pencil sketch artistic style', strength: 0.8, category: 'art-style', tags: ['pencil', 'sketch', 'drawing'] },
  { id: '9', name: 'Digital Art', type: 'style', description: 'Digital art enhancement', strength: 0.7, category: 'art-style', tags: ['digital', 'modern', 'clean'] },
  { id: '10', name: 'Vintage Film', type: 'style', description: 'Vintage film aesthetic', strength: 0.6, category: 'aesthetic', tags: ['vintage', 'film', 'retro'] },
  { id: '11', name: 'Noir Style', type: 'style', description: 'Film noir aesthetic', strength: 0.8, category: 'aesthetic', tags: ['noir', 'black-white', 'dramatic'] },
  { id: '12', name: 'Steampunk', type: 'theme', description: 'Steampunk aesthetic', strength: 0.85, category: 'theme', tags: ['steampunk', 'victorian', 'mechanical'] },
  { id: '13', name: 'Art Deco', type: 'style', description: 'Art Deco design style', strength: 0.75, category: 'art-style', tags: ['art-deco', 'geometric', '1920s'] },
  { id: '14', name: 'Minimalist', type: 'style', description: 'Minimalist design approach', strength: 0.6, category: 'design', tags: ['minimal', 'clean', 'simple'] },
  { id: '15', name: 'Baroque', type: 'style', description: 'Baroque artistic style', strength: 0.8, category: 'art-style', tags: ['baroque', 'ornate', 'classical'] },
  { id: '16', name: 'Pop Art', type: 'style', description: 'Pop art style', strength: 0.85, category: 'art-style', tags: ['pop-art', 'colorful', 'bold'] },
  { id: '17', name: 'Impressionist', type: 'style', description: 'Impressionist painting style', strength: 0.7, category: 'art-style', tags: ['impressionist', 'soft', 'light'] },
  { id: '18', name: 'Surreal', type: 'style', description: 'Surrealist artistic style', strength: 0.9, category: 'art-style', tags: ['surreal', 'dreamlike', 'abstract'] },
  { id: '19', name: 'Gothic', type: 'theme', description: 'Gothic aesthetic', strength: 0.8, category: 'theme', tags: ['gothic', 'dark', 'medieval'] },
  { id: '20', name: 'Sci-Fi', type: 'theme', description: 'Science fiction theme', strength: 0.85, category: 'theme', tags: ['sci-fi', 'futuristic', 'technology'] },
  { id: '21', name: 'Horror', type: 'theme', description: 'Horror aesthetic', strength: 0.9, category: 'theme', tags: ['horror', 'scary', 'dark'] },
  { id: '22', name: 'Kawaii', type: 'style', description: 'Cute Japanese style', strength: 0.8, category: 'art-style', tags: ['kawaii', 'cute', 'japanese'] },
  { id: '23', name: 'Chibi', type: 'style', description: 'Chibi character style', strength: 0.85, category: 'character', tags: ['chibi', 'small', 'cute'] },
  { id: '24', name: 'Realistic Skin', type: 'enhancement', description: 'Realistic skin texture', strength: 0.6, category: 'enhancement', tags: ['skin', 'texture', 'realistic'] },
  { id: '25', name: 'Hair Detail', type: 'enhancement', description: 'Enhanced hair detail', strength: 0.7, category: 'enhancement', tags: ['hair', 'detail', 'texture'] },
  { id: '26', name: 'Eye Enhancement', type: 'enhancement', description: 'Enhanced eye detail', strength: 0.75, category: 'enhancement', tags: ['eyes', 'detail', 'expressive'] },
  { id: '27', name: 'Lighting Master', type: 'enhancement', description: 'Professional lighting', strength: 0.8, category: 'lighting', tags: ['lighting', 'professional', 'dramatic'] },
  { id: '28', name: 'Color Grading', type: 'enhancement', description: 'Professional color grading', strength: 0.65, category: 'color', tags: ['color', 'grading', 'cinematic'] },
  { id: '29', name: 'HDR Effect', type: 'enhancement', description: 'HDR enhancement', strength: 0.7, category: 'enhancement', tags: ['hdr', 'dynamic', 'range'] },
  { id: '30', name: 'Bokeh Effect', type: 'enhancement', description: 'Beautiful bokeh background', strength: 0.6, category: 'photography', tags: ['bokeh', 'blur', 'depth'] },
  { id: '31', name: 'Film Grain', type: 'style', description: 'Analog film grain effect', strength: 0.5, category: 'aesthetic', tags: ['grain', 'film', 'analog'] },
  { id: '32', name: 'Vignette', type: 'enhancement', description: 'Artistic vignette effect', strength: 0.4, category: 'photography', tags: ['vignette', 'frame', 'focus'] },
  { id: '33', name: 'Sepia Tone', type: 'style', description: 'Classic sepia coloring', strength: 0.8, category: 'aesthetic', tags: ['sepia', 'vintage', 'warm'] },
  { id: '34', name: 'Black & White', type: 'style', description: 'Monochrome conversion', strength: 0.9, category: 'aesthetic', tags: ['bw', 'monochrome', 'classic'] },
  { id: '35', name: 'Neon Glow', type: 'effect', description: 'Neon lighting effect', strength: 0.85, category: 'lighting', tags: ['neon', 'glow', 'electric'] },
  { id: '36', name: 'Holographic', type: 'effect', description: 'Holographic effect', strength: 0.8, category: 'futuristic', tags: ['hologram', 'iridescent', 'futuristic'] },
  { id: '37', name: 'Glitch Art', type: 'style', description: 'Digital glitch aesthetic', strength: 0.75, category: 'digital', tags: ['glitch', 'digital', 'error'] },
  { id: '38', name: 'Pixel Art', type: 'style', description: '8-bit pixel art style', strength: 0.9, category: 'digital', tags: ['pixel', '8bit', 'retro'] },
  { id: '39', name: 'Low Poly', type: 'style', description: 'Low polygon 3D style', strength: 0.8, category: '3d', tags: ['low-poly', '3d', 'geometric'] },
  { id: '40', name: 'Voxel Art', type: 'style', description: 'Voxel-based 3D art', strength: 0.85, category: '3d', tags: ['voxel', '3d', 'blocky'] },
  { id: '41', name: 'Tilt-Shift', type: 'effect', description: 'Tilt-shift miniature effect', strength: 0.7, category: 'photography', tags: ['tilt-shift', 'miniature', 'focus'] },
  { id: '42', name: 'Double Exposure', type: 'effect', description: 'Double exposure effect', strength: 0.8, category: 'artistic', tags: ['double-exposure', 'blend', 'artistic'] },
  { id: '43', name: 'Long Exposure', type: 'effect', description: 'Long exposure photography', strength: 0.75, category: 'photography', tags: ['long-exposure', 'motion', 'blur'] },
  { id: '44', name: 'Macro Detail', type: 'enhancement', description: 'Macro photography detail', strength: 0.8, category: 'photography', tags: ['macro', 'detail', 'close-up'] },
  { id: '45', name: 'Wide Angle', type: 'effect', description: 'Wide angle perspective', strength: 0.6, category: 'photography', tags: ['wide-angle', 'perspective', 'distortion'] },
  { id: '46', name: 'Fisheye', type: 'effect', description: 'Fisheye lens effect', strength: 0.8, category: 'photography', tags: ['fisheye', 'curved', 'distortion'] },
  { id: '47', name: 'Motion Blur', type: 'effect', description: 'Dynamic motion blur', strength: 0.7, category: 'motion', tags: ['motion', 'blur', 'speed'] },
  { id: '48', name: 'Depth of Field', type: 'enhancement', description: 'Enhanced depth of field', strength: 0.75, category: 'photography', tags: ['dof', 'depth', 'focus'] },
  { id: '49', name: 'Chromatic Aberration', type: 'effect', description: 'Chromatic aberration effect', strength: 0.5, category: 'lens', tags: ['chromatic', 'aberration', 'color'] },
  { id: '50', name: 'Lens Flare', type: 'effect', description: 'Artistic lens flare', strength: 0.6, category: 'lighting', tags: ['lens-flare', 'light', 'sun'] },
];

for (let i = 51; i <= 1000; i++) {
  const types = ['style', 'enhancement', 'effect', 'theme', 'character', 'lighting', 'color'];
  const categories = ['art-style', 'enhancement', 'photography', 'aesthetic', 'theme', 'digital', '3d', 'lighting', 'color'];
  const tagOptions = ['artistic', 'realistic', 'fantasy', 'modern', 'vintage', 'colorful', 'dramatic', 'soft', 'bold', 'detailed'];
  
  loras.push({
    id: i.toString(),
    name: `LoRA ${i}`,
    type: types[Math.floor(Math.random() * types.length)],
    description: `Generated LoRA ${i} for testing purposes`,
    strength: Math.round((Math.random() * 0.5 + 0.5) * 100) / 100,
    category: categories[Math.floor(Math.random() * categories.length)],
    tags: [
      tagOptions[Math.floor(Math.random() * tagOptions.length)],
      tagOptions[Math.floor(Math.random() * tagOptions.length)]
    ]
  });
}

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      data: loras
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch LoRAs' },
      { status: 500 }
    );
  }
}
