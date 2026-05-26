import { getSettings } from './data';

const DEFAULT_SITE_URL = 'https://saviourgroup.in';

/**
 * Resolve the canonical public site URL for use in sitemap.xml, robots.txt,
 * metadataBase, canonical tags, etc.
 *
 * Resolution order (first non-empty wins):
 *   1. Admin setting  → `settings.site_url`
 *   2. Env var        → `NEXT_PUBLIC_SITE_URL`
 *   3. Hard fallback  → DEFAULT_SITE_URL
 *
 * The returned value has no trailing slash so callers can do `${base}/path`
 * without producing double slashes.
 */
export async function getSiteUrl() {
  let raw = '';
  try {
    const settings = await getSettings();
    raw = (settings?.site_url || '').toString().trim();
  } catch {
    raw = '';
  }
  if (!raw) raw = (process.env.NEXT_PUBLIC_SITE_URL || '').toString().trim();
  if (!raw) raw = DEFAULT_SITE_URL;
  return raw.replace(/\/+$/, '');
}
