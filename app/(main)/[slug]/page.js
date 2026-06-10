import { notFound } from 'next/navigation';
import ContentPageView from '../components/pages/ContentPageView';
import { getContentPageBySlug, getContentPages, getProjects, getSettings } from '@/lib/data';

export const revalidate = 60;

export async function generateStaticParams() {
  const pages = await getContentPages({ publishedOnly: true });
  return pages.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const page = await getContentPageBySlug(slug);
  if (!page) return { title: 'Page Not Found' };
  return {
    title: page.metaTitle?.trim() || page.title,
    description: page.metaDescription?.trim() || undefined,
  };
}

export default async function ContentPage({ params }) {
  const { slug } = await params;
  const page = await getContentPageBySlug(slug);
  if (!page) notFound();

  const wantsProjects = Boolean(page.showProjects && page.projectsLocation);
  const [projects, settings] = await Promise.all([
    wantsProjects
      ? getProjects({ location: page.projectsLocation }).catch(() => [])
      : Promise.resolve([]),
    getSettings(),
  ]);

  return (
    <ContentPageView
      page={page}
      projects={projects}
      bannerImage={settings.banner_image_content || settings.banner_image_default || ''}
    />
  );
}
