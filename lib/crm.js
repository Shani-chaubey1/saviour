/**
 * Lead push to external CRM (helptrip.me / InsertLead).
 *
 * Behavior:
 *   - POSTs application/x-www-form-urlencoded payload (CRM endpoint expects it).
 *   - Aborts after CRM_TIMEOUT_MS to avoid hanging the request.
 *   - Never throws — failures are logged and returned as { sent: false, ... }
 *     so a CRM outage never breaks the user-facing form flow.
 *   - Disable in any environment by setting CRM_ENABLED=false.
 *
 * Env vars:
 *   CRM_LEAD_API_URL   — override endpoint (defaults to helptrip.me URL).
 *   CRM_PROJECT_NAME   — fallback ProjectName when the lead has none.
 *   CRM_SOURCE         — Source label (e.g. "Saviour Builders Website").
 *   CRM_TIMEOUT_MS     — request timeout in ms (default 10000).
 *   CRM_ENABLED=false  — skip CRM entirely (returns { sent: false, skipped: true }).
 */

const CRM_LEAD_API_URL = 'https://helptrip.me/WebService/Lead.asmx/InsertLead';

const CRM_PROJECT_NAME = process.env.CRM_PROJECT_NAME || 'Saviour Builders';
const CRM_SOURCE = process.env.CRM_SOURCE || 'Saviour Builders Website';
const CRM_TIMEOUT_MS = Number(process.env.CRM_TIMEOUT_MS) || 10000;

function normalizeMobile(value) {
  const digits = String(value || '').replace(/\D/g, '');
  if (!digits) return '';
  if (digits.length > 10) return digits.slice(-10);
  return digits;
}

function asPlainString(value) {
  return String(value ?? '').trim();
}

/**
 * Push a single lead to the CRM.
 * @param {object} lead
 * @param {string} lead.name
 * @param {string} [lead.email]
 * @param {string} [lead.mobile]      raw phone, will be normalized
 * @param {string} [lead.formType]    free-text label shown in the CRM remark
 * @param {string} [lead.projectName]
 * @param {string} [lead.city]
 * @param {string} [lead.location]
 * @param {string} [lead.remark]
 * @returns {Promise<{sent: boolean, status?: number, data?: any, error?: string, skipped?: boolean, reason?: string}>}
 */
export async function sendLeadToCrm({
  name,
  email,
  mobile,
  formType = 'Website Lead',
  projectName,
  city,
  location,
  remark,
} = {}) {
  if (process.env.CRM_ENABLED === 'false') {
    return { sent: false, skipped: true };
  }

  const cleanedName = asPlainString(name);
  const cleanedEmail = asPlainString(email);
  const cleanedMobile = normalizeMobile(mobile);

  if (!cleanedName) return { sent: false, reason: 'missing-name' };
  if (!cleanedEmail && !cleanedMobile) {
    return { sent: false, reason: 'missing-contact' };
  }

  const payload = new URLSearchParams({
    Name: cleanedName,
    ProjectName: asPlainString(projectName) || CRM_PROJECT_NAME,
    City: asPlainString(city),
    Location: asPlainString(location),
    Remark:
      asPlainString(remark) ||
      `Lead from ${asPlainString(formType) || 'Website'} Form`,
    Source: CRM_SOURCE,
    Email: cleanedEmail,
    Mobile: cleanedMobile,
  });

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), CRM_TIMEOUT_MS);

  try {
    const response = await fetch(CRM_LEAD_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: payload.toString(),
      signal: controller.signal,
    });

    let data = '';
    try {
      data = await response.text();
    } catch {
      /* body parse failed — keep going, we still know status */
    }

    if (!response.ok) {
      console.error('[CRM] lead push non-OK:', response.status, data?.slice?.(0, 500));
      return { sent: false, status: response.status, data };
    }
    return { sent: true, status: response.status, data };
  } catch (error) {
    const msg = error?.name === 'AbortError'
      ? `timeout after ${CRM_TIMEOUT_MS}ms`
      : error?.message || 'CRM error';
    console.error('[CRM] lead push failed:', msg);
    return { sent: false, error: msg };
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Map our normalized Enquiry payload (see parseAndValidateLeadBody) to the
 * shape expected by sendLeadToCrm.
 *
 * - formType ('connect' | 'visit') becomes a human label in the CRM remark.
 * - message + preferredDateTime / visitDate / visitTime are concatenated into
 *   a single Remark so the CRM agent gets the full context.
 */
export function buildCrmLeadFromEnquiry(lead = {}) {
  const {
    name,
    email,
    phone,
    message,
    project,
    formType,
    preferredDateTime,
    visitDate,
    visitTime,
    propertyLead,
    projectLocation,
    projectAddress,
  } = lead;

  const formTypeLabel =
    formType === 'visit' ? 'Book a Visit' : 'Connect with an Agent';

  const propertyTitle = asPlainString(project);
  const genericSources = new Set([
    'Home',
    'About Us',
    'Contact Us',
    'Projects',
    'Blog',
    'Residential Projects',
    'Property detail',
    'Blog post',
    'Website',
    'Floating Enquire',
  ]);
  const isPropertyLead =
    propertyLead === true ||
    (propertyTitle &&
      !genericSources.has(propertyTitle) &&
      !propertyTitle.startsWith('Blog —'));

  const remarkParts = [];
  if (isPropertyLead && propertyTitle) {
    remarkParts.push(`Property interest: ${propertyTitle}`);
  }
  if (message) remarkParts.push(message);

  if (formType === 'visit') {
    const when = [visitDate, visitTime].filter(Boolean).join(' at ');
    if (when) remarkParts.push(`Preferred visit: ${when}`);
  } else if (preferredDateTime) {
    const dt =
      preferredDateTime instanceof Date
        ? preferredDateTime
        : new Date(preferredDateTime);
    if (!Number.isNaN(dt.getTime())) {
      remarkParts.push(`Preferred time: ${dt.toISOString()}`);
    }
  }

  const remark = remarkParts.length
    ? remarkParts.join(' — ')
    : `Lead from ${formTypeLabel} Form`;

  const crmProjectName = isPropertyLead
    ? process.env.CRM_PROPERTY_PROJECT_NAME || CRM_PROJECT_NAME
    : propertyTitle || CRM_PROJECT_NAME;

  const locationParts = [
    asPlainString(projectLocation),
    asPlainString(projectAddress),
    isPropertyLead ? propertyTitle : '',
  ].filter(Boolean);

  return {
    name,
    email,
    mobile: phone,
    projectName: crmProjectName,
    location: locationParts.join(' · ') || (isPropertyLead ? propertyTitle : ''),
    formType: formTypeLabel,
    remark,
  };
}
