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

export async function GET(_request, { params }) {
  try {
    await connectDB();
    const { id } = await Promise.resolve(params);
    const page = await ContentPage.findById(id).lean();
    if (!page) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ page });
  } catch (err) {
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    await connectDB();
    const { id } = await Promise.resolve(params);
    const body = await request.json();
    const update = {};

    if (body.title !== undefined) {
      const title = String(body.title || '').trim();
      if (!title) return NextResponse.json({ error: 'Title is required' }, { status: 400 });
      update.title = title;
    }

    if (body.slug !== undefined) {
      const slug = normaliseSlug(body.slug);
      if (!slug || !SLUG_RE.test(slug)) {
        return NextResponse.json({ error: 'Invalid slug.' }, { status: 400 });
      }
      if (RESERVED_CONTENT_PAGE_SLUGS.has(slug)) {
        return NextResponse.json({ error: `Slug "${slug}" is reserved.` }, { status: 400 });
      }
      const dup = await ContentPage.findOne({ slug, _id: { $ne: id } });
      if (dup) {
        return NextResponse.json({ error: `Another page already uses slug "${slug}".` }, { status: 409 });
      }
      update.slug = slug;
    }

    if (body.content !== undefined) update.content = String(body.content || '');
    if (body.metaTitle !== undefined) update.metaTitle = String(body.metaTitle || '').trim();
    if (body.metaDescription !== undefined) update.metaDescription = String(body.metaDescription || '').trim();
    if (body.isPublished !== undefined) update.isPublished = Boolean(body.isPublished);
    if (body.showInFooter !== undefined) update.showInFooter = Boolean(body.showInFooter);
    if (body.order !== undefined && Number.isFinite(Number(body.order))) update.order = Number(body.order);

    const page = await ContentPage.findByIdAndUpdate(id, update, { new: true });
    if (!page) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ page });
  } catch (err) {
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}

export async function DELETE(_request, { params }) {
  try {
    await connectDB();
    const { id } = await Promise.resolve(params);
    const page = await ContentPage.findByIdAndDelete(id);
    if (!page) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}
