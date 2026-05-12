import { NextResponse } from 'next/server';
import { getProjects } from '@/lib/data';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type');
  const limit = parseInt(searchParams.get('limit') || '0', 10) || undefined;

  const projects = await getProjects({ type, limit });
  return NextResponse.json(projects);
}
