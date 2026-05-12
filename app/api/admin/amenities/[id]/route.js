import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Amenity from '@/lib/models/Amenity';

export async function PUT(request, { params }) {
  try {
    await connectDB();
    const data = await request.json();
    const amenity = await Amenity.findByIdAndUpdate(params.id, data, { new: true });
    if (!amenity) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ amenity });
  } catch (error) {
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    await connectDB();
    await Amenity.findByIdAndDelete(params.id);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
