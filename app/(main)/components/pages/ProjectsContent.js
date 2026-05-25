'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import PageBanner from '../ui/PageBanner';
import SectionHeading from '../ui/SectionHeading';
import PropertyCard from '../ui/PropertyCard';

const FALLBACK = {
  residential: {
    title: 'Residential Projects',
    subtitle: 'Browse our residential townships and homes across Noida, Greater Noida & Ghaziabad.',
    breadcrumb: 'Residential',
  },
  commercial: {
    title: 'Commercial Projects',
    subtitle: 'Explore our premium commercial spaces on the Yamuna Expressway and across Delhi-NCR.',
    breadcrumb: 'Commercial',
  },
  '': {
    title: 'All Projects',
    subtitle: 'Browse our complete portfolio of residential and commercial projects across Delhi-NCR.',
    breadcrumb: 'All Projects',
  },
};

export function AllProjectsContent({ projects, sections = {}, locationLabel = '' }) {
  const searchParams = useSearchParams();
  const type = searchParams.get('type') || '';
  const hasLocation = Boolean(locationLabel);

  // Build a reset-location URL that keeps the active type tab intact.
  const resetLocationHref = type ? `/projects?type=${type}` : '/projects';

  const title =
    type === 'residential'
      ? (sections.residential_title?.trim() || FALLBACK.residential.title)
      : type === 'commercial'
      ? (sections.commercial_title?.trim() || FALLBACK.commercial.title)
      : (sections.all_title?.trim() || FALLBACK[''].title);

  const subtitle =
    type === 'residential'
      ? (sections.residential_subtitle?.trim() || FALLBACK.residential.subtitle)
      : type === 'commercial'
      ? (sections.commercial_subtitle?.trim() || FALLBACK.commercial.subtitle)
      : (sections.all_subtitle?.trim() || FALLBACK[''].subtitle);

  const breadcrumb =
    type === 'residential' ? 'Residential'
    : type === 'commercial' ? 'Commercial'
    : 'All Projects';

  const baseEmptyMsg = sections.empty_message?.trim() || 'No projects found at this time. Please check back soon.';
  const emptyMsg = hasLocation
    ? `No projects matched “${locationLabel}”. Try clearing the location filter to see all projects.`
    : baseEmptyMsg;

  const breadcrumbs = type
    ? [{ label: 'Projects', href: '/projects' }, { label: breadcrumb }]
    : [{ label: 'Projects' }];

  return (
    <>
      <PageBanner title={title} breadcrumbs={breadcrumbs} />

      <div className="pj-tabs-wrap">
        <div className="container pj-tabs">
          <Link href="/projects" className={`pj-tab${!type ? ' pj-tab-active' : ''}`}>All</Link>
          <Link href="/projects?type=residential" className={`pj-tab${type === 'residential' ? ' pj-tab-active' : ''}`}>Residential</Link>
          <Link href="/projects?type=commercial" className={`pj-tab${type === 'commercial' ? ' pj-tab-active' : ''}`}>Commercial</Link>
        </div>
      </div>

      <section className="projects-pg">
        <div className="container">
          <SectionHeading title={title} subtitle={subtitle} />

          {hasLocation && (
            <div className="pj-active-filters" role="status" aria-live="polite">
              <span className="pj-filter-pill">
                <span className="pj-filter-label">Location:</span>
                <span className="pj-filter-value">{locationLabel}</span>
                <Link
                  href={resetLocationHref}
                  className="pj-filter-clear"
                  aria-label={`Clear location filter (${locationLabel})`}
                >
                  ×
                </Link>
              </span>
            </div>
          )}

          {projects.length > 0 ? (
            <div className="pg-grid">
              {projects.map((project) => (
                <PropertyCard key={project._id?.toString() ?? project.slug} project={project} />
              ))}
            </div>
          ) : (
            <div className="pj-empty">
              <p className="empty-msg">{emptyMsg}</p>
              {hasLocation && (
                <Link href={resetLocationHref} className="pj-empty-cta">
                  Show all projects
                </Link>
              )}
            </div>
          )}
        </div>
      </section>

      <style jsx global>{`
        .pj-tabs-wrap {
          background: #f9fafb;
          border-bottom: 1px solid #f0f0f0;
          padding: 0;
        }
        .pj-tabs {
          display: flex !important;
          gap: 0;
          align-items: center !important;
        }
        .pj-tab {
          padding: 14px 28px;
          font-size: 13.5px;
          font-weight: 700;
          color: #6b7280;
          text-decoration: none;
          border-bottom: 3px solid transparent;
          transition: all 0.2s;
          white-space: nowrap;
        }
        .pj-tab:hover { color: var(--green, #006833); }
        .pj-tab-active {
          color: var(--green, #006833);
          border-bottom-color: var(--green, #006833);
          background: white;
        }
        .projects-pg { padding: 64px 0 80px; background: white; }
        .pg-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 28px; }
        .empty-msg { text-align: center; color: #888; font-size: 16px; padding: 48px 0 16px; }

        /* Active location filter pill */
        .pj-active-filters {
          display: flex; align-items: center; gap: 8px;
          margin: -16px 0 24px;
        }
        .pj-filter-pill {
          display: inline-flex !important;
          align-items: center !important;
          gap: 8px;
          padding: 6px 8px 6px 14px;
          background: var(--green-pale, #e8f5ee);
          color: var(--green-dark, #004d26);
          border: 1px solid rgba(0, 104, 51, 0.18);
          border-radius: 999px;
          font-size: 13px;
          font-weight: 600;
        }
        .pj-filter-label { color: var(--green-dark, #004d26); opacity: 0.7; font-weight: 500; }
        .pj-filter-value { color: var(--green, #006833); }
        .pj-filter-clear {
          display: inline-flex !important;
          align-items: center !important;
          justify-content: center !important;
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: rgba(0, 104, 51, 0.12);
          color: var(--green-dark, #004d26);
          font-size: 16px;
          line-height: 1;
          text-decoration: none !important;
          transition: background 0.18s, color 0.18s;
        }
        .pj-filter-clear:hover {
          background: var(--green, #006833);
          color: #fff;
        }

        .pj-empty { text-align: center; padding: 32px 0 16px; }
        .pj-empty-cta {
          display: inline-flex !important;
          align-items: center !important;
          gap: 8px;
          padding: 10px 22px;
          border: 1.5px solid var(--green, #006833);
          color: var(--green, #006833);
          border-radius: 999px;
          font-size: 13.5px;
          font-weight: 700;
          text-decoration: none !important;
          transition: all 0.2s;
        }
        .pj-empty-cta:hover {
          background: var(--green, #006833);
          color: #fff;
          transform: translateY(-1px);
        }
        @media (max-width: 1024px) { .pg-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 640px) { .pg-grid { grid-template-columns: 1fr; gap: 20px; } .pj-tab { padding: 12px 16px; font-size: 13px; } }
      `}</style>
    </>
  );
}

export function CommercialProjectsContent({ projects, sections }) {
  return <AllProjectsContent projects={projects} sections={sections} />;
}

export function ResidentialProjectsContent({ projects, sections }) {
  return <AllProjectsContent projects={projects} sections={sections} />;
}
