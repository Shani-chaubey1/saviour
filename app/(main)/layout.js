import TopBar from './components/layout/TopBar';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import { getSettings } from '@/lib/data';

export default async function PublicLayout({ children }) {
  const settings = await getSettings();
  return (
    <>
      {/* <TopBar settings={settings} /> */}
      <Header settings={settings} />
      <main className="flex-1">{children}</main>
      <Footer settings={settings} />
    </>
  );
}
