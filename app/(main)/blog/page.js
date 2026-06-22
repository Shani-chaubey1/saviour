import { BlogListContent } from '../components/pages/BlogContent';
import { getPosts, getPageSections, getSettings, getPageNextMetadata } from '@/lib/data';

export async function generateMetadata() {
  return getPageNextMetadata('blog');
}

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
