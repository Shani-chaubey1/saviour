import AboutPageContent from '../components/pages/AboutPageContent';
import { getPageSections, getSettings } from '@/lib/data';

export const metadata = {
  title: 'About Us',
  description:
    'Learn about M/s Saviour Builders Pvt. Ltd. — one of the leading real estate developers in Delhi-NCR delivering residential & commercial projects.',
};

export default async function AboutPage() {
  const [sections, settings] = await Promise.all([
    getPageSections('about-us'),
    getSettings(),
  ]);
  return <AboutPageContent sections={sections} settings={settings} />;
}
