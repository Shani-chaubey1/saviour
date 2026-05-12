'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

const SITE_PAGES = [
  {
    slug: 'home',
    title: 'Homepage & site settings',
    url: '/',
    icon: '🏠',
    hint: 'Homepage sections, stats, trust banner, SEO, contact info for header/footer',
  },
  { slug: 'about-us', title: 'About Us', url: '/about-us', icon: '🏢', hint: 'Intro text, chairman message, mission, vision, management team' },
  {
    slug: 'projects',
    title: 'Projects listing',
    url: '/projects',
    icon: '🏗',
    hint: 'Headings and subtitles for All / Residential / Commercial tabs',
  },
  {
    slug: 'blog',
    title: 'Blog listing',
    url: '/blog',
    icon: '📰',
    postsAdminHref: '/admin/blogs',
    hint: 'Banner text, section heading, empty state message',
  },
  { slug: 'contact-us', title: 'Contact Us', url: '/contact-us', icon: '📞', hint: 'Phone, email, address, map embed, form title' },
];

export default function PagesPage() {
  const [pages, setPages] = useState([]);

  useEffect(() => {
    fetch('/api/admin/pages', { credentials: 'same-origin' })
      .then((r) => r.json())
      .then((d) => setPages(d.pages || []));
  }, []);

  const getPageData = (slug) => pages.find((p) => p.slug === slug);

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Website Pages</h1>
          <p className="page-subtitle">
            Edit static page copy and global site content. Project listings stay under{' '}
            <Link href="/admin/projects">Projects</Link>; blog posts under{' '}
            <Link href="/admin/blogs">Blogs</Link>.
          </p>
        </div>
      </div>

      <div className="pages-grid">
        {SITE_PAGES.map((page) => {
          const pageData = getPageData(page.slug);
          return (
            <div key={page.slug} className="page-card">
              <div className="page-icon">{page.icon}</div>
              <div className="page-info">
                <h3 className="page-name">{page.title}</h3>
                <p className="page-url">{page.url}</p>
                {page.hint && <p className="page-hint">{page.hint}</p>}
                {pageData && (
                  <p className="page-updated">Last updated: {new Date(pageData.updatedAt).toLocaleDateString()}</p>
                )}
              </div>
              <div className="page-actions">
                <Link href={`/admin/pages/${page.slug}`} className="btn-edit">
                  {page.slug === 'home' ? 'Edit homepage & site' : 'Edit content'}
                </Link>
                <a href={page.url} target="_blank" rel="noopener noreferrer" className="btn-view">View →</a>
                {page.postsAdminHref && (
                  <Link href={page.postsAdminHref} className="btn-posts">Manage posts</Link>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <style jsx global>{`
        .page-header { margin-bottom: 24px; }
        .page-title { font-size: 24px; font-weight: 800; color: #111827; margin-bottom: 4px; }
        .page-subtitle { color: #6b7280; font-size: 14px; max-width: 720px; line-height: 1.5; }
        .page-subtitle a { color: #006833; font-weight: 600; }
        .pages-grid { display: flex; flex-direction: column; gap: 12px; }
        .page-card {
          background: white;
          border-radius: 12px;
          padding: 20px;
          display: flex;
          align-items: center;
          gap: 16px;
          box-shadow: 0 1px 4px rgba(0,0,0,0.06);
          border: 1px solid #f3f4f6;
          transition: all 0.2s;
        }
        .page-card:hover { box-shadow: 0 4px 12px rgba(0,0,0,0.08); }
        .page-icon { font-size: 32px; flex-shrink: 0; }
        .page-info { flex: 1; min-width: 0; }
        .page-name { font-size: 16px; font-weight: 700; color: #111827; margin-bottom: 2px; }
        .page-url { font-size: 12px; color: #9ca3af; font-family: monospace; margin-bottom: 2px; }
        .page-hint { font-size: 12px; color: #6b7280; margin-top: 4px; line-height: 1.4; }
        .page-updated { font-size: 11px; color: #9ca3af; }
        .page-actions { display: flex; flex-wrap: wrap; gap: 8px; flex-shrink: 0; align-items: center; }
        .btn-edit {
          padding: 8px 16px;
          background: #006833;
          color: white;
          border-radius: 8px;
          text-decoration: none;
          font-size: 13.5px;
          font-weight: 500;
          transition: background 0.2s;
        }
        .btn-edit:hover { background: #004d26; }
        .btn-view {
          padding: 8px 14px;
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          text-decoration: none;
          color: #374151;
          font-size: 13.5px;
          transition: all 0.2s;
        }
        .btn-view:hover { background: #f9fafb; }
        .btn-posts {
          padding: 8px 14px;
          background: #eff6ff;
          border: 1px solid #bfdbfe;
          border-radius: 8px;
          text-decoration: none;
          color: #1d4ed8;
          font-size: 13.5px;
          font-weight: 500;
        }
        .btn-posts:hover { background: #dbeafe; }
        @media (max-width: 640px) { .page-card { flex-direction: column; align-items: flex-start; } }
      `}</style>
    </div>
  );
}
