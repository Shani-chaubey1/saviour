import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Enquiry from '@/lib/models/Enquiry';

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, phone, message, project } = body;

    if (!name?.trim() || !phone?.trim()) {
      return NextResponse.json({ error: 'Name and phone are required' }, { status: 400 });
    }

    await connectDB();
    await Enquiry.create({ name, email, phone, message, project });

    return NextResponse.json({ success: true, message: 'Enquiry submitted successfully' });
  } catch (err) {
    console.error('Contact API error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
