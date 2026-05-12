import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Page from '@/lib/models/Page';
import { DEFAULT_PAGE_SECTIONS, CMS_PAGE_TITLES } from '@/lib/siteDefaults';

export async function GET(request, { params }) {
  try {
    await connectDB();
    const resolvedParams = await Promise.resolve(params);
    const slug = resolvedParams.slug;
    const doc = await Page.findOne({ slug }).lean();
    const defaults = DEFAULT_PAGE_SECTIONS[slug];
    if (!doc && !defaults) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    const mergedSections = {
      ...(defaults || {}),
      ...(doc?.sections && typeof doc.sections === 'object' ? doc.sections : {}),
    };
    const page = {
      ...doc,
      slug,
      title: doc?.title || CMS_PAGE_TITLES[slug] || slug,
      sections: mergedSections,
    };
    return NextResponse.json({ page });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    await connectDB();
    const resolvedParams = await Promise.resolve(params);
    const data = await request.json();
    const page = await Page.findOneAndUpdate(
      { slug: resolvedParams.slug },
      { ...data, updatedAt: new Date() },
      { new: true, upsert: true }
    );
    return NextResponse.json({ page });
  } catch (error) {
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}
