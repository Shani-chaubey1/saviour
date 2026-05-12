'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  FaHome, FaBuilding, FaNewspaper, FaFileAlt, FaCommentDots,
  FaTag, FaListUl, FaClipboardList, FaUsers, FaEnvelopeOpenText,
  FaCog, FaUserCircle, FaChevronRight,
} from 'react-icons/fa';

const NAV_GROUPS = [
  {
    label: 'Overview',
    items: [{ href: '/admin', label: 'Dashboard', icon: FaHome }],
  },
  {
    label: 'Content',
    items: [
      { href: '/admin/projects', label: 'Projects', icon: FaBuilding },
      { href: '/admin/blogs', label: 'Blogs', icon: FaNewspaper },
      { href: '/admin/pages', label: 'Pages', icon: FaFileAlt },
      { href: '/admin/testimonials', label: 'Testimonials', icon: FaCommentDots },
    ],
  },
  {
    label: 'Master Data',
    items: [
      { href: '/admin/property-types', label: 'Property Types', icon: FaTag },
      { href: '/admin/amenities', label: 'Amenities', icon: FaListUl },
      { href: '/admin/specifications', label: 'Specifications', icon: FaClipboardList },
    ],
  },
  {
    label: 'Users & Leads',
    items: [
      { href: '/admin/admins', label: 'Admins', icon: FaUsers },
      { href: '/admin/enquiries', label: 'Enquiries', icon: FaEnvelopeOpenText },
    ],
  },
  {
    label: 'System',
    items: [
      { href: '/admin/pages/home', label: 'Homepage & site', icon: FaCog },
      { href: '/admin/profile', label: 'My Profile', icon: FaUserCircle },
    ],
  },
];

