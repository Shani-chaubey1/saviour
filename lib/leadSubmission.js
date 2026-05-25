/**
 * Shared lead / enquiry validation and “project” (source) resolution for public forms + POST /api/contact.
 */

export const LEAD_PHONE_REGEX = /^[0-9+\-\s]{7,15}$/;

const PATH_LABELS = {
  '/': 'Home',
  '/about-us': 'About Us',
  '/contact-us': 'Contact Us',
  '/projects': 'Projects',
  '/blog': 'Blog',
  '/resedential-projects': 'Residential Projects',
};

/** Human-readable source stored in Enquiry.project: property title, or page label, or path-derived label. */
export function pathToLeadSource(pathname) {
  if (!pathname || pathname === '/') return 'Home';
  const key = pathname.replace(/\/$/, '') || '/';
  if (PATH_LABELS[key]) return PATH_LABELS[key];
  if (key.startsWith('/properties/')) return 'Property detail';
  if (key.startsWith('/blog/')) return 'Blog post';
  return key.replace(/^\//, '') || 'Website';
}

export function resolveLeadProjectField({ projectName, pageLabel, pathname }) {
  const fromProject = (projectName && String(projectName).trim()) || '';
  if (fromProject) return fromProject;
  const fromPage = (pageLabel && String(pageLabel).trim()) || '';
  if (fromPage) return fromPage;
  return pathToLeadSource(pathname || '/');
}

export const LEAD_FORM_TYPES = ['connect', 'visit'];

/** Client-side: returns field error map (empty if valid). */
export function validateLeadFormFields({ name, email, phone, formType, preferredDateTime, visitDate, visitTime }) {
  const errs = {};
  if (!String(name || '').trim()) errs.name = 'Name is required';
  if (!String(phone || '').trim()) errs.phone = 'Phone number is required';
  else if (!LEAD_PHONE_REGEX.test(String(phone).trim())) errs.phone = 'Enter a valid phone number';
  const em = String(email || '').trim();
  if (em && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em)) errs.email = 'Enter a valid email';

  if (formType === 'visit') {
    if (!String(visitDate || '').trim()) errs.visitDate = 'Pick a date';
    if (!String(visitTime || '').trim()) errs.visitTime = 'Pick a time';
  } else if (formType === 'connect') {
    if (preferredDateTime && Number.isNaN(new Date(preferredDateTime).getTime())) {
      errs.preferredDateTime = 'Enter a valid date & time';
    }
  }
  return errs;
}

/**
 * Server-side: normalize and validate body from /api/contact.
 * @throws {{ message: string, status: number }}
 */
export function parseAndValidateLeadBody(body) {
  const name = String(body?.name || '').trim();
  const phone = String(body?.phone || '').trim();
  const email = String(body?.email || '').trim().toLowerCase();
  const message = String(body?.message || '').trim();
  let project = String(body?.project || '').trim();
  const rawFormType = String(body?.formType || 'connect').trim().toLowerCase();
  const formType = LEAD_FORM_TYPES.includes(rawFormType) ? rawFormType : 'connect';

  if (!name || !phone) {
    const err = new Error('Name and phone are required');
    err.status = 400;
    throw err;
  }
  if (!LEAD_PHONE_REGEX.test(phone)) {
    const err = new Error('Invalid phone number');
    err.status = 400;
    throw err;
  }
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    const err = new Error('Invalid email');
    err.status = 400;
    throw err;
  }
  if (!project) project = 'Website';

  let preferredDateTime = null;
  let visitDate = '';
  let visitTime = '';

  if (formType === 'visit') {
    visitDate = String(body?.visitDate || '').trim();
    visitTime = String(body?.visitTime || '').trim();
    if (!visitDate || !visitTime) {
      const err = new Error('Visit date and time are required');
      err.status = 400;
      throw err;
    }
  } else {
    const raw = String(body?.preferredDateTime || '').trim();
    if (raw) {
      const dt = new Date(raw);
      if (Number.isNaN(dt.getTime())) {
        const err = new Error('Invalid preferred date & time');
        err.status = 400;
        throw err;
      }
      preferredDateTime = dt;
    }
  }

  return {
    name,
    phone,
    email,
    message,
    project,
    formType,
    preferredDateTime,
    visitDate,
    visitTime,
  };
}

/** Browser: POST lead to public API. */
export async function submitLeadRequest(payload) {
  const res = await fetch('/api/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'same-origin',
    body: JSON.stringify(payload),
  });
  let data = {};
  try {
    data = await res.json();
  } catch {
    /* ignore */
  }
  return { ok: res.ok, data };
}
