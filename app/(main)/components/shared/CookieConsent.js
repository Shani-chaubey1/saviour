'use client';

import { useCallback, useEffect, useState } from 'react';
import { Cookie, X } from 'lucide-react';

const STORAGE_KEY = 'cookieConsent';
const SUPPRESS_DAYS = 7;
const MS_PER_DAY = 24 * 60 * 60 * 1000;

function readStoredDecision() {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed.expiresAt !== 'number') return null;
    if (parsed.expiresAt < Date.now()) return null;
    return parsed;
  } catch {
    return null;
  }
}

function storeDecision(status) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        status,
        decidedAt: Date.now(),
        expiresAt: Date.now() + SUPPRESS_DAYS * MS_PER_DAY,
      }),
    );
  } catch {
    /* ignore quota / private mode errors */
  }
}

export default function CookieConsent({
  message = '',
  acceptLabel = 'Accept',
  closeLabel = 'Close',
}) {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!message) return;
    if (!readStoredDecision()) setVisible(true);
  }, [message]);

  const dismiss = useCallback((status) => {
    storeDecision(status);
    setVisible(false);
  }, []);

  if (!mounted || !message || !visible) return null;

  return (
    <div
      className="cookie-consent"
      role="dialog"
      aria-live="polite"
      aria-label="Cookie notice"
    >
      <div className="cookie-consent__icon" aria-hidden="true">
        <Cookie size={20} />
      </div>

      <div className="cookie-consent__body">
        <p className="cookie-consent__message">{message}</p>
        <div className="cookie-consent__actions">
          <button
            type="button"
            className="cookie-consent__btn cookie-consent__btn--accept"
            onClick={() => dismiss('accepted')}
          >
            {acceptLabel}
          </button>
          <button
            type="button"
            className="cookie-consent__btn cookie-consent__btn--close"
            onClick={() => dismiss('closed')}
          >
            <X size={14} aria-hidden="true" />
            <span>{closeLabel}</span>
          </button>
        </div>
      </div>

      <style jsx global>{`
        .cookie-consent {
          position: fixed;
          left: 16px;
          bottom: 16px;
          z-index: 960;

          display: flex;
          align-items: flex-start;
          gap: 12px;

          width: min(420px, calc(100vw - 32px));
          padding: 14px 16px;

          background: #ffffff;
          color: #1f2937;
          border: 1px solid #e5e7eb;
          border-radius: 14px;
          box-shadow: 0 12px 32px rgba(0, 0, 0, 0.16);

          animation: cookieConsentRise 240ms cubic-bezier(0.22, 1, 0.36, 1);
        }

        .cookie-consent__icon {
          flex: 0 0 auto;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: #f0faf5;
          color: var(--green, #006833);
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }

        .cookie-consent__body {
          flex: 1 1 auto;
          min-width: 0;
        }

        .cookie-consent__message {
          margin: 0 0 10px;
          font-size: 13px;
          line-height: 1.5;
          color: #374151;
        }

        .cookie-consent__actions {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .cookie-consent__btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          padding: 8px 14px;
          border-radius: 8px;
          font-size: 12.5px;
          font-weight: 700;
          line-height: 1;
          cursor: pointer;
          border: 1px solid transparent;
          transition:
            background-color 180ms ease,
            color 180ms ease,
            border-color 180ms ease,
            transform 120ms ease;
        }

        .cookie-consent__btn:active { transform: translateY(1px); }
        .cookie-consent__btn:focus-visible {
          outline: 2px solid var(--green, #006833);
          outline-offset: 2px;
        }

        .cookie-consent__btn--accept {
          background: var(--green, #006833);
          color: #ffffff;
        }
        .cookie-consent__btn--accept:hover { background: #00582b; }

        .cookie-consent__btn--close {
          background: transparent;
          color: #4b5563;
          border-color: #e5e7eb;
        }
        .cookie-consent__btn--close:hover {
          background: #f3f4f6;
          color: #111827;
        }

        @keyframes cookieConsentRise {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: none; }
        }

        @media (max-width: 520px) {
          .cookie-consent {
            left: 12px;
            right: 12px;
            bottom: 12px;
            width: auto;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .cookie-consent { animation: none; }
          .cookie-consent__btn { transition: none; }
        }

        @media print {
          .cookie-consent { display: none !important; }
        }
      `}</style>
    </div>
  );
}
