import { NextResponse } from 'next/server';
import { getPosts } from '@/lib/data';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const limit = parseInt(searchParams.get('limit') || '0', 10) || undefined;

  const posts = await getPosts({ limit });
  return NextResponse.json(posts);
}
