/**
 * Single source of truth for site settings & CMS page defaults.
 * Safe to import from Node scripts (no path aliases).
 */

/** @type {Record<string, string>} */
export const DEFAULT_SETTINGS = {
  site_name: 'Savviour Builderrs',
  site_tagline: 'Building a Better Life',
  site_phone: '+91 0120-4104506',
  site_phone_2: '+91 9206-001-002',
  site_email: 'sales@saviourindia.com',
  site_address: 'C-110, Sector 65, Noida, Uttar Pradesh 201301',
  site_logo: 'https://saviourgroup.in/wp-content/uploads/2025/05/sb-logo.png',
  header_cta_label: 'Get in Touch',
  header_cta_url: '/contact-us',
  topbar_phone: '+91 9206-001-002',
  topbar_email: 'info@saviourgroup.in',
  topbar_tagline: 'Best Builder in Delhi-NCR',
  footer_desc:
    "M/s Saviour Builders Pvt. Ltd. is one of Delhi-NCR's leading real estate developers, delivering landmark residential & commercial projects since 1999.",
  footer_map_embed: '',
  footer_stat_4_num: '5★',
  footer_stat_4_label: 'Rated',
  footer_copyright: 'Saviour Group. All rights reserved.',
  footer_powered_by: 'Sysneticindia',
  footer_powered_by_url: 'https://www.sysneticindia.com',
  stat_visitors: '30K+',
  site_facebook: 'https://www.facebook.com/saviourgroup',
  site_instagram: 'https://www.instagram.com/saviourgroup',
  site_twitter: 'https://twitter.com/saviourindia',
  site_youtube: 'https://www.youtube.com/saviourgroup',
  stat_years: '25+',
  stat_projects: '50+',
  stat_families: '10,000+',
  stat_assets: '₹500Cr+',
  trust_tag: 'A Name You Can Trust Upon',
  trust_intro:
    'Saviour Builders are one of the leading real estate developers in Delhi NCR. To provide an outstanding level of Houses & service to our buyers. Saviour Builders are dedicated to the highest standards, systems and performance necessary to fulfill all of your real estate dreams.',
  trust_credential_1: 'RERA Registered Projects',
  trust_credential_2: 'Member of CREDAI',
  about_heading: 'About Us',
  about_subtitle: 'Building dreams and delivering excellence across Delhi-NCR since 1999.',
  about_desc_1:
    'M/s Saviour Builders Pvt. Ltd. (Saviour Group) is one of the leading real estate developers in Delhi-NCR. It has turned up as one of the eminent entities in the real estate sector of India, making a mark in delivering residential & commercial township projects.',
  about_desc_2:
    'From building small residential projects to creating multi-dimensional mega townships, the Saviour Group has done it all with complete dedication to reach higher and build better.',
  about_image: 'https://saviourgroup.in/wp-content/uploads/2025/05/about.png',
  about_full_image: 'https://saviourgroup.in/wp-content/uploads/2024/11/SAVVIOUR-1520-x-530-px.png',
  about_badge_num: '25+',
  about_badge_text: 'Years of Excellence',
  about_points: 'Quality Policy\nOn-Time Delivery\nTransparent Dealings\nAfter-Sales Support',
  about_cta_label: 'Read Our Story',
  about_cta_url: '/about-us',
  mission_title: 'Our Mission',
  mission_desc:
    'To provide an outstanding level of Houses & service to our buyers. Saviour Builders are dedicated to the highest standards, systems, and performance necessary to fulfill all of your real estate dreams.',
  vision_title: 'Our Vision',
  vision_desc:
    'We believe real estate is more than just building the proverbial four walls, it\'s about "Building a Better Life". This is the ideology with which we have delivered some of the most iconic addresses in Delhi/NCR.',
  quality_title: 'Quality Policy',
  quality_desc:
    'We are committed to delight our customers by improving their quality of life. We continuously improve our processes and adopt ethical practices by engaging our employees and stakeholders.',
  projects_section_title: 'Current & Future Projects',
  projects_section_subtitle: 'We build value. We build you.',
  projects_section_cta: 'View All Projects',
  townships_section_title: 'Our Presence in Leading Townships',
  townships_section_subtitle:
    'Discover signature developments across Delhi-NCR\u2019s most desirable corridors.',
  townships_section_cta_label: 'View Projects',
  why_section_subtitle: 'Providing quality spaces through continuous innovation.',
  why_1_icon: '🏆',
  why_1_title: 'Quality Policy',
  why_1_desc:
    'We are committed to delight our customers by improving their quality of life. We continuously improve processes and adopt ethical practices by engaging our employees and stakeholders to surpass statutory and regulatory standards.',
  why_2_icon: '🌿',
  why_2_title: 'Green & Clean Environment',
  why_2_desc:
    'Each urban area of Saviour Builders is built on the basis of "A place where living is in harmony with nature" — with greeneries, parks, squares, and water surfaces designed and arranged harmoniously.',
  why_3_icon: '💎',
  why_3_title: 'We Build Value',
  why_3_desc:
    'With our projects spanning residential, commercial and corporate construction, we at Saviour Builders aim to deliver excellence and comfort, with a touch of fairness and transparency in everything we do.',
  launching_soon_badge: 'Launching Soon',
  launching_soon_title: 'Vridhi+ Premium Tower',
  launching_soon_desc:
    'Step into your dream world where luxury meets lifestyle. Surrounded by a lush 7.5-acre park, Vridhi+ Premium Tower offers an eco-friendly environment, grand commercial spaces, and beautifully crafted 3 & 4 BHK premium residences — limited to just 192 units.',
  launching_soon_tags: '🌳 7.5-Acre Park,🏠 3 & 4 BHK,✨ 192 Units Only,🏙️ Premium Location',
  launching_soon_cta_label: 'Register Your Interest',
  launching_soon_cta_url: '/contact-us',
  launching_soon_secondary_label: 'View All Projects',
  launching_soon_secondary_url: '/projects',
  dev_section_title: 'Explore More',
  dev_section_subtitle: 'Residential, commercial and investor opportunities across Delhi-NCR.',
  dev_1_title: 'Residential Developments',
  dev_1_desc:
    'The Group successfully ventured into Real Estate by creating a series of residential spaces at strategic locations in Ghaziabad, Noida Extension and Yamuna Expressway — homes that blend comfort, design, and affordability.',
  dev_1_image: 'https://saviourgroup.in/wp-content/uploads/2024/11/SAVVIOUR-1-1.png',
  dev_1_link: '/resedential-projects',
  dev_1_tag: 'Residential',
  dev_2_title: 'Commercial Developments',
  dev_2_desc:
    "At Saviour, we're not only shaping how people live and work, but we're also creating places that will last beyond our lifetime — sustainable, inclusive spaces contributing to the health and well-being of the community.",
  dev_2_image: 'https://saviourgroup.in/wp-content/uploads/2024/11/mart.png',
  dev_2_link: '/projects',
  dev_2_tag: 'Commercial',
  dev_3_title: 'Investor Opportunities',
  dev_3_desc:
    'Real estate has been one of the best investment options for decades. Saviour offers the best products for people looking to invest — from Commercial Properties to homes, with an array of high-return investment options.',
  dev_3_image: 'https://saviourgroup.in/wp-content/uploads/2025/05/about.png',
  dev_3_link: '/contact-us',
  dev_3_tag: 'Investor',
  blog_section_title: 'News & Events',
  blog_section_subtitle: 'From our blog — stay informed with the latest insights.',
  blog_section_view_all: 'View All',
  testimonials_section_title: 'What Clients Say',
  testimonials_section_subtitle: 'Real stories from real buyers — this is what we live for.',
  contact_section_desc:
    'Looking for your dream home or the perfect commercial investment? Our experts are ready to guide you through every step — from choosing the right property to final possession.',
  contact_form_title: 'Send a Message',
  contact_form_tab_connect_label: 'Connect with an Agent',
  contact_form_tab_visit_label: 'Book a Visit',
  enquire_fab_label: 'Enquire Now',
  enquire_fab_popup_title: 'Get in Touch',
  cookie_consent_message:
    'We use cookies to enhance your browsing experience and analyse site traffic. By clicking Accept, you consent to our use of cookies.',
  cookie_consent_accept_label: 'Accept',
  cookie_consent_close_label: 'Close',
  cert_heading: 'RERA Registered Projects & Member of CREDAI',
  cert_logo_1: 'https://saviourgroup.in/wp-content/uploads/2024/11/rera-logo-new-1.png',
  cert_logo_1_alt: 'RERA Approved',
  cert_logo_2: 'https://saviourgroup.in/wp-content/uploads/2024/11/credai.png',
  cert_logo_2_alt: 'Member of CREDAI',
  cert_partner_logos:
    'https://saviourgroup.in/wp-content/uploads/2024/11/savviour-manoharram.png\nhttps://saviourgroup.in/wp-content/uploads/2024/11/amara-vridhi.png\nhttps://saviourgroup.in/wp-content/uploads/2024/11/green-mart.png\nhttps://saviourgroup.in/wp-content/uploads/2024/11/lord-krishna.png\nhttps://saviourgroup.in/wp-content/uploads/2024/11/savviour-street.png\nhttps://saviourgroup.in/wp-content/uploads/2024/11/gaur-city-2.png\nhttps://saviourgroup.in/wp-content/uploads/2024/11/gaur-city.png\nhttps://saviourgroup.in/wp-content/uploads/2024/11/park-elite.png\nhttps://saviourgroup.in/wp-content/uploads/2024/11/greenisle.png\nhttps://saviourgroup.in/wp-content/uploads/2024/11/greenarch.png\nhttps://saviourgroup.in/wp-content/uploads/2024/11/spsc-commercial.png\nhttps://saviourgroup.in/wp-content/uploads/2024/11/euro-apartment.png\nhttps://saviourgroup.in/wp-content/uploads/2024/11/sps-residency.png\nhttps://saviourgroup.in/wp-content/uploads/2024/11/sps-heights.png',
  site_url: 'https://saviourgroup.in',
  meta_title: 'Savviour Builderrs – Best Builder in Delhi-NCR | RERA Certified',
  meta_description:
    'M/s Saviour Builders Pvt. Ltd. is one of the leading real estate developers in Delhi-NCR delivering residential & commercial projects.',
  google_analytics_id: '',
  trust_banner_stats_json:
    '[{"num":"25+","label":"Years of Experience"},{"num":"50+","label":"Projects Delivered"},{"num":"10,000+","label":"Happy Families"},{"num":"₹500Cr+","label":"Assets Delivered"}]',
  footer_stats_strip_json:
    '[{"num":"25+","label":"Years"},{"num":"50+","label":"Projects"},{"num":"10K+","label":"Families"},{"num":"5★","label":"Rated"}]',
  footer_quick_links_heading: 'Quick Links',
  footer_projects_heading: 'Our Projects',
  footer_contact_heading: 'Get in Touch',
  footer_quick_links_json:
    '[{"label":"Home","href":"/"},{"label":"About Us","href":"/about-us"},{"label":"Commercial Projects","href":"/projects"},{"label":"Residential Projects","href":"/resedential-projects"},{"label":"Blog","href":"/blog"},{"label":"Contact Us","href":"/contact-us"}]',
  footer_project_links_json:
    '[{"label":"Lord Krishna Mart","href":"/properties/lord-krishna-mart"},{"label":"Saviour Manoharram","href":"/properties/saviour-manoharram"},{"label":"Lord Krishna Medlley","href":"/properties/lord-krishna-medlley"},{"label":"Saviour IRIS / Greenisle","href":"/properties/saviour-iris"},{"label":"Saviour Park Elite","href":"/properties/saviour-park-elite"},{"label":"Saviour Greenarch","href":"/properties/saviour-greenarch"}]',
  footer_social_icons_json:
    '[{"icon":"FaFacebook","color":"#1877f2","url":"https://www.facebook.com/saviourgroup","label":"Facebook"},{"icon":"FaInstagram","color":"#e4405f","url":"https://www.instagram.com/saviourgroup","label":"Instagram"},{"icon":"FaYoutube","color":"#ff0000","url":"https://www.youtube.com/saviourgroup","label":"YouTube"}]',
  footer_contact_items_json:
    '[{"icon":"FaPhone","label":"Phone","value":"+91 9206-001-002","href":"tel:+919206001002"},{"icon":"FaEnvelope","label":"Email","value":"sales@saviourindia.com","href":"mailto:sales@saviourindia.com"},{"icon":"FaMapMarkerAlt","label":"Office","value":"C Block-110, Sector 65, Noida – 201301","href":""}]',
  // Page banner (top intro) images. Empty = fall back to banner_image_default,
  // then to the built-in default image baked into the PageBanner styles.
  banner_image_default: '',
  banner_image_about: '',
  banner_image_contact: '',
  banner_image_projects: '',
  banner_image_blog: '',
  banner_image_property: '',
  banner_image_content: '',
  // Homepage section order + visibility (JSON array of { key, enabled }).
  homepage_section_order_json:
    '[{"key":"hero","enabled":true},{"key":"trust","enabled":true},{"key":"certifications","enabled":true},{"key":"about","enabled":true},{"key":"projects","enabled":true},{"key":"townships","enabled":true},{"key":"launching","enabled":true},{"key":"developments","enabled":true}]',
  // Property detail right-sidebar promo carousel — newline-separated image URLs.
  property_sidebar_images: '',
  // Site-wide floating inquiry popup (bottom-left).
  inquiry_popup_enabled: false,
  inquiry_popup_image: '',
};

