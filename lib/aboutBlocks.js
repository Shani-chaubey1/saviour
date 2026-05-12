import { DEFAULT_ABOUT_BLOCKS } from './siteDefaults';

function uid() {
  return `blk-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

/** Normalize blocks from DB (array or JSON string). Empty array is valid. */
export function parseAboutBlocks(raw) {
  if (Array.isArray(raw)) return raw.map((b, i) => ({ ...b, id: b.id || `b-${i}` }));
  if (typeof raw === 'string' && raw.trim()) {
    try {
      const p = JSON.parse(raw);
      if (Array.isArray(p)) return p.map((b, i) => ({ ...b, id: b.id || `b-${i}` }));
    } catch { /* ignore */ }
  }
  return null;
}

/** Build blocks from legacy flat `sections` when `about_blocks` is absent. */
export function legacyToAboutBlocks(sections) {
  const img = 'https://saviourgroup.in/wp-content/uploads/2025/05/about.png';
  const blocks = [];

  if (sections.intro?.trim() || sections.page_title) {
    blocks.push({
      id: uid(),
      kind: 'intro_split',
      title: sections.page_title?.trim() || 'About Us',
      subtitle: sections.tagline?.trim() || '',
      html: sections.intro?.trim() || '',
      image: '',
    });
  }

  blocks.push({
    id: uid(),
    kind: 'stats_row',
    items: [
      { num: '25+', label: 'Years Experience' },
      { num: '10K+', label: 'Happy Families' },
      { num: '20+', label: 'Projects Delivered' },
      { num: sections.monthly_visitors?.trim() || '30K+', label: 'Monthly Visitors' },
    ],
  });

  const members = [1, 2, 3, 4]
    .map((n) => ({
      name: sections[`person_${n}_name`]?.trim(),
      role: sections[`person_${n}_role`]?.trim(),
      image: sections[`person_${n}_image`]?.trim() || img,
    }))
    .filter((m) => m.name);

  if (members.length) {
    blocks.push({
      id: uid(),
      kind: 'team',
      title: sections.team_heading?.trim() || 'Management',
      members,
    });
  }

  if (sections.chairman_message?.trim()) {
    blocks.push({
      id: uid(),
      kind: 'chairman',
      html: sections.chairman_message,
      image: sections.chairman_image?.trim() || img,
      signatureName: sections.chairman_name?.trim() || 'Mr. Rajesh Kumar',
      signatureTitle: sections.chairman_title?.trim() || 'Chairman & Managing Director, Saviour Group',
    });
  }

  const mItems = [
    { title: 'Our Mission', text: sections.mission?.trim() },
    { title: 'Our Vision', text: sections.vision?.trim() },
    { title: 'Our Motto', text: sections.motto?.trim() },
    { title: 'Our Values', text: sections.values?.trim() },
  ].filter((x) => x.text);

  if (mItems.length) {
    blocks.push({ id: uid(), kind: 'mission_grid', items: mItems });
  }

  return blocks.length ? blocks : [...DEFAULT_ABOUT_BLOCKS];
}

export function ensureAboutBlocks(sections) {
  if (sections.about_blocks != null) {
    const parsed = parseAboutBlocks(sections.about_blocks);
    if (Array.isArray(parsed) && parsed.length) return parsed;
  }
  return legacyToAboutBlocks(sections);
}
