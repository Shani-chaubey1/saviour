'use client';

export default function SectionHeading({ title, subtitle, centered = false, light = false }) {
  return (
    <div className={`sh-wrap${centered ? ' sh-c' : ''}${light ? ' sh-l' : ''}`}>
      <div className="sh-eyebrow">
        <span className="sh-accent-line" />
        <span className="sh-label">— {title} —</span>
        <span className="sh-accent-line" />
      </div>
      <h2 className="sh-title">{title}</h2>
      <div className="sh-divider" />
      {subtitle && <p className="sh-sub">{subtitle}</p>}

      <style jsx global>{`
        .sh-wrap { margin-bottom: 48px; }
        .sh-c { text-align: center; }
        .sh-c .sh-divider { margin-left: auto; margin-right: auto; }
        .sh-c .sh-sub { margin-left: auto; margin-right: auto; }
        .sh-c .sh-eyebrow { justify-content: center; }

        .sh-eyebrow {
          display: flex !important;
          align-items: center !important;
          gap: 10px;
          margin-bottom: 10px;
        }
        .sh-accent-line {
          height: 1px;
          width: 40px;
          background: var(--red, #eb3237);
          opacity: 0.5;
          flex-shrink: 0;
        }
        .sh-label {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 2.5px;
          text-transform: uppercase;
          color: var(--red, #eb3237);
        }
        .sh-l .sh-label { color: rgba(255,255,255,0.6); }
        .sh-l .sh-accent-line { background: rgba(255,255,255,0.3); }

        .sh-title {
          font-size: clamp(26px, 3.5vw, 42px);
          font-weight: 900;
          color: #111;
          letter-spacing: -0.5px;
          line-height: 1.15;
          margin-bottom: 0;
        }
        .sh-l .sh-title { color: #ffffff; }

        .sh-divider {
          width: 56px;
          height: 4px;
          background: linear-gradient(90deg, var(--green, #006833), var(--red, #eb3237));
          border-radius: 2px;
          margin: 14px 0 16px;
        }

        .sh-sub {
          font-size: 16px;
          color: #555;
          line-height: 1.75;
          max-width: 580px;
        }
        .sh-l .sh-sub { color: rgba(255,255,255,0.6); }
      `}</style>
    </div>
  );
}
