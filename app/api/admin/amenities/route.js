import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Amenity from '@/lib/models/Amenity';

export async function GET() {
  try {
    await connectDB();
    const amenities = await Amenity.find().sort({ name: 1 }).lean();
    return NextResponse.json({ amenities });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await connectDB();
    const { name, icon } = await request.json();
    if (!name) return NextResponse.json({ error: 'Name is required' }, { status: 400 });

    const existing = await Amenity.findOne({ name });
    if (existing) return NextResponse.json({ error: 'Amenity already exists' }, { status: 400 });

    const amenity = await Amenity.create({ name, icon: icon || 'FaCheck' });
    return NextResponse.json({ amenity }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}
