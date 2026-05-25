import HeroSlider from './components/shared/HeroSlider';
import {
  SearchBar,
  CertificationsSection,
  TrustBanner,
  AboutSection,
  MissionVisionSection,
  ProjectsSection,
  WhyUsSection,
  LaunchingSoonBanner,
  DevelopmentsSection,
  BlogSection,
  TestimonialsSection,
  ContactSection,
} from './components/pages/HomePageContent';
import { getProjects, getPosts, getTestimonials, getSettings, getHeroSlides } from '@/lib/data';

export const metadata = {
  title: 'Savviour Builderrs – Best Builder in Delhi-NCR',
  description:
    'M/s Saviour Builders Pvt. Ltd. (Saviour Group) is one of the leading real estate developers in Delhi-NCR.',
};

export const revalidate = 60;

export default async function HomePage() {
  const [projects, posts, testimonials, settings, heroSlides] = await Promise.all([
    getProjects({ limit: 6 }),
    getPosts({ limit: 3 }),
    getTestimonials(),
    getSettings(),
    getHeroSlides(),
  ]);

  return (
    <>
      <HeroSlider slides={heroSlides} />
      <TrustBanner settings={settings} />
      <CertificationsSection settings={settings} />
      <AboutSection settings={settings} willShowFull={false} />
      <ProjectsSection projects={projects} />
      <LaunchingSoonBanner data={settings} />
      <DevelopmentsSection settings={settings} />
      <TestimonialsSection testimonials={testimonials} />
      <ContactSection settings={settings} />
    </>
  );
}
