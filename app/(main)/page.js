import HeroSlider from './components/shared/HeroSlider';
import {
  SearchBar,
  CertificationsSection,
  TrustBanner,
  AboutSection,
  MissionVisionSection,
  ProjectsSection,
  TownshipsSection,
  WhyUsSection,
  LaunchingSoonBanner,
  DevelopmentsSection,
  BlogSection,
  TestimonialsSection,
  ContactSection,
} from './components/pages/HomePageContent';
import { getProjects, getPosts, getTestimonials, getSettings, getHeroSlides, getTownships } from '@/lib/data';

export const metadata = {
  title: 'Savviour Builderrs – Best Builder in Delhi-NCR',
  description:
    'M/s Saviour Builders Pvt. Ltd. (Saviour Group) is one of the leading real estate developers in Delhi-NCR.',
};

export const revalidate = 60;

const DEFAULT_SECTION_ORDER = [
  'hero',
  'trust',
  'certifications',
  'about',
  'projects',
  'townships',
  'launching',
  'developments',
];

/**
 * Parse the admin-configured homepage section order. Returns an array of
 * { key, enabled }. Falls back to the default order when missing/invalid, and
 * always appends any known sections not present in the saved config so new
 * sections still render.
 */
function resolveSectionOrder(raw) {
  let parsed = [];
  try {
    const value = typeof raw === 'string' ? JSON.parse(raw) : raw;
    if (Array.isArray(value)) parsed = value;
  } catch {
    parsed = [];
  }

  const seen = new Set();
  const order = [];
  parsed.forEach((item) => {
    const key = typeof item === 'string' ? item : item?.key;
    if (!key || seen.has(key) || !DEFAULT_SECTION_ORDER.includes(key)) return;
    seen.add(key);
    order.push({ key, enabled: item?.enabled !== false });
  });
  DEFAULT_SECTION_ORDER.forEach((key) => {
    if (!seen.has(key)) order.push({ key, enabled: true });
  });
  return order;
}

export default async function HomePage() {
  const [projects, posts, testimonials, settings, heroSlides, townships] = await Promise.all([
    getProjects({ limit: 6 }),
    getPosts({ limit: 3 }),
    getTestimonials(),
    getSettings(),
    getHeroSlides(),
    getTownships(),
  ]);

  const sectionMap = {
    hero: <HeroSlider slides={heroSlides} />,
    trust: <TrustBanner settings={settings} />,
    certifications: <CertificationsSection settings={settings} />,
    about: <AboutSection settings={settings} willShowFull={false} />,
    projects: <ProjectsSection projects={projects} settings={settings} />,
    townships: <TownshipsSection townships={townships} settings={settings} />,
    launching: <LaunchingSoonBanner data={settings} />,
    developments: <DevelopmentsSection settings={settings} />,
  };

  const order = resolveSectionOrder(settings.homepage_section_order_json);

  return (
    <>
      {order
        .filter((s) => s.enabled && sectionMap[s.key])
        .map((s) => <div key={s.key}>{sectionMap[s.key]}</div>)}
    </>
  );
}
