import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Township from '@/lib/models/Township';

async function resolveId(ctx) {
  const p = await Promise.resolve(ctx.params);
  return p?.id;
}

export async function GET(request, ctx) {
  try {
    const id = await resolveId(ctx);
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });
    await connectDB();
    const township = await Township.findById(id).lean();
    if (!township) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ township });
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
    if (data.area !== undefined) update.area = String(data.area).trim();
    if (data.city !== undefined) update.city = String(data.city).trim();
    if (data.line1 !== undefined) update.line1 = String(data.line1).trim();
    if (data.line2 !== undefined) update.line2 = String(data.line2).trim();
    if (data.image !== undefined) update.image = String(data.image).trim();
    if (data.link !== undefined) update.link = String(data.link).trim();
    if (data.order !== undefined && Number.isFinite(Number(data.order))) {
      update.order = Number(data.order);
    }
    if (data.isActive !== undefined) update.isActive = Boolean(data.isActive);

    if (update.area !== undefined && !update.area) {
      return NextResponse.json({ error: 'Area name is required' }, { status: 400 });
    }

    // Explicit $set + strict:false ensures line1/line2 are persisted even if
    // the Mongoose model was cached from an older schema (before these fields
    // were added). returnDocument replaces the deprecated `new: true` option.
    const township = await Township.findByIdAndUpdate(
      id,
      { $set: update },
      { returnDocument: 'after', strict: false },
    );
    if (!township) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ township: township.toObject ? township.toObject() : township });
  } catch (error) {
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}

export async function DELETE(request, ctx) {
  try {
    const id = await resolveId(ctx);
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });
    await connectDB();
    await Township.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
