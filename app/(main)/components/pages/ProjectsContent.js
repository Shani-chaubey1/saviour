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

export function AllProjectsContent({ projects, sections = {} }) {
  const searchParams = useSearchParams();
  const type = searchParams.get('type') || '';

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

  const emptyMsg = sections.empty_message?.trim() || 'No projects found at this time. Please check back soon.';

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
          {projects.length > 0 ? (
            <div className="pg-grid">
              {projects.map((project) => (
                <PropertyCard key={project._id?.toString() ?? project.slug} project={project} />
              ))}
            </div>
          ) : (
            <p className="empty-msg">{emptyMsg}</p>
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
        .empty-msg { text-align: center; color: #888; font-size: 16px; padding: 48px 0; }
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
