import connectDB from './mongodb';
import Project from './models/Project';
// PropertyType is referenced via `Project.type: ObjectId ref 'PropertyType'`.
// Mongoose only auto-registers a model when its module is evaluated, so this
// import must stay even though the symbol isn't used directly — otherwise
// `Project.find().populate('type', ...)` throws MissingSchemaError and the
// page silently falls back to SEED_PROJECTS.
import './models/PropertyType';
import PropertyType from './models/PropertyType';
import Post from './models/Post';
import Testimonial from './models/Testimonial';
import Setting from './models/Setting';
import Page from './models/Page';
import ContentPage from './models/ContentPage';
import Township from './models/Township';
import { DEFAULT_SETTINGS, DEFAULT_PAGE_SECTIONS } from './siteDefaults';

/**
 * Slugs that are already routed by static segments (or critical). Dynamic
 * `[slug]` pages must never be allowed to shadow these.
 */
export const RESERVED_CONTENT_PAGE_SLUGS = new Set([
  'about-us',
  'admin',
  'api',
  'blog',
  'contact-us',
  'home',
  'projects',
  'properties',
  'resedential-projects',
  'residential-projects',
]);

export { DEFAULT_SETTINGS, DEFAULT_PAGE_SECTIONS } from './siteDefaults';

// Seed data — used as fallback if DB is empty
export const SEED_PROJECTS = [
  {
    title: 'Lord Krishna Mart',
    slug: 'lord-krishna-mart',
    type: 'commercial',
    status: 'Possession Soon',
    badge: 'Hot Offer!',
    excerpt: 'Lord Krishna Mart is a beautifully designed convenient shopping center on Yamuna Expressway, Greater Noida. The project is an integral part ...',
    description: `Lord Krishna Mart is a beautifully designed convenient shopping center on Yamuna Expressway, Greater Noida. The project is an integral part of Gaur Yamuna City Township in 250 Acres. The Project will cater to the commercial requirements of approximate 17000 families expected in the township. The highlight of this project will be the 108 ft tall statue of LORD SHRI KRISHNA in "SHRI RADHA KRISHNA MART" which is opposite to the project and attract visitors on the Yamuna Expressway. The upcoming Jewar International Airport will also provide a great demand and footfall across the area. The project is a rich blend of Fun, Shopping, Entertainment, and Dining. The project can be reached easily through EXIT 2C from the Yamuna Expressway.`,
    price: '20 Lac-70 Lacs',
    size: '145-400 ft²',
    location: 'Yamuna Expressway',
    thumbnail: 'https://saviourgroup.in/wp-content/uploads/2024/11/mart.png',
    gallery: [
      'https://saviourgroup.in/wp-content/uploads/2025/05/LKM1.png',
      'https://saviourgroup.in/wp-content/uploads/2025/05/LKM2-1.png',
      'https://saviourgroup.in/wp-content/uploads/2025/05/LKM3.png',
    ],
    floorPlans: [
      'https://saviourgroup.in/wp-content/uploads/2025/05/floor-plan.png',
    ],
    highlights: [
      'The project is surrounded with school, Temple, High-Rise commercial proposed Service Apartments and Housing Projects.',
      'The building is a framed structure with dry partition wall between shops.',
      'Shopping arcade facing Yamuna Expressway & Directly Approached Statue and Temple.',
      'Commercial arcade has shops on lower ground, upper ground First, Second, Third, Fourth Floor and Food Court sit out Open Terraces.',
    ],
    features: ['Shop Sizes: 145 Sq. Ft to 400 Sq. Ft', 'Floors: Lower Ground Floor, Ground Floor, 1st, 2nd, 3rd'],
    floors: 'Lower Ground Floor, Ground Floor, 1st Floor, 2nd Floor & 3rd Floor',
    pricePerSqft: [
      { floor: 'Ground Floor', price: 'Starting from Rs. 22,500/Sq.Ft.' },
      { floor: 'Lower Ground Floor', price: 'Starting from Rs. 21,500/Sq.Ft.' },
      { floor: '1st Floor', price: 'Starting from Rs. 19,500/Sq.Ft.' },
      { floor: '2nd Floor', price: 'Starting from Rs. 15,500/Sq.Ft.' },
      { floor: '3rd Floor (Food Court)', price: 'Starting from Rs. 18,000/Sq.Ft.' },
    ],
    createdAt: new Date(Date.now() - 11 * 30 * 24 * 60 * 60 * 1000),
  },
  {
    title: 'Saviour Manoharram',
    slug: 'saviour-manoharram',
    type: 'commercial',
    status: 'For Sale',
    badge: 'Hot Offer!',
    excerpt: 'Saviour Manoharram is a commercial project on the yamuna expressway by Saviour Builders, the well known group of Delhi\'s real estate. After the huge success ...',
    description: `Saviour Manoharram is a commercial project on the yamuna expressway by Saviour Builders, the well known group of Delhi's real estate. After the huge success of Saviour Street and Saviour Greenarch projects, Saviour Group has launched Saviour Manoharram. The project offers a diverse range of commercial spaces including shops, showrooms, and food courts.`,
    price: '30lacs - 85lacs',
    size: '',
    location: 'Yamuna Expressway',
    thumbnail: 'https://saviourgroup.in/wp-content/uploads/2025/06/savviour-manoharram.jpg',
    gallery: [
      'https://saviourgroup.in/wp-content/uploads/2024/11/savviour.png',
      'https://saviourgroup.in/wp-content/uploads/2024/11/SAVVIOUR-.png',
    ],
    highlights: [
      'Located in Gaur Yamuna City, a prime commercial hub.',
      'Strategic positioning near the Noida International Airport.',
      'Flexible leasing terms for forward-thinking investors.',
      'Diverse commercial spaces including shops, showrooms, and food courts.',
    ],
    features: [],
    floors: '',
    pricePerSqft: [],
    createdAt: new Date(Date.now() - 12 * 30 * 24 * 60 * 60 * 1000),
  },
  {
    title: 'Lord Krishna Medlley',
    slug: 'lord-krishna-medlley',
    type: 'commercial',
    status: 'For Sale',
    badge: 'Hot Offer!',
    excerpt: 'Lord Krishna Medlley is a commercial project on the yamuna expressway by Saviour Builders, the well known group of Delhi\'s real estate. After the huge succes...',
    description: `Lord Krishna Medlley is a commercial project on the yamuna expressway by Saviour Builders, the well known group of Delhi's real estate. After the huge success of other commercial projects, Saviour Group has launched Lord Krishna Medlley. Nestled in the heart of Greater Noida, Lord Krishna Medley offers a prime location for businesses seeking to thrive in a rapidly developing commercial hub.`,
    price: '30lacs - 85lacs',
    size: '',
    location: 'Yamuna Expressway',
    thumbnail: 'https://saviourgroup.in/wp-content/uploads/2024/11/LORD-KRISHNA-MEDLLEY.png',
    gallery: [
      'https://saviourgroup.in/wp-content/uploads/2024/11/LORD-KRISHNA-MEDLLEY-1.png',
      'https://saviourgroup.in/wp-content/uploads/2024/11/Medlley.png',
    ],
    highlights: [
      'Prime location in Greater Noida.',
      'Near upcoming Jewar International Airport.',
      'Excellent ROI potential.',
    ],
    features: [],
    floors: '',
    pricePerSqft: [],
    createdAt: new Date(Date.now() - 4 * 365 * 24 * 60 * 60 * 1000),
  },
  {
    title: 'Saviour IRIS/Greenisle',
    slug: 'saviour-iris',
    type: 'residential',
    status: 'For Sale',
    badge: '',
    excerpt: 'Saviour IRIS is a residential project by Saviour Builders in Crossing Republik, Ghaziabad. The project offers living accommodations with a good combinati...',
    description: `Saviour IRIS is a residential project by Saviour Builders in Crossing Republik, Ghaziabad. The project offers living accommodations with a good combination of facilities and amenities. Saviour IRIS offers apartments in varied floor plan configurations.`,
    price: '35lacs - 62lacs',
    size: '1050 - 1800 ft²',
    location: 'Crossing Republik, Ghaziabad',
    thumbnail: 'https://saviourgroup.in/wp-content/uploads/2024/11/lord-1.png',
    gallery: [],
    highlights: [
      'Located in Crossing Republik, Ghaziabad.',
      'Well-connected to Delhi and Noida.',
      'Quality construction with modern amenities.',
    ],
    features: [],
    floors: '',
    pricePerSqft: [],
    createdAt: new Date(Date.now() - 5 * 365 * 24 * 60 * 60 * 1000),
  },
  {
    title: 'Saviour Park Elite',
    slug: 'saviour-park-elite',
    type: 'residential',
    status: 'For Sale',
    badge: '',
    excerpt: 'Saviour Park Elite is located at Mohan Nagar, Ghaziabad. It is directly connected to Delhi and Noida. Mohan Nagar has been forever a decent alternative f...',
    description: `Saviour Park Elite is located at Mohan Nagar, Ghaziabad. It is directly connected to Delhi and Noida. Mohan Nagar has been forever a decent alternative for people who are employed in Delhi and Noida but cannot afford the steep prices of residential properties. The locality offers good connectivity, basic amenities and quality infrastructure.`,
    price: 'Rs. 44.97* Lakhs Onwards',
    size: '1285 - 2450 ft²',
    location: 'Mohan Nagar, Ghaziabad',
    thumbnail: 'https://saviourgroup.in/wp-content/uploads/2024/11/SAVVIOUR-1-1.png',
    gallery: [],
    highlights: [
      'Directly connected to Delhi and Noida.',
      'Premium residential complex in Mohan Nagar.',
      'Spacious 2/3/4 BHK apartments.',
    ],
    features: [],
    floors: '',
    pricePerSqft: [],
    createdAt: new Date(Date.now() - 5 * 365 * 24 * 60 * 60 * 1000),
  },
  {
    title: 'Saviour Greenarch',
    slug: 'saviour-greenarch',
    type: 'residential',
    status: 'For Sale',
    badge: '',
    excerpt: 'Saviour Builders Pvt. Ltd is the name of leading realty developer in NCR that has become substitutable with the simplest quality and innovation within the fi...',
    description: `Saviour Builders Pvt. Ltd is the name of leading realty developer in NCR that has become substitutable with the simplest quality and innovation within the field. Saviour Greenarch is located in Greater Noida West (Noida Extension) and is one of the most preferred residential complexes in the area.`,
    price: '30lacs - 85lacs',
    size: '1180-1475 ft²',
    location: 'Greater Noida West',
    thumbnail: 'https://saviourgroup.in/wp-content/uploads/2024/11/SAVVIOUR-1520-x-530-px.png',
    gallery: [],
    highlights: [
      'Located in Greater Noida West (Noida Extension).',
      'Modern architecture with green spaces.',
      'Premium 2/3 BHK apartments.',
    ],
    features: [],
    floors: '',
    pricePerSqft: [],
    createdAt: new Date(Date.now() - 5 * 365 * 24 * 60 * 60 * 1000),
  },
];

