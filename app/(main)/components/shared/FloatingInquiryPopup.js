'use client';

import { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { X } from 'lucide-react';
import ContactPopup from './ContactPopup';

const REOPEN_SCROLL_DELTA = 1300;

/**
 * FloatingInquiryPopup — admin-managed clickable image pinned bottom-left.
 * Renders nothing unless enabled and an image is configured. Clicking the
 * image opens the shared enquiry modal (ContactPopup).
 */
export default function FloatingInquiryPopup({
  enabled = false,
  image = '',
  popupTitle = 'Get in Touch',
  tabConnectLabel = '',
  tabVisitLabel = '',
}) {
  const isEnabled = enabled === true || enabled === 'true';
  const pathname = usePathname();
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const closedAtRef = useRef(0);

  // Re-open once the user scrolls further down from where they dismissed it.
  useEffect(() => {
    if (!isEnabled || !image || !hidden) return undefined;
    const onScroll = () => {
      if (window.scrollY > closedAtRef.current + REOPEN_SCROLL_DELTA) {
        setHidden(false);
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [isEnabled, image, hidden]);

  // Re-open automatically on route change if it was dismissed.
  useEffect(() => {
    setHidden(false);
  }, [pathname]);

  if (!isEnabled || !image) return null;

  const handleClose = (e) => {
    e.stopPropagation();
    closedAtRef.current = typeof window !== 'undefined' ? window.scrollY : 0;
    setHidden(true);
  };

  return (
    <>
      <aside
        className={`fip-card${hidden ? ' fip-hidden' : ''}`}
        role="complementary"
        aria-label="Special offer"
        aria-hidden={hidden}
      >
        <button
          type="button"
          className="fip-close"
          onClick={handleClose}
          aria-label="Dismiss offer"
        >
          <X size={16} aria-hidden="true" />
        </button>
        <button
          type="button"
          className="fip-image-btn"
          onClick={() => setOpen(true)}
          aria-haspopup="dialog"
          aria-controls="modalInquiry"
          aria-label="Open enquiry form"
          tabIndex={hidden ? -1 : 0}
        >
          {/* Admin-uploaded image; plain img keeps arbitrary dimensions intact. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={image} alt="Special offer — tap to enquire" className="fip-image" />
        </button>
      </aside>

      <ContactPopup
        open={open}
        onClose={() => setOpen(false)}
        title={popupTitle}
        pageLabel="Floating Inquiry Popup"
        tabConnectLabel={tabConnectLabel}
        tabVisitLabel={tabVisitLabel}
      />

      <style jsx global>{`
        .fip-card {
          position: fixed;
          left: 5px;
          bottom: 5px;
          z-index: 940;
          width: min(220px, 42vw);
          border-radius: 14px;
          overflow: hidden;
          background: #fff;
          box-shadow: 0 12px 36px rgba(0, 0, 0, 0.28);
          transform: translateY(0) scale(1);
          transform-origin: bottom left;
          opacity: 1;
          transition: transform 0.36s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.36s ease,
            box-shadow 0.36s ease;
        }
        .fip-card:not(.fip-hidden):hover {
          transform: translateY(0) scale(1.4);
          box-shadow: 0 20px 52px rgba(0, 0, 0, 0.34);
        }
        .fip-hidden {
          transform: translateY(calc(100% + 30px)) scale(1);
          opacity: 0;
          pointer-events: none;
        }
        .fip-close {
          position: absolute;
          top: 6px;
          right: 6px;
          z-index: 2;
          width: 28px;
          height: 28px;
          min-width: 28px;
          min-height: 28px;
          border-radius: 50%;
          border: none;
          background: rgba(0, 0, 0, 0.55);
          color: #fff;
          cursor: pointer;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          transition: background 0.2s ease;
        }
        .fip-close:hover {
          background: rgba(0, 0, 0, 0.78);
        }
        .fip-close:focus-visible {
          outline: 2px solid #fff;
          outline-offset: 2px;
        }
        .fip-image-btn {
          display: block;
          width: 100%;
          padding: 0;
          border: none;
          background: none;
          cursor: pointer;
          line-height: 0;
        }
        .fip-image {
          display: block;
          width: 100%;
          height: auto;
          object-fit: cover;
        }
        .fip-image-btn:focus-visible {
          outline: 3px solid var(--green, #006833);
          outline-offset: -3px;
        }

        @media (max-width: 575px) {
          .fip-card { left: 12px; bottom: 12px; width: min(150px, 44vw); }
        }
        @media print {
          .fip-card { display: none !important; }
        }
        @media (prefers-reduced-motion: reduce) {
          .fip-card { transition: opacity 0.2s ease; }
          .fip-hidden { transform: none; }
        }
      `}</style>
    </>
  );
}
