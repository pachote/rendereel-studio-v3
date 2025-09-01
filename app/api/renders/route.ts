import { NextResponse } from 'next/server';
import { Render } from '../../../lib/types';

// In-memory storage for development
const renders: Render[] = [];

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
  } catch {
    return NextResponse.json({
      success: false,
      error: 'Failed to create render'
    }, { status: 400 });
  }
}
