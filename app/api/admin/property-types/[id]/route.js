import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import PropertyType from '@/lib/models/PropertyType';

export async function PUT(request, { params }) {
  try {
    await connectDB();
    const { name, isActive } = await request.json();
    const slug = name?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const type = await PropertyType.findByIdAndUpdate(
      params.id,
      { ...(name && { name, slug }), ...(isActive !== undefined && { isActive }) },
      { new: true }
    );
    if (!type) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ type });
  } catch (error) {
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    await connectDB();
    await PropertyType.findByIdAndDelete(params.id);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