const DEFAULT_IMG = 'https://saviourgroup.in/wp-content/uploads/2025/05/about.png';

/** Reusable About page block list (also used when legacy flat sections have no `about_blocks`). */
export const DEFAULT_ABOUT_BLOCKS = [
  {
    id: 'about-intro-1',
    kind: 'intro_split',
    title: 'About Us',
    subtitle: '',
    html: `<p>Saviour Group has a penchant for crafting dreams and desires into reality. It has emerged as one of the prominent entities in the real estate sector and is into residential, commercial and township projects in NCR.</p>
<p>From building small residential projects to creating multi-dimensional mega townships, the Saviour Group has done it all with complete dedication to reach higher and build better. The group has proved its mettle by delivering some prestigious projects like SPS Residency (Indirapuram), SPS Heights (Indirapuram), Euro Apartments (Sahibabad), SPS Commercial (Indirapuram).</p>
<p>A team of eminent architects, engineers, planners and business associates have taken the group to an all-time high and, have motivated it to create masterpieces in reality. The group is forging ahead with projects like Saviour Greenisle (Crossings-Republik), Saviour Park (Mohan Nagar, Ghaziabad), Gaur City-1 &amp; 2, Saviour Street &amp; Greenarch at (Greater Noida-West/Noida Extension).</p>
<p>The recent proud offering by the group is Gaur Yamuna City, a township in 250 acres, as a development partner with Gaursons on Yamuna Expressway.</p>
<p>We at Saviour, are building homes based on trust and you are invited to build your future with us. We help you live your dream of living in style.</p>`,
    image: DEFAULT_IMG,
  },
  {
    id: 'about-stats-1',
    kind: 'stats_row',
    items: [
      { num: '25+', label: 'Years Experience' },
      { num: '10K+', label: 'Happy Families' },
      { num: '20+', label: 'Projects Delivered' },
      { num: '30K+', label: 'Monthly Visitors' },
    ],
  },
  {
    id: 'about-team-1',
    kind: 'team',
    title: 'Management',
    members: [
      { name: 'Mr. Rajesh Kumar', role: 'Chairman & Managing Director', image: DEFAULT_IMG },
      { name: 'Mr. Suresh Sharma', role: 'Director – Operations', image: DEFAULT_IMG },
      { name: 'Mr. Anil Gupta', role: 'Director – Finance', image: DEFAULT_IMG },
    ],
  },
  {
    id: 'about-chairman-1',
    kind: 'chairman',
    html: `<p class="chairman-quote">&ldquo;At Saviour Group, we believe that every home we build is a testament to our commitment to quality, integrity, and innovation. Our journey began with a simple vision &mdash; to create spaces that not only meet the needs of today but also stand the test of time.&rdquo;</p>
<p>Over the past two-and-a-half decades, we have built more than just structures &mdash; we have built communities, nurtured trust, and fulfilled the dreams of thousands of families across Delhi-NCR.</p>
<p>As we move forward, we remain committed to pushing the boundaries of real estate development, embracing sustainable practices, and delivering projects that are a source of pride for all stakeholders.</p>`,
    image: DEFAULT_IMG,
    signatureName: 'Mr. Rajesh Kumar',
    signatureTitle: 'Chairman & Managing Director, Saviour Group',
  },
  {
    id: 'about-mission-1',
    kind: 'mission_grid',
    items: [
      {
        title: 'Our Mission',
        text:
          'To deliver world-class real estate projects with unwavering commitment to quality, transparency, and timely delivery while building lasting relationships with our customers.',
      },
      {
        title: 'Our Vision',
        text:
          'To be the most trusted and preferred real estate brand in India, known for innovation, integrity, and creating sustainable communities for generations.',
      },
      {
        title: 'Our Motto',
        text:
          'Building homes based on trust — we invite you to build your future with us and help you live your dream of living in style.',
      },
      {
        title: 'Our Values',
        text:
          'Quality, Integrity, Customer-First, Innovation, and Sustainability are the core values that drive every decision we make at Saviour Group.',
      },
    ],
  },
];

