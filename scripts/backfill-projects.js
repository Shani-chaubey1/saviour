require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

async function connectDB() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/saviourgroup';
  await mongoose.connect(uri);
  console.log('✅ Connected to MongoDB');
}

const PropertyTypeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true },
  isActive: { type: Boolean, default: true },
});

const AmenitySchema = new mongoose.Schema({
  name: { type: String, required: true },
  icon: { type: String, default: 'FaCheck' },
  isActive: { type: Boolean, default: true },
});

const SpecificationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  icon: { type: String, default: 'FaCheck' },
  isActive: { type: Boolean, default: true },
});

const ProjectSchema = new mongoose.Schema({}, { strict: false });

const PropertyType = mongoose.models.PropertyType || mongoose.model('PropertyType', PropertyTypeSchema);
const Amenity = mongoose.models.Amenity || mongoose.model('Amenity', AmenitySchema);
const Specification = mongoose.models.Specification || mongoose.model('Specification', SpecificationSchema);
const Project = mongoose.models.Project || mongoose.model('Project', ProjectSchema);

const FALLBACK_THUMBNAILS = [
  'https://saviourgroup.in/wp-content/uploads/2024/11/mart.png',
  'https://saviourgroup.in/wp-content/uploads/2025/06/savviour-manoharram.jpg',
  'https://saviourgroup.in/wp-content/uploads/2024/11/LORD-KRISHNA-MEDLLEY.png',
  'https://saviourgroup.in/wp-content/uploads/2024/11/lord-1.png',
  'https://saviourgroup.in/wp-content/uploads/2024/11/SAVVIOUR-1-1.png',
  'https://saviourgroup.in/wp-content/uploads/2024/11/SAVVIOUR-1520-x-530-px.png',
];

const DEFAULT_AMENITIES = [
  { name: 'Swimming Pool', icon: 'FaSwimmingPool' },
  { name: 'Gymnasium', icon: 'FaDumbbell' },
  { name: '24/7 Security', icon: 'FaShieldAlt' },
  { name: 'Power Backup', icon: 'FaBolt' },
  { name: 'Covered Parking', icon: 'FaParking' },
  { name: 'High-Speed Elevators', icon: 'FaArrowUp' },
];

const DEFAULT_SPECS = [
  { name: 'RCC Framed Structure', icon: 'FaHardHat' },
  { name: 'Vitrified Tile Flooring', icon: 'FaTh' },
  { name: 'Premium Sanitary Fittings', icon: 'FaTint' },
  { name: 'Concealed Copper Wiring', icon: 'FaBolt' },
  { name: 'Video Door Phone', icon: 'FaVideo' },
  { name: 'Fire Fighting Systems', icon: 'FaFireExtinguisher' },
];

