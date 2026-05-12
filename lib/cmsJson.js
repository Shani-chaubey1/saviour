/** Parse JSON array stored in settings (string or already array). */
export function parseJsonArray(value, fallback = []) {
  if (Array.isArray(value)) return value.length ? value : fallback;
  if (typeof value !== 'string' || !value.trim()) return fallback;
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) && parsed.length ? parsed : fallback;
  } catch {
    return fallback;
  }
}

export function stringifyJsonArray(arr) {
  if (!Array.isArray(arr)) return '[]';
  try {
    return JSON.stringify(arr);
  } catch {
    return '[]';
  }
}
