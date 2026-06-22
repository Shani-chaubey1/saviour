'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import ContactPopup from './ContactPopup';

const AUTOPLAY_MS = 1500;

/**
 * Normalize accepted image inputs (plain URL strings or { url|src|image })
 * into a clean [{ url, alt }] list, dropping blanks.
 */
function normalizeImages(images = []) {
  if (!Array.isArray(images)) return [];
  return images
    .map((img, i) => {
      if (!img) return null;
      if (typeof img === 'string') return img.trim() ? { url: img.trim(), alt: `Promo ${i + 1}` } : null;
      const url = (img.url || img.src || img.image || '').trim();
      return url ? { url, alt: img.alt || `Promo ${i + 1}` } : null;
    })
    .filter(Boolean);
}

/**
 * PropertyPromoCarousel — auto-rotating promo card for the property detail
 * right column. Images are admin-managed; renders nothing when empty.
 */
export default function PropertyPromoCarousel({
  images = [],
  bookLabel = 'Book Now',
  popupTitle = 'Book Now',
  tabConnectLabel = '',
  tabVisitLabel = '',
}) {
  const slides = normalizeImages(images);
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const [open, setOpen] = useState(false);
  const pausedRef = useRef(false);

  const hasMultiple = slides.length > 1;

  const next = useCallback(() => {
    setCurrent((c) => (c + 1) % slides.length);
  }, [slides.length]);

  useEffect(() => {
    if (!hasMultiple) return undefined;
    const t = setInterval(() => {
      if (!pausedRef.current) next();
    }, AUTOPLAY_MS);
    return () => clearInterval(t);
  }, [hasMultiple, next]);

  useEffect(() => {
    pausedRef.current = paused;
  }, [paused]);

  if (!slides.length) return null;

  return (
    <div
      className="ppc-card"
      role="region"
      aria-label="Featured promotions"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="ppc-viewport">
        {slides.map((s, i) => (
          <div
            key={i}
            className={`ppc-slide${i === current ? " ppc-slide-active" : ""}`}
            aria-hidden={i !== current}
          >
            <Image
              src={s.url}
              alt={s.alt}
              fill
              className="ppc-img"
              sizes="(max-width: 1024px) 100vw, 360px"
              unoptimized
            />
          </div>
        ))}

        <button
          type="button"
          className="ppc-book-btn"
          onClick={() => setOpen(true)}
          aria-haspopup="dialog"
          aria-controls="modalInquiry"
        >
          {bookLabel}
        </button>
      </div>

      <ContactPopup
        open={open}
        onClose={() => setOpen(false)}
        title={popupTitle}
        pageLabel="Property Detail — Promo Carousel"
        tabConnectLabel={tabConnectLabel}
        tabVisitLabel={tabVisitLabel}
      />

      <style jsx global>{`
        .ppc-card {
          position: relative;
          background: #fff;
          border: 1px solid #e5e7eb;
          border-radius: 16px;
          overflow: hidden;
          padding: 15px;
          background: white;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
        }
        .ppc-viewport {
          position: relative;
          width: 100%;
          height: 450px;
        }
        .ppc-slide {
          position: absolute;
          inset: 0;
          opacity: 0;
          transition: opacity 0.6s ease;
          pointer-events: none;
        }
        .ppc-slide-active {
          opacity: 1;
          pointer-events: auto;
        }
        .ppc-img {
          border-radius: 16px;
        }
        .ppc-dots {
          position: absolute;
          left: 50%;
          bottom: 84px;
          transform: translateX(-50%);
          z-index: 3;
          display: flex !important;
          gap: 8px;
          padding: 6px 10px;
          background: rgba(0, 0, 0, 0.28);
          border-radius: 999px;
          backdrop-filter: blur(4px);
        }
        .ppc-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          border: none;
          padding: 0;
          background: rgba(255, 255, 255, 0.6);
          cursor: pointer;
          transition: all 0.25s;
        }
        .ppc-dot-active {
          background: var(--green, #006833);
          transform: scale(1.35);
        }
        .ppc-dot:hover {
          background: #fff;
        }
        .ppc-book-btn {
          position: absolute;
          left: 0;
          bottom: 0px;
          z-index: 4;
          min-width: 130px;
          border-top-right-radius: 16px;
          border-bottom-left-radius: 16px;
          height: 46px;
          padding: 0 16px;
          border: none;
          background: var(--green, #006833);
          color: #fff;
          font-size: 14px;
          font-weight: 700;
          letter-spacing: 0.3px;
          cursor: pointer;
          box-shadow: 0 8px 22px rgba(0, 104, 51, 0.42);
          transition:
            transform 0.2s ease,
            background 0.2s ease,
            box-shadow 0.2s ease;
        }

        @media (max-width: 1199px) {
          .ppc-viewport {
            height: 450px;
          }
        }
        @media (max-width: 991px) {
          .ppc-viewport {
            height: 435px;
          }
        }
        @media (max-width: 575px) {
          .ppc-viewport {
            height: 435px;
          }
          .ppc-dots {
            bottom: 76px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .ppc-slide {
            transition: none;
          }
          .ppc-book-btn {
            transition: background 0.2s ease;
          }
          .ppc-book-btn:hover {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </div>
  );
}
