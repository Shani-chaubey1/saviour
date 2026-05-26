import {
  getProjects,
  getPosts,
  getContentPages,
  getPropertyTypeSlugs,
  RESERVED_CONTENT_PAGE_SLUGS,
} from '@/lib/data';
import { getSiteUrl } from '@/lib/siteUrl';

/**
 * Cache for one hour. Sitemap doesn't need to be perfectly real-time and this
 * avoids hammering Mongo on every crawler hit.
 */
export const revalidate = 3600;

function toDate(value, fallback = new Date()) {
  const d = value ? new Date(value) : null;
  return d && !Number.isNaN(d.getTime()) ? d : fallback;
}

/**
 * Next.js App Router sitemap convention.
 * Returns an array of `{ url, lastModified, changeFrequency, priority }`
 * which Next serializes to /sitemap.xml.
 */
export default async function sitemap() {
  const base = await getSiteUrl();
  const now = new Date();

  const [projects, posts, contentPages, typeSlugs] = await Promise.all([
    getProjects({ limit: 500 }).catch(() => []),
    getPosts({ limit: 500 }).catch(() => []),
    getContentPages({ publishedOnly: true }).catch(() => []),
    getPropertyTypeSlugs().catch(() => ['residential', 'commercial']),
  ]);

  /* ── Static, hand-curated routes ─────────────────────────── */
  const staticRoutes = [
    { path: '/', changeFrequency: 'weekly', priority: 1.0 },
    { path: '/about-us', changeFrequency: 'monthly', priority: 0.7 },
    { path: '/contact-us', changeFrequency: 'yearly', priority: 0.6 },
    { path: '/projects', changeFrequency: 'weekly', priority: 0.9 },
    { path: '/blog', changeFrequency: 'weekly', priority: 0.7 },
  ].map((r) => ({
    url: `${base}${r.path}`,
    lastModified: now,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }));

  /* ── Property type filters → /projects?type=… ─────────────
     Lets search engines crawl Residential and Commercial as distinct landing
     pages, plus any other types you create in PropertyType admin. */
  const typeRoutes = typeSlugs.map((slug) => ({
    url: `${base}/projects?type=${encodeURIComponent(slug)}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  /* ── Project detail pages: /properties/[slug] ───────────── */
  const projectRoutes = projects
    .filter((p) => p?.slug)
    .map((p) => ({
      url: `${base}/properties/${p.slug}`,
      lastModified: toDate(p.updatedAt || p.createdAt, now),
      changeFrequency: 'monthly',
      priority: 0.8,
    }));

  /* ── Blog post detail pages: /blog/[slug] ───────────────── */
  const postRoutes = posts
    .filter((p) => p?.slug)
    .map((p) => ({
      url: `${base}/blog/${p.slug}`,
      lastModified: toDate(p.updatedAt || p.createdAt, now),
      changeFrequency: 'monthly',
      priority: 0.6,
    }));

  /* ── Dynamic CMS pages: /[slug] (Disclaimer, T&C, etc.) ─── */
  const contentRoutes = contentPages
    .filter((p) => p?.slug && !RESERVED_CONTENT_PAGE_SLUGS.has(p.slug))
    .map((p) => ({
      url: `${base}/${p.slug}`,
      lastModified: toDate(p.updatedAt || p.createdAt, now),
      changeFrequency: 'yearly',
      priority: 0.4,
    }));

  return [
    ...staticRoutes,
    ...typeRoutes,
    ...projectRoutes,
    ...postRoutes,
    ...contentRoutes,
  ];
}
