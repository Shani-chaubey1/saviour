'use client';

import { useState } from 'react';
import { MessageSquare } from 'lucide-react';
import ContactPopup from './ContactPopup';

export default function EnquireFab({
  label = 'Enquire Now',
  popupTitle = 'Get in Touch',
  pageLabel = 'Floating Enquire',
  tabConnectLabel = '',
  tabVisitLabel = '',
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        className="enquire-fab"
        onClick={() => setOpen(true)}
        aria-label={label}
        aria-haspopup="dialog"
        aria-expanded={open}
      >
        <MessageSquare size={13} aria-hidden="true" className="enquire-fab__icon" />
        <span className="enquire-fab__text">{label}</span>
      </button>

      <ContactPopup
        open={open}
        onClose={() => setOpen(false)}
        title={popupTitle}
        pageLabel={pageLabel}
        tabConnectLabel={tabConnectLabel}
        tabVisitLabel={tabVisitLabel}
      />

      <style jsx global>{`
        .enquire-fab {
          position: fixed;
          right: 0;
          top: 50%;
          transform: translateY(-50%);
          z-index: 950;

          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 8px 8px;

          /* Vertical orientation — anchors flush to the right edge */
          writing-mode: vertical-rl;
          text-orientation: mixed;

          background: var(--green, #006833);
          color: #ffffff;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.03em;
          text-transform: uppercase;
          line-height: 1;

          border: none;
          border-radius: 10px 0 0 10px;
          box-shadow: 0 6px 18px rgba(0, 0, 0, 0.16);
          cursor: pointer;

          transition:
            transform 200ms cubic-bezier(0.22, 1, 0.36, 1),
            background-color 200ms ease,
            box-shadow 200ms ease;
        }

        .enquire-fab:hover {
          background: #00582b;
          transform: translateY(-50%) translateX(-3px);
          box-shadow: 0 12px 28px rgba(0, 0, 0, 0.22);
        }

        .enquire-fab:active {
          transform: translateY(-50%) translateX(-1px);
        }

        .enquire-fab:focus-visible {
          outline: 2px solid #ffffff;
          outline-offset: 2px;
          box-shadow:
            0 0 0 4px var(--green, #006833),
            0 12px 28px rgba(0, 0, 0, 0.22);
        }

        .enquire-fab__icon {
          /* Keep the icon upright while the text reads bottom-to-top */
          transform: rotate(180deg);
        }

        @media (max-width: 480px) {
          .enquire-fab {
            padding: 7px 6px;
            font-size: 10px;
            border-radius: 8px 0 0 8px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .enquire-fab,
          .enquire-fab:hover,
          .enquire-fab:active {
            transform: translateY(-50%);
            transition: background-color 200ms ease;
          }
        }

        @media print {
          .enquire-fab {
            display: none !important;
          }
        }
      `}</style>
    </>
  );
}
