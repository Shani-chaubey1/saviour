import { notFound } from 'next/navigation';
import PropertyDetailContent from '../../components/pages/PropertyDetailContent';
import { getProjectBySlug, getProjects, getSettings, SEED_PROJECTS } from '@/lib/data';

export const revalidate = 60;

export async function generateStaticParams() {
  return SEED_PROJECTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return { title: 'Project Not Found' };
  return {
    title: project.title,
    description: project.excerpt || project.description?.slice(0, 160),
  };
}

export default async function PropertyDetailPage({ params }) {
  const { slug } = await params;
  const [project, related, settings] = await Promise.all([
    getProjectBySlug(slug),
    getProjects({ limit: 6 }),
    getSettings(),
  ]);

  if (!project) notFound();

  const relatedProjects = related.filter(p => p.slug !== slug).slice(0, 2);
  const sidebarImages = String(settings.property_sidebar_images || '')
    .split('\n')
    .map((s) => s.trim())
    .filter(Boolean);
  return (
    <PropertyDetailContent
      project={project}
      relatedProjects={relatedProjects}
      bannerImage={settings.banner_image_property || settings.banner_image_default || ''}
      sidebarImages={sidebarImages}
    />
  );
}
