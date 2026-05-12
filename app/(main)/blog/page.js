import { BlogListContent } from '../components/pages/BlogContent';
import { getPosts } from '@/lib/data';

export const metadata = {
  title: 'Blog',
  description: 'Read the latest news, insights, and updates about real estate in Delhi-NCR from Saviour Group.',
};

export const revalidate = 60;

export default async function BlogPage() {
  const posts = await getPosts();
  return <BlogListContent posts={posts} />;
}
