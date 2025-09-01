export interface Model {
  id: string;
  name: string;
  description: string;
  category: string;
  type: string;
  baseModel: string;
  version: string;
  size: string;
  downloadCount: number;
  rating: number;
  tags: string[];
  nsfw: boolean;
  commercial: boolean;
  source?: string;
}

export interface LoRA {
  id: string;
  name: string;
  type: 'style' | 'character' | 'concept' | 'pose';
  description: string;
  strength: number;
  category: string;
  tags: string[];
  downloadCount?: number;
  rating?: number;
  baseModel?: string;
  source?: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  status: 'draft' | 'active' | 'completed';
  modelId: string;
  settings: Record<string, unknown>;
}

export interface Render {
  id: string;
  projectId: string;
  prompt: string;
  negativePrompt?: string;
  modelId: string;
  loraIds: string[];
  settings: Record<string, unknown>;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  imageUrl?: string;
  createdAt: string;
  completedAt?: string;
}
