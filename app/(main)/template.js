'use client';

import { useEffect } from 'react';

/**
 * Re-mounts on every public route change (Next.js convention), so we get a
 * fresh entrance animation on each page and can re-attach the
 * IntersectionObserver that drives the per-section reveal (AOS).
 *
 * The fade-in lives on a wrapper div; the per-section reveal is handled by
 * the global `main section` rules in `app/globals.css`.
 */
export default function MainTemplate({ children }) {
  useEffect(() => {
    if (typeof window === 'undefined') return undefined;

    const sections = Array.from(document.querySelectorAll('main section'));
    if (!sections.length) return undefined;

    const prefersReducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      sections.forEach((s) => s.classList.add('aos-visible'));
      return undefined;
    }

    sections.forEach((s) => s.classList.remove('aos-visible'));

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('aos-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
    );

    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  return <div className="page-enter">{children}</div>;
}
