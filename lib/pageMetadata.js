import {
  DEFAULT_PAGE_METADATA,
  DEFAULT_SETTINGS,
  CMS_PAGE_TITLES,
} from './siteDefaults';

/**
 * Convert stored title/description into a Next.js Metadata object.
 * Use absoluteTitle for the homepage so the root layout title template is skipped.
 */
export function toNextMetadata(
  { title = '', description = '' } = {},
  { absoluteTitle = false } = {},
) {
  const meta = {};
  const trimmedTitle = String(title || '').trim();
  const trimmedDesc = String(description || '').trim();
  if (trimmedTitle) {
    meta.title = absoluteTitle ? { absolute: trimmedTitle } : trimmedTitle;
  }
  if (trimmedDesc) meta.description = trimmedDesc;
  return meta;
}

/**
 * Resolve metadata for a CMS page slug (home, about-us, projects, blog, …).
 * `settings` is optional — pass when already loaded to avoid an extra fetch.
 */
export function resolvePageMetadata(slug, doc, settings = null) {
  const defaults = DEFAULT_PAGE_METADATA[slug] || {};
  const fromDoc = doc && typeof doc === 'object' ? doc : {};

  if (slug === 'home') {
    const settingsTitle = settings?.meta_title?.trim() || DEFAULT_SETTINGS.meta_title?.trim() || '';
    const settingsDesc =
      settings?.meta_description?.trim() || DEFAULT_SETTINGS.meta_description?.trim() || '';
    return {
      title: fromDoc.metaTitle?.trim() || settingsTitle || defaults.metaTitle || '',
      description:
        fromDoc.metaDescription?.trim() || settingsDesc || defaults.metaDescription || '',
      absoluteTitle: defaults.absoluteTitle === true,
    };
  }

  return {
    title:
      fromDoc.metaTitle?.trim() ||
      defaults.metaTitle ||
      CMS_PAGE_TITLES[slug] ||
      '',
    description: fromDoc.metaDescription?.trim() || defaults.metaDescription || '',
    absoluteTitle: defaults.absoluteTitle === true,
  };
}

/**
 * Projects listing has variant titles (all / residential / commercial).
 * Section-level meta keys live in Page.sections (meta_residential_* etc.).
 */
export function resolveProjectsPageMetadata(doc, sections = {}) {
  const defaults = DEFAULT_PAGE_METADATA.projects || {};
  const sectionDefaults = defaults.sectionMeta || {};

  return {
    all: {
      title: doc?.metaTitle?.trim() || defaults.metaTitle || 'All Projects',
      description: doc?.metaDescription?.trim() || defaults.metaDescription || '',
    },
    residential: {
      title:
        sections.meta_residential_title?.trim() ||
        sectionDefaults.meta_residential_title ||
        'Residential Projects',
      description:
        sections.meta_residential_description?.trim() ||
        sectionDefaults.meta_residential_description ||
        '',
    },
    commercial: {
      title:
        sections.meta_commercial_title?.trim() ||
        sectionDefaults.meta_commercial_title ||
        'Commercial Projects',
      description:
        sections.meta_commercial_description?.trim() ||
        sectionDefaults.meta_commercial_description ||
        '',
    },
  };
}

export { DEFAULT_PAGE_METADATA };
