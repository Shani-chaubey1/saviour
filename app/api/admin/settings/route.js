import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Setting from '@/lib/models/Setting';
import { getSettings } from '@/lib/data';

// GET /api/admin/settings — merged defaults + DB so every field shows a value in the admin UI
export async function GET() {
  try {
    const settings = await getSettings();
    return NextResponse.json({ settings });
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
