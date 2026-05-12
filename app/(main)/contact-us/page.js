import ContactPageContent from '../components/pages/ContactPageContent';
import { getPageSections, getSettings } from '@/lib/data';

export const metadata = {
  title: 'Contact Us',
  description: "Get in touch with Saviour Group. We're here to help you find your dream property in Delhi-NCR.",
};

export default async function ContactPage() {
  const [sections, settings] = await Promise.all([
    getPageSections('contact-us'),
    getSettings(),
  ]);
  return <ContactPageContent sections={sections} settings={settings} />;
}
