import { Model, LoRA } from './api-client';

interface CivitaiModel {
  id: number;
  name: string;
  description: string;
  type: string;
  nsfw: boolean;
  allowNoCredit: boolean;
  allowCommercialUse: string[];
  allowDerivatives: boolean;
  stats: {
    downloadCount: number;
    favoriteCount: number;
    thumbsUpCount: number;
    rating: number;
  };
  modelVersions: Array<{
    id: number;
    name: string;
    baseModel: string;
    baseModelType: string;
    publishedAt: string;
    availability: string;
    files: Array<{
      id: number;
      name: string;
      type: string;
      sizeKB: number;
      downloadUrl: string;
    }>;
  }>;
}

interface ReplicateModel {
  url: string;
  owner: string;
  name: string;
  description: string;
  visibility: string;
  github_url: string;
  paper_url: string;
  license_url: string;
  cover_image_url: string;
  default_example: any;
  latest_version: {
    id: string;
    created_at: string;
    cog_version: string;
    openapi_schema: any;
  };
}

export class CivitaiAPI {
  private baseUrl = 'https://civitai.com/api/v1';
  private apiKey = process.env.CIVITAI_API_KEY;

  async getModels(limit = 2000, types = 'Checkpoint'): Promise<Model[]> {
    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      if (this.apiKey) {
        headers['Authorization'] = `Bearer ${this.apiKey}`;
      }

      const aggregated: any[] = [];
      let page = 1;
      const pageLimit = 100;

      while (aggregated.length < limit) {
        const url = `${this.baseUrl}/models?limit=${pageLimit}&types=${types}&page=${page}`;
        const response = await fetch(url, { headers });
        if (!response.ok) {
          throw new Error(`Civitai API error: ${response.status}`);
        }
        const data = await response.json();
        const items = data.items || [];
        if (items.length === 0) break;
        aggregated.push(...items);
        page += 1;
      }

      return this.mapCivitaiModelsToInternal(aggregated.slice(0, limit));
    } catch (error) {
      console.error('Error fetching Civitai models:', error);
      return [];
    }
  }

  async getLoRAs(limit = 4000): Promise<LoRA[]> {
    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      if (this.apiKey) {
        headers['Authorization'] = `Bearer ${this.apiKey}`;
      }

      const aggregated: any[] = [];
      let page = 1;
      const pageLimit = 100;

      while (aggregated.length < limit) {
        const url = `${this.baseUrl}/models?limit=${pageLimit}&types=LORA&page=${page}`;
        const response = await fetch(url, { headers });
        if (!response.ok) {
          throw new Error(`Civitai API error: ${response.status}`);
        }
        const data = await response.json();
        const items = data.items || [];
        if (items.length === 0) break;
        aggregated.push(...items);
        page += 1;
      }

      return this.mapCivitaiLoRAsToInternal(aggregated.slice(0, limit));
    } catch (error) {
      console.error('Error fetching Civitai LoRAs:', error);
      return [];
    }
  }

  private mapCivitaiModelsToInternal(civitaiModels: CivitaiModel[]): Model[] {
    return civitaiModels.map(model => {
      const latestVersion = model.modelVersions?.[0];
      const baseModel = latestVersion?.baseModel || 'Unknown';
      
      let category = 'general';
      if (baseModel.includes('SDXL')) category = 'sdxl';
      else if (baseModel.includes('SD 1.5')) category = 'sd15';
      else if (baseModel.includes('Flux')) category = 'flux';

      return {
        id: model.id.toString(),
        name: model.name,
        type: baseModel.includes('SDXL') ? 'image' : baseModel.includes('Flux') ? 'image' : 'image',
        provider: 'Civitai',
        description: model.description?.replace(/<[^>]*>/g, '').substring(0, 200) || '',
        category,
        version: latestVersion?.name || '1.0'
      };
    });
  }

  private mapCivitaiLoRAsToInternal(civitaiLoRAs: CivitaiModel[]): LoRA[] {
    return civitaiLoRAs.map(lora => {
      const latestVersion = lora.modelVersions?.[0];
      const baseModel = latestVersion?.baseModel || 'Unknown';
      
      let category = 'style';
      if (lora.name.toLowerCase().includes('character')) category = 'character';
      else if (lora.name.toLowerCase().includes('concept')) category = 'concept';
      else if (lora.name.toLowerCase().includes('pose')) category = 'pose';

      return {
        id: lora.id.toString(),
        name: lora.name,
        type: category,
        description: lora.description?.replace(/<[^>]*>/g, '').substring(0, 200) || '',
        strength: 0.8,
        category,
        tags: [baseModel.toLowerCase(), category]
      };
    });
  }
}