export default function Sidebar({ isOpen, onClose }) {
  const pathname = usePathname();

  const isActive = (href) => {
    if (href === '/admin') return pathname === '/admin';
    return pathname.startsWith(href);
  };

  return (
    <>
      {isOpen && <div className="sb-overlay" onClick={onClose} />}

      <aside className={`sb-sidebar ${isOpen ? 'sb-open' : ''}`}>
        {/* Logo */}
        <div className="sb-logo-area">
          <Link href="/admin" className="sb-logo-link" onClick={onClose}>
            <div className="sb-logo-badge">S</div>
            <div className="sb-logo-text">
              <span className="sb-logo-name">Saviour</span>
              <span className="sb-logo-sub">Admin Panel</span>
            </div>
          </Link>
        </div>

        {/* Nav */}
        <nav className="sb-nav">
          {NAV_GROUPS.map((group) => (
            <div key={group.label} className="sb-nav-group">
              <span className="sb-group-label">{group.label}</span>
              {group.items.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`sb-nav-item${active ? ' sb-active' : ''}`}
                    onClick={onClose}
                  >
                    <span className={`sb-icon-wrap${active ? ' sb-icon-active' : ''}`}>
                      <Icon size={14} />
                    </span>
                    <span className="sb-nav-label">{item.label}</span>
                    {active && <FaChevronRight size={9} className="sb-chevron" />}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="sb-footer">
          <div className="sb-footer-inner">
            <div className="sb-dot" />
            <span className="sb-footer-text">Saviour Group © 2026</span>
          </div>
        </div>
      </aside>

      <style jsx global>{`
        /* ── Overlay ── */
        .sb-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.45);
          z-index: 39;
          display: none;
          backdrop-filter: blur(2px);
        }

        /* ── Sidebar shell ── */
        .sb-sidebar {
          position: fixed;
          top: 0;
          left: 0;
          height: 100vh;
          width: 260px;
          background: linear-gradient(175deg, #002e18 0%, #004d26 30%, #006833 65%, #007a3d 100%);
          display: flex !important;
          flex-direction: column !important;
          z-index: 40;
          overflow: hidden;
          transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 4px 0 32px rgba(0, 0, 0, 0.3);
        }
        .sb-sidebar::before {
          content: '';
          position: absolute;
          top: -80px;
          right: -80px;
          width: 200px;
          height: 200px;
          background: radial-gradient(circle, rgba(255, 255, 255, 0.06) 0%, transparent 70%);
          pointer-events: none;
        }
        .sb-sidebar::after {
          content: '';
          position: absolute;
          bottom: -60px;
          left: -60px;
          width: 160px;
          height: 160px;
          background: radial-gradient(circle, rgba(235, 50, 55, 0.1) 0%, transparent 70%);
          pointer-events: none;
        }

        /* ── Logo ── */
        .sb-logo-area {
          padding: 18px 16px 16px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          flex-shrink: 0;
          background: rgba(0, 0, 0, 0.15);
        }
        .sb-logo-link {
          display: flex !important;
          flex-direction: row !important;
          align-items: center !important;
          gap: 12px;
          text-decoration: none !important;
        }
        .sb-logo-badge {
          width: 42px;
          height: 42px;
          min-width: 42px;
          background: linear-gradient(135deg, #eb3237, #c01a1e);
          border-radius: 10px;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          color: white;
          font-size: 22px;
          font-weight: 900;
          flex-shrink: 0;
          box-shadow: 0 4px 14px rgba(235, 50, 55, 0.45);
          letter-spacing: -1px;
        }
        .sb-logo-text {
          display: flex !important;
          flex-direction: column !important;
          gap: 2px;
          min-width: 0;
        }
        .sb-logo-name {
          color: #ffffff;
          font-size: 16px;
          font-weight: 800;
          line-height: 1.2;
          display: block;
        }
        .sb-logo-sub {
          color: rgba(255, 255, 255, 0.45);
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 1.2px;
          font-weight: 500;
          display: block;
        }

        /* ── Nav ── */
        .sb-nav {
          flex: 1;
          padding: 8px 0 16px;
          overflow-y: auto;
          scrollbar-width: none;
        }
        .sb-nav::-webkit-scrollbar { display: none; }

        .sb-nav-group { margin-bottom: 2px; }

        .sb-group-label {
          display: block;
          color: rgba(255, 255, 255, 0.35);
          font-size: 9.5px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1.5px;
          padding: 14px 20px 5px;
        }

        /* Critical: nav item row layout */
        .sb-nav-item {
          display: flex !important;
          flex-direction: row !important;
          align-items: center !important;
          flex-wrap: nowrap !important;
          gap: 11px;
          padding: 9px 14px 9px 18px;
          color: rgba(255, 255, 255, 0.72);
          text-decoration: none !important;
          font-size: 13.5px;
          font-weight: 400;
          transition: all 0.18s ease;
          border-left: 3px solid transparent;
          position: relative;
          margin: 1px 0;
          width: 100%;
          box-sizing: border-box;
        }
        .sb-nav-item:hover {
          color: #ffffff;
          background: rgba(255, 255, 255, 0.09);
          border-left-color: rgba(255, 255, 255, 0.35);
          text-decoration: none !important;
        }
        .sb-nav-item.sb-active {
          color: #ffffff;
          background: rgba(255, 255, 255, 0.14);
          border-left-color: #eb3237;
          font-weight: 600;
        }

        /* Icon badge */
        .sb-icon-wrap {
          width: 30px;
          height: 30px;
          min-width: 30px;
          border-radius: 7px;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          background: rgba(255, 255, 255, 0.1);
          flex-shrink: 0;
          transition: all 0.18s;
          color: rgba(255, 255, 255, 0.75);
        }
        .sb-nav-item:hover .sb-icon-wrap {
          background: rgba(255, 255, 255, 0.16);
          color: white;
        }
        .sb-icon-wrap.sb-icon-active {
          background: linear-gradient(135deg, #eb3237, #c01a1e);
          color: white;
          box-shadow: 0 3px 10px rgba(235, 50, 55, 0.45);
        }

        .sb-nav-label {
          flex: 1;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .sb-chevron {
          color: rgba(255, 255, 255, 0.5);
          flex-shrink: 0;
        }

        /* ── Footer ── */
        .sb-footer {
          padding: 12px 20px;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          flex-shrink: 0;
          background: rgba(0, 0, 0, 0.12);
        }
        .sb-footer-inner {
          display: flex !important;
          align-items: center !important;
          gap: 8px;
        }
        .sb-dot {
          width: 7px;
          height: 7px;
          min-width: 7px;
          border-radius: 50%;
          background: #4ade80;
          box-shadow: 0 0 7px rgba(74, 222, 128, 0.85);
        }
        .sb-footer-text {
          color: rgba(255, 255, 255, 0.3);
          font-size: 10.5px;
        }

        /* ── Mobile ── */
        @media (max-width: 768px) {
          .sb-overlay { display: block; }
          .sb-sidebar { transform: translateX(-100%); }
          .sb-sidebar.sb-open { transform: translateX(0); }
        }
      `}</style>
    </>
  );
}
