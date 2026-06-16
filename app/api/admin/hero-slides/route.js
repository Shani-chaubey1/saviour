import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import HeroSlide from '@/lib/models/HeroSlide';

export async function GET() {
  try {
    await connectDB();
    const slides = await HeroSlide.find()
      .sort({ order: 1, createdAt: 1 })
      .lean();
    return NextResponse.json({ slides });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await connectDB();
    const data = await request.json();
    if (!data?.image || !String(data.image).trim()) {
      return NextResponse.json({ error: 'Banner image is required' }, { status: 400 });
    }
    // strict:false on the document instance ensures all fields survive even
    // if a stale cached model is missing those schema paths.
    const doc = new HeroSlide({
      image: String(data.image).trim(),
      title: String(data.title || '').trim(),
      link: String(data.link || '').trim(),
      order: Number.isFinite(Number(data.order)) ? Number(data.order) : 0,
      isActive: data.isActive !== false,
    });
    const slide = await doc.save({ strict: false });
    return NextResponse.json({ slide: slide.toObject() }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}
