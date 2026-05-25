"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import ContactForm from "./ContactForm";

export default function ContactPopup({
  open,
  onClose,
  title = "Get in Touch",
  pageLabel = "",
  tabConnectLabel = "",
  tabVisitLabel = "",
}) {
  const dialogRef = useRef(null);
  const previouslyFocusedRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;

    previouslyFocusedRef.current = document.activeElement;

    const handleKey = (e) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        onClose?.();
      }
      if (e.key === "Tab" && dialogRef.current) {
        const focusables = dialogRef.current.querySelectorAll(
          'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])',
        );
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          last.focus();
          e.preventDefault();
        } else if (!e.shiftKey && document.activeElement === last) {
          first.focus();
          e.preventDefault();
        }
      }
    };

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKey);

    const t = window.setTimeout(() => {
      const firstInput = dialogRef.current?.querySelector(
        "input, textarea, button",
      );
      firstInput?.focus();
    }, 30);

    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = prevOverflow;
      window.clearTimeout(t);
      if (previouslyFocusedRef.current?.focus) {
        previouslyFocusedRef.current.focus();
      }
    };
  }, [open, onClose]);

  if (!open) return null;
  if (typeof document === "undefined") return null;

  return createPortal(
    <div
      className="cp-overlay"
      role="presentation"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose?.();
      }}
    >
      <div
        ref={dialogRef}
        className="cp-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="cp-title"
      >
        <div className="cp-head">
          <h3 id="cp-title" className="cp-title">
            {title}
          </h3>
          <button
            type="button"
            className="cp-close"
            onClick={onClose}
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>
        <div className="cp-body">
          <ContactForm
            pageLabel={pageLabel}
            tabConnectLabel={tabConnectLabel}
            tabVisitLabel={tabVisitLabel}
          />
        </div>
      </div>
      <style jsx global>{`
        .cp-overlay {
          position: fixed;
          inset: 0;
          z-index: 1000;
          background: rgba(8, 16, 12, 0.62);
          backdrop-filter: blur(3px);
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          padding: 16px;
          animation: cpFade 0.18s ease-out;
        }
        .cp-dialog {
          background: white;
          border-radius: 16px;
          width: 100%;
          max-width: 480px;
          max-height: calc(100vh - 32px);
          overflow: hidden;
          display: flex !important;
          flex-direction: column !important;
          box-shadow: 0 24px 72px rgba(0, 0, 0, 0.35);
          animation: cpRise 0.22s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .cp-head {
          display: flex !important;
          align-items: center !important;
          justify-content: space-between;
          gap: 16px;
          padding: 18px 22px;
          border-bottom: 1px solid #f0f0f0;
        }
        .cp-title {
          font-size: 18px;
          font-weight: 800;
          color: #111;
          margin: 0;
        }
        .cp-close {
          width: 34px;
          height: 34px;
          border-radius: 50%;
          border: none;
          background: #f3f4f6;
          color: #374151;
          cursor: pointer;
          display: inline-flex !important;
          align-items: center !important;
          justify-content: center !important;
          transition:
            background 0.2s,
            color 0.2s;
        }
        .cp-close:hover {
          background: #e5e7eb;
          color: #111;
        }
        .cp-close:focus-visible {
          outline: 2px solid var(--green, #006833);
          outline-offset: 2px;
        }
        .cp-body {
          padding: 20px 22px 24px;
          overflow-y: auto;
        }
        @keyframes cpFade {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes cpRise {
          from {
            opacity: 0;
            transform: translateY(12px) scale(0.98);
          }
          to {
            opacity: 1;
            transform: none;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .cp-overlay,
          .cp-dialog {
            animation: none;
          }
        }
        @media (max-width: 480px) {
          .cp-head {
            padding: 14px 16px;
          }
          .cp-body {
            padding: 16px 16px 20px;
          }
        }
      `}</style>
    </div>,
    document.body,
  );
}
