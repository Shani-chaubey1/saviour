import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Post from '@/lib/models/Post';

export async function GET(request, { params }) {
  try {
    await connectDB();
    const resolvedParams = await Promise.resolve(params);
    const post = await Post.findById(resolvedParams.id).lean();
    if (!post) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ post });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    await connectDB();
    const resolvedParams = await Promise.resolve(params);
    const data = await request.json();
    const post = await Post.findByIdAndUpdate(
      resolvedParams.id,
      { ...data, updatedAt: new Date() },
      { new: true, runValidators: true }
    );
    if (!post) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ post });
  } catch (error) {
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    await connectDB();
    const resolvedParams = await Promise.resolve(params);
    const post = await Post.findByIdAndDelete(resolvedParams.id);
    if (!post) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
