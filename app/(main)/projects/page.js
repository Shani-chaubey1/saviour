import { AllProjectsContent } from '../components/pages/ProjectsContent';
import { getProjects, getPageSections, getSettings, getProjectsPageMetadata } from '@/lib/data';
import { toNextMetadata } from '@/lib/pageMetadata';

export const dynamic = 'force-dynamic';

/**
 * Convert "yamuna-expressway" → "Yamuna Expressway" for display.
 */
function locationSlugToLabel(slug) {
  return String(slug || '')
    .replace(/-+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export async function generateMetadata({ searchParams }) {
  const params = await Promise.resolve(searchParams);
  const type = params?.type || '';
  const locationLabel = locationSlugToLabel(params?.location);
  const locationSuffix = locationLabel ? ` in ${locationLabel}` : '';
  const meta = await getProjectsPageMetadata();

  let base = meta.all;
  if (type === 'residential') base = meta.residential;
  if (type === 'commercial') base = meta.commercial;

  const title = `${base.title}${locationSuffix}`;
  const description = locationSuffix
    ? `${base.description}${locationSuffix}.`
    : base.description;

  return toNextMetadata({ title, description });
}

export default async function ProjectsPage({ searchParams }) {
  const params = await Promise.resolve(searchParams);
  const type = params?.type || '';
  const location = params?.location || '';
  const locationLabel = locationSlugToLabel(location);

  const [projects, sections, settings] = await Promise.all([
    getProjects({
      ...(type ? { type } : {}),
      ...(location ? { location } : {}),
    }),
    getPageSections('projects'),
    getSettings(),
  ]);

  // Residential & Commercial can each have their own banner; both fall back to
  // the generic Projects banner, then the site-wide default.
  const typeBanner =
    type === 'residential'
      ? settings.banner_image_projects_residential
      : type === 'commercial'
        ? settings.banner_image_projects_commercial
        : '';
  const bannerImage =
    typeBanner || settings.banner_image_projects || settings.banner_image_default || '';

  return (
    <AllProjectsContent
      projects={projects}
      sections={sections}
      locationLabel={locationLabel}
      bannerImage={bannerImage}
    />
  );
}
