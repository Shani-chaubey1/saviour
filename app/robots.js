import { getSiteUrl } from '@/lib/siteUrl';

export const revalidate = 3600;

/**
 * Next.js App Router robots convention → /robots.txt
 *
 * Rules:
 *   • Allow all public crawlers to index everything by default.
 *   • Block admin + API surface (auth-only, no SEO value).
 *   • Point crawlers at the dynamic sitemap.
 */
export default async function robots() {
  const base = await getSiteUrl();
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/admin/', '/api/', '/_next/'],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
