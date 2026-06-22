import ContactPageContent from '../components/pages/ContactPageContent';
import { getPageSections, getSettings, getPageNextMetadata } from '@/lib/data';

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
