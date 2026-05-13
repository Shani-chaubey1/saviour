'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Calendar, Tag, ArrowLeft } from 'lucide-react';
import PageBanner from '../ui/PageBanner';
import SectionHeading from '../ui/SectionHeading';
import BlogCard from '../ui/BlogCard';
import ContactForm from '../shared/ContactForm';

function formatDate(date) {
  return new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
}

export function BlogListContent({ posts, cms = {} }) {
  const bannerBrand = cms.banner_brand?.trim() || 'Savviour Builderrs';
  const sectionTitle = cms.section_title?.trim() || 'Blog';
  const sectionSubtitle = cms.section_subtitle?.trim() || 'Best Builder in Delhi-NCR';
  const emptyMessage =
    cms.empty_message?.trim() ||
    'No blog posts found at this time. Please check back soon.';
  const recentBlogs = posts.slice(0, 6);

  return (
    <>
      <PageBanner title={bannerBrand} breadcrumbs={[{ label: 'Blog' }]} />
      <section className="blog-pg">
        <div className="container">
          <SectionHeading title={sectionTitle} subtitle={sectionSubtitle} />
          <div className="blog-pg-layout">
            <div className="blog-pg-main">
              {posts.length > 0 ? (
                <div className="blog-pg-grid">
                  {posts.map((post) => (
                    <BlogCard key={post._id?.toString() ?? post.slug} post={post} />
                  ))}
                </div>
              ) : (
                <p className="empty-msg">{emptyMessage}</p>
              )}
            </div>
            <aside className="blog-pg-sidebar" aria-label="Recent posts and contact">
              {recentBlogs.length > 0 && (
                <div className="blog-list-recent-box">
                  <h3 className="blog-list-recent-title">Recent Blogs</h3>
                  <ul className="blog-list-recent-list">
                    {recentBlogs.map((p) => (
                      <li key={p._id?.toString() ?? p.slug}>
                        <Link href={`/blog/${p.slug}`} className="blog-list-recent-item">
                          <div className="blog-list-recent-img-wrap">
                            <Image
                              src={p.thumbnail || 'https://saviourgroup.in/wp-content/uploads/2025/05/b1.jpg'}
                              alt=""
                              aria-hidden
                              fill
                              className="blog-list-recent-img"
                              sizes="80px"
                            />
                          </div>
                          <div className="blog-list-recent-info">
                            <p className="blog-list-recent-post-title">{p.title}</p>
                            <span className="blog-list-recent-date">{formatDate(p.createdAt)}</span>
                          </div>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <div className="blog-list-sidebar-form">
                <h3 className="blog-list-sidebar-form-title">Get in Touch</h3>
                <ContactForm pageLabel="Blog — listing" />
              </div>
            </aside>
          </div>
        </div>
      </section>
      <style jsx global>{`
        .blog-pg { padding: 80px 0; background: white; }
        .blog-pg-layout { display: grid; grid-template-columns: 1fr 320px; gap: 40px; align-items: start; }
        .blog-pg-sidebar { position: sticky; top: 96px; display: flex; flex-direction: column; gap: 24px; }
        .blog-pg-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 28px; }
        .empty-msg { text-align: center; color: #888; font-size: 16px; padding: 48px 0; }
        .blog-list-recent-box { background: white; border-radius: 12px; padding: 24px; box-shadow: 0 4px 24px rgba(0,0,0,0.08); border: 1px solid #eee; }
        .blog-list-recent-title { font-size: 18px; font-weight: 700; color: #2c3e50; margin: 0 0 16px; padding-bottom: 12px; border-bottom: 2px solid #e67e22; display: inline-block; }
        .blog-list-recent-list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 16px; }
        .blog-list-recent-item { display: flex; gap: 12px; align-items: flex-start; text-decoration: none; transition: color 0.2s ease; }
        .blog-list-recent-item:hover .blog-list-recent-post-title { color: #e67e22; }
        .blog-list-recent-img-wrap { position: relative; width: 80px; height: 60px; border-radius: 6px; overflow: hidden; flex-shrink: 0; }
        .blog-list-recent-img { object-fit: cover; }
        .blog-list-recent-info { flex: 1; min-width: 0; }
        .blog-list-recent-post-title { font-size: 13px; font-weight: 600; color: #333; line-height: 1.4; margin: 0 0 4px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; transition: color 0.2s; }
        .blog-list-recent-date { font-size: 11px; color: #999; }
        .blog-list-sidebar-form { background: white; border-radius: 12px; padding: 24px; box-shadow: 0 4px 24px rgba(0,0,0,0.08); border: 1px solid #eee; }
        .blog-list-sidebar-form-title { font-size: 18px; font-weight: 700; color: #2c3e50; margin: 0 0 20px; padding-bottom: 12px; border-bottom: 2px solid #e67e22; display: inline-block; }
        @media (max-width: 1280px) { .blog-pg-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 1024px) {
          .blog-pg-layout { grid-template-columns: 1fr; }
          .blog-pg-sidebar { position: static; }
          .blog-pg-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 640px) { .blog-pg-grid { grid-template-columns: 1fr; gap: 20px; } }
      `}</style>
    </>
  );
}

export function BlogPostContent({ post, recentPosts }) {
  return (
    <>
      <PageBanner
        title={post.title}
        breadcrumbs={[{ label: 'Blog', href: '/blog' }, { label: post.title.slice(0, 40) + (post.title.length > 40 ? '...' : '') }]}
      />
      <div className="post-layout container">
        <article className="post-main">
          {post.thumbnail && (
            <div className="post-featured-img">
              <Image src={post.thumbnail} alt={post.title} fill className="post-img" sizes="(max-width: 768px) 100vw, 65vw" priority />
            </div>
          )}
          <div className="post-meta">
            <div className="post-meta-item"><Calendar size={14} /><span>{formatDate(post.createdAt)}</span></div>
            {post.category && <div className="post-meta-item"><Tag size={14} /><span>{post.category}</span></div>}
          </div>
          <h1 className="post-title">{post.title}</h1>
          <div className="post-content" dangerouslySetInnerHTML={{ __html: post.content || post.excerpt || '' }} />
          {post.tags?.length > 0 && (
            <div className="post-tags">
              <span className="tags-label">Tags:</span>
              {post.tags.map((tag) => <span key={tag} className="post-tag">{tag}</span>)}
            </div>
          )}
          <div className="post-nav">
            <Link href="/blog" className="back-btn"><ArrowLeft size={16} /> Back to Blog</Link>
          </div>
        </article>

        <aside className="post-sidebar">
          <div className="sidebar-form-box">
            <h3 className="sidebar-form-title">Get in Touch</h3>
            <ContactForm pageLabel={`Blog — ${post.title}`} />
          </div>
          {recentPosts.length > 0 && (
            <div className="recent-posts-box">
              <h3 className="recent-title">Recent Posts</h3>
              <div className="recent-list">
                {recentPosts.map((p) => (
                  <Link key={p.slug} href={`/blog/${p.slug}`} className="recent-item">
                    <div className="recent-img-wrap">
                      <Image src={p.thumbnail || 'https://saviourgroup.in/wp-content/uploads/2025/05/b1.jpg'} alt={p.title} fill className="recent-img" sizes="80px" />
                    </div>
                    <div className="recent-info">
                      <p className="recent-post-title">{p.title}</p>
                      <span className="recent-date">{formatDate(p.createdAt)}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </aside>
      </div>

      <style jsx global>{`
        .post-layout { display: grid; grid-template-columns: 1fr 320px; gap: 40px; padding-top: 48px; padding-bottom: 80px; align-items: start; }
        .post-featured-img { position: relative; height: 400px; border-radius: 12px; overflow: hidden; margin-bottom: 28px; box-shadow: 0 8px 32px rgba(0,0,0,0.10); }
        .post-img { object-fit: cover; }
        .post-meta { display: flex; align-items: center; gap: 20px; margin-bottom: 16px; flex-wrap: wrap; }
        .post-meta-item { display: flex; align-items: center; gap: 6px; font-size: 13px; color: #888; }
        .post-meta-item svg { color: #e67e22; }
        .post-title { font-size: clamp(22px, 3vw, 32px); font-weight: 700; color: #2c3e50; line-height: 1.3; margin-bottom: 24px; }
        .post-content { font-size: 16px; color: #444; line-height: 1.9; }
        :global(.post-content h2) { font-size: 22px; font-weight: 700; color: #2c3e50; margin: 28px 0 12px; }
        :global(.post-content h3) { font-size: 18px; font-weight: 700; color: #2c3e50; margin: 20px 0 10px; }
        :global(.post-content p) { margin-bottom: 18px; }
        :global(.post-content ul) { margin: 12px 0 18px 24px; }
        :global(.post-content li) { margin-bottom: 8px; }
        .post-tags { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; margin-top: 32px; padding-top: 20px; border-top: 1px solid #eee; }
        .tags-label { font-size: 13px; font-weight: 700; color: #888; text-transform: uppercase; letter-spacing: 0.5px; }
        .post-tag { padding: 4px 12px; background: rgba(230,126,34,0.1); color: #e67e22; border-radius: 20px; font-size: 12px; font-weight: 600; }
        .post-nav { margin-top: 32px; padding-top: 20px; border-top: 1px solid #eee; }
        .back-btn { display: inline-flex; align-items: center; gap: 8px; color: #e67e22; font-weight: 700; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px; text-decoration: none; transition: gap 0.2s; }
        .back-btn:hover { gap: 12px; }
        .sidebar-form-box { background: white; border-radius: 12px; padding: 24px; box-shadow: 0 4px 24px rgba(0,0,0,0.08); border: 1px solid #eee; margin-bottom: 24px; }
        .sidebar-form-title { font-size: 18px; font-weight: 700; color: #2c3e50; margin-bottom: 20px; padding-bottom: 12px; border-bottom: 2px solid #e67e22; display: inline-block; }
        .recent-posts-box { background: white; border-radius: 12px; padding: 24px; box-shadow: 0 4px 24px rgba(0,0,0,0.08); border: 1px solid #eee; }
        .recent-title { font-size: 18px; font-weight: 700; color: #2c3e50; margin-bottom: 16px; padding-bottom: 12px; border-bottom: 2px solid #e67e22; display: inline-block; }
        .recent-list { display: flex; flex-direction: column; gap: 16px; }
        .recent-item { display: flex; gap: 12px; align-items: flex-start; text-decoration: none; transition: all 0.2s ease; }
        .recent-item:hover .recent-post-title { color: #e67e22; }
        .recent-img-wrap { position: relative; width: 80px; height: 60px; border-radius: 6px; overflow: hidden; flex-shrink: 0; }
        .recent-img { object-fit: cover; }
        .recent-info { flex: 1; }
        .recent-post-title { font-size: 13px; font-weight: 600; color: #333; line-height: 1.4; margin-bottom: 4px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; transition: color 0.2s; }
        .recent-date { font-size: 11px; color: #999; }
        @media (max-width: 1024px) { .post-layout { grid-template-columns: 1fr; } .post-sidebar { order: -1; } }
        @media (max-width: 640px) { .post-featured-img { height: 240px; } }
      `}</style>
    </>
  );
}
