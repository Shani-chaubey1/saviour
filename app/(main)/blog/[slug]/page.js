import { notFound } from 'next/navigation';
import { BlogPostContent } from '../../components/pages/BlogContent';
import { getPostBySlug, getPosts, SEED_POSTS } from '@/lib/data';

export const revalidate = 60;

export async function generateStaticParams() {
  return SEED_POSTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return { title: 'Post Not Found' };
  return {
    title: post.title,
    description: post.excerpt?.slice(0, 160),
  };
}

export default async function BlogPostPage({ params }) {
  const { slug } = await params;
  const [post, allPosts] = await Promise.all([
    getPostBySlug(slug),
    getPosts(),
  ]);

  if (!post) notFound();

  const recentPosts = allPosts.filter(p => p.slug !== slug).slice(0, 3);
  return <BlogPostContent post={post} recentPosts={recentPosts} />;
}
