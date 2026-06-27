/**
 * Shared lead / enquiry validation and “project” (source) resolution for public forms + POST /api/contact.
 */

export const LEAD_PHONE_REGEX = /^[0-9+\-\s().]{7,20}$/;

/** Digits only — used for phone validation and CRM. */
export function normalizeLeadPhoneDigits(value) {
  return String(value || '').replace(/\D/g, '');
}

/** Accepts +91, spaces, dashes, brackets; requires 10–15 digits. */
export function isValidLeadPhone(value) {
  const raw = String(value || '').trim();
  if (!raw || !LEAD_PHONE_REGEX.test(raw)) return false;
  const digits = normalizeLeadPhoneDigits(raw);
  return digits.length >= 10 && digits.length <= 15;
}

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

/** Today's date as YYYY-MM-DD (local timezone). */
export function getTodayDateString() {
  const now = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
}

/** Minimum value for `datetime-local` inputs — current local date & time. */
export function getMinDateTimeLocalString() {
  const now = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}T${pad(now.getHours())}:${pad(now.getMinutes())}`;
}

export function isPastDateOnly(dateStr) {
  const cleaned = String(dateStr || '').trim();
  if (!cleaned) return false;
  return cleaned < getTodayDateString();
}

export function isPastDateTimeLocal(value) {
  const cleaned = String(value || '').trim();
  if (!cleaned) return false;
  const dt = new Date(cleaned);
  return Number.isNaN(dt.getTime()) || dt < new Date();
}

/** Visit tab: past calendar day, or today with a time already passed. */
export function isPastVisitSchedule(visitDate, visitTime) {
  const date = String(visitDate || '').trim();
  const time = String(visitTime || '').trim();
  if (!date) return false;
  if (isPastDateOnly(date)) return true;
  if (!time || date !== getTodayDateString()) return false;
  const dt = new Date(`${date}T${time}`);
  return !Number.isNaN(dt.getTime()) && dt < new Date();
}

/** Random addition or subtraction challenge (subtraction always yields a non-negative result). */
export function generateMathChallenge() {
  const op = Math.random() < 0.5 ? '+' : '-';
  let a = Math.floor(Math.random() * 9) + 2;
  let b = Math.floor(Math.random() * 9) + 1;
  if (op === '-' && b > a) [a, b] = [b, a];
  const answer = op === '+' ? a + b : a - b;
  return { a, b, op, answer };
}

export function validateMathCaptcha({ a, b, op, userAnswer }) {
  if (!String(userAnswer ?? '').trim()) return 'Please solve the calculation to continue';
  const numA = Number(a);
  const numB = Number(b);
  const operator = String(op || '').trim();
  if (!Number.isFinite(numA) || !Number.isFinite(numB) || (operator !== '+' && operator !== '-')) {
    return 'Security check failed. Please refresh and try again.';
  }
  const expected = operator === '+' ? numA + numB : numA - numB;
  const given = Number(String(userAnswer).trim());
  if (!Number.isFinite(given) || given !== expected) {
    return 'Incorrect answer. Please try again.';
  }
  return '';
}

/** Client-side: returns field error map (empty if valid). */
export function validateLeadFormFields({
  name,
  email,
  phone,
  formType,
  preferredDateTime,
  visitDate,
  visitTime,
  captchaA,
  captchaB,
  captchaOp,
  captchaAnswer,
}) {
  const errs = {};
  if (!String(name || '').trim()) errs.name = 'Name is required';
  if (!String(phone || '').trim()) errs.phone = 'Phone number is required';
  else if (!isValidLeadPhone(phone)) errs.phone = 'Enter a valid 10-digit phone number';
  const em = String(email || '').trim();
  if (em && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em)) errs.email = 'Enter a valid email';

  const captchaErr = validateMathCaptcha({ a: captchaA, b: captchaB, op: captchaOp, userAnswer: captchaAnswer });
  if (captchaErr) errs.captchaAnswer = captchaErr;

  if (formType === 'visit') {
    if (!String(visitDate || '').trim()) errs.visitDate = 'Pick a date';
    else if (isPastDateOnly(visitDate)) errs.visitDate = 'Date cannot be in the past';
    if (!String(visitTime || '').trim()) errs.visitTime = 'Pick a time';
    else if (String(visitDate || '').trim() && isPastVisitSchedule(visitDate, visitTime)) {
      errs.visitTime = 'Time cannot be in the past';
    }
  } else if (formType === 'connect') {
    if (preferredDateTime) {
      if (Number.isNaN(new Date(preferredDateTime).getTime())) {
        errs.preferredDateTime = 'Enter a valid date & time';
      } else if (isPastDateTimeLocal(preferredDateTime)) {
        errs.preferredDateTime = 'Date & time cannot be in the past';
      }
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

  const captchaErr = validateMathCaptcha({
    a: body?.captchaA,
    b: body?.captchaB,
    op: body?.captchaOp,
    userAnswer: body?.captchaAnswer,
  });
  if (captchaErr) {
    const err = new Error(captchaErr);
    err.status = 400;
    throw err;
  }

  if (!name || !phone) {
    const err = new Error('Name and phone are required');
    err.status = 400;
    throw err;
  }
  if (!isValidLeadPhone(phone)) {
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
    if (isPastDateOnly(visitDate)) {
      const err = new Error('Visit date cannot be in the past');
      err.status = 400;
      throw err;
    }
    if (isPastVisitSchedule(visitDate, visitTime)) {
      const err = new Error(
        visitDate === getTodayDateString()
          ? 'Visit time cannot be in the past'
          : 'Visit date cannot be in the past',
      );
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
      if (isPastDateTimeLocal(raw)) {
        const err = new Error('Preferred date & time cannot be in the past');
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
    propertyLead: Boolean(body?.propertyLead),
    projectLocation: String(body?.projectLocation || '').trim(),
    projectAddress: String(body?.projectAddress || '').trim(),
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
