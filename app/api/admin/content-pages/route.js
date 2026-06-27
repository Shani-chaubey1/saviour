import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import ContentPage from '@/lib/models/ContentPage';
import { RESERVED_CONTENT_PAGE_SLUGS } from '@/lib/data';

export const dynamic = 'force-dynamic';

const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function normaliseSlug(raw) {
  return String(raw || '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-{2,}/g, '-')
    .replace(/^-|-$/g, '');
}

export async function GET() {
  try {
    await connectDB();
    const pages = await ContentPage.find()
      .sort({ order: 1, title: 1 })
      .lean();
    return NextResponse.json({ pages });
  } catch (err) {
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const title = String(body?.title || '').trim();
    const slug = normaliseSlug(body?.slug || title);

    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }
    if (!slug || !SLUG_RE.test(slug)) {
      return NextResponse.json({ error: 'Invalid slug. Use lowercase letters, numbers, hyphens.' }, { status: 400 });
    }
    if (RESERVED_CONTENT_PAGE_SLUGS.has(slug)) {
      return NextResponse.json(
        { error: `Slug "${slug}" is reserved by the site. Choose a different one.` },
        { status: 400 },
      );
    }

    await connectDB();
    const existing = await ContentPage.findOne({ slug });
    if (existing) {
      return NextResponse.json({ error: `A page with slug "${slug}" already exists.` }, { status: 409 });
    }

    const showProjects = Boolean(body?.showProjects);
    const page = await ContentPage.create({
      title,
      slug,
      content: String(body?.content || ''),
      metaTitle: String(body?.metaTitle || '').trim(),
      metaDescription: String(body?.metaDescription || '').trim(),
      bannerImage: String(body?.bannerImage || '').trim(),
      isPublished: body?.isPublished !== false,
      showInFooter: Boolean(body?.showInFooter),
      order: Number.isFinite(Number(body?.order)) ? Number(body.order) : 0,
      showProjects,
      // Only persist a location when the section is enabled.
      projectsLocation: showProjects ? String(body?.projectsLocation || '').trim() : '',
    });
    return NextResponse.json({ page }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}
