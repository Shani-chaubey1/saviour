/**
 * Fill MongoDB with default site settings and CMS page sections.
 * Non-destructive: only adds Setting keys that are missing, and Page section keys that are missing.
 *
 * Usage: npm run sync-defaults   (from saviour-next/, requires .env.local MONGODB_URI)
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
    updatedAt: { type: Date, default: Date.now },
  },
  { strict: false },
);

async function main() {
  const { DEFAULT_SETTINGS, DEFAULT_PAGE_SECTIONS, CMS_PAGE_TITLES } = await import('../lib/siteDefaults.js');
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('Missing MONGODB_URI in .env.local');
    process.exit(1);
  }

  await mongoose.connect(uri);
  const Setting = mongoose.models.Setting || mongoose.model('Setting', SettingSchema);
  const Page = mongoose.models.Page || mongoose.model('Page', PageSchema);

  const existingSettings = await Setting.find({
    key: { $in: Object.keys(DEFAULT_SETTINGS) },
  }).lean();
  const haveKey = new Set(existingSettings.map((r) => r.key));
  const settingOps = Object.entries(DEFAULT_SETTINGS)
    .filter(([key]) => !haveKey.has(key))
    .map(([key, value]) => ({
      updateOne: {
        filter: { key },
        update: { $set: { key, value: value == null ? '' : String(value), updatedAt: new Date() } },
        upsert: true,
      },
    }));
  if (settingOps.length) {
    await Setting.bulkWrite(settingOps);
    console.log(`✅ Added ${settingOps.length} missing settings`);
  } else {
    console.log('✅ No missing settings (all keys already in DB)');
  }

  for (const slug of Object.keys(DEFAULT_PAGE_SECTIONS)) {
    const defs = DEFAULT_PAGE_SECTIONS[slug];
    const doc = await Page.findOne({ slug });
    if (!doc) {
      await Page.create({
        slug,
        title: CMS_PAGE_TITLES[slug] || slug,
        sections: { ...defs },
        updatedAt: new Date(),
      });
      console.log(`✅ Created page: ${slug}`);
      continue;
    }
    const cur = doc.sections && typeof doc.sections === 'object' ? doc.sections : {};
    const next = { ...cur };
    let changed = false;
    for (const [k, v] of Object.entries(defs)) {
      if (next[k] === undefined) {
        if (slug === 'about-us' && k === 'about_blocks') {
          const hasLegacy = ['intro', 'chairman_message', 'person_1_name', 'mission'].some(
            (key) => next[key] != null && String(next[key]).trim() !== '',
          );
          if (hasLegacy) continue;
        }
        next[k] = v;
        changed = true;
      }
    }
    if (changed) {
      await Page.updateOne(
        { _id: doc._id },
        { $set: { sections: next, updatedAt: new Date() } },
      );
      console.log(`✅ Patched page ${slug} (added missing section fields)`);
    } else {
      console.log(`— Page ${slug} already complete`);
    }
  }

  await mongoose.disconnect();
  console.log('\nDone.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
