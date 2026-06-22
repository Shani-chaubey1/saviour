import AboutPageContent from '../components/pages/AboutPageContent';
import { getPageSections, getSettings, getPageNextMetadata } from '@/lib/data';

export async function generateMetadata() {
  return getPageNextMetadata('about-us');
}

export default async function AboutPage() {
  const [sections, settings] = await Promise.all([
    getPageSections('about-us'),
    getSettings(),
  ]);
  return <AboutPageContent sections={sections} settings={settings} />;
}
