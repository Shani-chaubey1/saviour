'use client';
import Link from 'next/link';
import Image from 'next/image';

function formatDate(date) {
  return new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function BlogCard({ post }) {
  const { title, slug, excerpt, thumbnail, createdAt, category } = post;
  return (
    <Link href={`/blog/${slug}`} className="bc-card">
      <div className="bc-img-wrap">
        <Image
          src={
            thumbnail ||
            "https://saviourgroup.in/wp-content/uploads/2025/05/b1.jpg"
          }
          alt={title}
          fill
          className="bc-img"
          sizes="(max-width:768px) 100vw, (max-width:1024px) 50vw, 33vw"
        />
        <div className="bc-img-overlay" />
        {category && <span className="bc-cat">{category}</span>}
      </div>
      <div className="bc-body">
        {createdAt && (
          <p className="bc-date">
            <svg
              width="11"
              height="11"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <rect x="3" y="4" width="18" height="18" rx="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            {formatDate(createdAt)}
          </p>
        )}
        <h3 className="bc-title">{title}</h3>
        <p className="bc-excerpt">{excerpt}</p>
        <div className="bc-read">
          Read More
          <svg
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
          >
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </div>
      </div>
      <style jsx global>{`
        .bc-card { display: flex; flex-direction: column; background: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.07); border: 1px solid #eee; transition: transform 0.3s, box-shadow 0.3s; text-decoration: none; color: inherit; }
        .bc-card:hover { transform: translateY(-8px); box-shadow: 0 20px 48px rgba(0,104,51,0.14); }
        .bc-img-wrap { position: relative; height: 210px; overflow: hidden; flex-shrink: 0; }
        .bc-img { object-fit: cover; transition: transform 0.5s; }
        .bc-card:hover .bc-img { transform: scale(1.06); }
        .bc-img-overlay { position: absolute; inset: 0; background: linear-gradient(to bottom, transparent 50%, rgba(2,45,18,0.6) 100%); }
        .bc-cat { position: absolute; top: 14px; left: 14px; background: #016833; color: white; padding: 4px 12px; border-radius: 4px; font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.8px; }
        .bc-body { padding: 20px 22px 24px; display: flex; flex-direction: column; flex: 1; }
        .bc-date { display: flex !important; align-items: center !important; gap: 5px; font-size: 11px; color: #aaa; margin-bottom: 8px; }
        .bc-date svg { color: var(--green, #006833); }
        .bc-title { font-size: 17px; font-weight: 800; color: #111; line-height: 1.4; margin-bottom: 10px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; flex: 1; transition: color 0.2s; }
        .bc-card:hover .bc-title { color: var(--green, #006833); }
        .bc-excerpt { font-size: 13px; color: #666; line-height: 1.65; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; margin-bottom: 18px; }
        .bc-read { display: flex !important; align-items: center !important; gap: 6px; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.8px; color: var(--red, #eb3237); transition: gap 0.2s; }
        .bc-card:hover .bc-read { gap: 10px; }
      `}</style>
    </Link>
  );
}
