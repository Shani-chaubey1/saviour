'use client';
import Link from 'next/link';
import Image from 'next/image';

function timeAgo(date) {
  const diff = Date.now() - new Date(date);
  const months = Math.floor(diff / (1000 * 60 * 60 * 24 * 30));
  const years = Math.floor(months / 12);
  if (years >= 1) return `${years}y ago`;
  if (months >= 1) return `${months}mo ago`;
  return 'New';
}

export default function PropertyCard({ project }) {
  const { title, slug, status, badge, excerpt, thumbnail, price, size, location, createdAt, type } = project;

  return (
    <Link href={`/properties/${slug}`} className="pc-card">
      <div className="pc-img-wrap">
        <Image
          src={thumbnail || 'https://saviourgroup.in/wp-content/uploads/2024/11/mart.png'}
          alt={title}
          fill
          className="pc-img"
          sizes="(max-width:768px) 100vw, (max-width:1024px) 50vw, 33vw"
        />
        <div className="pc-overlay" />
        <div className="pc-badges">
          {status && <span className="pc-badge pc-badge-green">{status}</span>}
          {badge && <span className="pc-badge pc-badge-red">{badge}</span>}
        </div>
        {type && <div className="pc-type-tag">{type === 'residential' ? 'Residential' : 'Commercial'}</div>}
      </div>
      <div className="pc-body">
        <h3 className="pc-title">{title}</h3>
        {location && (
          <p className="pc-loc">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
            {location}
          </p>
        )}
        {excerpt && <p className="pc-excerpt">{excerpt}</p>}
        <div className="pc-meta">
          {price && <div className="pc-meta-item"><span className="pc-meta-k">Price</span><span className="pc-meta-v">{price}</span></div>}
          {size && <div className="pc-meta-item"><span className="pc-meta-k">Area</span><span className="pc-meta-v">{size}</span></div>}
        </div>
        <div className="pc-cta-row">
          <span className="pc-cta">
            View Details
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </span>
          {createdAt && <span className="pc-age">{timeAgo(createdAt)}</span>}
        </div>
      </div>

      <style jsx global>{`
        .pc-card {
          display: flex; flex-direction: column;
          background: #fff; border-radius: 12px; overflow: hidden;
          box-shadow: 0 4px 20px rgba(0,0,0,0.08);
          border: 1px solid #eee;
          transition: transform 0.3s, box-shadow 0.3s;
          text-decoration: none; color: inherit;
        }
        .pc-card:hover { transform: translateY(-8px); box-shadow: 0 20px 56px rgba(0,104,51,0.15); }

        .pc-img-wrap { position: relative; height: 240px; overflow: hidden; flex-shrink: 0; }
        .pc-img { object-fit: cover; transition: transform 0.5s; }
        .pc-card:hover .pc-img { transform: scale(1.07); }
        .pc-overlay { position: absolute; inset: 0; background: linear-gradient(to bottom, transparent 40%, rgba(2,45,18,0.7) 100%); }

        .pc-badges { position: absolute; top: 12px; left: 12px; display: flex !important; gap: 6px; z-index: 2; }
        .pc-badge { padding: 4px 12px; border-radius: 20px; font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.8px; backdrop-filter: blur(6px); }
        .pc-badge-green { background: rgba(0,104,51,0.9); color: #fff; }
        .pc-badge-red { background: rgba(235,50,55,0.9); color: #fff; }

        .pc-type-tag { position: absolute; bottom: 12px; left: 12px; z-index: 2; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: rgba(255,255,255,0.7); }

        .pc-body { padding: 18px 20px 20px; display: flex; flex-direction: column; flex: 1; }
        .pc-title { font-size: 18px; font-weight: 800; color: #111; line-height: 1.3; margin-bottom: 6px; transition: color 0.2s; }
        .pc-card:hover .pc-title { color: var(--green, #006833); }

        .pc-loc { display: flex !important; align-items: center !important; gap: 5px; font-size: 12px; color: #888; margin-bottom: 10px; }
        .pc-loc svg { color: var(--red, #eb3237); flex-shrink: 0; }

        .pc-excerpt { font-size: 13px; color: #666; line-height: 1.6; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; margin-bottom: 14px; flex: 1; }

        .pc-meta { display: flex !important; gap: 20px; padding: 12px 0; border-top: 1px solid #f0f0f0; margin-bottom: 12px; }
        .pc-meta-item { display: flex !important; flex-direction: column !important; gap: 2px; }
        .pc-meta-k { font-size: 10px; text-transform: uppercase; letter-spacing: 0.8px; color: #aaa; }
        .pc-meta-v { font-size: 13px; font-weight: 700; color: #111; }

        .pc-cta-row { display: flex !important; align-items: center !important; justify-content: space-between; }
        .pc-cta { display: flex !important; align-items: center !important; gap: 6px; font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.8px; color: var(--green, #006833); transition: gap 0.2s; }
        .pc-card:hover .pc-cta { gap: 10px; }
        .pc-age { font-size: 11px; color: #bbb; }
      `}</style>
    </Link>
  );
}
