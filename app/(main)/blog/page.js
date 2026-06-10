import { BlogListContent } from '../components/pages/BlogContent';
import { getPosts, getPageSections, getSettings } from '@/lib/data';

export const metadata = {
  title: 'Blog',
  description: 'Read the latest news, insights, and updates about real estate in Delhi-NCR from Saviour Group.',
};

export const revalidate = 60;

export default async function BlogPage() {
  const [posts, blogCms, settings] = await Promise.all([
    getPosts(),
    getPageSections('blog'),
    getSettings(),
  ]);
  return (
    <BlogListContent
      posts={posts}
      cms={blogCms}
      bannerImage={settings.banner_image_blog || settings.banner_image_default || ''}
    />
  );
}