export const SEED_POSTS = [
  {
    title: 'Best Commercial Spaces on Yamuna Expressway',
    slug: 'best-commercial-spaces-on-yamuna-expressway',
    excerpt: 'Saviour Manoharram Is a prime location for High-End Businesses Saviour Manoharram stands out as a top destination for commercial investments due to its unparalleled location along the Yamuna Expressway, a key development corridor.',
    content: `<h2>Saviour Manoharram Is a prime location for High-End Businesses</h2>
<p>Saviour Manoharram stands out as a top destination for commercial investments due to its unparalleled location along the Yamuna Expressway, a key development corridor. Positioned just minutes away from the upcoming Jewar International Airport, Saviour Manoharram offers businesses the advantage of being in a high-growth zone.</p>
<p>The project is strategically located within Gaur Yamuna City, one of the most ambitious township projects in the Delhi-NCR region. This prime positioning ensures that businesses at Saviour Manoharram benefit from the steady flow of traffic generated by the township's large residential population.</p>
<h3>Why Choose Yamuna Expressway?</h3>
<p>The Yamuna Expressway corridor has emerged as one of the most sought-after commercial destinations in North India. With multiple infrastructure projects underway, including the Jewar Airport, Formula One circuit, and various educational institutions, the area is set to witness exponential growth.</p>`,
    thumbnail: 'https://saviourgroup.in/wp-content/uploads/2025/05/b1.jpg',
    category: 'Commercial',
    tags: ['Yamuna Expressway', 'Commercial', 'Investment'],
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
  },
  {
    title: 'How to Lease Commercial Property at Saviour Manoharram?',
    slug: 'how-to-lease-commercial-property-at-saviour-manoharram',
    excerpt: 'Leasing Terms for Investors at Saviour Manoharram. Saviour Manoharram, a landmark development located along the Yamuna Expressway, offers attractive leasing terms designed for forward-thinking investors.',
    content: `<h2>Leasing Terms for Investors at Saviour Manoharram</h2>
<p>Saviour Manoharram, a landmark development located along the Yamuna Expressway, offers attractive leasing terms designed for forward-thinking investors. With its strategic positioning near the Noida International Airport and within the expansive Gaur Yamuna City township, leasing a commercial space here promises excellent returns.</p>
<h3>Flexible Leasing Options</h3>
<p>The project offers a range of commercial spaces that can be leased for various business purposes. Whether you're looking to establish a retail outlet, a restaurant, or a corporate office, Saviour Manoharram has the right space for your business needs.</p>`,
    thumbnail: 'https://saviourgroup.in/wp-content/uploads/2025/05/b2.webp',
    category: 'Investment',
    tags: ['Leasing', 'Commercial', 'Manoharram'],
    createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000),
  },
  {
    title: 'Expected ROI for Commercial Property at Saviour Manoharram',
    slug: 'expected-roi-for-commercial-property-at-saviour-manoharram',
    excerpt: 'Unlocking Potential Returns: Expected ROI at Saviour Manoharram. Saviour Manoharram, situated in the thriving Gaur Yamuna City along the Yamuna Expressway, presents itself as a promising investment opportunity.',
    content: `<h2>Unlocking Potential Returns: Expected ROI at Saviour Manoharram</h2>
<p>Saviour Manoharram, situated in the thriving Gaur Yamuna City along the Yamuna Expressway, presents itself as a promising investment opportunity. Designed to cater to diverse commercial pursuits, the project's expected ROI is fueled by various factors that make it a compelling choice for investors.</p>
<h3>Key ROI Drivers</h3>
<ul>
<li>Strategic location near Jewar International Airport</li>
<li>Part of the 1000-acre Gaur Yamuna City township</li>
<li>Growing residential population in the area</li>
<li>Excellent connectivity through Yamuna Expressway</li>
</ul>`,
    thumbnail: 'https://saviourgroup.in/wp-content/uploads/2024/11/lord-9.png',
    category: 'Investment',
    tags: ['ROI', 'Investment', 'Commercial'],
    createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
  },
  {
    title: 'Types of Stores in Lord Krishna Mart – Full Details',
    slug: 'types-of-stores-in-lord-krishna-mart-full-details',
    excerpt: 'A New Hub of Shopping and Lifestyle at Lord Krishna Mart. Lord Krishna Mart is shaping up to be a premier shopping destination, offering an array of retail spaces to meet various lifestyle needs.',
    content: `<h2>A New Hub of Shopping and Lifestyle at Lord Krishna Mart</h2>
<p>Lord Krishna Mart is shaping up to be a premier shopping destination, offering an array of retail spaces to meet various lifestyle needs. This development features various types of stores designed to attract both local and regional shoppers.</p>
<h3>Available Store Types</h3>
<ul>
<li>Ground Floor Retail Shops – Ideal for high-footfall businesses</li>
<li>Lower Ground Floor Shops – Perfect for storage-heavy businesses</li>
<li>First & Second Floor Showrooms – For lifestyle and fashion brands</li>
<li>Third Floor Food Court – A complete dining destination</li>
</ul>`,
    thumbnail: 'https://saviourgroup.in/wp-content/uploads/2024/11/LORD-KRISHNA-MART.png',
    category: 'Commercial',
    tags: ['Lord Krishna Mart', 'Shopping', 'Commercial'],
    createdAt: new Date(Date.now() - 75 * 24 * 60 * 60 * 1000),
  },
  {
    title: 'Where is Lord Krishna Medley located?',
    slug: 'where-is-lord-krishna-medley-located',
    excerpt: 'Lord Krishna Medley: Your Prime Spot for Business Success. Nestled in the heart of Greater Noida, Lord Krishna Medley offers a prime location for businesses seeking to thrive in a rapidly developing commercial hub.',
    content: `<h2>Lord Krishna Medley: Your Prime Spot for Business Success</h2>
<p>Nestled in the heart of Greater Noida, Lord Krishna Medley offers a prime location for businesses seeking to thrive in a rapidly developing commercial hub. Situated on the Yamuna Expressway, this commercial project is perfectly positioned to capitalize on the growing business activity in the region.</p>`,
    thumbnail: 'https://saviourgroup.in/wp-content/uploads/2024/11/LORD-KRISHNA-MEDLLEY.png',
    category: 'Commercial',
    tags: ['Lord Krishna Medley', 'Greater Noida', 'Location'],
    createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
  },
  {
    title: 'How to Lease a Shop or Office at Saviour Manoharram?',
    slug: 'how-to-lease-a-shop-or-office-at-saviour-manoharram',
    excerpt: 'Leasing Options for Commercial Spaces at Savviour Manoharram. Saviour Manoharram provides flexible leasing options for businesses looking to establish their presence in a prime commercial hub.',
    content: `<h2>Leasing Options for Commercial Spaces at Savviour Manoharram</h2>
<p>Saviour Manoharram provides flexible leasing options for businesses looking to establish their presence in a prime commercial hub. Situated along the Yamuna Expressway and part of a mega township, this development is an ideal spot for your business.</p>`,
    thumbnail: 'https://saviourgroup.in/wp-content/uploads/2024/11/savviour.png',
    category: 'Investment',
    tags: ['Leasing', 'Office', 'Commercial'],
    createdAt: new Date(Date.now() - 105 * 24 * 60 * 60 * 1000),
  },
];