/** Default `sections` for each CMS-managed page slug. */
export const DEFAULT_PAGE_SECTIONS = {
  projects: {
    all_title: 'All Projects',
    all_subtitle: 'Browse our complete portfolio of residential and commercial projects across Delhi-NCR.',
    residential_title: 'Residential Projects',
    residential_subtitle: 'Browse our residential townships and homes across Noida, Greater Noida & Ghaziabad.',
    commercial_title: 'Commercial Projects',
    commercial_subtitle: 'Explore our premium commercial spaces on the Yamuna Expressway and across Delhi-NCR.',
    empty_message: 'No projects found at this time. Please check back soon.',
  },
  'about-us': {
    page_title: 'About Us',
    tagline: '',
    about_blocks: DEFAULT_ABOUT_BLOCKS,
  },
  'contact-us': {
    page_title: 'Contact Us',
    intro_subtitle:
      "We'd love to hear from you. Send us a message and we'll get back to you as soon as possible.",
    phone: '+91 9206-001-002',
    email: 'info@saviourgroup.in',
    address: 'C-110, Sector 65, Noida, Uttar Pradesh 201301',
    working_hours: 'Mon – Sat: 9:00 AM – 7:00 PM',
    map_embed: '',
    form_title: 'Send Us a Message',
  },
  blog: {
    banner_brand: 'Savviour Builderrs',
    section_title: 'Blog',
    section_subtitle: 'Best Builder in Delhi-NCR',
    empty_message: 'No blog posts found at this time. Please check back soon.',
  },
};

