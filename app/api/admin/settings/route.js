import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Setting from '@/lib/models/Setting';

// GET /api/admin/settings — returns { settings: { key: value, ... } }
export async function GET() {
  try {
    await connectDB();
    const rows = await Setting.find().lean();
    const map = {};
    rows.forEach((r) => { map[r.key] = r.value; });
    return NextResponse.json({ settings: map });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// PUT /api/admin/settings — body: { settings: { key: value, ... } }
export async function PUT(request) {
  try {
    await connectDB();
    const { settings } = await request.json();
    if (!settings || typeof settings !== 'object') {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }
    const ops = Object.entries(settings).map(([key, value]) => ({
      updateOne: {
        filter: { key },
        update: { $set: { key, value, updatedAt: new Date() } },
        upsert: true,
      },
    }));
    if (ops.length) await Setting.bulkWrite(ops);
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}
