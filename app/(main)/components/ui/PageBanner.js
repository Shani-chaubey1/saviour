'use client';

import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';

export default function PageBanner({ title, breadcrumbs = [] }) {
  return (
    <div className="page-banner">
      <div className="banner-overlay" />
      <div className="container banner-content">
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

      <style jsx global>{`
        .page-banner {
          position: relative;
          background: linear-gradient(135deg, #2c3e50 0%, #1a252f 100%);
          padding: 64px 0;
          overflow: hidden;
        }
        .page-banner::before {
          content: '';
          position: absolute;
          inset: 0;
          background: url('https://saviourgroup.in/wp-content/uploads/2025/05/about.png') center/cover no-repeat;
          opacity: 0.12;
        }
        .banner-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(44,62,80,0.9), rgba(26,37,47,0.85));
        }
        .banner-content {
          position: relative;
          z-index: 1;
        }
        .banner-title {
          font-size: clamp(28px, 4vw, 48px);
          font-weight: 700;
          color: white;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 16px;
          line-height: 1.2;
        }
        .breadcrumb {
          display: flex;
          align-items: center;
          gap: 4px;
          flex-wrap: wrap;
        }
        .bc-group {
          display: flex;
          align-items: center;
          gap: 4px;
        }
        .bc-sep {
          color: rgba(255,255,255,0.4);
        }
        .bc-item {
          display: flex;
          align-items: center;
          gap: 4px;
          color: rgba(255,255,255,0.7);
          font-size: 14px;
          text-decoration: none;
          transition: color 0.2s;
        }
        .bc-item:hover {
          color: #e67e22;
        }
        .bc-item.active {
          color: #e67e22;
          font-weight: 600;
        }
      `}</style>
    </div>
  );
}
