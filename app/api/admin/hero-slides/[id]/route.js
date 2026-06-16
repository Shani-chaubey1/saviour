import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import HeroSlide from '@/lib/models/HeroSlide';

async function resolveId(ctx) {
  const p = await Promise.resolve(ctx.params);
  return p?.id;
}

export async function GET(request, ctx) {
  try {
    const id = await resolveId(ctx);
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });
    await connectDB();
    const slide = await HeroSlide.findById(id).lean();
    if (!slide) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ slide });
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

    const update = {};
    if (data.image !== undefined) update.image = String(data.image).trim();
    if (data.title !== undefined) update.title = String(data.title).trim();
    if (data.link !== undefined) update.link = String(data.link).trim();
    if (data.order !== undefined && Number.isFinite(Number(data.order))) {
      update.order = Number(data.order);
    }
    if (data.isActive !== undefined) update.isActive = Boolean(data.isActive);

    if (update.image !== undefined && !update.image) {
      return NextResponse.json({ error: 'Banner image is required' }, { status: 400 });
    }

    // Explicit $set + strict:false ensures every field is persisted even if the
    // Mongoose model was cached from an older schema. returnDocument replaces
    // the deprecated `new: true` option.
    const slide = await HeroSlide.findByIdAndUpdate(
      id,
      { $set: update },
      { returnDocument: 'after', strict: false },
    );
    if (!slide) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ slide: slide.toObject ? slide.toObject() : slide });
  } catch (error) {
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}

export async function DELETE(request, ctx) {
  try {
    const id = await resolveId(ctx);
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });
    await connectDB();
    await HeroSlide.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