export class ReplicateAPI {
  private baseUrl = 'https://api.replicate.com/v1';
  private apiKey = process.env.REPLICATE_API_TOKEN;

  async getModels(): Promise<Model[]> {
    if (!this.apiKey) {
      console.warn('REPLICATE_API_TOKEN not found');
      return [];
    }

    try {
      const response = await fetch(`${this.baseUrl}/models`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Replicate API error: ${response.status}`);
      }

      const data = await response.json();
      return this.mapReplicateModelsToInternal(data.results || []);
    } catch (error) {
      console.error('Error fetching Replicate models:', error);
      return [];
    }
  }

  private mapReplicateModelsToInternal(replicateModels: ReplicateModel[]): Model[] {
    return replicateModels
      .filter(model => 
        model.name.toLowerCase().includes('flux') ||
        model.name.toLowerCase().includes('sdxl') ||
        model.name.toLowerCase().includes('stable-diffusion')
      )
      .map(model => {
        let category = 'general';
        let type = 'sd15';
        
        if (model.name.toLowerCase().includes('flux')) {
          category = 'flux';
          type = 'flux';
        } else if (model.name.toLowerCase().includes('sdxl')) {
          category = 'sdxl';
          type = 'sdxl';
        }

        return {
          id: `replicate-${model.owner}-${model.name}`,
          name: `${model.owner}/${model.name}`,
          type: 'image',
          provider: 'Replicate',
          description: model.description || '',
          category,
          version: model.latest_version?.id?.substring(0, 8) || '1.0'
        };
      });
  }
}

export class KlingAPI {
  private baseUrl = 'https://api.kling.ai/v1';
  private apiKey = process.env.KLING_API_KEY;

  async getModels(): Promise<Model[]> {
    if (!this.apiKey) {
      console.warn('KLING_API_KEY not found');
      return this.getFallbackKlingModels();
    }

    try {
      const response = await fetch(`${this.baseUrl}/models`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        console.warn('Kling API not accessible, using fallback models');
        return this.getFallbackKlingModels();
      }

      const data = await response.json();
      return this.mapKlingModelsToInternal(data.models || []);
    } catch (error) {
      console.error('Error fetching Kling models:', error);
      return this.getFallbackKlingModels();
    }
  }

  private getFallbackKlingModels(): Model[] {
    return [
      {
        id: 'kling-v1',
        name: 'Kling AI v1.0',
        type: 'video',
        provider: 'Kling',
        description: 'Advanced video generation model',
        category: 'video',
        version: '1.0'
      },
      {
        id: 'kling-v1.5',
        name: 'Kling AI v1.5',
        type: 'video',
        provider: 'Kling',
        description: 'Enhanced video generation with better quality',
        category: 'video',
        version: '1.5'
      }
    ];
  }

  private mapKlingModelsToInternal(klingModels: any[]): Model[] {
    return klingModels.map((model, index) => ({
      id: `kling-${model.id || index}`,
      name: model.name || `Kling Model ${index + 1}`,
      type: 'video',
      provider: 'Kling',
      description: model.description || 'Kling AI video generation model',
      category: 'video',
      version: model.version || '1.0'
    }));
  }
}
