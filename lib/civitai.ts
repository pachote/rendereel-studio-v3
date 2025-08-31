import { Model, LoRA } from './api-client';

interface CivitaiModelResponse {
  items: CivitaiModel[];
  metadata?: { currentPage?: number; nextPage?: number | null; totalItems?: number };
}

interface CivitaiModel {
  id: number;
  name: string;
  description?: string;
  type: string;
  nsfw?: boolean;
  tags?: string[];
  modelVersions?: Array<{
    id: number;
    name: string;
    baseModel?: string;
    baseModelType?: string;
    publishedAt?: string;
    files?: Array<{ id: number; name: string; type: string; sizeKB: number; downloadUrl: string }>;
  }>;
  stats?: { downloadCount?: number; favoriteCount?: number; thumbsUpCount?: number; rating?: number };
}

type FetchAllOptions = {
  types: 'Checkpoint' | 'LORA';
  baseModels?: string[];
  query?: string;
  perPage?: number;
  maxPages?: number;
  includeNsfw?: boolean;
};

export class CivitaiClient {
  private baseUrl = 'https://civitai.com/api/v1/models';
  private apiKey = process.env.CIVITAI_API_KEY;

  private buildHeaders(): Record<string, string> {
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (this.apiKey) {
      headers['Authorization'] = `Bearer ${this.apiKey}`;
      headers['X-Api-Key'] = this.apiKey as string;
    }
    return headers;
  }

  async fetchAll(options: FetchAllOptions): Promise<CivitaiModel[]> {
    const perPage = options.perPage ?? 100;
    const maxPages = options.maxPages ?? 50;
    let page = 1;
    const all: CivitaiModel[] = [];

    while (page <= maxPages) {
      const url = new URL(this.baseUrl);
      url.searchParams.set('limit', String(perPage));
      url.searchParams.set('page', String(page));
      url.searchParams.set('types', options.types);
      if (options.baseModels && options.baseModels.length > 0) {
        url.searchParams.set('baseModels', options.baseModels.join(','));
      }
      if (options.query) url.searchParams.set('query', options.query);
      // Intentionally not filtering NSFW here to collect both SFW & NSFW

      const resp = await fetch(url.toString(), { headers: this.buildHeaders(), cache: 'no-store' as any });
      if (!resp.ok) break;
      const data: CivitaiModelResponse = await resp.json();
      const items = data.items || [];
      all.push(...items);
      if (items.length < perPage) break;
      page += 1;
    }

    return all;
  }

  mapModels(items: CivitaiModel[]): Model[] {
    return items
      .filter(m => (m.modelVersions && m.modelVersions.length > 0))
      .map(m => {
        const v = m.modelVersions![0];
        const base = (v.baseModel || '').toLowerCase();
        let category = 'general';
        if (base.includes('sdxl')) category = 'sdxl';
        else if (base.includes('flux')) category = 'flux';
        else if (base.includes('sd 1.5')) category = 'sd15';

        return {
          id: String(m.id),
          name: m.name,
          type: 'image',
          provider: 'Civitai',
          description: (m.description || '').replace(/<[^>]*>/g, '').slice(0, 240),
          category,
          version: v.name || '1.0',
        } as Model;
      });
  }

  mapLoRAs(items: CivitaiModel[]): LoRA[] {
    return items
      .filter(m => (m.modelVersions && m.modelVersions.length > 0))
      .map(m => {
        const v = m.modelVersions![0];
        const base = (v.baseModel || '').toLowerCase();
        const nameLower = m.name.toLowerCase();
        let category: string = 'style';
        if (nameLower.includes('character')) category = 'character';
        if (nameLower.includes('nsfw') || (m.tags || []).some(t => (t || '').toLowerCase().includes('nsfw'))) category = 'nsfw';

        return {
          id: String(m.id),
          name: m.name,
          type: category,
          description: (m.description || '').replace(/<[^>]*>/g, '').slice(0, 240),
          strength: 0.8,
          category,
          tags: [category, base].filter(Boolean),
        } as LoRA;
      });
  }
}