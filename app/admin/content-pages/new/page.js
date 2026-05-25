'use client';

import Link from 'next/link';
import ContentPageForm from '../../_components/ContentPageForm';

export default function NewContentPage() {
  return (
    <div>
      <div className="cp-page-header">
        <div>
          <h1 className="cp-page-title">New Content Page</h1>
          <p className="cp-page-subtitle">Create a standalone page like Disclaimer, Privacy Policy or Terms.</p>
        </div>
        <Link href="/admin/content-pages" className="cp-back">← All pages</Link>
      </div>
      <ContentPageForm />
      <style jsx global>{`
        .cp-page-header { display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; margin-bottom: 20px; flex-wrap: wrap; }
        .cp-page-title { font-size: 24px; font-weight: 800; color: #111827; margin-bottom: 4px; }
        .cp-page-subtitle { color: #6b7280; font-size: 14px; }
        .cp-back { padding: 8px 14px; background: white; border: 1px solid #e5e7eb; border-radius: 8px; color: #374151; text-decoration: none; font-size: 13.5px; }
      `}</style>
    </div>
  );
}
