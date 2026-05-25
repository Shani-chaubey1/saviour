/**
 * All editable setting keys grouped for the homepage + global site content panel.
 * Order mirrors the actual section order on the live site (globals first, then
 * homepage sections in render order, then About-page sections, then footer/SEO).
 */
export const SITE_SETTINGS_GROUPS = [
  /* ── Brand & General ──────────────────────── */
  {
    id: 'general',
    label: '🏢 General',
    fields: [
      { key: 'site_name', label: 'Site Name', type: 'text' },
      { key: 'site_tagline', label: 'Tagline', type: 'text' },
      { key: 'site_logo', label: 'Logo Image', type: 'image', hint: 'Used in header and footer.' },
      { key: 'site_phone', label: 'Phone (Toll Free / Primary)', type: 'text' },
      { key: 'site_phone_2', label: 'Phone (Mobile)', type: 'text' },
      { key: 'site_email', label: 'Email', type: 'text' },
      { key: 'site_address', label: 'Office Address', type: 'textarea' },
    ],
  },
  /* ── Social Media ─────────────────────────── */
  {
    id: 'social',
    label: '🔗 Social Media',
    fields: [
      { key: 'site_facebook', label: 'Facebook URL', type: 'text' },
      { key: 'site_instagram', label: 'Instagram URL', type: 'text' },
      { key: 'site_youtube', label: 'YouTube URL', type: 'text' },
      { key: 'site_twitter', label: 'Twitter / X URL', type: 'text' },
    ],
  },
  /* ── Header & Top Bar ────────────────────── */
  {
    id: 'header',
    label: '🔝 Header & Top Bar',
    fields: [
      { key: 'header_cta_label', label: 'Header CTA Button Label', type: 'text', hint: 'e.g. Get in Touch' },
      { key: 'header_cta_url', label: 'Header CTA Button URL', type: 'text', hint: 'e.g. /contact-us' },
      { key: 'topbar_phone', label: 'Top Bar Phone', type: 'text', hint: 'Displayed in the thin top bar strip.' },
      { key: 'topbar_email', label: 'Top Bar Email', type: 'text' },
      { key: 'topbar_tagline', label: 'Top Bar Tagline / Promo Text', type: 'text', hint: 'Short text shown in top bar, e.g. "Best Builder in Delhi-NCR"' },
    ],
  },
  /* ── Stats (shared across site) ──────────── */
  {
    id: 'stats',
    label: '📊 Stats (shared)',
    fields: [
      { key: 'stat_years', label: 'Years of Experience (e.g. 25+)', type: 'text' },
      { key: 'stat_projects', label: 'Projects Delivered (e.g. 50+)', type: 'text' },
      { key: 'stat_families', label: 'Happy Families (e.g. 10,000+)', type: 'text' },
      { key: 'stat_assets', label: 'Assets Delivered (e.g. ₹500Cr+)', type: 'text' },
      { key: 'stat_visitors', label: 'Monthly Visitors (e.g. 30K+)', type: 'text', hint: 'Used on About page stats row.' },
    ],
  },
  /* ── 1. Trust Banner (Homepage) ──────────── */
  {
    id: 'trust',
    label: '🏆 Homepage · Trust Banner',
    fields: [
      { key: 'trust_tag', label: 'Badge Label', type: 'text', hint: 'e.g. A Name You Can Trust Upon' },
      { key: 'trust_intro', label: 'Intro Paragraph', type: 'textarea', hint: 'The paragraph below the company name.' },
      { key: 'trust_credential_1', label: 'Credential Badge 1 (e.g. RERA Registered Projects)', type: 'text' },
      { key: 'trust_credential_2', label: 'Credential Badge 2 (e.g. Member of CREDAI)', type: 'text' },
      {
        key: 'trust_banner_stats_json',
        label: 'Stat cards (right column)',
        type: 'stats_cards_json',
        hint: 'Add or remove cards; each row is a number + label. If empty, the four global stats fields are used.',
      },
    ],
  },
  /* ── 2. Certifications Banner (Homepage) ── */
  {
    id: 'certifications',
    label: '🏅 Homepage · Certifications Banner',
    fields: [
      { key: 'cert_heading', label: 'Section Heading', type: 'text', hint: 'e.g. RERA Registered Projects & Member of CREDAI' },
      { key: 'cert_logo_1', label: 'Certification Logo 1 (RERA)', type: 'image', hint: 'Large certification logo — e.g. RERA Approved seal' },
      { key: 'cert_logo_1_alt', label: 'Logo 1 Alt Text', type: 'text' },
      { key: 'cert_logo_2', label: 'Certification Logo 2 (CREDAI)', type: 'image', hint: 'Large certification logo — e.g. CREDAI Member badge' },
      { key: 'cert_logo_2_alt', label: 'Logo 2 Alt Text', type: 'text' },
      { key: 'cert_partner_logos', label: 'Partner / Project Logos', type: 'multi_image', hint: 'Upload or paste URLs. Each logo appears in the strip below the RERA/CREDAI badges.' },
    ],
  },
  /* ── 3. About Banner (Homepage) ──────────── */
  {
    id: 'about',
    label: '🖼️ Homepage · About Banner',
    fields: [
      {
        key: 'about_full_image',
        label: 'Full-width Banner Image',
        type: 'image',
        hint: 'Displayed as a full-width image band on the homepage between Certifications and Projects.',
      },
    ],
  },
  /* ── 4. Projects Section (Homepage) ──────── */
  {
    id: 'projects_section',
    label: '🏗 Homepage · Projects Section',
    fields: [
      { key: 'projects_section_title', label: 'Section Heading', type: 'text', hint: 'e.g. Current & Future Projects' },
      { key: 'projects_section_subtitle', label: 'Section Subtitle', type: 'text' },
      { key: 'projects_section_cta', label: 'View All CTA Label', type: 'text', hint: 'e.g. View All Projects' },
    ],
  },
  /* ── 5. Launching Soon Banner (Homepage) ── */
  {
    id: 'launching',
    label: '🚀 Homepage · Launching Soon Banner',
    fields: [
      { key: 'launching_soon_badge', label: 'Badge Label', type: 'text', hint: 'e.g. Launching Soon' },
      { key: 'launching_soon_title', label: 'Project Name', type: 'text' },
      { key: 'launching_soon_desc', label: 'Description', type: 'textarea' },
      { key: 'launching_soon_tags', label: 'Tags (comma-separated)', type: 'text', hint: 'e.g. 🌳 7.5-Acre Park,🏠 3 & 4 BHK,✨ 192 Units Only' },
      { key: 'launching_soon_cta_label', label: 'Primary CTA Label', type: 'text', hint: 'e.g. Register Your Interest' },
      { key: 'launching_soon_cta_url', label: 'Primary CTA URL', type: 'text' },
      { key: 'launching_soon_secondary_label', label: 'Secondary CTA Label', type: 'text', hint: 'e.g. View All Projects' },
      { key: 'launching_soon_secondary_url', label: 'Secondary CTA URL', type: 'text' },
    ],
  },
  /* ── 6. Developments Section (Homepage) ─── */
  {
    id: 'developments',
    label: '🏗️ Homepage · Developments Section',
    fields: [
      { key: 'dev_section_title', label: 'Section Heading', type: 'text', hint: 'e.g. Explore More' },
      { key: 'dev_section_subtitle', label: 'Section Subtitle', type: 'text' },
      { key: 'dev_1_title', label: 'Card 1 Title', type: 'text' },
      { key: 'dev_1_desc', label: 'Card 1 Description', type: 'textarea' },
      { key: 'dev_1_image', label: 'Card 1 Image', type: 'image' },
      { key: 'dev_1_link', label: 'Card 1 Link', type: 'text' },
      { key: 'dev_1_tag', label: 'Card 1 Tag Label (e.g. Residential)', type: 'text' },
      { key: 'dev_2_title', label: 'Card 2 Title', type: 'text' },
      { key: 'dev_2_desc', label: 'Card 2 Description', type: 'textarea' },
      { key: 'dev_2_image', label: 'Card 2 Image', type: 'image' },
      { key: 'dev_2_link', label: 'Card 2 Link', type: 'text' },
      { key: 'dev_2_tag', label: 'Card 2 Tag Label (e.g. Commercial)', type: 'text' },
      { key: 'dev_3_title', label: 'Card 3 Title', type: 'text' },
      { key: 'dev_3_desc', label: 'Card 3 Description', type: 'textarea' },
      { key: 'dev_3_image', label: 'Card 3 Image', type: 'image' },
      { key: 'dev_3_link', label: 'Card 3 Link', type: 'text' },
      { key: 'dev_3_tag', label: 'Card 3 Tag Label (e.g. Investor)', type: 'text' },
    ],
  },
  /* ── 7. Testimonials Section (Homepage) ─── */
  {
    id: 'testimonials_section',
    label: '💬 Homepage · Testimonials Section',
    fields: [
      { key: 'testimonials_section_title', label: 'Section Heading', type: 'text', hint: 'e.g. What Clients Say' },
      { key: 'testimonials_section_subtitle', label: 'Section Subtitle', type: 'text' },
    ],
  },
  /* ── 8. Contact CTA Section (Homepage) ──── */
  {
    id: 'contact_section',
    label: '📞 Homepage · Contact CTA Section',
    fields: [
      { key: 'contact_section_desc', label: 'Description Paragraph', type: 'textarea', hint: 'Intro text in the homepage contact section.' },
      { key: 'contact_form_title', label: 'Contact Form Box Title', type: 'text', hint: 'e.g. Send a Message' },
      {
        key: 'contact_form_tab_connect_label',
        label: 'Form Tab 1 Label — Connect',
        type: 'text',
        hint: 'Label for the first tab (default: "Connect with an Agent"). Used everywhere the contact form appears.',
      },
      {
        key: 'contact_form_tab_visit_label',
        label: 'Form Tab 2 Label — Visit',
        type: 'text',
        hint: 'Label for the second tab (default: "Book a Visit").',
      },
    ],
  },
  /* ── About Page · Why Choose Us ──────────── */
  {
    id: 'whyus',
    label: '💡 About Page · Why Choose Us',
    fields: [
      { key: 'why_section_subtitle', label: 'Section Subtitle', type: 'text' },
      { key: 'why_1_icon', label: 'Pillar 1 Icon (emoji)', type: 'text', hint: 'e.g. 🏆' },
      { key: 'why_1_title', label: 'Pillar 1 Title', type: 'text' },
      { key: 'why_1_desc', label: 'Pillar 1 Description', type: 'textarea' },
      { key: 'why_2_icon', label: 'Pillar 2 Icon (emoji)', type: 'text', hint: 'e.g. 🌿' },
      { key: 'why_2_title', label: 'Pillar 2 Title', type: 'text' },
      { key: 'why_2_desc', label: 'Pillar 2 Description', type: 'textarea' },
      { key: 'why_3_icon', label: 'Pillar 3 Icon (emoji)', type: 'text', hint: 'e.g. 💎' },
      { key: 'why_3_title', label: 'Pillar 3 Title', type: 'text' },
      { key: 'why_3_desc', label: 'Pillar 3 Description', type: 'textarea' },
    ],
  },
  /* ── Footer ──────────────────────────────── */
  {
    id: 'footer',
    label: '🦶 Footer',
    fields: [
      { key: 'footer_desc', label: 'Brand Description', type: 'textarea', hint: 'Short paragraph shown below the logo in the footer.' },
      { key: 'footer_map_embed', label: 'Google Maps Embed URL', type: 'text', hint: 'Paste the src URL from Google Maps embed code.' },
      {
        key: 'footer_stats_strip_json',
        label: 'Stats strip (top green bar)',
        type: 'stats_cards_json',
        hint: 'One row per stat. If empty, global stat fields + 4th stat below are used.',
      },
      { key: 'footer_stat_4_num', label: 'Fallback 4th Stat Number', type: 'text', hint: 'Used only when stats strip JSON is empty.' },
      { key: 'footer_stat_4_label', label: 'Fallback 4th Stat Label', type: 'text' },
      { key: 'footer_quick_links_heading', label: 'Quick links column heading', type: 'text' },
      { key: 'footer_projects_heading', label: 'Projects column heading', type: 'text' },
      { key: 'footer_contact_heading', label: 'Contact column heading', type: 'text' },
      { key: 'footer_quick_links_json', label: 'Quick links', type: 'link_list_json', hint: 'Label + URL. Internal paths like /about-us work.' },
      { key: 'footer_project_links_json', label: 'Featured project links', type: 'link_list_json' },
      { key: 'footer_social_icons_json', label: 'Social icons (react-icons)', type: 'social_icons_json', hint: 'Icon name e.g. FaFacebook, color, URL.' },
      { key: 'footer_contact_items_json', label: 'Get in Touch rows', type: 'footer_contact_json', hint: 'Phone, email, address lines; optional link per row.' },
      { key: 'footer_copyright', label: 'Copyright Text', type: 'text', hint: 'e.g. Saviour Group. All rights reserved.' },
      { key: 'footer_powered_by', label: 'Powered-by Credits Text', type: 'text', hint: 'e.g. Sysneticindia (leave blank to hide)' },
      { key: 'footer_powered_by_url', label: 'Powered-by Credits URL', type: 'text' },
    ],
  },
  /* ── SEO & Analytics ─────────────────────── */
  {
    id: 'seo',
    label: '🔍 SEO & Analytics',
    fields: [
      { key: 'meta_title', label: 'Default Meta Title', type: 'text' },
      { key: 'meta_description', label: 'Default Meta Description', type: 'textarea' },
      { key: 'google_analytics_id', label: 'Google Analytics ID', type: 'text' },
    ],
  },
];
