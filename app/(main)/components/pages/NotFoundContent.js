'use client';

import Link from 'next/link';
import { Home } from 'lucide-react';

export default function NotFoundContent() {
  return (
    <div className="nf-page">
      <div className="nf-content">
        <div className="nf-code">404</div>
        <h1 className="nf-title">Page Not Found</h1>
        <p className="nf-desc">The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.</p>
        <div className="nf-actions">
          <Link href="/" className="btn-home"><Home size={16} /> Go to Homepage</Link>
          <Link href="/contact-us" className="btn-contact">Contact Us</Link>
        </div>
      </div>
      <style jsx global>{`
        .nf-page { min-height: 60vh; display: flex; align-items: center; justify-content: center; text-align: center; padding: 80px 20px; background: #f8f9fa; }
        .nf-content { max-width: 480px; }
        .nf-code { font-size: clamp(80px, 15vw, 140px); font-weight: 900; color: #e67e22; line-height: 1; opacity: 0.15; margin-bottom: -20px; }
        .nf-title { font-size: clamp(24px, 4vw, 36px); font-weight: 700; color: #2c3e50; margin-bottom: 16px; }
        .nf-desc { font-size: 16px; color: #666; line-height: 1.7; margin-bottom: 32px; }
        .nf-actions { display: flex; gap: 16px; justify-content: center; flex-wrap: wrap; }
        .btn-home { display: inline-flex; align-items: center; gap: 8px; background: linear-gradient(135deg, #e67e22, #d35400); color: white; padding: 13px 28px; border-radius: 6px; font-weight: 700; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px; text-decoration: none; transition: all 0.3s ease; }
        .btn-home:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(230,126,34,0.35); }
        .btn-contact { display: inline-flex; align-items: center; border: 2px solid #e67e22; color: #e67e22; padding: 13px 28px; border-radius: 6px; font-weight: 700; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px; text-decoration: none; transition: all 0.3s ease; }
        .btn-contact:hover { background: linear-gradient(135deg, #e67e22, #d35400); color: white; transform: translateY(-2px); }
      `}</style>
    </div>
  );
}
