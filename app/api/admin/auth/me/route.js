import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Admin from '@/lib/models/Admin';
import { getAdminFromRequest } from '@/lib/auth';

export async function GET(request) {
  try {
    const payload = await getAdminFromRequest(request);
    if (!payload) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const admin = await Admin.findById(payload.id).select('-password');
    if (!admin) {
      return NextResponse.json({ error: 'Admin not found' }, { status: 404 });
    }

    return NextResponse.json({ admin });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
