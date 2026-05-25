import TopBar from './components/layout/TopBar';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import ScrollToTop from './components/shared/ScrollToTop';
import { getSettings, getFooterContentPages } from '@/lib/data';

export default async function PublicLayout({ children }) {
  const [settings, footerPages] = await Promise.all([
    getSettings(),
    getFooterContentPages(),
  ]);
  return (
    <>
      <noscript>
        <style>{`main section { opacity: 1 !important; transform: none !important; }`}</style>
      </noscript>
      <ScrollToTop />
      {/* <TopBar settings={settings} /> */}
      <Header settings={settings} />
      <main className="flex-1">{children}</main>
      <Footer settings={settings} contentPages={footerPages} />
    </>
  );
}
