import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Page from '@/lib/models/Page';

export async function GET() {
  try {
    await connectDB();
    const pages = await Page.find().sort({ slug: 1 }).lean();
    return NextResponse.json({ pages });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
