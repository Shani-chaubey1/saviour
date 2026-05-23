'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const FALLBACK_SLIDES = [
  {
    _id: '1',
    thumbnail: 'https://saviourgroup.in/wp-content/uploads/2025/05/LKM1.png',
    status: 'Possession Soon',
    title: 'Lord Krishna Mart',
    excerpt: 'Premium Commercial Spaces on Yamuna Expressway — Redefining Retail Experience',
    slug: 'lord-krishna-mart',
  },
  {
    _id: '2',
    thumbnail: 'https://saviourgroup.in/wp-content/uploads/2025/05/LKM2-1.png',
    status: 'Hot Offer',
    title: 'Saviour Manoharram',
    excerpt: 'Your Premier Business Hub in Gaur Yamuna City — Strategic Location, Limitless Potential',
    slug: 'saviour-manoharram',
  },
  {
    _id: '3',
    thumbnail: 'https://saviourgroup.in/wp-content/uploads/2025/05/LKM3.png',
    status: 'For Sale',
    title: 'Lord Krishna Medlley',
    excerpt: 'A Landmark Commercial Development in Greater Noida — Where Business Meets Legacy',
    slug: 'lord-krishna-medlley',
  },
];

export default function HeroSlider({ slides: slidesProp }) {
  const slides = slidesProp?.length ? slidesProp : FALLBACK_SLIDES;
  const [current, setCurrent] = useState(0);
  const [transitioning, setTransitioning] = useState(false);

  const goTo = useCallback((index) => {
    if (transitioning) return;
    setTransitioning(true);
    setCurrent(index);
    setTimeout(() => setTransitioning(false), 700);
  }, [transitioning]);

  const next = useCallback(() => goTo((current + 1) % slides.length), [current, goTo, slides.length]);
  const prev = useCallback(() => goTo((current - 1 + slides.length) % slides.length), [current, goTo, slides.length]);

  useEffect(() => {
    const t = setInterval(next, 6000);
    return () => clearInterval(t);
  }, [next]);

  return (
    <div className="hs-root">
      {slides.map((s, i) => (
        <div
          key={s._id || i}
          className={`hs-slide${i === current ? " hs-active" : ""}`}
        >
          <Image
            src={s.thumbnail}
            alt={s.title}
            fill
            className="hs-img"
            priority={i === 0}
            sizes="100vw"
          />
          <div
            className={`hs-content container${i === current ? " hs-content-in" : ""}`}
          >
            {s.status && <span className="hs-eyebrow">{s.status}</span>}
            <h1 className="hs-title">{s.title}</h1>
            {s.excerpt && <p className="hs-sub">{s.excerpt}</p>}
            <div className="hs-ctas">
              <Link href={`/properties/${s.slug}`} className="hs-btn-primary">
                Explore Project
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      ))}

      <button
        className="hs-arrow hs-arrow-l"
        onClick={prev}
        aria-label="Previous"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
        >
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
      </button>
      <button className="hs-arrow hs-arrow-r" onClick={next} aria-label="Next">
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
        >
          <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
      </button>

      <div className="hs-controls">
        <div className="hs-dots">
          {slides.map((_, i) => (
            <button
              key={i}
              className={`hs-dot${i === current ? " hs-dot-active" : ""}`}
              onClick={() => goTo(i)}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Progress bar */}
      <div className="hs-progress">
        <div key={current} className="hs-progress-fill" />
      </div>

      <style jsx global>{`
        .hs-root {
          position: relative;
          height: clamp(520px, 80vh, 780px);
          overflow: hidden;
          background: var(--dark-900, #020c05);
        }

        /* Slides */
        .hs-slide {
          position: absolute;
          inset: 0;
          opacity: 0;
          transition: opacity 0.8s ease;
        }
        .hs-slide.hs-active {
          opacity: 1;
        }
        .hs-img {
          object-fit: cover;
          object-position: center;
          transition: transform 8s ease;
        }
        .hs-slide.hs-active .hs-img {
          transform: scale(1.04);
        }

        /* Content */
        .hs-content {
          position: absolute;
          bottom: 16px;
          top: auto;
          transform: none;
          left: 50%;
          margin-left: -700px;
          width: min(560px, calc(100vw - 48px));
          color: white;
          background: #0a0a0acf;
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          border: 1px solid rgba(255, 255, 255, 0.28);
          border-radius: 16px;
          padding: 18px 20px;
          box-shadow: 0 20px 46px rgba(0, 0, 0, 0.34);
        }
        @media (max-width: 1600px) {
          .hs-content {
            left: 10px;
            margin-left: 0;
          }
        }

        .hs-eyebrow {
          display: inline-block;
          background: linear-gradient(
            135deg,
            var(--red, #eb3237),
            var(--red-light, #ff4d52)
          );
          color: #fff;
          padding: 5px 18px;
          border-radius: 20px;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          margin-bottom: 12px;
          opacity: 0;
          transform: translateY(24px);
          animation: none;
        }
        .hs-content-in .hs-eyebrow {
          animation: hsIn 0.6s ease 0.1s forwards;
        }
        .hs-title {
          font-size: 32px !important;
          font-weight: 900;
          line-height: 1.1;
          letter-spacing: -0.5px;
          margin-bottom: 18px;
          text-shadow: 0 4px 24px rgba(0, 0, 0, 0.4);
          opacity: 0;
          transform: translateY(24px);
          animation: none;
        }
        .hs-content-in .hs-title {
          animation: hsIn 0.6s ease 0.25s forwards;
        }
        .hs-sub {
          font-size: 14px !important;
          color: rgba(255, 255, 255, 0.75);
          line-height: 1.7;
          margin-bottom: 12px;
          opacity: 0;
          transform: translateY(24px);
          animation: none;
        }
        .hs-content-in .hs-sub {
          animation: hsIn 0.6s ease 0.4s forwards;
        }
        .hs-ctas {
          display: flex !important;
          gap: 14px;
          flex-wrap: wrap;
          opacity: 0;
          transform: translateY(24px);
          animation: none;
        }
        .hs-content-in .hs-ctas {
          animation: hsIn 0.6s ease 0.55s forwards;
        }

        @keyframes hsIn {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .hs-btn-primary {
          display: inline-flex !important;
          align-items: center !important;
          gap: 8px;
          background: linear-gradient(
            135deg,
            var(--green, #006833),
            var(--green-dark, #004d26)
          );
          color: white;
          padding: 14px 30px;
          border-radius: 8px;
          font-size: 13.5px;
          font-weight: 700;
          text-decoration: none;
          letter-spacing: 0.3px;
          transition: all 0.25s;
          box-shadow: 0 6px 24px rgba(0, 104, 51, 0.4);
        }
        .hs-btn-primary:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 32px rgba(0, 104, 51, 0.5);
          background: linear-gradient(
            135deg,
            var(--green-light, #00a04d),
            var(--green, #006833)
          );
        }

        .hs-btn-outline {
          display: inline-flex !important;
          align-items: center !important;
          padding: 14px 30px;
          border-radius: 8px;
          font-size: 13.5px;
          font-weight: 700;
          letter-spacing: 0.3px;
          color: white;
          text-decoration: none;
          border: 1.5px solid rgba(255, 255, 255, 0.4);
          backdrop-filter: blur(8px);
          transition: all 0.25s;
        }
        .hs-btn-outline:hover {
          border-color: var(--red, #eb3237);
          color: var(--red, #eb3237);
          background: rgba(235, 50, 55, 0.08);
        }

        /* Arrows */
        .hs-arrow {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.1);
          border: 1.5px solid rgba(255, 255, 255, 0.25);
          color: white;
          cursor: pointer;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          backdrop-filter: blur(10px);
          z-index: 10;
          transition: all 0.25s;
        }
        .hs-arrow:hover {
          background: var(--green, #006833);
          border-color: var(--green, #006833);
          transform: translateY(-50%) scale(1.05);
        }
        .hs-arrow-l {
          left: 28px;
        }
        .hs-arrow-r {
          right: 28px;
        }

        /* Controls */
        .hs-controls {
          position: absolute;
          right: 10px;
          top: 50%;
          transform: translateY(-50%);
          display: flex !important;
          flex-direction: column !important;
          gap: 10px;
          z-index: 10;
        }
        .hs-dots {
          display: flex !important;
          flex-direction: column !important;
          gap: 10px;
          align-items: center !important;
          justify-content: center !important;
        }
        .hs-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.35);
          border: none;
          cursor: pointer;
          transition: all 0.3s;
          padding: 0;
        }
        .hs-dot.hs-dot-active {
          background: var(--red, #eb3237);
          transform: scale(1.4);
        }
        .hs-dot:hover {
          background: rgba(255, 255, 255, 0.7);
        }
        .hs-counter {
          font-size: 11px;
          color: rgba(255, 255, 255, 0.4);
          letter-spacing: 1px;
        }

        /* Progress */
        .hs-progress {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: rgba(255, 255, 255, 0.1);
          z-index: 10;
        }
        .hs-progress-fill {
          height: 100%;
          background: linear-gradient(
            90deg,
            var(--green, #006833),
            var(--red, #eb3237)
          );
          animation: hsProgress 6s linear forwards;
        }
        @keyframes hsProgress {
          from {
            width: 0;
          }
          to {
            width: 100%;
          }
        }

        @media (max-width: 768px) {
          .hs-root {
            height: clamp(400px, 65vw, 520px);
          }
          .hs-arrow {
            display: none !important;
          }
          .hs-content {
            left: 24px !important;
            margin-left: 0 !important;
            bottom: 70px;
          }
        }
      `}</style>
    </div>
  );
}
