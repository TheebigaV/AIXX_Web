import { NextResponse } from 'next/server';

// This is a mock API route - should not be used since we have a real backend API
// Redirecting all requests to the real backend

export async function GET(request: Request, { params }: { params: { id: string } }) {
  return NextResponse.json({ error: 'Use the backend API instead' }, { status: 404 });
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  return NextResponse.json({ error: 'Use the backend API instead' }, { status: 404 });
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  return NextResponse.json({ error: 'Use the backend API instead' }, { status: 404 });
}
