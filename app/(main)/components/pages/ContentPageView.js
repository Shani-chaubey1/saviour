'use client';

import Link from 'next/link';
import PageBanner from '../ui/PageBanner';
import SectionHeading from '../ui/SectionHeading';
import PropertyCard from '../ui/PropertyCard';

function locationToSlug(value) {
  return String(value || '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-{2,}/g, '-')
    .replace(/^-|-$/g, '');
}

function humanizeLocation(value) {
  return String(value || '')
    .trim()
    .replace(/-+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function ContentPageView({ page, projects = [] }) {
  const showProjects = Boolean(page?.showProjects && page?.projectsLocation);
  const locationLabel = showProjects ? humanizeLocation(page.projectsLocation) : '';
  const projectsUrl = showProjects
    ? `/projects?location=${encodeURIComponent(locationToSlug(page.projectsLocation))}`
    : '';

  return (
    <>
      <PageBanner title={page.title} breadcrumbs={[{ label: page.title }]} />
      <section className="cpv-section">
        <div className="container cpv-container">
          <article
            className="cpv-article"
            dangerouslySetInnerHTML={{ __html: page.content || '' }}
          />
          {showProjects && (
            <div className="cpv-cta-row">
              <Link href={projectsUrl} className="cpv-cta">
                View Projects in {locationLabel}
                <span aria-hidden="true">→</span>
              </Link>
            </div>
          )}
        </div>
      </section>

      {showProjects && (
        <section className="cpv-projects">
          <div className="container">
            <SectionHeading
              title={`Projects in ${locationLabel}`}
              subtitle={`Explore our portfolio across ${locationLabel} and the surrounding area.`}
            />
            {projects.length > 0 ? (
              <div className="cpv-grid">
                {projects.map((project) => (
                  <PropertyCard
                    key={project._id?.toString() ?? project.slug}
                    project={project}
                  />
                ))}
              </div>
            ) : (
              <div className="cpv-empty">
                <p>No projects matched &ldquo;{locationLabel}&rdquo; yet — please check back soon.</p>
                <Link href="/projects" className="cpv-empty-cta">Browse all projects</Link>
              </div>
            )}
          </div>
        </section>
      )}
      <style jsx global>{`
        .cpv-section { padding: 72px 0 96px; background: #fff; }
        .cpv-container { max-width: 1080px; }
        .cpv-article { font-size: 16px; line-height: 1.85; color: #374151; }
        .cpv-article h1,
        .cpv-article h2,
        .cpv-article h3,
        .cpv-article h4 {
          color: #1f2937;
          font-weight: 800;
          line-height: 1.3;
          margin-top: 36px;
          margin-bottom: 14px;
        }
        .cpv-article h1 { font-size: 28px; }
        .cpv-article h2 { font-size: 24px; }
        .cpv-article h3 { font-size: 20px; }
        .cpv-article h4 { font-size: 17px; }
        .cpv-article p { margin: 0 0 18px; }
        .cpv-article ul,
        .cpv-article ol { margin: 0 0 18px 22px; padding: 0; }
        .cpv-article li { margin-bottom: 8px; }
        .cpv-article a { color: #006833; font-weight: 600; text-decoration: underline; text-underline-offset: 3px; }
        .cpv-article a:hover { color: #004d26; }
        .cpv-article strong { color: #111827; font-weight: 700; }
        .cpv-article blockquote {
          border-left: 4px solid #e67e22;
          padding: 6px 0 6px 20px;
          margin: 24px 0;
          color: #4b5563;
          font-style: italic;
          background: rgba(230, 126, 34, 0.04);
        }
        .cpv-article img {
          max-width: 100%;
          height: auto;
          border-radius: 10px;
          margin: 18px 0;
        }
        .cpv-article table {
          width: 100%;
          border-collapse: collapse;
          margin: 18px 0;
          font-size: 15px;
        }
        .cpv-article table th,
        .cpv-article table td {
          padding: 10px 14px;
          border: 1px solid #e5e7eb;
          text-align: left;
        }
        .cpv-article table th { background: #f9fafb; font-weight: 700; color: #1f2937; }
        .cpv-article hr {
          border: 0;
          border-top: 1px solid #e5e7eb;
          margin: 28px 0;
        }
        @media (max-width: 640px) {
          .cpv-section { padding: 48px 0 64px; }
          .cpv-article { font-size: 15px; }
        }

        /* ── Projects button + section appended to content pages ── */
        .cpv-cta-row {
          display: flex;
          justify-content: flex-start;
          margin-top: 32px;
        }
        .cpv-cta {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 12px 22px;
          background: var(--green, #006833);
          color: #ffffff;
          font-weight: 700;
          font-size: 14px;
          border-radius: 10px;
          text-decoration: none;
          box-shadow: 0 6px 20px rgba(0, 104, 51, 0.18);
          transition:
            background-color 200ms ease,
            transform 120ms ease,
            box-shadow 200ms ease;
        }
        .cpv-cta:hover {
          background: #00582b;
          transform: translateY(-1px);
          box-shadow: 0 10px 24px rgba(0, 104, 51, 0.22);
          color: #ffffff;
        }
        .cpv-cta:active { transform: translateY(0); }
        .cpv-cta:focus-visible {
          outline: 2px solid var(--green, #006833);
          outline-offset: 3px;
        }

        .cpv-projects {
          padding: 56px 0 88px;
          background: #f8faf9;
        }
        .cpv-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 28px;
        }
        @media (max-width: 1024px) {
          .cpv-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 640px) {
          .cpv-grid { grid-template-columns: 1fr; gap: 20px; }
        }
        .cpv-empty {
          text-align: center;
          padding: 32px 16px;
          color: #6b7280;
        }
        .cpv-empty p { margin: 0 0 14px; font-size: 15px; }
        .cpv-empty-cta {
          display: inline-block;
          padding: 9px 18px;
          background: white;
          border: 1px solid var(--green, #006833);
          border-radius: 8px;
          color: var(--green, #006833);
          font-weight: 600;
          font-size: 13.5px;
          text-decoration: none;
          transition: background-color 180ms ease, color 180ms ease;
        }
        .cpv-empty-cta:hover { background: var(--green, #006833); color: #ffffff; }

        @media (max-width: 640px) {
          .cpv-projects { padding: 40px 0 64px; }
          .cpv-cta { width: 100%; justify-content: center; }
          .cpv-cta-row { justify-content: stretch; }
        }
      `}</style>
    </>
  );
}