function slugify(input) {
  return String(input || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

function isEmpty(v) {
  return v === undefined || v === null || v === '' || (Array.isArray(v) && v.length === 0);
}

function inferTypeText(project) {
  const raw = String(project.typeName || '').toLowerCase();
  if (raw.includes('commercial')) return 'commercial';
  if (raw.includes('residential')) return 'residential';
  const title = String(project.title || '').toLowerCase();
  if (title.includes('mart') || title.includes('commercial')) return 'commercial';
  return 'residential';
}

function typeDisplay(typeSlug) {
  return typeSlug === 'commercial' ? 'Commercial' : 'Residential';
}

async function ensureBaseMasters() {
  const types = {};
  for (const row of [
    { name: 'Commercial', slug: 'commercial', isActive: true },
    { name: 'Residential', slug: 'residential', isActive: true },
  ]) {
    const doc = await PropertyType.findOneAndUpdate(
      { slug: row.slug },
      { $setOnInsert: row },
      { upsert: true, new: true }
    );
    types[row.slug] = doc;
  }

  const amenityIds = [];
  for (const item of DEFAULT_AMENITIES) {
    const doc = await Amenity.findOneAndUpdate(
      { name: item.name },
      { $setOnInsert: { ...item, isActive: true } },
      { upsert: true, new: true }
    );
    amenityIds.push(doc._id);
  }

  const specIds = [];
  for (const item of DEFAULT_SPECS) {
    const doc = await Specification.findOneAndUpdate(
      { name: item.name },
      { $setOnInsert: { ...item, isActive: true } },
      { upsert: true, new: true }
    );
    specIds.push(doc._id);
  }

  return { types, amenityIds, specIds };
}

function buildFallbackDescription(project, typeSlug) {
  const t = project.title || 'Project';
  const loc = project.location || project.address || 'Delhi NCR';
  return `${t} is a premium ${typeSlug} development by Saviour Group located at ${loc}. ` +
    'The project is crafted with modern architecture, high-quality construction, and future-ready infrastructure. ' +
    'It offers excellent livability, strong investment potential, and seamless connectivity to major city corridors.';
}

function buildFallbackOverview(project, typeSlug) {
  return `<h2>${project.title || 'Project'} Overview</h2><p>${buildFallbackDescription(project, typeSlug)}</p>` +
    `<h3>Why Invest</h3><ul><li>Strategic location advantage</li><li>Trusted developer legacy</li><li>Strong long-term appreciation potential</li></ul>`;
}

async function run() {
  await connectDB();
  const { types, amenityIds, specIds } = await ensureBaseMasters();

  const projects = await Project.find().lean();
  if (!projects.length) {
    console.log('⚠️ No projects found in DB.');
    await mongoose.disconnect();
    return;
  }

  let modified = 0;
  for (let i = 0; i < projects.length; i++) {
    const p = projects[i];
    const typeSlug = (() => {
      if (typeof p.type === 'string') {
        const t = p.type.toLowerCase();
        if (t.includes('commercial')) return 'commercial';
        if (t.includes('residential')) return 'residential';
      }
      if (p.typeName) {
        const t = String(p.typeName).toLowerCase();
        if (t.includes('commercial')) return 'commercial';
        if (t.includes('residential')) return 'residential';
      }
      return inferTypeText(p);
    })();

    const chosenType = types[typeSlug] || types.residential;
    const thumb = p.thumbnail || FALLBACK_THUMBNAILS[i % FALLBACK_THUMBNAILS.length];
    const title = p.title || `Saviour Project ${i + 1}`;

    const patch = {
      title,
      slug: isEmpty(p.slug) ? slugify(title) : p.slug,
      rera: isEmpty(p.rera) ? `UPRERAPRJ${String(100000 + i).padStart(6, '0')}` : p.rera,
      configuration: isEmpty(p.configuration) ? (typeSlug === 'commercial' ? 'Shops & Office Spaces' : '2/3 BHK Apartments') : p.configuration,
      type: chosenType._id,
      typeName: isEmpty(p.typeName) ? typeDisplay(typeSlug) : p.typeName,
      address: isEmpty(p.address) ? (p.location || 'Greater Noida, Uttar Pradesh') : p.address,
      location: isEmpty(p.location) ? (p.address || 'Greater Noida, Uttar Pradesh') : p.location,
      status: isEmpty(p.status) ? 'For Sale' : p.status,
      price: isEmpty(p.price) ? (typeSlug === 'commercial' ? '₹30 Lacs Onwards' : '₹45 Lacs Onwards') : p.price,
      area: isEmpty(p.area) ? (typeSlug === 'commercial' ? '200-800 Sq.Ft' : '1050-1800 Sq.Ft') : p.area,
      pricePerSqft: isEmpty(p.pricePerSqft) ? (typeSlug === 'commercial' ? '₹18,000/Sq.Ft onwards' : '₹4,000/Sq.Ft onwards') : p.pricePerSqft,
      badge: isEmpty(p.badge) ? (typeSlug === 'commercial' ? 'Hot Offer!' : 'New Launch') : p.badge,
      excerpt: isEmpty(p.excerpt) ? buildFallbackDescription(p, typeSlug).slice(0, 220) : p.excerpt,
      overview: isEmpty(p.overview) ? buildFallbackOverview(p, typeSlug) : p.overview,
      thumbnail: thumb,
      gallery: Array.isArray(p.gallery) && p.gallery.length ? p.gallery : [thumb],
      floorPlans: Array.isArray(p.floorPlans) && p.floorPlans.length
        ? p.floorPlans
        : [{ title: 'Floor Plan', image: thumb }],
      masterPlan: isEmpty(p.masterPlan) ? thumb : p.masterPlan,
      video: isEmpty(p.video) ? '' : p.video,
      amenities: Array.isArray(p.amenities) && p.amenities.length ? p.amenities : amenityIds,
      specifications: Array.isArray(p.specifications) && p.specifications.length ? p.specifications : specIds,
      highlights: Array.isArray(p.highlights) && p.highlights.length
        ? p.highlights
        : [
            'Prime location with excellent connectivity',
            'Developed by trusted Saviour Group',
            'Strong long-term appreciation potential',
            'Quality construction and modern amenities',
          ],
      priceTable: Array.isArray(p.priceTable) && p.priceTable.length
        ? p.priceTable
        : [
            { type: 'Standard Unit', size: p.area || 'On Request', price: p.price || 'On Request' },
            { type: 'Premium Unit', size: p.area || 'On Request', price: p.price || 'On Request' },
          ],
      isActive: p.isActive === undefined ? true : p.isActive,
      isFeatured: p.isFeatured === undefined ? false : p.isFeatured,
      updatedAt: new Date(),
    };

    await Project.updateOne({ _id: p._id }, { $set: patch });
    modified += 1;
  }

  console.log(`✅ Backfilled ${modified} project(s) with complete field data`);
  await mongoose.disconnect();
}

run().catch((err) => {
  console.error('❌ Backfill failed:', err);
  process.exit(1);
});

