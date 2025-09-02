// Use same-origin in development to avoid cross-origin/port mismatches in Preview
const API_BASE_URL = process.env.NODE_ENV === 'production'
  ? process.env.NEXT_PUBLIC_API_URL || ''
  : '';

export interface Project {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface Render {
  id: string;
  projectId: string;
  status: string;
  progress: number;
  createdAt: string;
  updatedAt: string;
}

export interface Model {
  id: string;
  name: string;
  type: string;
  provider: string;
  description?: string;
  category?: string;
  version?: string;
}

export interface LoRA {
  id: string;
  name: string;
  type: string;
  description?: string;
  strength?: number;
  category?: string;
  tags?: string[];
}

class ApiClient {
  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }

    return response.json();
  }

  async getHealth() {
    return this.request<{ status: string; timestamp: string; service: string }>('/api/health');
  }

  async getProjects() {
    return this.request<{ success: boolean; data: Project[] }>('/api/projects');
  }

  async createProject(data: { name: string; description: string }) {
    return this.request<{ success: boolean; data: Project }>('/api/projects', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getRenders() {
    return this.request<{ success: boolean; data: Render[] }>('/api/renders');
  }

  async createRender(data: { projectId: string; status?: string; progress?: number }) {
    return this.request<{ success: boolean; data: Render }>('/api/renders', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getModels(): Promise<Model[]> {
    const response = await this.request<{ success: boolean; data: Model[] }>('/api/models');
    return response.data;
  }

  async getLoRAs(): Promise<LoRA[]> {
    const response = await this.request<{ success: boolean; data: LoRA[] }>('/api/loras');
    return response.data;
  }
}

export const apiClient = new ApiClient();
