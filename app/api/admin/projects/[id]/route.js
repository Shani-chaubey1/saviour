import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Project from '@/lib/models/Project';
import '@/lib/models/PropertyType';
import '@/lib/models/Amenity';
import '@/lib/models/Specification';

export async function GET(request, { params }) {
  try {
    await connectDB();
    const resolvedParams = await Promise.resolve(params);
    const project = await Project.findById(resolvedParams.id)
      .populate('type', 'name slug')
      .populate('amenities', 'name icon')
      .populate('specifications', 'name icon')
      .lean();
    if (!project) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ project });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    await connectDB();
    const resolvedParams = await Promise.resolve(params);
    const data = await request.json();
    const project = await Project.findByIdAndUpdate(
      resolvedParams.id,
      { ...data, updatedAt: new Date() },
      { new: true, runValidators: true }
    );
    if (!project) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ project });
  } catch (error) {
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    await connectDB();
    const resolvedParams = await Promise.resolve(params);
    const project = await Project.findByIdAndDelete(resolvedParams.id);
    if (!project) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
