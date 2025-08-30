// In-memory database for development
// This will be replaced with proper database in production

export interface Project {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Render {
  id: string;
  projectId: string;
  status: 'queued' | 'processing' | 'completed' | 'failed';
  progress: number;
  outputUrl?: string;
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
  baseModel?: string;
  size?: string;
  downloadCount?: number;
  rating?: number;
  tags?: string[];
  nsfw?: boolean;
  commercial?: boolean;
  source?: string;
}

export interface LoRA {
  id: string;
  name: string;
  type: string;
  description?: string;
  strength?: number;
  category?: string;
  tags?: string[];
  downloadCount?: number;
  rating?: number;
  baseModel?: string;
  source?: string;
}

// In-memory storage
export const db = {
  projects: [] as Project[],
  renders: [] as Render[]
};

export const dbOperations = {
  // Project operations
  createProject: (data: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => {
    const project: Project = {
      id: Date.now().toString(),
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    db.projects.push(project);
    return project;
  },
  
  getProjects: () => db.projects,
  
  getProject: (id: string) => db.projects.find(p => p.id === id),
  
  // Render operations
  createRender: (data: Omit<Render, 'id' | 'createdAt' | 'updatedAt'>) => {
    const render: Render = {
      id: Date.now().toString(),
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    db.renders.push(render);
    return render;
  },
  
  getRenders: () => db.renders,
  
  getRender: (id: string) => db.renders.find(r => r.id === id),
  
  updateRender: (id: string, updates: Partial<Render>) => {
    const index = db.renders.findIndex(r => r.id === id);
    if (index !== -1) {
      db.renders[index] = {
        ...db.renders[index],
        ...updates,
        updatedAt: new Date().toISOString()
      };
      return db.renders[index];
    }
    return null;
  }
};
