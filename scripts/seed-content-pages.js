/**
 * Seed default content pages: Disclaimer and Privacy Policy.
 * Non-destructive: skips any slug that already exists.
 *
 * Usage: npm run seed:content-pages
 *   (requires .env.local with MONGODB_URI)
 */
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env.local') });
const mongoose = require('mongoose');

const ContentPageSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true, trim: true, lowercase: true },
    title: { type: String, required: true, trim: true },
    content: { type: String, default: '' },
    metaTitle: { type: String, default: '' },
    metaDescription: { type: String, default: '' },
    isPublished: { type: Boolean, default: true },
    showInFooter: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { strict: false },
);

const SEED_PAGES = [
  {
    slug: 'disclaimer',
    title: 'Disclaimer',
    metaTitle: 'Disclaimer — Saviour Group',
    metaDescription:
      'Information on disclaimer, accuracy of content, and limitations on the official Saviour Group website.',
    showInFooter: true,
    order: 10,
    content: `
<p>The information provided on this website is published for general information purposes only. Saviour Group makes every effort to keep the content current and accurate; however, no representations or warranties of any kind, express or implied, are made about the completeness, accuracy, reliability, suitability, or availability of the information, images, or related graphics contained on the website.</p>

<h2>No commitment or offer</h2>
<p>The content presented on this website &mdash; including project details, layouts, specifications, prices, payment plans, and amenities &mdash; is for representational purposes only and does not constitute an offer, an invitation to offer, or a contractual commitment of any kind. Nothing on this website should be construed as legal, financial, or investment advice.</p>

<h2>Project information</h2>
<p>All project plans, specifications, configurations, dimensions, layouts, designs, prices, payment schedules, and other particulars are tentative and subject to change at the sole discretion of the developer and/or competent authorities, without prior notice. Customers are requested to verify all project-related details directly with our sales office or authorised representatives before making any decision.</p>
<p>The promoted projects on this site are duly registered under the applicable Real Estate (Regulation and Development) Act, 2016 (RERA) where required. The respective RERA registration numbers and related details are available with our sales team and on the official RERA portal of the relevant State / UT.</p>

<h2>External links</h2>
<p>Through this website, you may be able to link to other websites which are not under our control. We have no control over the nature, content, and availability of those sites and the inclusion of any such links does not necessarily imply a recommendation or endorse the views expressed within them.</p>

<h2>Use at your own risk</h2>
<p>In no event will Saviour Group be liable for any loss or damage including, without limitation, indirect or consequential loss or damage, or any loss or damage whatsoever arising from loss of data or profits arising out of, or in connection with, the use of this website.</p>

<p>By continuing to use this website, you agree to the terms of this disclaimer.</p>
`.trim(),
  },
  {
    slug: 'privacy-policy',
    title: 'Privacy Policy',
    metaTitle: 'Privacy Policy — Saviour Group',
    metaDescription:
      'Learn how Saviour Group collects, uses, stores and protects personal information shared via this website.',
    showInFooter: true,
    order: 20,
    content: `
<p>Saviour Group ("we", "our", "us") respects your privacy and is committed to protecting the personal information you share with us through this website. This Privacy Policy explains what information we collect, how we use it, and the choices you have about your information.</p>

<h2>1. Information we collect</h2>
<ul>
  <li><strong>Contact details</strong> &mdash; name, phone number, email address, message you submit through enquiry / contact / call-back forms.</li>
  <li><strong>Visit preferences</strong> &mdash; preferred date and time when you request a site visit or callback.</li>
  <li><strong>Project interest</strong> &mdash; the project or property page from which you submitted an enquiry.</li>
  <li><strong>Usage data</strong> &mdash; basic technical information such as browser type, device, pages visited and the referring URL, collected via cookies or analytics tools.</li>
</ul>

<h2>2. How we use your information</h2>
<ul>
  <li>To respond to your enquiries, schedule site visits and share project information.</li>
  <li>To contact you about projects, offers, updates, and events related to Saviour Group.</li>
  <li>To improve our website, content and customer experience.</li>
  <li>To comply with applicable legal, regulatory and accounting requirements.</li>
</ul>

<h2>3. Sharing your information</h2>
<p>We do not sell or rent your personal information. Your details may be shared only with:</p>
<ul>
  <li>Our employees, channel partners, and authorised sales representatives strictly for the purpose of responding to your enquiry.</li>
  <li>Service providers that help us operate our website, CRM and communications (e.g. hosting, analytics, email/SMS providers) under appropriate confidentiality obligations.</li>
  <li>Regulatory or government authorities when required by law.</li>
</ul>

<h2>4. Cookies</h2>
<p>This website may use cookies and similar technologies to enable core functionality, remember preferences, and measure traffic. Most browsers allow you to control or block cookies via their settings; however, disabling cookies may affect parts of the website&rsquo;s functionality.</p>

<h2>5. Data security</h2>
<p>We use reasonable technical and organisational safeguards designed to protect your information from unauthorised access, disclosure, alteration, or destruction. No method of transmission over the Internet or electronic storage is 100% secure, so absolute security cannot be guaranteed.</p>

<h2>6. Your choices</h2>
<ul>
  <li><strong>Opt-out</strong> &mdash; you can ask us to stop contacting you for marketing purposes at any time.</li>
  <li><strong>Access / correction</strong> &mdash; you may request access to, correction of, or deletion of the personal data we hold about you, subject to applicable law.</li>
</ul>
<p>To exercise these rights, email us at <a href="mailto:info@saviourgroup.in">info@saviourgroup.in</a>.</p>

<h2>7. Updates to this policy</h2>
<p>We may update this Privacy Policy from time to time. The latest version will always be available on this page with the &ldquo;last updated&rdquo; date implicit in this publication.</p>

<h2>8. Contact</h2>
<p>For questions about this Privacy Policy or how your information is handled, please contact us using the details on our <a href="/contact-us">Contact Us</a> page.</p>
`.trim(),
  },
];

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('Missing MONGODB_URI in .env.local');
    process.exit(1);
  }

  await mongoose.connect(uri);
  console.log('✅ Connected to MongoDB');

  const ContentPage =
    mongoose.models.ContentPage ||
    mongoose.model('ContentPage', ContentPageSchema);

  for (const seed of SEED_PAGES) {
    const existing = await ContentPage.findOne({ slug: seed.slug });
    if (existing) {
      console.log(`— Page "${seed.slug}" already exists. Skipping.`);
      continue;
    }
    await ContentPage.create({
      ...seed,
      isPublished: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    console.log(`✅ Created page "${seed.slug}"`);
  }

  await mongoose.disconnect();
  console.log('\nDone.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
