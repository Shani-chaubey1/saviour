'use client';

import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';
import './PageBanner.css';

export default function PageBanner({ title, breadcrumbs = [], image = '', variant = '', badges = [] }) {
  const hasImage = Boolean(image);
  const variantClass = variant ? ` page-banner--${variant}` : '';
  const badgeList = Array.isArray(badges) ? badges.filter(Boolean) : [];
  return (
    <div
      className={`page-banner${hasImage ? ' has-image' : ''}${variantClass}`}
      style={hasImage ? { backgroundImage: `url(${image})` } : undefined}
    >
      <div className="banner-overlay" />
      <div className="container banner-content">
        {badgeList.length > 0 && (
          <div className="banner-badges">
            {badgeList.map((badge, i) => (
              <span key={i} className={`banner-badge banner-badge--${badge.tone || 'default'}`}>
                {badge.label}
              </span>
            ))}
          </div>
        )}
        <h1 className="banner-title">{title}</h1>
        <nav className="breadcrumb" aria-label="Breadcrumb">
          <Link href="/" className="bc-item">
            <Home size={14} />
            <span>Home</span>
          </Link>
          {breadcrumbs.map((crumb, i) => (
            <span key={i} className="bc-group">
              <ChevronRight size={14} className="bc-sep" />
              {crumb.href ? (
                <Link href={crumb.href} className="bc-item">{crumb.label}</Link>
              ) : (
                <span className="bc-item active">{crumb.label}</span>
              )}
            </span>
          ))}
        </nav>
      </div>
</div>
  );
}
