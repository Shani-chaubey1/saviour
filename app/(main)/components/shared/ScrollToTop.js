'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

/**
 * On every forward route change, scroll the document to the very top.
 * Because the site header uses `position: sticky; top: 0;`, scrolling the
 * window to y=0 naturally places page content right below the navbar.
 *
 * Browser back / forward navigation is detected via `popstate` so the
 * previous scroll position is preserved (matching native browser behaviour).
 * Hash links are also skipped so in-page anchors keep working.
 */
export default function ScrollToTop() {
  const pathname = usePathname();
  const isPopNavRef = useRef(false);

  useEffect(() => {
    const handlePop = () => {
      isPopNavRef.current = true;
    };
    window.addEventListener('popstate', handlePop);
    return () => window.removeEventListener('popstate', handlePop);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (isPopNavRef.current) {
      isPopNavRef.current = false;
      return;
    }
    if (window.location.hash) return;

    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname]);

  return null;
}
