import { AllProjectsContent } from '../components/pages/ProjectsContent';
import { getProjects } from '@/lib/data';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ searchParams }) {
  const params = await Promise.resolve(searchParams);
  const type = params?.type || '';
  if (type === 'residential') return { title: 'Residential Projects – Saviour Group', description: "Explore Saviour Group's residential projects across Delhi-NCR." };
  if (type === 'commercial') return { title: 'Commercial Projects – Saviour Group', description: "Explore Saviour Group's commercial real estate projects." };
  return { title: 'All Projects – Saviour Group', description: "Browse all residential and commercial projects by Saviour Group across Delhi-NCR." };
}

export default async function ProjectsPage({ searchParams }) {
  const params = await Promise.resolve(searchParams);
  const type = params?.type || '';
  const projects = await getProjects(type ? { type } : {});
  return <AllProjectsContent projects={projects} />;
}
