import TopBar from './components/layout/TopBar';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import ScrollToTop from './components/shared/ScrollToTop';
import EnquireFab from './components/shared/EnquireFab';
import CookieConsent from './components/shared/CookieConsent';
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
      <EnquireFab
        label={settings.enquire_fab_label || 'Enquire Now'}
        popupTitle={settings.enquire_fab_popup_title || 'Get in Touch'}
        tabConnectLabel={settings.contact_form_tab_connect_label || ''}
        tabVisitLabel={settings.contact_form_tab_visit_label || ''}
      />
      <CookieConsent
        message={settings.cookie_consent_message || ''}
        acceptLabel={settings.cookie_consent_accept_label || 'Accept'}
        closeLabel={settings.cookie_consent_close_label || 'Close'}
      />
    </>
  );
}
