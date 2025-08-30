import { Model, LoRA } from './api-client';
import { kv as kvClient } from '@vercel/kv';
import { neon } from '@neondatabase/serverless';

// Detect availability from provided env vars (Vercel KV uses KV_REST_* vars)
const isKvAvailable = Boolean(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);
const isDbAvailable = Boolean(process.env.DATABASE_URL);

// Initialize clients conditionally while keeping strong typing
const kv = isKvAvailable ? kvClient : null;
const sql: (ReturnType<typeof neon>) | null = isDbAvailable && process.env.DATABASE_URL
  ? neon(process.env.DATABASE_URL)
  : null;

export class CacheService {
  private static readonly CACHE_TTL = 3600;
  private static readonly MODELS_CACHE_KEY = 'models:all';
  private static readonly LORAS_CACHE_KEY = 'loras:all';

  static async getModels(): Promise<Model[] | null> {
    try {
      if (kv && isKvAvailable) {
        const cached = await kv.get<Model[]>(this.MODELS_CACHE_KEY);
        if (cached) return cached as Model[];
      }

      if (sql && isDbAvailable) {
        const dbModels = await sql`
          SELECT * FROM cached_models 
          WHERE updated_at > NOW() - INTERVAL '1 hour'
          ORDER BY updated_at DESC
        `;
        
        if ((dbModels as unknown[]).length > 0) {
          return (dbModels as Array<{ data: string }>).map((row) => JSON.parse(row.data) as Model[]).flat();
        }
      }

      return null;
    } catch (error) {
      console.error('Error getting cached models:', error);
      return null;
    }
  }

  static async setModels(models: Model[]): Promise<void> {
    try {
      if (kv && isKvAvailable) {
        await kv.set(this.MODELS_CACHE_KEY, models, { ex: this.CACHE_TTL });
      }

      if (sql && isDbAvailable) {
        await sql`
          INSERT INTO cached_models (key, data, updated_at)
          VALUES (${this.MODELS_CACHE_KEY}, ${JSON.stringify(models)}, NOW())
          ON CONFLICT (key) 
          DO UPDATE SET data = ${JSON.stringify(models)}, updated_at = NOW()
        `;
      }
    } catch (error) {
      console.error('Error caching models:', error);
    }
  }

  static async getLoRAs(): Promise<LoRA[] | null> {
    try {
      if (kv && isKvAvailable) {
        const cached = await kv.get<LoRA[]>(this.LORAS_CACHE_KEY);
        if (cached) return cached as LoRA[];
      }

      if (sql && isDbAvailable) {
        const dbLoRAs = await sql`
          SELECT * FROM cached_loras 
          WHERE updated_at > NOW() - INTERVAL '1 hour'
          ORDER BY updated_at DESC
        `;
        
        if ((dbLoRAs as unknown[]).length > 0) {
          return (dbLoRAs as Array<{ data: string }>).map((row) => JSON.parse(row.data) as LoRA[]).flat();
        }
      }

      return null;
    } catch (error) {
      console.error('Error getting cached LoRAs:', error);
      return null;
    }
  }

  static async setLoRAs(loras: LoRA[]): Promise<void> {
    try {
      if (kv && isKvAvailable) {
        await kv.set(this.LORAS_CACHE_KEY, loras, { ex: this.CACHE_TTL });
      }

      if (sql && isDbAvailable) {
        await sql`
          INSERT INTO cached_loras (key, data, updated_at)
          VALUES (${this.LORAS_CACHE_KEY}, ${JSON.stringify(loras)}, NOW())
          ON CONFLICT (key) 
          DO UPDATE SET data = ${JSON.stringify(loras)}, updated_at = NOW()
        `;
      }
    } catch (error) {
      console.error('Error caching LoRAs:', error);
    }
  }

  static async initializeTables(): Promise<void> {
    try {
      if (sql && isDbAvailable) {
        await sql`
          CREATE TABLE IF NOT EXISTS cached_models (
            key VARCHAR(255) PRIMARY KEY,
            data JSONB NOT NULL,
            updated_at TIMESTAMP DEFAULT NOW()
          )
        `;

        await sql`
          CREATE TABLE IF NOT EXISTS cached_loras (
            key VARCHAR(255) PRIMARY KEY,
            data JSONB NOT NULL,
            updated_at TIMESTAMP DEFAULT NOW()
          )
        `;
      }
    } catch (error) {
      console.error('Error initializing cache tables:', error);
    }
  }
}
