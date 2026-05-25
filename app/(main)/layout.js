import TopBar from './components/layout/TopBar';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import { getSettings, getFooterContentPages } from '@/lib/data';

export default async function PublicLayout({ children }) {
  const [settings, footerPages] = await Promise.all([
    getSettings(),
    getFooterContentPages(),
  ]);
  return (
    <>
      {/* <TopBar settings={settings} /> */}
      <Header settings={settings} />
      <main className="flex-1">{children}</main>
      <Footer settings={settings} contentPages={footerPages} />
    </>
  );
}
