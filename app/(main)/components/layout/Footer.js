'use client';

import Link from 'next/link';
import Image from 'next/image';

const FbIcon = () => (
  <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);
const IgIcon = () => (
  <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
  </svg>
);
const YtIcon = () => (
  <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor">
    <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);

const quickLinks = [
  { label: 'Home', href: '/' },
  { label: 'About Us', href: '/about-us' },
  { label: 'Commercial Projects', href: '/projects' },
  { label: 'Residential Projects', href: '/resedential-projects' },
  { label: 'Blog', href: '/blog' },
  { label: 'Contact Us', href: '/contact-us' },
];

const featuredProjects = [
  { label: 'Lord Krishna Mart', href: '/properties/lord-krishna-mart' },
  { label: 'Saviour Manoharram', href: '/properties/saviour-manoharram' },
  { label: 'Lord Krishna Medlley', href: '/properties/lord-krishna-medlley' },
  { label: 'Saviour IRIS / Greenisle', href: '/properties/saviour-iris' },
  { label: 'Saviour Park Elite', href: '/properties/saviour-park-elite' },
  { label: 'Saviour Greenarch', href: '/properties/saviour-greenarch' },
];

export default function Footer({ settings = {} }) {
  const footerStats = [
    { num: settings.stat_years || '25+', label: 'Years' },
    { num: settings.stat_projects || '50+', label: 'Projects' },
    { num: settings.stat_families || '10K+', label: 'Families' },
    { num: '5★', label: 'Rated' },
  ];
  const phone = settings.site_phone || '+91 0120-4104506';
  const phone2 = settings.site_phone_2 || '+91 9206-001-002';
  const email = settings.site_email || 'sales@saviourindia.com';
  const address = settings.site_address || 'C Block-110, Sector 65, Noida – 201301';
  const fbUrl = settings.site_facebook || 'https://facebook.com/saviourindia';
  const igUrl = settings.site_instagram || 'https://instagram.com/saviourindia';
  const ytUrl = settings.site_youtube || 'https://youtube.com/@saviourindia';

  return (
    <footer className="ft-root">
      {/* Stats strip */}
      <div className="ft-stats-strip">
        <div className="container ft-stats-inner">
          {footerStats.map((s) => (
            <div key={s.label} className="ft-stat">
              <span className="ft-stat-num">{s.num}</span>
              <span className="ft-stat-label">{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Main footer */}
      <div className="ft-main">
        <div className="container ft-grid">
          {/* Brand */}
          <div className="ft-col ft-brand-col">
            <Link href="/">
              <Image
                src="https://saviourgroup.in/wp-content/uploads/2025/05/sb-logo.png"
                alt="Saviour Group"
                width={150}
                height={50}
                style={{ filter: 'brightness(0) invert(1)', objectFit: 'contain', marginBottom: '16px', display: 'block' }}
              />
            </Link>
            <p className="ft-desc">
              M/s Saviour Builders Pvt. Ltd. is one of Delhi-NCR's leading real estate developers, delivering landmark residential & commercial projects since 1999.
            </p>
            <div className="ft-social">
              {[
                { href: fbUrl, Icon: FbIcon, label: 'Facebook' },
                { href: igUrl, Icon: IgIcon, label: 'Instagram' },
                { href: ytUrl, Icon: YtIcon, label: 'YouTube' },
              ].map(({ href, Icon, label }) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer" className="ft-social-btn" aria-label={label}>
                  <Icon />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="ft-col">
            <h3 className="ft-heading">Quick Links</h3>
            <ul className="ft-links">
              {quickLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="ft-link">
                    <span className="ft-link-dot" />
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Projects */}
          <div className="ft-col">
            <h3 className="ft-heading">Our Projects</h3>
            <ul className="ft-links">
              {featuredProjects.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="ft-link">
                    <span className="ft-link-dot" />
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="ft-col">
            <h3 className="ft-heading">Get in Touch</h3>
            <ul className="ft-contact">
              <li>
                <div className="ft-contact-icon">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13.1 19.79 19.79 0 0 1 1.62 4.5 2 2 0 0 1 3.6 2.33h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.08 6.08l.97-.97a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                </div>
                <a href={`tel:${phone2.replace(/\s/g,'')}`}>{phone2}</a>
              </li>
              <li>
                <div className="ft-contact-icon">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                </div>
                <a href={`mailto:${email}`}>{email}</a>
              </li>
              <li>
                <div className="ft-contact-icon">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                </div>
                <span>{address}</span>
              </li>
            </ul>
            <div className="ft-map">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3510.4561793905256!2d77.47369!3d28.32944!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjjCsDE5JzQ2LjAiTiA3N8KwMjgnMjUuMyJF!5e0!3m2!1sen!2sin!4v1620000000000!5m2!1sen!2sin"
                width="100%" height="130"
                style={{ border: 0, borderRadius: '8px', display: 'block' }}
                allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade"
                title="Saviour Group Location"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="ft-bottom">
        <div className="container ft-bottom-inner">
          <p>&copy; {new Date().getFullYear()} Saviour Group. All rights reserved. &nbsp;·&nbsp; <span className="ft-disclaimer">Images for representation only.</span></p>
          <p>Powered by <a href="https://www.sysneticindia.com" target="_blank" rel="noopener noreferrer">Sysneticindia</a></p>
        </div>
      </div>

      <style jsx global>{`
        .ft-root { background: var(--dark-800, #041208); color: rgba(255,255,255,0.65); }

        /* Stats strip */
        .ft-stats-strip {
          background: linear-gradient(135deg, var(--green-dark, #004d26), var(--green, #006833));
          padding: 28px 0;
          border-bottom: 1px solid rgba(255,255,255,0.1);
        }
        .ft-stats-inner {
          display: grid !important;
          grid-template-columns: repeat(4, 1fr);
          gap: 0;
        }
        .ft-stat {
          display: flex !important;
          flex-direction: column !important;
          align-items: center;
          gap: 4px;
          padding: 0 20px;
          border-right: 1px solid rgba(255,255,255,0.15);
        }
        .ft-stat:last-child { border-right: none; }
        .ft-stat-num {
          font-size: 30px; font-weight: 900; color: white; line-height: 1;
          background: linear-gradient(135deg, #fff, var(--red-light, #ff4d52));
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
        }
        .ft-stat-label { font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: rgba(255,255,255,0.7); }

        /* Main */
        .ft-main { padding: 64px 0 48px; border-bottom: 1px solid rgba(255,255,255,0.07); }
        .ft-grid {
          display: grid;
          grid-template-columns: 1.4fr 1fr 1fr 1.2fr;
          gap: 40px;
        }

        .ft-desc { font-size: 14px; line-height: 1.75; color: rgba(255,255,255,0.5); margin-bottom: 24px; }

        .ft-social { display: flex !important; gap: 10px; }
        .ft-social-btn {
          display: flex !important; align-items: center !important; justify-content: center !important;
          width: 36px; height: 36px; border-radius: 8px;
          background: rgba(255,255,255,0.07);
          border: 1px solid rgba(255,255,255,0.1);
          color: rgba(255,255,255,0.6);
          transition: all 0.2s;
        }
        .ft-social-btn:hover { background: var(--red, #eb3237); border-color: var(--red, #eb3237); color: var(--dark-900, #020c05); transform: translateY(-3px); }

        .ft-heading {
          font-size: 12px; font-weight: 800; color: white;
          text-transform: uppercase; letter-spacing: 1.8px;
          margin-bottom: 22px; padding-bottom: 12px;
          border-bottom: 1px solid rgba(255,255,255,0.1);
        }

        .ft-links { list-style: none; display: flex; flex-direction: column; gap: 8px; }
        .ft-link {
          display: flex !important; align-items: center !important; gap: 9px;
          font-size: 13.5px; color: rgba(255,255,255,0.55);
          text-decoration: none; transition: all 0.18s;
        }
        .ft-link:hover { color: var(--red, #eb3237); padding-left: 4px; }
        .ft-link-dot { width: 5px; height: 5px; border-radius: 50%; background: var(--red, #eb3237); opacity: 0.5; flex-shrink: 0; }

        .ft-contact { list-style: none; display: flex; flex-direction: column; gap: 14px; }
        .ft-contact li { display: flex !important; align-items: flex-start !important; gap: 12px; }
        .ft-contact-icon {
          width: 30px; height: 30px; min-width: 30px;
          border-radius: 6px; background: rgba(0,104,51,0.2);
          display: flex !important; align-items: center !important; justify-content: center !important;
          color: var(--red, #eb3237); flex-shrink: 0;
        }
        .ft-contact a, .ft-contact span { font-size: 13.5px; color: rgba(255,255,255,0.6); text-decoration: none; transition: color 0.15s; line-height: 1.6; }
        .ft-contact a:hover { color: var(--red, #eb3237); }
        .ft-map { margin-top: 18px; border-radius: 10px; overflow: hidden; opacity: 0.8; }

        /* Bottom bar */
        .ft-bottom { padding: 18px 0; background: rgba(0,0,0,0.25); }
        .ft-bottom-inner {
          display: flex !important; justify-content: space-between; align-items: center;
          flex-wrap: wrap; gap: 10px;
        }
        .ft-bottom p { font-size: 12px; color: rgba(255,255,255,0.3); margin: 0; }
        .ft-disclaimer { font-size: 11px; opacity: 0.7; }
        .ft-bottom a { color: var(--red, #eb3237); text-decoration: none; }
        .ft-bottom a:hover { text-decoration: underline; }

        @media (max-width: 1024px) { .ft-grid { grid-template-columns: 1fr 1fr; gap: 36px; } }
        @media (max-width: 640px) {
          .ft-grid { grid-template-columns: 1fr; gap: 32px; }
          .ft-stats-inner { grid-template-columns: repeat(2, 1fr); gap: 1px; }
          .ft-stat { padding: 16px; border-bottom: 1px solid rgba(255,255,255,0.1); border-right: none; }
          .ft-stat:nth-child(odd) { border-right: 1px solid rgba(255,255,255,0.15) !important; }
          .ft-bottom-inner { flex-direction: column; text-align: center; }
        }
      `}</style>
    </footer>
  );
}
