import ContactPageContent from '../components/pages/ContactPageContent';
import { getPageSections, getSettings, getPageNextMetadata } from '@/lib/data';

export const revalidate = 60;

export async function generateMetadata() {
  return getPageNextMetadata('contact-us');
}

export default async function ContactPage() {
  const [sections, settings] = await Promise.all([
    getPageSections('contact-us'),
    getSettings(),
  ]);
  return <ContactPageContent sections={sections} settings={settings} />;
}
