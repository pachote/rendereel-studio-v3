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