export const SEED_TESTIMONIALS = [
  {
    name: 'Annirudha',
    role: 'Team Lead',
    company: 'HCL Technologies',
    content: 'I purchased a flat through saviourgroup.in in Noida. I am highly satisfied with the services provided by Saviour Group. I just provided details of the flat looking for and, the Saviour Group team has provided me lots of options. They not only helped me to provide my dream home but also in budget. Thanks a ton Saviour Group. I wish you all the best.',
    rating: 5,
  },
  {
    name: 'Ashish Shriwastav',
    role: 'Software Developer',
    company: 'NXP Semiconductors',
    content: 'I am expressing my humble gratitude for the outstanding service and support provided by team Saviour Group, by guiding me for a home loan. With their guidance, I never felt that I am applying for a home loan from Hong Kong. Within two weeks of application, I have received my home loan approval letter which is really a great achievement.',
    rating: 5,
  },
  {
    name: 'Rajeev Kumar',
    role: 'Manager',
    company: 'Mondelez International',
    content: 'This is to acknowledge the efforts of Saviour Group in helping me to find a property of my exact choice and also helping me in negotiating the price of the flat with the builders. The representative of Saviour Group has been extremely professional, sincere and helpful.',
    rating: 5,
  },
  {
    name: 'Harish Kumar',
    role: 'Developer',
    company: 'Bloom Reach (IIT Delhi)',
    content: 'I extremely appreciate the kind and professional effort from team Saviour Group. Their tireless and utmost friendly behavior helped right from search till booking and registration. Being a stranger to the city, they not only guided me on everything but, also went out of the way till I got my possession.',
    rating: 5,
  },
  {
    name: 'Sachin Goel',
    role: 'Manager',
    company: 'Oracle',
    content: 'Buying a flat is a difficult thing in Noida Extension. Saviour Group made it very easy for us to select and buy a flat as per our requirements. They assisted us very well, provided several options and allowed us to choose as per our need and time. We truly appreciate their effort.',
    rating: 5,
  },
];

