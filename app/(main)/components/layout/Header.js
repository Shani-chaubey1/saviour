"use client";

import { ChevronDown, Menu, Phone, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

const NAV_ITEMS = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about-us" },
  {
    label: "Projects",
    href: "/projects",
    submenu: [
      { label: "Commercial Projects", href: "/projects?type=commercial" },
      { label: "Residential Projects", href: "/projects?type=residential" },
    ],
  },
  { label: "Blog", href: "/blog" },
  { label: "Contact Us", href: "/contact-us" },
];

export default function Header({ settings = {} }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileDropdown, setMobileDropdown] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  const handleScroll = useCallback(() => setScrolled(window.scrollY > 60), []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  useEffect(() => {
    setMobileOpen(false);
    setMobileDropdown(null);
  }, [pathname]);

  const isActive = (href) =>
    pathname === href || pathname.startsWith(href + "/");

  const ctaLabel = settings.header_cta_label || "Get in Touch";
  const ctaPhone = settings.site_phone || settings.site_phone_2 || "";
  const ctaTel = ctaPhone ? `tel:${ctaPhone.replace(/\s/g, "")}` : "";
  const ctaHref = ctaTel || settings.header_cta_url || "/contact-us";

  return (
    <>
      <header className={`lx-header${scrolled ? " lx-scrolled" : ""}`}>
        <div className="lx-header-inner container">
          {/* Logo */}
          <Link href="/" className="lx-logo">
            <Image
              src={settings.site_logo || 'https://saviourgroup.in/wp-content/uploads/2025/05/sb-logo.png'}
              alt={settings.site_name || 'Saviour Group'}
              width={160}
              height={52}
              className="lx-logo-img"
              priority
            />
          </Link>

          {/* Desktop Nav */}
          <nav className="lx-nav">
            {NAV_ITEMS.map((item) => (
              <div key={item.label} className="lx-nav-item">
                {item.submenu ? (
                  <>
                    <Link
                      href={item.href}
                      className={`lx-nav-link lx-has-sub${isActive(item.href) ? " lx-active" : ""}`}
                    >
                      {item.label}
                      <ChevronDown size={13} className="lx-chev" />
                    </Link>
                    <div className="lx-dropdown">
                      <div className="lx-dropdown-inner">
                        {item.submenu.map((sub) => (
                          <Link
                            key={sub.href}
                            href={sub.href}
                            className="lx-dd-item"
                          >
                            <span className="lx-dd-dot" />
                            {sub.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </>
                ) : (
                  <Link
                    href={item.href}
                    className={`lx-nav-link${isActive(item.href) ? " lx-active" : ""}`}
                  >
                    {item.label}
                  </Link>
                )}
              </div>
            ))}

            {ctaPhone ? (
              <a href={ctaHref} className="lx-cta-btn lx-cta-phone" aria-label={`${ctaPhone}`}>
                <span className="lx-cta-icon" aria-hidden="true">
                  <Phone size={16} />
                </span>
                <span className="lx-cta-text">
                  <span className="lx-cta-num">{ctaPhone}</span>
                </span>
              </a>
            ) : (
              <Link href={settings.header_cta_url || '/contact-us'} className="lx-cta-btn">
                {ctaLabel}
              </Link>
            )}
          </nav>

          {/* Mobile toggle */}
          <button
            className="lx-mob-toggle"
            onClick={() => setMobileOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile Nav */}
        {mobileOpen && (
          <nav className="lx-mob-nav">
            {NAV_ITEMS.map((item) => (
              <div key={item.label} className="lx-mob-item">
                {item.submenu ? (
                  <>
                    <button
                      className={`lx-mob-link lx-mob-toggle-btn${isActive(item.href) ? " lx-active" : ""}`}
                      onClick={() =>
                        setMobileDropdown((p) =>
                          p === item.label ? null : item.label,
                        )
                      }
                    >
                      {item.label}
                      <ChevronDown
                        size={14}
                        className={`lx-chev${mobileDropdown === item.label ? " lx-chev-open" : ""}`}
                      />
                    </button>
                    {mobileDropdown === item.label && (
                      <div className="lx-mob-sub">
                        {item.submenu.map((sub) => (
                          <Link
                            key={sub.href}
                            href={sub.href}
                            className="lx-mob-sub-link"
                          >
                            {sub.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <Link
                    href={item.href}
                    className={`lx-mob-link${isActive(item.href) ? " lx-active" : ""}`}
                  >
                    {item.label}
                  </Link>
                )}
              </div>
            ))}
            <div className="lx-mob-cta">
              {ctaPhone ? (
                <a
                  href={ctaHref}
                  className="lx-cta-btn lx-cta-phone"
                  aria-label={`${ctaPhone}`}
                >
                  <span className="lx-cta-icon" aria-hidden="true">
                    <Phone size={16} />
                  </span>
                  <span className="lx-cta-text">
                    <span className="lx-cta-num">{ctaPhone}</span>
                  </span>
                </a>
              ) : (
                <Link
                  href={settings.header_cta_url || "/contact-us"}
                  className="lx-cta-btn"
                  style={{ display: "inline-flex" }}
                >
                  {ctaLabel}
                </Link>
              )}
            </div>
          </nav>
        )}
      </header>

      <style jsx global>{`
        .lx-header {
          position: sticky;
          top: 0;
          z-index: 999;
          background: rgba(255, 255, 255, 0.97);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(0, 0, 0, 0.06);
          transition:
            box-shadow 0.3s ease,
            border-color 0.3s ease;
        }
        .lx-header.lx-scrolled {
          box-shadow: 0 4px 32px rgba(0, 0, 0, 0.1);
          border-bottom-color: rgba(201, 168, 76, 0.25);
        }

        .lx-header-inner {
          display: flex !important;
          align-items: center !important;
          justify-content: space-between;
          height: 76px;
          gap: 24px;
        }

        .lx-logo {
          display: flex;
          align-items: center;
          flex-shrink: 0;
          text-decoration: none;
        }
        .lx-logo-img {
          height: 52px;
          width: auto;
          object-fit: contain;
          transition: transform 0.3s;
        }
        .lx-logo:hover .lx-logo-img {
          transform: scale(1.03);
        }

        /* Desktop nav */
        .lx-nav {
          display: flex !important;
          align-items: center !important;
          gap: 4px;
        }

        .lx-nav-item {
          position: relative;
        }

        .lx-nav-link {
          display: flex !important;
          align-items: center !important;
          gap: 4px;
          padding: 9px 14px;
          font-size: 13.5px;
          font-weight: 600;
          color: #1f2937;
          text-decoration: none;
          border-radius: 6px;
          white-space: nowrap;
          transition:
            color 0.2s,
            background 0.2s;
          position: relative;
        }
        .lx-nav-link::after {
          content: "";
          position: absolute;
          bottom: 4px;
          left: 14px;
          right: 14px;
          height: 2px;
          background: linear-gradient(
            90deg,
            var(--green, #006833),
            var(--red, #eb3237)
          );
          border-radius: 1px;
          transform: scaleX(0);
          transition: transform 0.25s ease;
        }
        .lx-nav-link:hover,
        .lx-nav-link.lx-active {
          color: var(--green, #006833);
        }
        .lx-nav-link:hover::after,
        .lx-nav-link.lx-active::after {
          transform: scaleX(1);
        }
        .lx-nav-link:hover {
          background: var(--green-pale, #e8f5ee);
        }

        .lx-chev {
          transition: transform 0.2s;
          flex-shrink: 0;
        }
        .lx-nav-item:hover .lx-has-sub .lx-chev {
          transform: rotate(180deg);
        }
        .lx-chev.lx-chev-open {
          transform: rotate(180deg) !important;
        }

        /* Dropdown — padding-top bridges the gap so hover doesn't break */
        .lx-dropdown {
          position: absolute;
          top: 100%;
          left: 0;
          min-width: 230px;
          z-index: 100;
          padding-top: 10px;
          opacity: 0;
          visibility: hidden;
          transform: translateY(-6px);
          transition:
            opacity 0.22s ease,
            transform 0.22s ease,
            visibility 0.22s ease;
          pointer-events: none;
        }
        .lx-nav-item:hover .lx-dropdown {
          opacity: 1;
          visibility: visible;
          transform: translateY(0);
          pointer-events: auto;
        }
        .lx-dropdown-inner {
          background: white;
          border-radius: 10px;
          border: 1px solid rgba(0, 0, 0, 0.08);
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.14);
          overflow: hidden;
        }
        .lx-dd-item {
          display: flex !important;
          align-items: center !important;
          gap: 10px;
          padding: 13px 18px;
          font-size: 13px;
          font-weight: 600;
          color: #374151;
          text-decoration: none;
          border-bottom: 1px solid #f3f4f6;
          transition: all 0.18s;
        }
        .lx-dd-item:last-child {
          border-bottom: none;
        }
        .lx-dd-item:hover {
          background: var(--green-pale, #e8f5ee);
          color: var(--green, #006833);
          padding-left: 22px;
        }
        .lx-dd-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--red, #eb3237);
          flex-shrink: 0;
        }

        /* CTA button */
        .lx-cta-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 10px 22px;
          background: linear-gradient(
            135deg,
            var(--green, #006833),
            var(--green-dark, #004d26)
          );
          color: white;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 700;
          text-decoration: none;
          margin-left: 8px;
          white-space: nowrap;
          transition: all 0.25s;
          box-shadow: 0 4px 14px rgba(0, 104, 51, 0.3);
        }
        .lx-cta-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(0, 104, 51, 0.4);
          background: linear-gradient(
            135deg,
            var(--green-light, #00a04d),
            var(--green, #006833)
          );
        }

        .lx-cta-phone {
          padding: 8px 16px 8px 12px;
          gap: 10px;
          align-items: center;
        }
        .lx-cta-icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.15);
          color: white;
          flex-shrink: 0;
        }
        .lx-cta-text {
          display: inline-flex;
          flex-direction: column;
          align-items: flex-start;
          line-height: 1.15;
          text-align: left;
        }
        .lx-cta-label {
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.6px;
          text-transform: uppercase;
          opacity: 0.85;
        }
        .lx-cta-num {
          font-size: 14px;
          font-weight: 800;
          letter-spacing: 0.2px;
        }

        /* Mobile toggle */
        .lx-mob-toggle {
          display: none;
          width: 40px;
          height: 40px;
          border-radius: 8px;
          background: var(--gray-100, #f3f4f6);
          border: 1px solid var(--gray-200, #e5e7eb);
          color: #374151;
          cursor: pointer;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: background 0.15s;
        }
        .lx-mob-toggle:hover {
          background: var(--green-pale, #e8f5ee);
          color: var(--green, #006833);
        }

        /* Mobile nav */
        .lx-mob-nav {
          background: white;
          border-top: 1px solid var(--gray-100, #f3f4f6);
          padding: 8px 0 20px;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
        }
        .lx-mob-item {
          border-bottom: 1px solid var(--gray-100, #f3f4f6);
        }
        .lx-mob-item:last-child {
          border-bottom: none;
        }

        .lx-mob-link,
        .lx-mob-toggle-btn {
          display: flex !important;
          align-items: center !important;
          justify-content: space-between;
          width: 100%;
          padding: 14px 24px;
          font-size: 14px;
          font-weight: 600;
          color: #374151;
          text-decoration: none;
          background: none;
          border: none;
          cursor: pointer;
          text-align: left;
          transition: color 0.15s;
        }
        .lx-mob-link:hover,
        .lx-mob-link.lx-active,
        .lx-mob-toggle-btn:hover,
        .lx-mob-toggle-btn.lx-active {
          color: var(--green, #006833);
        }

        .lx-mob-sub {
          background: var(--gray-50, #f9fafb);
          border-top: 1px solid var(--gray-100, #f3f4f6);
        }
        .lx-mob-sub-link {
          display: block;
          padding: 11px 32px;
          font-size: 13px;
          font-weight: 500;
          color: #6b7280;
          text-decoration: none;
          border-bottom: 1px solid var(--gray-100, #f3f4f6);
          transition:
            color 0.15s,
            background 0.15s;
        }
        .lx-mob-sub-link:last-child {
          border-bottom: none;
        }
        .lx-mob-sub-link:hover {
          color: var(--green, #006833);
          background: var(--green-pale, #e8f5ee);
        }

        .lx-mob-cta {
          padding: 16px 24px;
        }

        @media (max-width: 1024px) {
          .lx-nav {
            display: none !important;
          }
          .lx-mob-toggle {
            display: flex !important;
          }
          .lx-header-inner {
            height: 68px;
          }
        }
      `}</style>
    </>
  );
}
