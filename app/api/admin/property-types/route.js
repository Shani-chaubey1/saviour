import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import PropertyType from '@/lib/models/PropertyType';

export async function GET() {
  try {
    await connectDB();
    const types = await PropertyType.find().sort({ name: 1 }).lean();
    return NextResponse.json({ types });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await connectDB();
    const { name } = await request.json();
    if (!name) return NextResponse.json({ error: 'Name is required' }, { status: 400 });

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const existing = await PropertyType.findOne({ $or: [{ name }, { slug }] });
    if (existing) return NextResponse.json({ error: 'Type already exists' }, { status: 400 });

    const type = await PropertyType.create({ name, slug });
    return NextResponse.json({ type }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}