async function ensureSeedData() {
  try {
    await connectDB();

    const projectCount = await Project.countDocuments();
    if (projectCount === 0) {
      await Project.insertMany(SEED_PROJECTS);
    }

    const postCount = await Post.countDocuments();
    if (postCount === 0) {
      await Post.insertMany(SEED_POSTS);
    }

    const testimonialCount = await Testimonial.countDocuments();
    if (testimonialCount === 0) {
      await Testimonial.insertMany(SEED_TESTIMONIALS);
    }
  } catch (err) {
    console.error('Seed error:', err);
  }
}

/**
 * Convert a URL location slug (e.g. "yamuna-expressway") into the lower-case
 * search needle used to match against `address` / `location` fields
 * (e.g. "yamuna expressway").
 */
function locationSlugToNeedle(slug) {
  return String(slug || '')
    .trim()
    .toLowerCase()
    .replace(/-+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export async function getProjects({ type, limit, location } = {}) {
  const normalizedType = (type || '').toString().trim().toLowerCase();
  const locationNeedle = locationSlugToNeedle(location);
  try {
    await ensureSeedData();

    // `type` can be stored in multiple formats in this codebase:
    // 1) legacy string field (commercial/residential),
    // 2) ObjectId ref to PropertyType (with name/slug),
    // 3) optional `typeName` text.
    // Fetch broad and normalize-filter in JS for consistent behavior.
    // Sort by manual `order` first (lower = earlier), then newest-first as
    // tiebreaker for rows that haven't been manually ordered.
    const rows = await Project.find()
      .populate('type', 'name slug')
      .sort({ order: 1, createdAt: -1 })
      .lean();

    const filteredByType = normalizedType
      ? rows.filter((p) => {
          const legacyType = typeof p?.type === 'string' ? p.type.toLowerCase() : '';
          const refTypeName =
            p?.type && typeof p.type === 'object' && p.type.name ? String(p.type.name).toLowerCase() : '';
          const refTypeSlug =
            p?.type && typeof p.type === 'object' && p.type.slug ? String(p.type.slug).toLowerCase() : '';
          const typeNameField = p?.typeName ? String(p.typeName).toLowerCase() : '';

          return (
            legacyType === normalizedType ||
            refTypeSlug === normalizedType ||
            refTypeName === normalizedType ||
            typeNameField === normalizedType
          );
        })
      : rows;

    // Location filter: case-insensitive substring match against the project's
    // address (primary) or location field (fallback). The query value is a
    // slug ("yamuna-expressway") that we de-slugify before comparing.
    const filtered = locationNeedle
      ? filteredByType.filter((p) => {
          const address = String(p?.address || '').toLowerCase();
          const loc = String(p?.location || '').toLowerCase();
          return address.includes(locationNeedle) || loc.includes(locationNeedle);
        })
      : filteredByType;

    return JSON.parse(JSON.stringify(filtered.slice(0, limit || 100)));
  } catch (err) {
    console.error('[getProjects] DB error, using seed fallback:', err?.message || err);
    const fallback = type
      ? SEED_PROJECTS.filter((p) => String(p.type || '').toLowerCase() === normalizedType)
      : SEED_PROJECTS;
    const fallbackFiltered = locationNeedle
      ? fallback.filter((p) => {
          const loc = String(p?.location || '').toLowerCase();
          return loc.includes(locationNeedle);
        })
      : fallback;
    return fallbackFiltered.slice(0, limit || 100);
  }
}

export async function getProjectBySlug(slug) {
  try {
    await connectDB();
    const project = await Project.findOne({ slug }).lean();
    if (!project) return SEED_PROJECTS.find(p => p.slug === slug) ?? null;
    return JSON.parse(JSON.stringify(project));
  } catch {
    return SEED_PROJECTS.find(p => p.slug === slug) ?? null;
  }
}

export async function getPosts({ limit } = {}) {
  try {
    await ensureSeedData();
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .limit(limit || 100)
      .lean();
    return JSON.parse(JSON.stringify(posts));
  } catch {
    return SEED_POSTS.slice(0, limit || 100);
  }
}

export async function getPostBySlug(slug) {
  try {
    await connectDB();
    const post = await Post.findOne({ slug }).lean();
    if (!post) return SEED_POSTS.find(p => p.slug === slug) ?? null;
    return JSON.parse(JSON.stringify(post));
  } catch {
    return SEED_POSTS.find(p => p.slug === slug) ?? null;
  }
}

export async function getTestimonials() {
  try {
    await ensureSeedData();
    const testimonials = await Testimonial.find().sort({ createdAt: -1 }).lean();
    return JSON.parse(JSON.stringify(testimonials));
  } catch {
    return SEED_TESTIMONIALS;
  }
}

export async function getSettings() {
  try {
    await connectDB();
    const rows = await Setting.find().lean();
    const map = { ...DEFAULT_SETTINGS };
    rows.forEach(r => { map[r.key] = r.value; });
    return map;
  } catch {
    return DEFAULT_SETTINGS;
  }
}

/** CMS sections for static pages — merges DB with `DEFAULT_PAGE_SECTIONS` from siteDefaults. */
export async function getPageSections(slug) {
  const base = DEFAULT_PAGE_SECTIONS[slug] ? { ...DEFAULT_PAGE_SECTIONS[slug] } : {};
  try {
    await connectDB();
    const doc = await Page.findOne({ slug }).lean();
    const fromDb = doc?.sections && typeof doc.sections === 'object' ? doc.sections : {};
    return JSON.parse(JSON.stringify({ ...base, ...fromDb }));
  } catch {
    return JSON.parse(JSON.stringify(base));
  }
}

/* ─────────── Dynamic content pages (Disclaimer, Privacy, etc.) ─────────── */
export async function getContentPageBySlug(slug) {
  if (!slug) return null;
  const cleaned = String(slug).trim().toLowerCase();
  if (!cleaned || RESERVED_CONTENT_PAGE_SLUGS.has(cleaned)) return null;
  try {
    await connectDB();
    const doc = await ContentPage.findOne({ slug: cleaned, isPublished: true }).lean();
    if (!doc) return null;
    return JSON.parse(JSON.stringify(doc));
  } catch {
    return null;
  }
}

export async function getContentPages({ publishedOnly = false } = {}) {
  try {
    await connectDB();
    const query = publishedOnly ? { isPublished: true } : {};
    const docs = await ContentPage.find(query)
      .sort({ order: 1, title: 1 })
      .lean();
    return JSON.parse(JSON.stringify(docs));
  } catch {
    return [];
  }
}

export async function getFooterContentPages() {
  try {
    await connectDB();
    const docs = await ContentPage.find({ isPublished: true, showInFooter: true })
      .sort({ order: 1, title: 1 })
      .select('slug title')
      .lean();
    return JSON.parse(JSON.stringify(docs));
  } catch {
    return [];
  }
}

/* ─────────── Property types (for /projects?type=… sitemap entries) ─────────── */
/**
 * Returns the set of `type` slugs that have at least one project, ready to be
 * used as `/projects?type=<slug>` URLs. Includes:
 *   • Active PropertyType records (slug field)
 *   • Legacy projects where `type` is stored as a plain string
 *   • Falls back to ['residential','commercial'] if the DB is empty/unreachable
 *     so the canonical category URLs always appear in the sitemap.
 */
export async function getPropertyTypeSlugs() {
  const fallback = ['residential', 'commercial'];
  try {
    await connectDB();
    const slugs = new Set();

    const types = await PropertyType.find({ isActive: true }).select('slug name').lean();
    types.forEach((t) => {
      const slug = (t.slug || t.name || '').toString().trim().toLowerCase();
      if (slug) slugs.add(slug);
    });

    const legacy = await Project.distinct('type', { type: { $type: 'string', $ne: '' } });
    legacy.forEach((raw) => {
      const slug = String(raw || '').trim().toLowerCase();
      if (slug) slugs.add(slug);
    });

    fallback.forEach((s) => slugs.add(s));
    return Array.from(slugs);
  } catch {
    return fallback;
  }
}

/* ─────────── Townships (homepage "Our Presence" cards) ─────────── */
export async function getTownships({ publishedOnly = true } = {}) {
  try {
    await connectDB();
    const query = publishedOnly ? { isActive: true } : {};
    const docs = await Township.find(query)
      .sort({ order: 1, createdAt: 1 })
      .lean();
    return JSON.parse(JSON.stringify(docs));
  } catch {
    return [];
  }
}

/* ── Hero Slides from latest projects ── */
export async function getHeroSlides() {
  try {
    await connectDB();
    const projects = await Project.find({ thumbnail: { $exists: true, $ne: '' } })
      .sort({ createdAt: -1 })
      .limit(5)
      .select('title slug status badge thumbnail excerpt')
      .lean();
    if (!projects.length) throw new Error('empty');
    return JSON.parse(JSON.stringify(projects));
  } catch {
    return SEED_PROJECTS.filter(p => p.thumbnail).slice(0, 5);
  }
}
