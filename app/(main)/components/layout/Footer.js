'use client';

import Link from 'next/link';
import Image from 'next/image';
import DynamicFaIcon from '../shared/DynamicFaIcon';
import { parseJsonArray } from '@/lib/cmsJson';

const FALLBACK_QUICK_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'About Us', href: '/about-us' },
  { label: 'Commercial Projects', href: '/projects' },
  { label: 'Residential Projects', href: '/resedential-projects' },
  { label: 'Blog', href: '/blog' },
  { label: 'Contact Us', href: '/contact-us' },
];

const FALLBACK_PROJECT_LINKS = [
  { label: 'Lord Krishna Mart', href: '/properties/lord-krishna-mart' },
  { label: 'Saviour Manoharram', href: '/properties/saviour-manoharram' },
  { label: 'Lord Krishna Medlley', href: '/properties/lord-krishna-medlley' },
  { label: 'Saviour IRIS / Greenisle', href: '/properties/saviour-iris' },
  { label: 'Saviour Park Elite', href: '/properties/saviour-park-elite' },
  { label: 'Saviour Greenarch', href: '/properties/saviour-greenarch' },
];

function isExternalHref(href) {
  if (!href || typeof href !== 'string') return false;
  return /^https?:\/\//i.test(href) || href.startsWith('mailto:') || href.startsWith('tel:');
}

