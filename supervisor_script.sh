#!/bin/bash


echo "🎬 RENDEREEL STUDIO V3 - SUPERVISOR SCRIPT"
echo "=========================================="
echo ""

echo "📋 PHASE 1: BACKEND CONSTRUCTION & VERIFICATION"
echo "-----------------------------------------------"
echo ""

echo "✅ Step 1.1: Project Structure Verification"
echo "Checking Next.js App Router structure..."

if [ -d "app" ]; then
    echo "✓ app/ directory exists"
else
    echo "❌ app/ directory missing - Next.js App Router not properly initialized"
    exit 1
fi

if [ -f "package.json" ]; then
    echo "✓ package.json exists"
else
    echo "❌ package.json missing"
    exit 1
fi

if [ -f "next.config.ts" ]; then
    echo "✓ next.config.ts exists"
else
    echo "❌ next.config.ts missing"
    exit 1
fi

echo ""
echo "✅ Step 1.2: Install Dependencies"
echo "Installing project dependencies..."
npm install

echo ""
echo "✅ Step 1.3: Environment Setup"
echo "Setting up environment variables..."

if [ ! -f ".env.local" ]; then
    echo "Creating .env.local file..."
    cat > .env.local << EOF
DATABASE_URL="postgresql://localhost:5432/rendereel_studio"
REDIS_URL="redis://localhost:6379"

OPENAI_API_KEY=""
ANTHROPIC_API_KEY=""
REPLICATE_API_TOKEN=""


AWS_ACCESS_KEY_ID=""
AWS_SECRET_ACCESS_KEY=""
AWS_REGION=""
AWS_S3_BUCKET=""

NODE_ENV="development"
EOF
    echo "✓ .env.local created"
else
    echo "✓ .env.local already exists"
fi

echo ""
echo "✅ Step 1.4: Core Backend API Routes Setup"
echo "Creating API route structure..."

mkdir -p app/api

mkdir -p app/api/health
cat > app/api/health/route.ts << 'EOF'
import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'Rendereel Studio V3'
  });
}
EOF

mkdir -p app/api/projects
cat > app/api/projects/route.ts << 'EOF'
import { NextResponse } from 'next/server';

// In-memory storage for development
let projects: any[] = [];

export async function GET() {
  return NextResponse.json({
    success: true,
    data: projects
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newProject = {
      id: Date.now().toString(),
      ...body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    projects.push(newProject);
    
    return NextResponse.json({
      success: true,
      data: newProject
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Failed to create project'
    }, { status: 400 });
  }
}
EOF

mkdir -p app/api/renders
cat > app/api/renders/route.ts << 'EOF'
import { NextResponse } from 'next/server';

// In-memory storage for development
let renders: any[] = [];

export async function GET() {
  return NextResponse.json({
    success: true,
    data: renders
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newRender = {
      id: Date.now().toString(),
      ...body,
      status: 'queued',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    renders.push(newRender);
    
    return NextResponse.json({
      success: true,
      data: newRender
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Failed to create render'
    }, { status: 400 });
  }
}
EOF

echo "✓ API routes created"

echo ""
echo "✅ Step 1.5: Database Schema Setup"
echo "Setting up database schema..."

mkdir -p lib

cat > lib/database.ts << 'EOF'
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
EOF

echo "✓ Database schema created"

echo ""
echo "✅ Step 1.6: Backend Verification"
echo "Testing backend endpoints..."

echo "Starting Next.js development server..."
npm run dev &
SERVER_PID=$!

echo "Waiting for server to start..."
sleep 10

echo "Testing health endpoint..."
HEALTH_RESPONSE=$(curl -s http://localhost:3000/api/health)
if [[ $HEALTH_RESPONSE == *"healthy"* ]]; then
    echo "✓ Health endpoint working"
else
    echo "❌ Health endpoint failed"
    kill $SERVER_PID
    exit 1
fi

echo "Testing projects endpoint..."
PROJECTS_RESPONSE=$(curl -s http://localhost:3000/api/projects)
if [[ $PROJECTS_RESPONSE == *"success"* ]]; then
    echo "✓ Projects endpoint working"
else
    echo "❌ Projects endpoint failed"
    kill $SERVER_PID
    exit 1
fi

echo "Testing renders endpoint..."
RENDERS_RESPONSE=$(curl -s http://localhost:3000/api/renders)
if [[ $RENDERS_RESPONSE == *"success"* ]]; then
    echo "✓ Renders endpoint working"
else
    echo "❌ Renders endpoint failed"
    kill $SERVER_PID
    exit 1
fi

kill $SERVER_PID

echo ""
echo "🎉 PHASE 1 COMPLETED SUCCESSFULLY!"
echo "================================="
echo ""
echo "✅ Next.js App Router project initialized"
echo "✅ Environment variables configured"
echo "✅ Core API routes created and tested"
echo "✅ In-memory database setup complete"
echo "✅ Backend verification passed"
echo ""
echo "📋 NEXT STEPS:"
echo "1. Run 'npm run dev' to start the development server"
echo "2. Visit http://localhost:3000 to view the application"
echo "3. API endpoints available at:"
echo "   - GET /api/health"
echo "   - GET/POST /api/projects"
echo "   - GET/POST /api/renders"
echo ""
echo "🚀 Ready for Phase 2: Frontend Development"
echo ""
