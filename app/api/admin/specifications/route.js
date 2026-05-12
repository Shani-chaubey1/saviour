import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Specification from '@/lib/models/Specification';

export async function GET() {
  try {
    await connectDB();
    const specifications = await Specification.find().sort({ name: 1 }).lean();
    return NextResponse.json({ specifications });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await connectDB();
    const { name, icon } = await request.json();
    if (!name) return NextResponse.json({ error: 'Name is required' }, { status: 400 });

    const existing = await Specification.findOne({ name });
    if (existing) return NextResponse.json({ error: 'Specification already exists' }, { status: 400 });

    const specification = await Specification.create({ name, icon: icon || 'FaCheck' });
    return NextResponse.json({ specification }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}
