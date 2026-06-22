/**
 * Backfill SEO metadata for all static pages in MongoDB.
 *
 * - Setting keys: meta_title, meta_description (site-wide defaults)
 * - Page collection: metaTitle, metaDescription per CMS slug (home, about-us, …)
 * - Page.sections: projects variant meta (residential / commercial)
 * - ContentPage: fills meta only when missing (unless --force)
 *
 * Usage:
 *   npm run update-page-metadata
 *   npm run update-page-metadata -- --force   # overwrite existing meta in DB
 *
 * Requires MONGODB_URI in .env.local
 */
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env.local') });
const mongoose = require('mongoose');

const SettingSchema = new mongoose.Schema(
  { key: String, value: mongoose.Schema.Types.Mixed },
  { strict: false },
);
const PageSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true },
    title: { type: String, required: true },
    sections: { type: mongoose.Schema.Types.Mixed, default: {} },
    metaTitle: { type: String, default: '' },
    metaDescription: { type: String, default: '' },
    updatedAt: { type: Date, default: Date.now },
  },
  { strict: false },
);
const ContentPageSchema = new mongoose.Schema(
  {
    slug: String,
    title: String,
    metaTitle: { type: String, default: '' },
    metaDescription: { type: String, default: '' },
    sections: { type: mongoose.Schema.Types.Mixed, default: {} },
    updatedAt: { type: Date, default: Date.now },
  },
  { strict: false },
);

const force = process.argv.includes('--force');

function shouldSet(current, next) {
  if (!next) return false;
  if (force) return String(current || '').trim() !== String(next).trim();
  return !String(current || '').trim();
}

async function upsertSetting(Setting, key, value) {
  const existing = await Setting.findOne({ key }).lean();
  if (!shouldSet(existing?.value, value) && existing) return false;
  await Setting.updateOne(
    { key },
    { $set: { key, value: String(value), updatedAt: new Date() } },
    { upsert: true },
  );
  return true;
}

async function main() {
  const {
    DEFAULT_SETTINGS,
    DEFAULT_PAGE_METADATA,
    DEFAULT_PAGE_SECTIONS,
    CMS_PAGE_TITLES,
  } = await import('../lib/siteDefaults.js');

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('Missing MONGODB_URI in .env.local');
    process.exit(1);
  }

  await mongoose.connect(uri);
  const Setting = mongoose.models.Setting || mongoose.model('Setting', SettingSchema);
  const Page = mongoose.models.Page || mongoose.model('Page', PageSchema);
  const ContentPage =
    mongoose.models.ContentPage || mongoose.model('ContentPage', ContentPageSchema);

  let updated = 0;

  // ── Global SEO settings ─────────────────────────────────────────────
  if (await upsertSetting(Setting, 'meta_title', DEFAULT_SETTINGS.meta_title)) {
    console.log('✅ meta_title');
    updated += 1;
  }
  if (await upsertSetting(Setting, 'meta_description', DEFAULT_SETTINGS.meta_description)) {
    console.log('✅ meta_description');
    updated += 1;
  }

  // ── CMS Page documents ────────────────────────────────────────────
  for (const slug of Object.keys(DEFAULT_PAGE_METADATA)) {
    const defs = DEFAULT_PAGE_METADATA[slug];
    const doc = await Page.findOne({ slug });
    const title = CMS_PAGE_TITLES[slug] || slug;
    const sectionDefaults = DEFAULT_PAGE_SECTIONS[slug] || {};
    const sectionMeta = defs.sectionMeta || {};

    if (!doc) {
      const sections = { ...sectionDefaults, ...sectionMeta };
      await Page.create({
        slug,
        title,
        metaTitle: defs.metaTitle || '',
        metaDescription: defs.metaDescription || '',
        sections,
        updatedAt: new Date(),
      });
      console.log(`✅ Created page "${slug}" with metadata`);
      updated += 1;
      continue;
    }

    const patch = {};
    if (shouldSet(doc.metaTitle, defs.metaTitle)) patch.metaTitle = defs.metaTitle;
    if (shouldSet(doc.metaDescription, defs.metaDescription)) {
      patch.metaDescription = defs.metaDescription;
    }

    const curSections =
      doc.sections && typeof doc.sections === 'object' ? { ...doc.sections } : { ...sectionDefaults };
    let sectionsChanged = false;
    for (const [k, v] of Object.entries(sectionMeta)) {
      if (shouldSet(curSections[k], v)) {
        curSections[k] = v;
        sectionsChanged = true;
      }
    }
    for (const [k, v] of Object.entries(sectionDefaults)) {
      if (curSections[k] === undefined) {
        curSections[k] = v;
        sectionsChanged = true;
      }
    }
    if (sectionsChanged) patch.sections = curSections;

    if (Object.keys(patch).length) {
      patch.updatedAt = new Date();
      await Page.updateOne({ _id: doc._id }, { $set: patch });
      console.log(`✅ Updated page "${slug}" metadata`);
      updated += 1;
    } else {
      console.log(`— Page "${slug}" metadata already set`);
    }
  }

  // ── Content pages (Disclaimer, Privacy, …) ──────────────────────────
  const contentPages = await ContentPage.find().lean();
  for (const page of contentPages) {
    const patch = {};
    const fallbackTitle = page.title ? `${page.title} — Saviour Group` : '';
    const fallbackDesc = page.title
      ? `Read ${page.title} on the official Saviour Group website.`
      : '';

    if (shouldSet(page.metaTitle, fallbackTitle)) patch.metaTitle = fallbackTitle;
    if (shouldSet(page.metaDescription, fallbackDesc)) patch.metaDescription = fallbackDesc;

    if (Object.keys(patch).length) {
      patch.updatedAt = new Date();
      await ContentPage.updateOne({ _id: page._id }, { $set: patch });
      console.log(`✅ Updated content page "${page.slug}" metadata`);
      updated += 1;
    }
  }

  await mongoose.disconnect();
  console.log(`\nDone. ${updated} record(s) updated${force ? ' (force mode)' : ''}.`);
  console.log('Public routes now read metadata from the database via generateMetadata().');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