/** Display titles stored on Page documents. */
export const CMS_PAGE_TITLES = {
  home: 'Homepage',
  projects: 'Projects listing page',
  'about-us': 'About Us',
  'contact-us': 'Contact Us',
  blog: 'Blog listing page',
};

/**
 * Default SEO metadata for static routes. Used by scripts/update-page-metadata.js
 * and lib/pageMetadata.js when DB fields are empty.
 */
export const DEFAULT_PAGE_METADATA = {
  home: {
    metaTitle: 'Savviour Builderrs – Best Builder in Delhi-NCR',
    metaDescription:
      'M/s Saviour Builders Pvt. Ltd. (Saviour Group) is one of the leading real estate developers in Delhi-NCR.',
    absoluteTitle: true,
  },
  'about-us': {
    metaTitle: 'About Us',
    metaDescription:
      'Learn about M/s Saviour Builders Pvt. Ltd. — one of the leading real estate developers in Delhi-NCR delivering residential & commercial projects.',
  },
  'contact-us': {
    metaTitle: 'Contact Us',
    metaDescription:
      "Get in touch with Saviour Group. We're here to help you find your dream property in Delhi-NCR.",
  },
  projects: {
    metaTitle: 'All Projects',
    metaDescription:
      'Browse residential and commercial projects by Saviour Group across Delhi-NCR.',
    sectionMeta: {
      meta_residential_title: 'Residential Projects',
      meta_residential_description:
        "Explore Saviour Group's residential projects across Delhi-NCR.",
      meta_commercial_title: 'Commercial Projects',
      meta_commercial_description:
        "Explore Saviour Group's commercial real estate projects across Delhi-NCR.",
    },
  },
  blog: {
    metaTitle: 'Blog',
    metaDescription:
      'Read the latest news, insights, and updates about real estate in Delhi-NCR from Saviour Group.',
  },
};
