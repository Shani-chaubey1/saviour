import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Page from '@/lib/models/Page';

export async function GET(request, { params }) {
  try {
    await connectDB();
    const resolvedParams = await Promise.resolve(params);
    const page = await Page.findOne({ slug: resolvedParams.slug }).lean();
    if (!page) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ page });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    await connectDB();
    const resolvedParams = await Promise.resolve(params);
    const data = await request.json();
    const page = await Page.findOneAndUpdate(
      { slug: resolvedParams.slug },
      { ...data, updatedAt: new Date() },
      { new: true, upsert: true }
    );
    return NextResponse.json({ page });
  } catch (error) {
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}
