import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Township from '@/lib/models/Township';

export async function GET() {
  try {
    await connectDB();
    const townships = await Township.find()
      .sort({ order: 1, createdAt: 1 })
      .lean();
    return NextResponse.json({ townships });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await connectDB();
    const data = await request.json();
    if (!data?.area || !String(data.area).trim()) {
      return NextResponse.json({ error: 'Area name is required' }, { status: 400 });
    }
    const township = await Township.create({
      area: String(data.area).trim(),
      city: String(data.city || '').trim(),
      line1: String(data.line1 || '').trim(),
      line2: String(data.line2 || '').trim(),
      image: String(data.image || '').trim(),
      link: String(data.link || '').trim(),
      order: Number.isFinite(Number(data.order)) ? Number(data.order) : 0,
      isActive: data.isActive !== false,
    });
    return NextResponse.json({ township }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}
