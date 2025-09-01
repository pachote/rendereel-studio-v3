import { Model, LoRA } from './api-client';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let kvClient: any = null;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let sql: any = null;

async function initializeKV() {
  try {
    if (process.env.VERCEL_KV_URL && !kvClient) {
      const { kv } = await import('@vercel/kv');
      kvClient = kv;
    }
  } catch (error) {
    console.warn('Vercel KV not available:', error);
  }
}

async function initializeSQL() {
  try {
    if (process.env.DATABASE_URL && !sql) {
      const { neon } = await import('@neondatabase/serverless');
      sql = neon(process.env.DATABASE_URL);
    }
  } catch (error) {
    console.warn('Neon database not available:', error);
  }
}

export class CacheService {
  private static readonly CACHE_TTL = 3600;
  private static readonly MODELS_CACHE_KEY = 'models:all';
  private static readonly LORAS_CACHE_KEY = 'loras:all';

  static async getModels(): Promise<Model[] | null> {
    try {
      await initializeKV();
      if (kvClient && process.env.VERCEL_KV_URL) {
        const cached = await kvClient.get(this.MODELS_CACHE_KEY);
        if (cached) return cached;
      }

      await initializeSQL();
      if (sql && process.env.DATABASE_URL) {
        const dbModels = await sql`
          SELECT * FROM cached_models 
          WHERE updated_at > NOW() - INTERVAL '1 hour'
          ORDER BY updated_at DESC
        `;
        
        if (dbModels.length > 0) {
          return dbModels.map((row: { data: string }) => JSON.parse(row.data));
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
      await initializeKV();
      if (kvClient && process.env.VERCEL_KV_URL) {
        await kvClient.setex(this.MODELS_CACHE_KEY, this.CACHE_TTL, models);
      }

      await initializeSQL();
      if (sql && process.env.DATABASE_URL) {
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
      await initializeKV();
      if (kvClient && process.env.VERCEL_KV_URL) {
        const cached = await kvClient.get(this.LORAS_CACHE_KEY);
        if (cached) return cached;
      }

      await initializeSQL();
      if (sql && process.env.DATABASE_URL) {
        const dbLoRAs = await sql`
          SELECT * FROM cached_loras 
          WHERE updated_at > NOW() - INTERVAL '1 hour'
          ORDER BY updated_at DESC
        `;
        
        if (dbLoRAs.length > 0) {
          return dbLoRAs.map((row: { data: string }) => JSON.parse(row.data));
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
      await initializeKV();
      if (kvClient && process.env.VERCEL_KV_URL) {
        await kvClient.setex(this.LORAS_CACHE_KEY, this.CACHE_TTL, loras);
      }

      await initializeSQL();
      if (sql && process.env.DATABASE_URL) {
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
      await initializeSQL();
      if (sql && process.env.DATABASE_URL) {
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
