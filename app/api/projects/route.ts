import { NextResponse } from 'next/server';
import { Project } from '../../../lib/types';

// In-memory storage for development
const projects: Project[] = [];

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
  } catch {
    return NextResponse.json({
      success: false,
      error: 'Failed to create project'
    }, { status: 400 });
  }
}
