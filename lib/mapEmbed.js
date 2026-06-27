/**
 * Google Maps iframe helpers for contact page & footer.
 * Keeps the embedded map in sync with the displayed office address.
 */

/** Old placeholder embed (Yamuna Expressway coords) — not the corporate office. */
export const LEGACY_PLACEHOLDER_MAP_EMBED =
  'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3510.4561793905256!2d77.47369!3d28.32944!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjjCsDE5JzQ2LjAiTiA3N8KwMjgnMjUuMyJF!5e0!3m2!1sen!2sin!4v1620000000000!5m2!1sen!2sin';

export const DEFAULT_OFFICE_ADDRESS = 'C-110, Sector 65, Noida, Uttar Pradesh 201301';

/** Build a no-API-key embed URL from a free-text address. */
export function buildGoogleMapsEmbedFromAddress(address) {
  const q = encodeURIComponent(String(address || DEFAULT_OFFICE_ADDRESS).trim());
  return `https://www.google.com/maps?q=${q}&hl=en&z=16&output=embed`;
}

/**
 * Prefer an admin-provided embed URL; otherwise derive from the displayed address.
 * Ignores the legacy placeholder so prod DB seeds don't pin the wrong location.
 */
export function resolveGoogleMapsEmbedUrl({ mapEmbed, address }) {
  const custom = String(mapEmbed || '').trim();
  if (custom && custom !== LEGACY_PLACEHOLDER_MAP_EMBED) return custom;
  const addr = String(address || '').trim();
  return buildGoogleMapsEmbedFromAddress(addr || DEFAULT_OFFICE_ADDRESS);
}
