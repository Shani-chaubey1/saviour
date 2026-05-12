import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connectDB from '@/lib/mongodb';
import Admin from '@/lib/models/Admin';

export async function PUT(request, { params }) {
  try {
    await connectDB();
    const { name, email, password, role, isActive } = await request.json();
    const updates = {};

    if (name) updates.name = name;
    if (email) updates.email = email.toLowerCase();
    if (role) updates.role = role;
    if (isActive !== undefined) updates.isActive = isActive;
    if (password) updates.password = await bcrypt.hash(password, 12);
    updates.updatedAt = new Date();

    const admin = await Admin.findByIdAndUpdate(params.id, updates, { new: true }).select('-password');
    if (!admin) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ admin });
  } catch (error) {
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    await connectDB();
    await Admin.findByIdAndDelete(params.id);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
