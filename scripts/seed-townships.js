/**
 * Seed default townships for the "Our Presence in Leading Townships" section.
 * Non-destructive: any township whose `area` already exists is skipped.
 *
 * Usage: npm run seed:townships
 *   (requires .env.local with MONGODB_URI)
 */
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env.local') });
const mongoose = require('mongoose');

const TownshipSchema = new mongoose.Schema(
  {
    area: { type: String, required: true, trim: true },
    city: { type: String, default: '', trim: true },
    image: { type: String, default: '' },
    link: { type: String, default: '' },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now },
  },
  { strict: false },
);

const SEED_TOWNSHIPS = [
  {
    area: 'Gaur Yamuna City',
    city: 'Yamuna Expressway',
    image:
      'https://saviourgroup.in/wp-content/uploads/2024/11/savviour-manoharram.png',
    link: '/projects?location=yamuna-expressway',
    order: 1,
  },
  {
    area: 'Crossing Republik',
    city: 'Ghaziabad',
    image:
      'https://saviourgroup.in/wp-content/uploads/2024/11/lord-1.png',
    link: '/projects?location=crossing-republik',
    order: 2,
  },
  {
    area: 'Gaur City',
    city: 'Noida Extension',
    image:
      'https://saviourgroup.in/wp-content/uploads/2024/11/SAVVIOUR-1520-x-530-px.png',
    link: '/projects?location=noida-extension',
    order: 3,
  },
];

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('Missing MONGODB_URI in .env.local');
    process.exit(1);
  }

  await mongoose.connect(uri);
  console.log('Connected to MongoDB');

  const Township =
    mongoose.models.Township || mongoose.model('Township', TownshipSchema);

  for (const seed of SEED_TOWNSHIPS) {
    const existing = await Township.findOne({ area: seed.area });
    if (existing) {
      console.log(`— Township "${seed.area}" already exists. Skipping.`);
      continue;
    }
    await Township.create({
      ...seed,
      isActive: true,
      createdAt: new Date(),
    });
    console.log(`Created township "${seed.area}"`);
  }

  await mongoose.disconnect();
  console.log('\nDone.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
