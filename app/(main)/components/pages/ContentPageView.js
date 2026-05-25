'use client';

import PageBanner from '../ui/PageBanner';

export default function ContentPageView({ page }) {
  return (
    <>
      <PageBanner title={page.title} breadcrumbs={[{ label: page.title }]} />
      <section className="cpv-section">
        <div className="container cpv-container">
          <article
            className="cpv-article"
            dangerouslySetInnerHTML={{ __html: page.content || '' }}
          />
        </div>
      </section>
      <style jsx global>{`
        .cpv-section { padding: 72px 0 96px; background: #fff; }
        .cpv-container { max-width: 1080px; }
        .cpv-article { font-size: 16px; line-height: 1.85; color: #374151; }
        .cpv-article h1,
        .cpv-article h2,
        .cpv-article h3,
        .cpv-article h4 {
          color: #1f2937;
          font-weight: 800;
          line-height: 1.3;
          margin-top: 36px;
          margin-bottom: 14px;
        }
        .cpv-article h1 { font-size: 28px; }
        .cpv-article h2 { font-size: 24px; }
        .cpv-article h3 { font-size: 20px; }
        .cpv-article h4 { font-size: 17px; }
        .cpv-article p { margin: 0 0 18px; }
        .cpv-article ul,
        .cpv-article ol { margin: 0 0 18px 22px; padding: 0; }
        .cpv-article li { margin-bottom: 8px; }
        .cpv-article a { color: #006833; font-weight: 600; text-decoration: underline; text-underline-offset: 3px; }
        .cpv-article a:hover { color: #004d26; }
        .cpv-article strong { color: #111827; font-weight: 700; }
        .cpv-article blockquote {
          border-left: 4px solid #e67e22;
          padding: 6px 0 6px 20px;
          margin: 24px 0;
          color: #4b5563;
          font-style: italic;
          background: rgba(230, 126, 34, 0.04);
        }
        .cpv-article img {
          max-width: 100%;
          height: auto;
          border-radius: 10px;
          margin: 18px 0;
        }
        .cpv-article table {
          width: 100%;
          border-collapse: collapse;
          margin: 18px 0;
          font-size: 15px;
        }
        .cpv-article table th,
        .cpv-article table td {
          padding: 10px 14px;
          border: 1px solid #e5e7eb;
          text-align: left;
        }
        .cpv-article table th { background: #f9fafb; font-weight: 700; color: #1f2937; }
        .cpv-article hr {
          border: 0;
          border-top: 1px solid #e5e7eb;
          margin: 28px 0;
        }
        @media (max-width: 640px) {
          .cpv-section { padding: 48px 0 64px; }
          .cpv-article { font-size: 15px; }
        }
      `}</style>
    </>
  );
}
