require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

/* ─── Connect ─── */
async function connectDB() {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/saviourgroup');
  console.log('✅ Connected to MongoDB');
}

/* ─── Schemas ─── */
const PropertyTypeSchema = new mongoose.Schema({ name: String, slug: String, description: String });
const AmenitySchema = new mongoose.Schema({ name: String, icon: String, category: String });
const SpecificationSchema = new mongoose.Schema({ name: String, icon: String, category: String });

const ProjectSchema = new mongoose.Schema({
  title: String, slug: String, type: String, status: String, badge: String,
  excerpt: String, description: String, overview: String,
  price: String, area: String, size: String, location: String,
  configuration: String, rera: String, pricePerSqft: String,
  thumbnail: String, gallery: [String], masterPlan: String, video: String,
  amenities: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Amenity' }],
  specifications: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Specification' }],
  propertyType: { type: mongoose.Schema.Types.ObjectId, ref: 'PropertyType' },
  highlights: [String], features: [String],
  floorPlans: [{ label: String, image: String }],
  priceTable: [{ type: { type: String }, size: String, price: String }],
  isPublished: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

const PostSchema = new mongoose.Schema({
  title: String, slug: String, excerpt: String, content: String,
  thumbnail: String, category: String, tags: [String],
  isPublished: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

const TestimonialSchema = new mongoose.Schema({
  name: String, role: String, company: String, content: String,
  rating: Number, avatar: String,
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

const AdminSchema = new mongoose.Schema({
  name: String, email: String, password: String,
  role: { type: String, enum: ['super_admin', 'admin'], default: 'admin' },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

const EnquirySchema = new mongoose.Schema({
  name: String, email: String, phone: String,
  project: String, message: String,
  status: { type: String, default: 'new' },
  createdAt: { type: Date, default: Date.now },
});

const SettingSchema = new mongoose.Schema({ key: String, value: String, group: String });

/* ─── Models ─── */
const PropertyType = mongoose.models.PropertyType || mongoose.model('PropertyType', PropertyTypeSchema);
const Amenity = mongoose.models.Amenity || mongoose.model('Amenity', AmenitySchema);
const Specification = mongoose.models.Specification || mongoose.model('Specification', SpecificationSchema);
const Project = mongoose.models.Project || mongoose.model('Project', ProjectSchema);
const Post = mongoose.models.Post || mongoose.model('Post', PostSchema);
const Testimonial = mongoose.models.Testimonial || mongoose.model('Testimonial', TestimonialSchema);
const Admin = mongoose.models.Admin || mongoose.model('Admin', AdminSchema);
const Enquiry = mongoose.models.Enquiry || mongoose.model('Enquiry', EnquirySchema);
const Setting = mongoose.models.Setting || mongoose.model('Setting', SettingSchema);

/* ─── Seed Data ─── */
async function seed() {
  await connectDB();

  // Clear all
  await Promise.all([
    PropertyType.deleteMany({}), Amenity.deleteMany({}),
    Specification.deleteMany({}), Project.deleteMany({}),
    Post.deleteMany({}), Testimonial.deleteMany({}),
    Admin.deleteMany({}), Enquiry.deleteMany({}), Setting.deleteMany({}),
  ]);
  console.log('🗑️  Cleared existing data');

  /* ── Admin ── */
  const hashedPass = await bcrypt.hash('Admin@2026', 10);
  await Admin.create([
    { name: 'Super Admin', email: 'admin@saviourgroup.in', password: hashedPass, role: 'super_admin' },
    { name: 'Content Manager', email: 'content@saviourgroup.in', password: hashedPass, role: 'admin' },
  ]);
  console.log('👤 Created admins');

  /* ── Property Types ── */
  const types = await PropertyType.insertMany([
    { name: 'Commercial', slug: 'commercial', description: 'Shops, showrooms, office spaces, food courts' },
    { name: 'Residential', slug: 'residential', description: '2 BHK, 3 BHK, 4 BHK apartments and villas' },
    { name: 'Township', slug: 'township', description: 'Integrated township projects with all amenities' },
    { name: 'Plots', slug: 'plots', description: 'Residential and commercial land parcels' },
  ]);
  const [commercial, residential] = types;
  console.log('🏷️  Created property types');

  /* ── Amenities ── */
  const amenities = await Amenity.insertMany([
    { name: 'Swimming Pool', icon: 'FaSwimmingPool', category: 'Recreation' },
    { name: 'Gymnasium', icon: 'FaDumbbell', category: 'Health' },
    { name: 'Clubhouse', icon: 'FaBuilding', category: 'Community' },
    { name: 'Children Play Area', icon: 'FaChild', category: 'Recreation' },
    { name: 'Landscaped Gardens', icon: 'FaLeaf', category: 'Environment' },
    { name: 'Jogging Track', icon: 'FaRunning', category: 'Health' },
    { name: 'Multi-purpose Hall', icon: 'FaUsers', category: 'Community' },
    { name: '24/7 Security', icon: 'FaShieldAlt', category: 'Safety' },
    { name: 'CCTV Surveillance', icon: 'FaVideo', category: 'Safety' },
    { name: 'Power Backup', icon: 'FaBolt', category: 'Utilities' },
    { name: 'Rainwater Harvesting', icon: 'FaTint', category: 'Environment' },
    { name: 'Intercom Facility', icon: 'FaPhone', category: 'Utilities' },
    { name: 'Covered Parking', icon: 'FaParking', category: 'Utilities' },
    { name: 'High-Speed Elevators', icon: 'FaArrowUp', category: 'Utilities' },
    { name: 'Food Court', icon: 'FaUtensils', category: 'Recreation' },
  ]);
  console.log('✨ Created amenities');

  /* ── Specifications ── */
  const specs = await Specification.insertMany([
    { name: 'RCC Framed Structure', icon: 'FaHardHat', category: 'Structure' },
    { name: 'Vitrified Tile Flooring', icon: 'FaTh', category: 'Flooring' },
    { name: 'Anti-skid Bathroom Tiles', icon: 'FaBath', category: 'Flooring' },
    { name: 'UPVC Doors & Windows', icon: 'FaDoorClosed', category: 'Fixtures' },
    { name: 'Modular Kitchen', icon: 'FaUtensils', category: 'Kitchen' },
    { name: 'Granite Kitchen Platform', icon: 'FaGem', category: 'Kitchen' },
    { name: 'Premium Sanitary Fittings', icon: 'FaTint', category: 'Bathroom' },
    { name: 'Concealed Copper Wiring', icon: 'FaBolt', category: 'Electrical' },
    { name: 'Provision for AC', icon: 'FaSnowflake', category: 'Electrical' },
    { name: 'Oil-bound Distemper Walls', icon: 'FaPaintRoller', category: 'Finishing' },
    { name: 'Video Door Phone', icon: 'FaVideo', category: 'Security' },
    { name: 'Fire Fighting Systems', icon: 'FaFireExtinguisher', category: 'Safety' },
  ]);
  console.log('📋 Created specifications');

  /* ── Projects ── */
  const projectAmenities = amenities.slice(0, 8).map((a) => a._id);
  const projectSpecs = specs.slice(0, 6).map((s) => s._id);

  await Project.insertMany([
    {
      title: 'Lord Krishna Mart',
      slug: 'lord-krishna-mart',
      type: 'commercial',
      propertyType: commercial._id,
      status: 'Possession Soon',
      badge: 'Hot Offer!',
      rera: 'UPRERAPRJ123456',
      configuration: 'Shops: 145–400 Sq.Ft',
      excerpt: 'Lord Krishna Mart is a beautifully designed convenient shopping center on Yamuna Expressway, Greater Noida — integral to Gaur Yamuna City Township.',
      description: `Lord Krishna Mart is a beautifully designed convenient shopping center on Yamuna Expressway, Greater Noida. The project is an integral part of Gaur Yamuna City Township in 250 Acres. The Project will cater to the commercial requirements of approximate 17,000 families expected in the township.\n\nThe highlight of this project is the 108 ft tall statue of LORD SHRI KRISHNA in SHRI RADHA KRISHNA MART which is opposite to the project and attracts visitors on the Yamuna Expressway. The upcoming Jewar International Airport will also provide great demand and footfall across the area.\n\nThe project is a rich blend of Fun, Shopping, Entertainment, and Dining. The project can be reached easily through EXIT 2C from the Yamuna Expressway.`,
      overview: `<h2>About Lord Krishna Mart</h2><p>Lord Krishna Mart stands as one of the most strategically placed commercial developments on the Yamuna Expressway corridor. Positioned within the expansive Gaur Yamuna City Township, the project benefits from a captive audience of over 17,000 families who will require retail, dining, and entertainment services.</p><h3>Location Advantages</h3><ul><li>Direct visibility from Yamuna Expressway</li><li>Adjacent to the iconic 108-ft Lord Krishna statue</li><li>Minutes from upcoming Jewar International Airport</li><li>Part of 250-acre integrated township</li></ul><h3>Investment Potential</h3><p>With footfall driven by both the township's residential population and highway traffic, Lord Krishna Mart offers one of the lowest-risk commercial investments in Greater Noida's fastest-growing zone.</p>`,
      price: '₹20 Lac – ₹70 Lacs',
      area: '145 – 400 Sq.Ft',
      size: '145-400 ft²',
      location: 'Yamuna Expressway, Greater Noida',
      pricePerSqft: '₹18,000 – ₹22,500/Sq.Ft',
      thumbnail: 'https://saviourgroup.in/wp-content/uploads/2024/11/mart.png',
      gallery: [
        'https://saviourgroup.in/wp-content/uploads/2025/05/LKM1.png',
        'https://saviourgroup.in/wp-content/uploads/2025/05/LKM2-1.png',
        'https://saviourgroup.in/wp-content/uploads/2025/05/LKM3.png',
      ],
      highlights: [
        'Surrounded by schools, temples, and high-rise residential projects',
        'Framed RCC structure with dry partition walls between shops',
        'Shopping arcade facing Yamuna Expressway with direct temple access',
        'Shops on LG, G, 1st, 2nd, 3rd Floor with Food Court on top',
        'Part of 250-acre Gaur Yamuna City township',
      ],
      floorPlans: [
        { label: 'Ground Floor Plan', image: 'https://saviourgroup.in/wp-content/uploads/2025/05/floor-plan.png' },
      ],
      priceTable: [
        { type: 'Ground Floor', size: '145–400 Sq.Ft', price: 'From ₹22,500/Sq.Ft' },
        { type: 'Lower Ground', size: '145–400 Sq.Ft', price: 'From ₹21,500/Sq.Ft' },
        { type: '1st Floor', size: '145–400 Sq.Ft', price: 'From ₹19,500/Sq.Ft' },
        { type: '2nd Floor', size: '145–400 Sq.Ft', price: 'From ₹15,500/Sq.Ft' },
        { type: '3rd Floor (Food Court)', size: '145–400 Sq.Ft', price: 'From ₹18,000/Sq.Ft' },
      ],
      amenities: projectAmenities,
      specifications: projectSpecs,
      createdAt: new Date(Date.now() - 11 * 30 * 24 * 60 * 60 * 1000),
    },
    {
      title: 'Saviour Manoharram',
      slug: 'saviour-manoharram',
      type: 'commercial',
      propertyType: commercial._id,
      status: 'For Sale',
      badge: 'Hot Offer!',
      rera: 'UPRERAPRJ234567',
      configuration: 'Shops & Showrooms',
      excerpt: 'Saviour Manoharram is a landmark commercial project on the Yamuna Expressway by Saviour Builders — the trusted name in Delhi-NCR real estate.',
      description: `Saviour Manoharram is a landmark commercial project on the Yamuna Expressway by Saviour Builders, the well-known group of Delhi's real estate. After the huge success of Saviour Street and Saviour Greenarch projects, Saviour Group has launched Saviour Manoharram.\n\nLocated within the prestigious Gaur Yamuna City, this project offers diverse commercial spaces including retail shops, showrooms, and food courts catering to businesses of all scales. With the Jewar International Airport nearby and excellent expressway connectivity, Saviour Manoharram is poised to be a commercial landmark.`,
      overview: `<h2>Saviour Manoharram – Your Business Destination</h2><p>Saviour Manoharram redefines commercial real estate on the Yamuna Expressway. Strategically positioned within Gaur Yamuna City, this development offers businesses unparalleled visibility, footfall, and connectivity.</p><h3>Why Invest Here?</h3><ul><li>Proximity to Jewar International Airport</li><li>Part of 1000-acre integrated township</li><li>Flexible space sizes for all business types</li><li>Guaranteed rental potential from township population</li></ul>`,
      price: '₹30 Lacs – ₹85 Lacs',
      area: 'Flexible Options',
      size: 'Flexible',
      location: 'Gaur Yamuna City, Yamuna Expressway',
      pricePerSqft: 'On Request',
      thumbnail: 'https://saviourgroup.in/wp-content/uploads/2025/06/savviour-manoharram.jpg',
      gallery: [
        'https://saviourgroup.in/wp-content/uploads/2024/11/savviour.png',
        'https://saviourgroup.in/wp-content/uploads/2024/11/SAVVIOUR-.png',
      ],
      highlights: [
        'Located in Gaur Yamuna City — a prime commercial hub',
        'Strategic positioning near Noida International Airport',
        'Flexible leasing terms for forward-thinking investors',
        'Diverse commercial spaces: shops, showrooms, food courts',
        'Part of thriving 1000-acre township ecosystem',
      ],
      amenities: projectAmenities.slice(0, 6),
      specifications: projectSpecs.slice(0, 4),
      createdAt: new Date(Date.now() - 12 * 30 * 24 * 60 * 60 * 1000),
    },
    {
      title: 'Lord Krishna Medlley',
      slug: 'lord-krishna-medlley',
      type: 'commercial',
      propertyType: commercial._id,
      status: 'For Sale',
      badge: 'Hot Offer!',
      rera: 'UPRERAPRJ345678',
      configuration: 'Commercial Units',
      excerpt: 'Lord Krishna Medlley is a prime commercial project in Greater Noida by Saviour Builders, offering exceptional investment opportunities in India\'s fastest-growing business district.',
      description: `Lord Krishna Medlley is a commercial project on the Yamuna Expressway by Saviour Builders. After the huge success of other commercial projects, Saviour Group has launched Lord Krishna Medlley.\n\nNestled in the heart of Greater Noida, Lord Krishna Medley offers a prime location for businesses seeking to thrive in a rapidly developing commercial hub. The project's excellent road connectivity, proximity to Jewar Airport, and integration within a large township make it a compelling investment.`,
      overview: `<h2>Lord Krishna Medlley — Where Business Meets Legacy</h2><p>Lord Krishna Medlley is not just a commercial development — it is a statement of intent for investors who understand the transformative potential of the Yamuna Expressway corridor.</p><h3>Growth Catalysts</h3><ul><li>Jewar International Airport — India's largest airport</li><li>F1 Racing Track and entertainment zones nearby</li><li>Film City and IT Parks in the vicinity</li><li>Direct Yamuna Expressway frontage</li></ul>`,
      price: '₹30 Lacs – ₹85 Lacs',
      area: 'Variable',
      size: '',
      location: 'Yamuna Expressway, Greater Noida',
      pricePerSqft: 'On Request',
      thumbnail: 'https://saviourgroup.in/wp-content/uploads/2024/11/LORD-KRISHNA-MEDLLEY.png',
      gallery: [
        'https://saviourgroup.in/wp-content/uploads/2024/11/LORD-KRISHNA-MEDLLEY-1.png',
        'https://saviourgroup.in/wp-content/uploads/2024/11/Medlley.png',
      ],
      highlights: [
        'Prime location on Yamuna Expressway with maximum visibility',
        'Near upcoming Jewar International Airport',
        'Excellent ROI potential — consistent appreciation expected',
        'Modern architecture with contemporary design language',
      ],
      amenities: projectAmenities.slice(0, 5),
      specifications: projectSpecs.slice(0, 5),
      createdAt: new Date(Date.now() - 4 * 365 * 24 * 60 * 60 * 1000),
    },
    {
      title: 'Saviour IRIS / Greenisle',
      slug: 'saviour-iris',
      type: 'residential',
      propertyType: residential._id,
      status: 'For Sale',
      badge: '',
      rera: 'UPRERAPRJ456789',
      configuration: '2 BHK & 3 BHK Apartments',
      excerpt: 'Saviour IRIS is a premium residential project in Crossing Republik, Ghaziabad offering modern 2 & 3 BHK apartments with world-class amenities.',
      description: `Saviour IRIS is a residential project by Saviour Builders in Crossing Republik, Ghaziabad. The project offers living accommodations with a good combination of modern facilities and premium amenities.\n\nSaviour IRIS offers apartments in varied floor plan configurations — from spacious 2 BHK units to luxurious 3 BHK homes. The project is strategically located in Crossing Republik, one of the fastest-growing residential hubs of Ghaziabad, with excellent connectivity to Delhi and Noida via the NH-24 highway.`,
      overview: `<h2>Welcome Home to Saviour IRIS</h2><p>Saviour IRIS represents the perfect blend of modern design and functional living. Each apartment has been thoughtfully planned to maximise space utilisation, natural light, and cross ventilation — creating homes that breathe comfort.</p><h3>Connectivity</h3><ul><li>Adjacent to NH-24 (Delhi-Meerut Expressway)</li><li>15 minutes from Noida City Centre</li><li>30 minutes from Connaught Place, Delhi</li><li>Upcoming metro connectivity</li></ul>`,
      price: '₹35 Lacs – ₹62 Lacs',
      area: '1,050 – 1,800 Sq.Ft',
      size: '1050 - 1800 ft²',
      location: 'Crossing Republik, Ghaziabad',
      pricePerSqft: '₹3,300 – ₹3,800/Sq.Ft',
      thumbnail: 'https://saviourgroup.in/wp-content/uploads/2024/11/lord-1.png',
      gallery: [],
      highlights: [
        'Located in Crossing Republik — Ghaziabad\'s most vibrant township',
        'Well-connected to Delhi, Noida, and Greater Noida',
        'Quality construction with premium modern amenities',
        'Spacious 2 BHK (1050 Sq.Ft) and 3 BHK (1800 Sq.Ft) options',
        'Vastu-compliant apartment layouts',
      ],
      amenities: projectAmenities,
      specifications: projectSpecs,
      createdAt: new Date(Date.now() - 5 * 365 * 24 * 60 * 60 * 1000),
    },
    {
      title: 'Saviour Park Elite',
      slug: 'saviour-park-elite',
      type: 'residential',
      propertyType: residential._id,
      status: 'For Sale',
      badge: '',
      rera: 'UPRERAPRJ567890',
      configuration: '2 BHK, 3 BHK & 4 BHK Apartments',
      excerpt: 'Saviour Park Elite is an upscale residential complex at Mohan Nagar, Ghaziabad — directly connected to Delhi and Noida with spacious 2/3/4 BHK luxury apartments.',
      description: `Saviour Park Elite is located at Mohan Nagar, Ghaziabad. It is directly connected to Delhi and Noida. Mohan Nagar has been a premium residential alternative for professionals employed in Delhi and Noida who seek spacious homes at competitive prices.\n\nThe locality offers excellent connectivity via NH-58, proximity to metro stations, good schools, hospitals, and shopping centres. Saviour Park Elite offers the ideal combination of location, quality, and value.`,
      overview: `<h2>Saviour Park Elite — Elevated Living</h2><p>Saviour Park Elite is designed for those who refuse to compromise. Every element of these apartments — from the grand entrance lobbies to the premium fixtures inside each home — speaks of refined taste and uncompromising quality.</p><h3>Key Features</h3><ul><li>Entrance lobby with double-height ceiling</li><li>Landscaped podium garden</li><li>Rooftop infinity pool and sky lounge</li><li>Smart home automation provision</li></ul>`,
      price: '₹44.97 Lakhs Onwards',
      area: '1,285 – 2,450 Sq.Ft',
      size: '1285 - 2450 ft²',
      location: 'Mohan Nagar, Ghaziabad',
      pricePerSqft: '₹3,500 – ₹4,200/Sq.Ft',
      thumbnail: 'https://saviourgroup.in/wp-content/uploads/2024/11/SAVVIOUR-1-1.png',
      gallery: [],
      highlights: [
        'Premium residential complex directly connected to Delhi and Noida',
        'Spacious 2 BHK, 3 BHK, and 4 BHK luxury apartments',
        'High-quality construction with premium finishes',
        'Excellent social infrastructure: schools, hospitals, malls nearby',
        'Vastu-compliant floor plans with maximum natural ventilation',
      ],
      amenities: projectAmenities,
      specifications: projectSpecs,
      createdAt: new Date(Date.now() - 5 * 365 * 24 * 60 * 60 * 1000),
    },
    {
      title: 'Saviour Greenarch',
      slug: 'saviour-greenarch',
      type: 'residential',
      propertyType: residential._id,
      status: 'For Sale',
      badge: '',
      rera: 'UPRERAPRJ678901',
      configuration: '2 BHK & 3 BHK Apartments',
      excerpt: 'Saviour Greenarch is a highly preferred residential complex in Greater Noida West (Noida Extension) offering modern 2 & 3 BHK homes amidst lush greenery.',
      description: `Saviour Builders Pvt. Ltd. is the name of a leading realty developer in NCR that has become synonymous with quality and innovation. Saviour Greenarch is located in Greater Noida West (Noida Extension) and is one of the most preferred residential complexes in the area.\n\nThe project offers a perfect balance of urban connectivity and green living. With its thoughtfully designed apartments, world-class amenities, and strategic location, Saviour Greenarch has attracted thousands of home buyers from across Delhi-NCR.`,
      overview: `<h2>Saviour Greenarch — Green Living Redefined</h2><p>Saviour Greenarch is more than a residential complex — it is a self-sustaining community designed for modern families. The project's extensive green cover, recreational facilities, and premium specifications create a living experience that rivals the best in Greater Noida West.</p><h3>Why Noida Extension?</h3><ul><li>Metro connectivity (upcoming Aqua Line extension)</li><li>FNG Expressway access</li><li>Proximity to Noida Sector 18 and Central Noida</li><li>Rapidly appreciating real estate values</li></ul>`,
      price: '₹30 Lacs – ₹85 Lacs',
      area: '1,180 – 1,475 Sq.Ft',
      size: '1180-1475 ft²',
      location: 'Greater Noida West (Noida Extension)',
      pricePerSqft: '₹2,800 – ₹3,500/Sq.Ft',
      thumbnail: 'https://saviourgroup.in/wp-content/uploads/2024/11/SAVVIOUR-1520-x-530-px.png',
      gallery: [],
      highlights: [
        'Located in Greater Noida West — one of NCR\'s fastest-growing micro-markets',
        'Modern architecture with extensive green landscaping',
        'Premium 2 BHK and 3 BHK apartments',
        'Club with swimming pool, gym, and indoor games',
        'Adjacent to proposed metro station',
      ],
      amenities: projectAmenities,
      specifications: projectSpecs,
      createdAt: new Date(Date.now() - 5 * 365 * 24 * 60 * 60 * 1000),
    },
  ]);
  console.log('🏗️  Created projects');

  /* ── Blog Posts ── */
  await Post.insertMany([
    {
      title: 'Why Yamuna Expressway is India\'s Hottest Investment Corridor in 2026',
      slug: 'yamuna-expressway-investment-corridor-2026',
      category: 'Market Insights',
      excerpt: 'With the Jewar International Airport nearing completion and multiple mega-projects underway, the Yamuna Expressway corridor has emerged as India\'s most sought-after real estate investment destination.',
      thumbnail: 'https://saviourgroup.in/wp-content/uploads/2025/05/b1.jpg',
      tags: ['Yamuna Expressway', 'Investment', 'Market Trends'],
      content: `<h2>The Rise of Yamuna Expressway</h2>
<p>The 165-km Yamuna Expressway connecting Greater Noida to Agra has transformed into one of India's most dynamic real estate corridors. What was once considered a peripheral zone is now a prime destination for both residential and commercial investments.</p>
<h3>Key Drivers of Growth</h3>
<ul>
<li><strong>Jewar International Airport:</strong> Positioned as India's largest airport upon completion, Noida International Airport at Jewar is the single biggest catalyst driving property prices in the region.</li>
<li><strong>Formula 1 Circuit:</strong> The Buddh International Circuit brings international sporting events and hospitality demand.</li>
<li><strong>Film City:</strong> The proposed UP Film City near Greater Noida will create thousands of jobs and ancillary commercial demand.</li>
<li><strong>IT/ITES Parks:</strong> Multiple tech parks are being developed along the expressway, attracting corporate occupiers.</li>
</ul>
<h3>Price Appreciation Trends</h3>
<p>Properties along the Yamuna Expressway have appreciated by 35-45% over the last 3 years, significantly outperforming the broader NCR market. Commercial properties near township projects have seen even higher appreciation.</p>
<h3>Investment Recommendation</h3>
<p>For investors looking at 3-5 year horizons, the Yamuna Expressway corridor — particularly commercial spaces within integrated townships like Gaur Yamuna City — presents an exceptional risk-adjusted return opportunity.</p>`,
      createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
    },
    {
      title: 'Commercial Real Estate vs Residential: Which is Right for You in 2026?',
      slug: 'commercial-vs-residential-real-estate-2026',
      category: 'Investment Guide',
      excerpt: 'Choosing between commercial and residential real estate can be overwhelming. This comprehensive guide breaks down the pros, cons, and ideal investor profiles for each asset class.',
      thumbnail: 'https://saviourgroup.in/wp-content/uploads/2025/05/b2.webp',
      tags: ['Commercial', 'Residential', 'Investment Guide'],
      content: `<h2>Commercial vs Residential: A 2026 Perspective</h2>
<p>The age-old debate between commercial and residential real estate investment takes on new dimensions in today's market. With interest rates stabilising and infrastructure development accelerating across NCR, both asset classes present compelling opportunities.</p>
<h3>Commercial Real Estate: Pros</h3>
<ul>
<li>Higher rental yields (6-10% vs 2-4% for residential)</li>
<li>Longer lease terms providing stable cash flows</li>
<li>Tenant responsible for most maintenance costs</li>
<li>Price appreciation tied to business growth</li>
</ul>
<h3>Residential Real Estate: Pros</h3>
<ul>
<li>Lower entry ticket size</li>
<li>Easier financing options with home loans</li>
<li>End-use plus investment dual benefit</li>
<li>More liquid asset in established markets</li>
</ul>
<h3>Our Recommendation</h3>
<p>For investors with a 5+ year horizon and a minimum ticket size of ₹30 Lakhs, commercial spaces in upcoming corridors like Yamuna Expressway offer the superior risk-adjusted return. For first-time buyers with end-use requirements, residential properties in well-developed micro-markets remain the safest bet.</p>`,
      createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    },
    {
      title: 'Top 5 Factors to Check Before Buying a Commercial Property',
      slug: 'top-5-factors-buying-commercial-property',
      category: 'Buying Guide',
      excerpt: 'Buying a commercial property is one of the most significant financial decisions you\'ll make. Here are the five critical factors every investor must evaluate before signing on the dotted line.',
      thumbnail: 'https://saviourgroup.in/wp-content/uploads/2024/11/LORD-KRISHNA-MART.png',
      tags: ['Commercial', 'Buying Tips', 'Due Diligence'],
      content: `<h2>The Commercial Property Buyer's Checklist</h2>
<p>Commercial real estate can be extraordinarily rewarding — or extremely challenging — depending on how well you do your due diligence. Here are the five non-negotiable factors to evaluate before any commercial purchase.</p>
<h3>1. Location and Footfall</h3>
<p>For retail spaces, footfall is king. Evaluate the catchment area, existing and proposed infrastructure, and traffic patterns at different times of day. A shop on a high-visibility expressway access point has fundamentally different economics from one tucked inside a complex.</p>
<h3>2. RERA Registration</h3>
<p>Verify that the project is RERA registered and the developer has a clean compliance record. Check the RERA portal for the latest status of possession commitments and any complaints filed.</p>
<h3>3. Developer Track Record</h3>
<p>A developer's past delivery record is the best predictor of future performance. Look at: number of projects delivered on time, quality of construction, and post-possession support.</p>
<h3>4. Catchment Area Analysis</h3>
<p>Understand the demographic profile of the surrounding area. A commercial project within a large township has a built-in customer base that de-risks your investment significantly.</p>
<h3>5. Exit Strategy</h3>
<p>Evaluate the resale market liquidity. Projects from reputed developers in established corridors are significantly easier to exit than standalone developments.</p>`,
      createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000),
    },
    {
      title: 'Jewar International Airport: How it is Transforming Greater Noida',
      slug: 'jewar-international-airport-transforming-greater-noida',
      category: 'Infrastructure',
      excerpt: 'The Noida International Airport at Jewar is set to become India\'s largest airport. Here\'s a comprehensive look at how this mega-project is reshaping Greater Noida\'s real estate landscape.',
      thumbnail: 'https://saviourgroup.in/wp-content/uploads/2024/11/lord-9.png',
      tags: ['Jewar Airport', 'Infrastructure', 'Greater Noida'],
      content: `<h2>Jewar Airport: A Game Changer for Greater Noida</h2>
<p>The Noida International Airport (NIA) at Jewar is not just an infrastructure project — it is a catalyst that is fundamentally reshaping the economic geography of western Uttar Pradesh and the broader Delhi-NCR region.</p>
<h3>Airport Overview</h3>
<ul>
<li>Total area: 5,000+ acres (Phase 1: 1,334 acres)</li>
<li>Phase 1 capacity: 12 million passengers annually</li>
<li>Final capacity: 70 million passengers annually</li>
<li>Estimated completion: Phase 1 by 2025-26</li>
</ul>
<h3>Impact on Real Estate</h3>
<p>Historically, airports have been among the most powerful catalysts for real estate appreciation. Studies of comparable airports globally show 40-60% price appreciation in a 10-km radius within 5 years of airport operationalisation.</p>
<h3>Saviour Group's Positioning</h3>
<p>Saviour Group's commercial projects on the Yamuna Expressway are strategically located within the airport's influence zone. Lord Krishna Mart and Saviour Manoharram, both situated within Gaur Yamuna City, are positioned to directly benefit from the increased commercial activity the airport will generate.</p>`,
      createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
    },
    {
      title: 'Home Loan Guide 2026: Everything You Need to Know',
      slug: 'home-loan-guide-2026',
      category: 'Finance',
      excerpt: 'Navigating the home loan landscape can be complex. This 2026 guide covers interest rates, eligibility, documents required, and pro tips to get the best deal from your bank.',
      thumbnail: 'https://saviourgroup.in/wp-content/uploads/2025/05/b1.jpg',
      tags: ['Home Loan', 'Finance', 'Buying Guide'],
      content: `<h2>Your Complete Home Loan Guide for 2026</h2>
<p>With interest rates in 2026 hovering around 8.5-9.5% for most major banks, understanding how to optimise your home loan structure can save you lakhs over the loan tenure.</p>
<h3>Key Parameters</h3>
<ul>
<li><strong>Interest Rate:</strong> Compare both fixed and floating rates. Floating rates tied to external benchmarks (repo rate) typically offer better deals in a declining rate cycle.</li>
<li><strong>Loan Amount:</strong> Banks typically finance up to 80% of the property value. Ensure your own contribution covers at least 20% plus registration costs.</li>
<li><strong>Tenure:</strong> Longer tenures reduce EMI but increase total interest outgo. Opt for the shortest tenure your cash flows can comfortably support.</li>
</ul>
<h3>Documents Required</h3>
<ul>
<li>Identity proof (Aadhaar/PAN)</li>
<li>Address proof</li>
<li>Income proof (salary slips, ITR for 2 years)</li>
<li>Bank statements (6 months)</li>
<li>Property documents (sale agreement, NOC)</li>
</ul>
<h3>Pro Tips</h3>
<p>Always get pre-approved for a home loan before finalising a property. This gives you negotiating leverage and speeds up the transaction process significantly.</p>`,
      createdAt: new Date(Date.now() - 75 * 24 * 60 * 60 * 1000),
    },
    {
      title: 'RERA: Protecting Homebuyers — What You Must Know',
      slug: 'rera-protecting-homebuyers-guide',
      category: 'Legal Guide',
      excerpt: 'The Real Estate Regulatory Authority (RERA) has fundamentally changed how property transactions work in India. Here\'s everything a homebuyer must know about RERA compliance.',
      thumbnail: 'https://saviourgroup.in/wp-content/uploads/2024/11/savviour.png',
      tags: ['RERA', 'Legal', 'Homebuyer Protection'],
      content: `<h2>Understanding RERA: A Buyer's Perspective</h2>
<p>The Real Estate (Regulation and Development) Act, 2016 — commonly known as RERA — was enacted to bring transparency, accountability, and efficiency to the real estate sector.</p>
<h3>Key Protections Under RERA</h3>
<ul>
<li><strong>Project Registration:</strong> All projects with more than 8 units must be registered with the respective state RERA authority before advertising or selling.</li>
<li><strong>Escrow Account:</strong> Developers must deposit 70% of funds received in a separate escrow account used only for that project's construction.</li>
<li><strong>Carpet Area Clarity:</strong> Sale must be on carpet area basis — no more of the "super built-up area" confusion.</li>
<li><strong>Delay Compensation:</strong> If possession is delayed, the buyer is entitled to interest compensation at the bank rate.</li>
</ul>
<h3>How to Verify RERA Compliance</h3>
<p>Visit your state's RERA portal (e.g., UP RERA at up-rera.in), search for the project RERA number, and verify the registration status, project timeline, and any complaints filed against the developer.</p>
<h3>Saviour Group's RERA Commitment</h3>
<p>All Saviour Group projects are fully RERA registered and compliant. We believe transparency is not just a legal requirement — it is the foundation of lasting customer relationships.</p>`,
      createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
    },
  ]);
  console.log('📝 Created blog posts');

  /* ── Testimonials ── */
  await Testimonial.insertMany([
    {
      name: 'Anirudha Sharma',
      role: 'Team Lead',
      company: 'HCL Technologies',
      rating: 5,
      content: 'I purchased a flat through Saviour Group in Noida Extension. I am highly satisfied with the services provided. Their team was incredibly professional — they understood my requirements perfectly and provided multiple options within my budget. Thanks a ton Saviour Group!',
    },
    {
      name: 'Ashish Shrivastav',
      role: 'Senior Software Engineer',
      company: 'NXP Semiconductors',
      rating: 5,
      content: 'I am expressing my humble gratitude for the outstanding service provided by team Saviour Group in guiding me through my home loan application. Despite being based in Hong Kong during the process, their team made everything seamless. I received loan approval within two weeks — truly remarkable.',
    },
    {
      name: 'Rajeev Kumar',
      role: 'Regional Manager',
      company: 'Mondelez International',
      rating: 5,
      content: 'This is to acknowledge the exceptional efforts of Saviour Group in helping me find a property of my exact specifications and negotiating the best price. The representative was extremely professional, sincere and helpful throughout the entire process.',
    },
    {
      name: 'Harish Kumar Gupta',
      role: 'Senior Developer',
      company: 'BloomReach (IIT Delhi)',
      rating: 5,
      content: 'I truly appreciate the kind and professional approach from team Saviour Group. Their tireless efforts from property search to booking and registration were invaluable. Being new to Noida, they not only guided me on every aspect but went above and beyond until I received possession.',
    },
    {
      name: 'Sachin Goel',
      role: 'Senior Manager',
      company: 'Oracle India',
      rating: 5,
      content: 'Buying a flat in Noida Extension seemed complex, but Saviour Group made it incredibly simple. They provided several options matching our requirements, explained every detail patiently, and supported us through the entire documentation process. Highly recommended to anyone looking in NCR.',
    },
    {
      name: 'Priya Mehta',
      role: 'Financial Analyst',
      company: 'ICICI Bank',
      rating: 5,
      content: 'As a financial professional, I was thorough in my due diligence before investing in a commercial property. Saviour Group provided complete transparency — from RERA documents to floor plans to payment schedules. The investment has already appreciated 22% in 18 months. Excellent team.',
    },
  ]);
  console.log('💬 Created testimonials');

  /* ── Sample Enquiries ── */
  await Enquiry.insertMany([
    { name: 'Vikram Singh', email: 'vikram@email.com', phone: '9876543210', project: 'Lord Krishna Mart', message: 'Interested in ground floor shop. Please share details and pricing.' },
    { name: 'Sunita Agarwal', email: 'sunita@email.com', phone: '9123456789', project: 'Saviour Greenarch', message: 'Looking for a 3 BHK apartment. What is the current availability?' },
    { name: 'Rohit Verma', email: 'rohit@email.com', phone: '9988776655', project: 'Saviour Manoharram', message: 'Want to schedule a site visit this weekend. Please confirm.' },
    { name: 'Kavita Pandey', email: 'kavita@email.com', phone: '9765432100', project: 'Saviour Park Elite', message: 'Please send the brochure and floor plans for the 4 BHK option.' },
    { name: 'Deepak Joshi', email: 'deepak@email.com', phone: '9654321099', project: 'Lord Krishna Medlley', message: 'Looking for investment purposes. What is the expected rental yield?' },
  ]);
  console.log('📬 Created sample enquiries');

  /* ── Settings ── */
  await Setting.insertMany([
    { key: 'site_name', value: 'Saviour Group', group: 'general' },
    { key: 'site_tagline', value: 'Building Dreams, Delivering Excellence', group: 'general' },
    { key: 'phone', value: '+91 9206-001-002', group: 'general' },
    { key: 'email', value: 'info@saviourgroup.in', group: 'general' },
    { key: 'address', value: 'Yamuna Expressway, Greater Noida, Uttar Pradesh – 201308', group: 'general' },
    { key: 'facebook_url', value: 'https://www.facebook.com/saviourgroup', group: 'social' },
    { key: 'instagram_url', value: 'https://www.instagram.com/saviourgroup', group: 'social' },
    { key: 'youtube_url', value: 'https://www.youtube.com/saviourgroup', group: 'social' },
    { key: 'meta_title', value: 'Saviour Group – Best Builder in Delhi-NCR | RERA Certified', group: 'seo' },
    { key: 'meta_description', value: 'M/s Saviour Builders Pvt. Ltd. is one of the leading real estate developers in Delhi-NCR delivering residential & commercial projects in Greater Noida and Ghaziabad.', group: 'seo' },
  ]);
  console.log('⚙️  Created settings');

  console.log('\n✅ SEED COMPLETE!');
  console.log('━'.repeat(40));
  console.log('Admin Login:');
  console.log('  Email: admin@saviourgroup.in');
  console.log('  Password: Admin@2026');
  console.log('━'.repeat(40));

  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
