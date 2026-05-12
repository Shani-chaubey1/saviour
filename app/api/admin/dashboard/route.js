import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Project from '@/lib/models/Project';
import Post from '@/lib/models/Post';
import Enquiry from '@/lib/models/Enquiry';
import Testimonial from '@/lib/models/Testimonial';
import Admin from '@/lib/models/Admin';

export async function GET() {
  try {
    await connectDB();

    const [projects, posts, enquiries, testimonials, admins, recentEnquiries] = await Promise.all([
      Project.countDocuments(),
      /* Total posts — matches admin blog list & public listing (many legacy rows are draft in DB but still shown). */
      Post.countDocuments(),
      Enquiry.countDocuments(),
      Testimonial.countDocuments(),
      Admin.countDocuments(),
      Enquiry.find().sort({ createdAt: -1 }).limit(5).lean(),
    ]);

    return NextResponse.json({
      stats: { projects, posts, enquiries, testimonials, admins },
      recentEnquiries,
    });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