function FooterNavLink({ href, className, children }) {
  const h = href || '#';
  if (isExternalHref(h)) {
    const isHttp = /^https?:\/\//i.test(h);
    return (
      <a
        href={h}
        className={className}
        {...(isHttp ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      >
        {children}
      </a>
    );
  }
  return (
    <Link href={h} className={className}>
      {children}
    </Link>
  );
}

export default function Footer({ settings = {}, contentPages = [] }) {
  const fromJson = parseJsonArray(settings.footer_stats_strip_json, [])
    .filter((s) => String(s.num || '').trim() && String(s.label || '').trim())
    .map((s) => ({ num: String(s.num).trim(), label: String(s.label).trim() }));

  const footerStats =
    fromJson.length > 0
      ? fromJson
      : [
          { num: settings.stat_years || '25+', label: 'Years' },
          { num: settings.stat_projects || '50+', label: 'Projects' },
          { num: settings.stat_families || '10K+', label: 'Families' },
          { num: settings.footer_stat_4_num || '5★', label: settings.footer_stat_4_label || 'Rated' },
        ];

  const logo = settings.site_logo || 'https://saviourgroup.in/wp-content/uploads/2025/05/sb-logo.png';
  const siteName = settings.site_name || 'Saviour Group';
  const footerDesc =
    settings.footer_desc ||
    "M/s Saviour Builders Pvt. Ltd. is one of Delhi-NCR's leading real estate developers, delivering landmark residential & commercial projects since 1999.";
  const footerMap =
    settings.footer_map_embed ||
    'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3510.4561793905256!2d77.47369!3d28.32944!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjjCsDE5JzQ2LjAiTiA3N8KwMjgnMjUuMyJF!5e0!3m2!1sen!2sin!4v1620000000000!5m2!1sen!2sin';
  const phone2 = settings.site_phone_2 || '+91 9206-001-002';
  const email = settings.site_email || 'sales@saviourindia.com';
  const address = settings.site_address || 'C Block-110, Sector 65, Noida – 201301';
  const fbUrl = settings.site_facebook || 'https://facebook.com/saviourindia';
  const igUrl = settings.site_instagram || 'https://instagram.com/saviourindia';
  const ytUrl = settings.site_youtube || 'https://youtube.com/@saviourindia';

  const quickHeading = (settings.footer_quick_links_heading || '').trim() || 'Quick Links';
  const projectsHeading = (settings.footer_projects_heading || '').trim() || 'Our Projects';
  const contactHeading = (settings.footer_contact_heading || '').trim() || 'Get in Touch';

  const quickParsed = parseJsonArray(settings.footer_quick_links_json, []).filter(
    (r) => (r.label || '').trim() && (r.href || '').trim(),
  );
  const baseQuickLinks = quickParsed.length ? quickParsed : FALLBACK_QUICK_LINKS;
  const dynamicFooterLinks = Array.isArray(contentPages)
    ? contentPages
        .filter((p) => p && p.slug && p.title)
        .map((p) => ({ label: p.title, href: `/${p.slug}` }))
    : [];
  const dedupedDynamic = dynamicFooterLinks.filter(
    (d) => !baseQuickLinks.some((q) => (q.href || '').trim().toLowerCase() === d.href.toLowerCase()),
  );
  const quickLinks = [...baseQuickLinks, ...dedupedDynamic];

  const projParsed = parseJsonArray(settings.footer_project_links_json, []).filter(
    (r) => (r.label || '').trim() && (r.href || '').trim(),
  );
  const projectLinks = projParsed.length ? projParsed : FALLBACK_PROJECT_LINKS;

  const socialRows = parseJsonArray(settings.footer_social_icons_json, []).filter((r) => (r.url || '').trim());

  const contactParsed = parseJsonArray(settings.footer_contact_items_json, []).filter((r) => (r.value || '').trim());
  const contactRows =
    contactParsed.length > 0
      ? contactParsed
      : [
          { icon: 'FaPhone', label: 'Phone', value: phone2, href: `tel:${phone2.replace(/\s/g, '')}` },
          { icon: 'FaEnvelope', label: 'Email', value: email, href: `mailto:${email}` },
          { icon: 'FaMapMarkerAlt', label: 'Office', value: address, href: '' },
        ];

  return (
    <footer className="ft-root">
      {/* <div className="ft-stats-strip">
        <div className="container ft-stats-inner">
          {footerStats.map((s) => (
            <div key={`${s.num}-${s.label}`} className="ft-stat">
              <span className="ft-stat-num">{s.num}</span>
              <span className="ft-stat-label">{s.label}</span>
            </div>
          ))}
        </div>
      </div> */}

      <div className="ft-main">
        <div className="container ft-grid">
          <div className="ft-col ft-brand-col">
            <Link href="/">
              <Image
                src={logo}
                alt={siteName}
                width={150}
                height={50}
                style={{
                  filter: "brightness(0) invert(1)",
                  objectFit: "contain",
                  marginBottom: "16px",
                  display: "block",
                }}
              />
            </Link>
            <p className="ft-desc">{footerDesc}</p>
            <div className="ft-social">
              {socialRows.length > 0
                ? socialRows.map((row, idx) => {
                    const col = row.color?.startsWith("#")
                      ? row.color
                      : "#ffffff";
                    return (
                      <a
                        key={`${row.url}-${idx}`}
                        href={row.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ft-social-btn"
                        aria-label={row.label || "Social link"}
                        style={{ color: col }}
                      >
                        <DynamicFaIcon
                          name={row.icon}
                          size={15}
                          style={{ color: col }}
                        />
                      </a>
                    );
                  })
                : [
                    {
                      href: fbUrl,
                      icon: "FaFacebook",
                      color: "#1877f2",
                      label: "Facebook",
                    },
                    {
                      href: igUrl,
                      icon: "FaInstagram",
                      color: "#e4405f",
                      label: "Instagram",
                    },
                    {
                      href: ytUrl,
                      icon: "FaYoutube",
                      color: "#ff0000",
                      label: "YouTube",
                    },
                  ].map((row) => (
                    <a
                      key={row.label}
                      href={row.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ft-social-btn"
                      aria-label={row.label}
                      style={{ color: row.color }}
                    >
                      <DynamicFaIcon
                        name={row.icon}
                        size={15}
                        style={{ color: row.color }}
                      />
                    </a>
                  ))}
            </div>
          </div>

          <div className="ft-col">
            <h3 className="ft-heading">{quickHeading}</h3>
            <ul className="ft-links">
              {quickLinks.map((l) => (
                <li key={`${l.href}-${l.label}`}>
                  <FooterNavLink href={l.href} className="ft-link">
                    <span className="ft-link-dot" />
                    {l.label}
                  </FooterNavLink>
                </li>
              ))}
            </ul>
          </div>

          <div className="ft-col">
            <h3 className="ft-heading">{projectsHeading}</h3>
            <ul className="ft-links">
              {projectLinks.map((l) => (
                <li key={`${l.href}-${l.label}`}>
                  <FooterNavLink href={l.href} className="ft-link">
                    <span className="ft-link-dot" />
                    {l.label}
                  </FooterNavLink>
                </li>
              ))}
            </ul>
          </div>

          <div className="ft-col">
            <h3 className="ft-heading">{contactHeading}</h3>
            <ul className="ft-contact">
              {contactRows.map((row, idx) => (
                <li key={`${row.value}-${idx}`}>
                  <div className="ft-contact-icon" aria-hidden>
                    <DynamicFaIcon
                      name={row.icon}
                      size={14}
                      style={{ color: "var(--red,#eb3237)" }}
                    />
                  </div>
                  {row.href?.trim() ? (
                    <FooterNavLink
                      href={row.href.trim()}
                      className="ft-contact-link"
                    >
                      {row.value}
                    </FooterNavLink>
                  ) : (
                    <span>{row.value}</span>
                  )}
                </li>
              ))}
            </ul>
            {/* <div className="ft-map">
              <iframe
                src={footerMap}
                width="100%"
                height="130"
                style={{ border: 0, borderRadius: '8px', display: 'block' }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title={`${siteName} Location`}
              />
            </div> */}
          </div>
        </div>
      </div>

      <div className="ft-bottom">
        <div className="container ft-bottom-inner">
          <p>
            &copy; {new Date().getFullYear()}{" "}
            {settings.footer_copyright || "Saviour Group. All rights reserved."}{" "}
            &nbsp;·&nbsp;{" "}
            <span className="ft-disclaimer">
              Images for representation only.
            </span>
          </p>
          {settings.footer_powered_by !== "" &&
            settings.footer_powered_by !== undefined && (
              <p className="ft-powered-by">
                Designed & Developed by{" "}
                {settings.footer_powered_by_url ? (
                  <a
                    href={settings.footer_powered_by_url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Image
                      src="/uploads/sysneticindialogo.png"
                      alt="Sysneticindia"
                      width={100}
                      height={30}
                    />
                  </a>
                ) : (
                  <span>{settings.footer_powered_by || "Sysneticindia"}</span>
                )}
              </p>
            )}
        </div>
      </div>

      <style jsx global>{`
        .ft-powered-by {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .ft-powered-by img {
          width: 100px;
          height: 30px;
          object-fit: contain;
        }
        .ft-root {
          background: var(--dark-800, #041208);
          color: rgba(255, 255, 255, 0.65);
        }

        .ft-stats-strip {
          background: linear-gradient(
            135deg,
            var(--green-dark, #004d26),
            var(--green, #006833)
          );
          padding: 28px 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }
        .ft-stats-inner {
          display: grid !important;
          grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
          gap: 0;
        }
        .ft-stat {
          display: flex !important;
          flex-direction: column !important;
          align-items: center;
          gap: 4px;
          padding: 0 20px;
          border-right: 1px solid rgba(255, 255, 255, 0.15);
        }
        .ft-stat:last-child {
          border-right: none;
        }
        .ft-stat-num {
          font-size: 30px;
          font-weight: 900;
          color: white;
          line-height: 1;
          background: linear-gradient(135deg, #fff, var(--red-light, #ff4d52));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .ft-stat-label {
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: rgba(255, 255, 255, 0.7);
        }

        .ft-main {
          padding: 30px 0 20px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.07);
        }
        .ft-grid {
          display: grid;
          grid-template-columns: 1.4fr 1fr 1fr 1.2fr;
          gap: 40px;
        }

        .ft-desc {
          font-size: 14px;
          line-height: 1.75;
          color: rgba(255, 255, 255, 0.5);
          margin-bottom: 24px;
        }

        .ft-social {
          display: flex !important;
          gap: 10px;
          flex-wrap: wrap;
        }
        .ft-social-btn {
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          width: 36px;
          height: 36px;
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.07);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: rgba(255, 255, 255, 0.6);
          transition: all 0.2s;
        }
        .ft-social-btn:hover {
          background: rgba(255, 255, 255, 0.12);
          border-color: rgba(255, 255, 255, 0.25);
          transform: translateY(-3px);
        }

        .ft-heading {
          font-size: 12px;
          font-weight: 800;
          color: white;
          text-transform: uppercase;
          letter-spacing: 1.8px;
          margin-bottom: 22px;
          padding-bottom: 12px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .ft-links {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .ft-link {
          display: flex !important;
          align-items: center !important;
          gap: 9px;
          font-size: 13.5px;
          color: rgba(255, 255, 255, 0.55);
          text-decoration: none;
          transition: all 0.18s;
        }
        .ft-link:hover {
          color: var(--red, #eb3237);
          padding-left: 4px;
        }
        .ft-link-dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: var(--red, #eb3237);
          opacity: 0.5;
          flex-shrink: 0;
        }

        .ft-contact {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 14px;
        }
        .ft-contact li {
          display: flex !important;
          align-items: flex-start !important;
          gap: 12px;
        }
        .ft-contact-icon {
          width: 30px;
          height: 30px;
          min-width: 30px;
          border-radius: 6px;
          background: rgba(0, 104, 51, 0.2);
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          color: var(--red, #eb3237);
          flex-shrink: 0;
        }
        .ft-contact a,
        .ft-contact span,
        .ft-contact-link {
          font-size: 13.5px;
          color: rgba(255, 255, 255, 0.6);
          text-decoration: none;
          transition: color 0.15s;
          line-height: 1.6;
        }
        .ft-contact a:hover,
        .ft-contact-link:hover {
          color: var(--red, #eb3237);
        }
        .ft-map {
          margin-top: 18px;
          border-radius: 10px;
          overflow: hidden;
          opacity: 0.8;
        }

        .ft-bottom {
          padding: 18px 0;
          background: rgba(0, 0, 0, 0.25);
        }
        .ft-bottom-inner {
          display: flex !important;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 10px;
        }
        .ft-bottom p {
          font-size: 12px;
          color: rgba(255, 255, 255, 0.3);
          margin: 0;
        }
        .ft-disclaimer {
          font-size: 11px;
          opacity: 0.7;
        }
        .ft-bottom a {
          color: var(--red, #eb3237);
          text-decoration: none;
        }
        .ft-bottom a:hover {
          text-decoration: underline;
        }

        @media (max-width: 1024px) {
          .ft-grid {
            grid-template-columns: 1fr 1fr;
            gap: 36px;
          }
        }
        @media (max-width: 640px) {
          .ft-grid {
            grid-template-columns: 1fr;
            gap: 32px;
          }
          .ft-stats-inner {
            grid-template-columns: repeat(2, 1fr);
            gap: 1px;
          }
          .ft-stat {
            padding: 16px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            border-right: none;
          }
          .ft-stat:nth-child(odd) {
            border-right: 1px solid rgba(255, 255, 255, 0.15) !important;
          }
          .ft-bottom-inner {
            flex-direction: column;
            text-align: center;
          }
        }
      `}</style>
    </footer>
  );
}
