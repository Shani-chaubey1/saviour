'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  FaBars, FaUserCircle, FaSignOutAlt, FaChevronDown, FaBell,
} from 'react-icons/fa';

const BREADCRUMB_MAP = {
  '/admin': 'Dashboard',
  '/admin/projects': 'Projects',
  '/admin/projects/new': 'New Project',
  '/admin/blogs': 'Blogs',
  '/admin/blogs/new': 'New Blog Post',
  '/admin/pages': 'Pages',
  '/admin/pages/home': 'Homepage & site',
  '/admin/testimonials': 'Testimonials',
  '/admin/property-types': 'Property Types',
  '/admin/amenities': 'Amenities',
  '/admin/specifications': 'Specifications',
  '/admin/admins': 'Admins',
  '/admin/admins/new': 'New Admin',
  '/admin/enquiries': 'Enquiries',
  '/admin/profile': 'My Profile',
};

function getPageTitle(pathname) {
  if (BREADCRUMB_MAP[pathname]) return BREADCRUMB_MAP[pathname];
  if (pathname.includes('/projects/')) return 'Edit Project';
  if (pathname.includes('/blogs/')) return 'Edit Blog Post';
  if (pathname.includes('/admins/')) return 'Edit Admin';
  if (pathname.includes('/testimonials/')) return 'Edit Testimonial';
  if (pathname.startsWith('/admin/pages/')) {
    const seg = pathname.replace('/admin/pages/', '');
    if (seg === 'home') return 'Homepage & site';
    if (seg === 'about-us') return 'About Us';
    if (seg === 'contact-us') return 'Contact Us';
    if (seg === 'blog') return 'Blog listing';
    return 'Edit page';
  }
  return 'Admin Panel';
}

