'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

const SITE_PAGES = [
  { slug: 'home', title: 'Homepage', url: '/', icon: '🏠' },
  { slug: 'about-us', title: 'About Us', url: '/about-us', icon: '🏢' },
  { slug: 'projects', title: 'Commercial Projects', url: '/projects', icon: '🏗' },
  { slug: 'resedential-projects', title: 'Residential Projects', url: '/resedential-projects', icon: '🏡' },
  { slug: 'contact-us', title: 'Contact Us', url: '/contact-us', icon: '📞' },
];

export default function PagesPage() {
  const [pages, setPages] = useState([]);

  useEffect(() => {
    fetch('/api/admin/pages')
      .then((r) => r.json())
      .then((d) => setPages(d.pages || []));
  }, []);

  const getPageData = (slug) => pages.find((p) => p.slug === slug);

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Website Pages</h1>
          <p className="page-subtitle">Edit content for each page of the website</p>
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
                {pageData && (
                  <p className="page-updated">Last updated: {new Date(pageData.updatedAt).toLocaleDateString()}</p>
                )}
              </div>
              <div className="page-actions">
                <Link href={`/admin/pages/${page.slug}`} className="btn-edit">Edit Content</Link>
                <a href={page.url} target="_blank" className="btn-view">View →</a>
              </div>
            </div>
          );
        })}
      </div>

      <style jsx global>{`
        .page-header { margin-bottom: 24px; }
        .page-title { font-size: 24px; font-weight: 800; color: #111827; margin-bottom: 4px; }
        .page-subtitle { color: #6b7280; font-size: 14px; }
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
        .page-info { flex: 1; }
        .page-name { font-size: 16px; font-weight: 700; color: #111827; margin-bottom: 2px; }
        .page-url { font-size: 12px; color: #9ca3af; font-family: monospace; margin-bottom: 2px; }
        .page-updated { font-size: 11px; color: #9ca3af; }
        .page-actions { display: flex; gap: 8px; flex-shrink: 0; }
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
        @media (max-width: 640px) { .page-card { flex-direction: column; align-items: flex-start; } }
      `}</style>
    </div>
  );
}
