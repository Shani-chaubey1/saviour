import { notFound } from 'next/navigation';
import PropertyDetailContent from '../../components/pages/PropertyDetailContent';
import { getProjectBySlug, getProjects, SEED_PROJECTS } from '@/lib/data';

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
  const [project, related] = await Promise.all([
    getProjectBySlug(slug),
    getProjects({ limit: 6 }),
  ]);

  if (!project) notFound();

  const relatedProjects = related.filter(p => p.slug !== slug).slice(0, 2);
  return <PropertyDetailContent project={project} relatedProjects={relatedProjects} />;
}