export default function AdminHeader({ admin, onMenuToggle }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const pageTitle = getPageTitle(pathname);

  const handleLogout = async () => {
    setDropdownOpen(false);
    await fetch('/api/admin/auth/logout', { method: 'POST' });
    router.push('/admin/login');
    router.refresh();
  };

  const initials = admin?.name
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || 'AD';

  return (
    <>
      <header className="ah-header">
        {/* Left */}
        <div className="ah-left">
          <button className="ah-hamburger" onClick={onMenuToggle} aria-label="Toggle menu">
            <FaBars size={16} />
          </button>
          <div className="ah-title-wrap">
            <h1 className="ah-page-title">{pageTitle}</h1>
            <p className="ah-breadcrumb">Admin / {pageTitle}</p>
          </div>
        </div>

        {/* Right */}
        <div className="ah-right">
          <div className="ah-user-wrap">
            <button className="ah-user-trigger" onClick={() => setDropdownOpen(!dropdownOpen)}>
              <div className="ah-avatar">
                {admin?.avatar
                  ? <img src={admin.avatar} alt={admin.name} className="ah-avatar-img" />
                  : <span>{initials}</span>
                }
              </div>
              <div className="ah-user-text">
                <span className="ah-user-name">{admin?.name || 'Admin'}</span>
                <span className="ah-user-role">
                  {admin?.role === 'super_admin' ? 'Super Admin' : 'Admin'}
                </span>
              </div>
              <FaChevronDown size={10} className={`ah-chevron${dropdownOpen ? ' ah-chevron-open' : ''}`} />
            </button>

            {dropdownOpen && (
              <>
                <div className="ah-dd-backdrop" onClick={() => setDropdownOpen(false)} />
                <div className="ah-dropdown">
                  <div className="ah-dd-head">
                    <div className="ah-dd-avatar">{initials}</div>
                    <div className="ah-dd-info">
                      <p className="ah-dd-name">{admin?.name || 'Admin'}</p>
                      <p className="ah-dd-email">{admin?.email || ''}</p>
                    </div>
                  </div>
                  <div className="ah-divider" />
                  <Link
                    href="/admin/profile"
                    className="ah-dd-item"
                    onClick={() => setDropdownOpen(false)}
                  >
                    <span className="ah-dd-icon ah-dd-icon-green"><FaUserCircle size={13} /></span>
                    My Profile
                  </Link>
                  <div className="ah-divider" />
                  <button className="ah-dd-item ah-dd-item-red" onClick={handleLogout}>
                    <span className="ah-dd-icon ah-dd-icon-red"><FaSignOutAlt size={13} /></span>
                    Sign Out
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </header>

      <style jsx global>{`
        .ah-header {
          position: sticky;
          top: 0;
          height: 64px;
          background: #ffffff;
          border-bottom: 1px solid #e5e9f0;
          display: flex !important;
          flex-direction: row !important;
          align-items: center !important;
          justify-content: space-between;
          padding: 0 24px;
          z-index: 30;
          box-shadow: 0 2px 10px rgba(0, 30, 15, 0.07);
          gap: 16px;
          box-sizing: border-box;
        }

        /* ── Left ── */
        .ah-left {
          display: flex !important;
          flex-direction: row !important;
          align-items: center !important;
          gap: 14px;
          min-width: 0;
        }
        .ah-hamburger {
          display: none;
          width: 36px;
          height: 36px;
          min-width: 36px;
          border-radius: 8px;
          background: #f3f5f7;
          border: 1px solid #e5e9f0;
          cursor: pointer;
          align-items: center;
          justify-content: center;
          color: #4b5563;
          flex-shrink: 0;
          transition: background 0.15s;
        }
        .ah-hamburger:hover { background: #e8ecf0; }
        .ah-title-wrap {
          display: flex !important;
          flex-direction: column !important;
          gap: 1px;
          min-width: 0;
        }
        .ah-page-title {
          font-size: 17px;
          font-weight: 800;
          color: #0f1923;
          line-height: 1.2;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          margin: 0;
          padding: 0;
        }
        .ah-breadcrumb {
          font-size: 11px;
          color: #9ca3af;
          white-space: nowrap;
          margin: 0;
        }

        /* ── Right ── */
        .ah-right {
          display: flex !important;
          flex-direction: row !important;
          align-items: center !important;
          gap: 8px;
          flex-shrink: 0;
        }
        .ah-bell-btn {
          position: relative;
          width: 36px;
          height: 36px;
          border-radius: 9px;
          background: #f3f5f7;
          border: 1px solid #e5e9f0;
          cursor: pointer;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          color: #6b7280;
          transition: all 0.15s;
          flex-shrink: 0;
        }
        .ah-bell-btn:hover { background: #e8ecf0; color: #374151; }
        .ah-notif-dot {
          position: absolute;
          top: 7px;
          right: 7px;
          width: 7px;
          height: 7px;
          background: #eb3237;
          border-radius: 50%;
          border: 1.5px solid white;
        }

        /* ── User trigger ── */
        .ah-user-wrap { position: relative; }
        .ah-user-trigger {
          display: flex !important;
          flex-direction: row !important;
          align-items: center !important;
          gap: 10px;
          background: linear-gradient(135deg, #edf8f2, #daf2e5);
          border: 1.5px solid #a8dbbe;
          border-radius: 10px;
          padding: 7px 12px 7px 8px;
          cursor: pointer;
          transition: all 0.18s;
          white-space: nowrap;
        }
        .ah-user-trigger:hover {
          background: linear-gradient(135deg, #daf2e5, #c8ecdb);
          border-color: #6abf93;
          box-shadow: 0 2px 10px rgba(0, 104, 51, 0.14);
        }
        .ah-avatar {
          width: 32px;
          height: 32px;
          min-width: 32px;
          border-radius: 8px;
          background: linear-gradient(135deg, #004d26, #006833);
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          color: white;
          font-size: 12px;
          font-weight: 700;
          flex-shrink: 0;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(0, 104, 51, 0.3);
        }
        .ah-avatar-img { width: 100%; height: 100%; object-fit: cover; display: block; }
        .ah-user-text {
          display: flex !important;
          flex-direction: column !important;
          text-align: left;
          gap: 1px;
        }
        .ah-user-name {
          font-size: 13px;
          font-weight: 700;
          color: #04401e;
          line-height: 1.2;
          white-space: nowrap;
          display: block;
        }
        .ah-user-role {
          font-size: 10.5px;
          color: #3a8a5c;
          white-space: nowrap;
          display: block;
        }
        .ah-chevron {
          color: #3a8a5c;
          transition: transform 0.2s ease;
          flex-shrink: 0;
        }
        .ah-chevron.ah-chevron-open { transform: rotate(180deg); }

        /* ── Dropdown ── */
        .ah-dd-backdrop {
          position: fixed;
          inset: 0;
          z-index: 49;
        }
        .ah-dropdown {
          position: absolute;
          top: calc(100% + 8px);
          right: 0;
          background: white;
          border-radius: 12px;
          border: 1px solid #e5e9f0;
          box-shadow: 0 10px 36px rgba(0, 30, 15, 0.15), 0 2px 8px rgba(0, 0, 0, 0.06);
          min-width: 220px;
          z-index: 50;
          overflow: hidden;
          animation: ahDropIn 0.18s ease;
        }
        @keyframes ahDropIn {
          from { opacity: 0; transform: translateY(-6px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0)  scale(1); }
        }

        /* Dropdown header */
        .ah-dd-head {
          display: flex !important;
          flex-direction: row !important;
          align-items: center !important;
          gap: 10px;
          padding: 14px 16px;
          background: linear-gradient(135deg, #edf8f2, #daf2e5);
        }
        .ah-dd-avatar {
          width: 38px;
          height: 38px;
          min-width: 38px;
          border-radius: 9px;
          background: linear-gradient(135deg, #003d20, #006833);
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          color: white;
          font-size: 14px;
          font-weight: 800;
          flex-shrink: 0;
          box-shadow: 0 2px 8px rgba(0, 104, 51, 0.28);
        }
        .ah-dd-info {
          display: flex !important;
          flex-direction: column !important;
          gap: 1px;
          min-width: 0;
        }
        .ah-dd-name {
          font-size: 13.5px;
          font-weight: 700;
          color: #04401e;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          margin: 0;
        }
        .ah-dd-email {
          font-size: 11px;
          color: #6b7280;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          margin: 0;
        }

        .ah-divider { height: 1px; background: #f0f2f5; }

        .ah-dd-item {
          display: flex !important;
          flex-direction: row !important;
          align-items: center !important;
          gap: 10px;
          padding: 11px 16px;
          font-size: 13.5px;
          font-weight: 500;
          color: #374151;
          text-decoration: none !important;
          width: 100%;
          background: none;
          border: none;
          cursor: pointer;
          transition: background 0.15s;
          text-align: left;
          white-space: nowrap;
          box-sizing: border-box;
        }
        .ah-dd-item:hover { background: #f7f8fa; }
        .ah-dd-item.ah-dd-item-red { color: #dc2626; }
        .ah-dd-item.ah-dd-item-red:hover { background: #fef2f2; }

        .ah-dd-icon {
          width: 26px;
          height: 26px;
          min-width: 26px;
          border-radius: 6px;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          flex-shrink: 0;
        }
        .ah-dd-icon-green { background: #e6f5ed; color: #006833; }
        .ah-dd-icon-red   { background: #fef2f2; color: #dc2626; }

        /* ── Mobile ── */
        @media (max-width: 768px) {
          .ah-hamburger { display: flex !important; }
          .ah-page-title { font-size: 15px; }
          .ah-breadcrumb { display: none; }
          .ah-user-text { display: none !important; }
          .ah-chevron { display: none; }
          .ah-user-trigger { padding: 6px; border-radius: 8px; gap: 0; }
        }
      `}</style>
    </>
  );
}
