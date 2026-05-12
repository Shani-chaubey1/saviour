import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Testimonial from '@/lib/models/Testimonial';

async function resolveId(ctx) {
  const p = await Promise.resolve(ctx.params);
  return p?.id;
}

export async function GET(request, ctx) {
  try {
    const id = await resolveId(ctx);
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });
    await connectDB();
    const testimonial = await Testimonial.findById(id).lean();
    if (!testimonial) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ testimonial });
  } catch (error) {
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}

export async function PUT(request, ctx) {
  try {
    const id = await resolveId(ctx);
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });
    await connectDB();
    const data = await request.json();
    const testimonial = await Testimonial.findByIdAndUpdate(id, data, { new: true });
    if (!testimonial) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ testimonial });
  } catch (error) {
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}

export async function DELETE(request, ctx) {
  try {
    const id = await resolveId(ctx);
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });
    await connectDB();
    await Testimonial.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
