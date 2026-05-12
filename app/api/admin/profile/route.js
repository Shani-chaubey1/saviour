import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connectDB from '@/lib/mongodb';
import Admin from '@/lib/models/Admin';
import { getAdminFromRequest } from '@/lib/auth';

export async function PUT(request) {
  try {
    const payload = await getAdminFromRequest(request);
    if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await connectDB();
    const { name, avatar, currentPassword, newPassword } = await request.json();
    const updates = { updatedAt: new Date() };

    if (name) updates.name = name;
    if (avatar !== undefined) updates.avatar = avatar;

    if (newPassword) {
      if (!currentPassword) {
        return NextResponse.json({ error: 'Current password is required' }, { status: 400 });
      }
      const admin = await Admin.findById(payload.id);
      const isValid = await bcrypt.compare(currentPassword, admin.password);
      if (!isValid) {
        return NextResponse.json({ error: 'Current password is incorrect' }, { status: 400 });
      }
      updates.password = await bcrypt.hash(newPassword, 12);
    }

    const admin = await Admin.findByIdAndUpdate(payload.id, updates, { new: true }).select('-password');
    return NextResponse.json({ admin });
  } catch (error) {
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}
