"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import { ArrowRight, MapPin, CheckCircle } from "lucide-react";
import SectionHeading from "../ui/SectionHeading";
import PropertyCard from "../ui/PropertyCard";
import BlogCard from "../ui/BlogCard";
import TestimonialCard from "../ui/TestimonialCard";
import ContactForm from "../shared/ContactForm";
import { parseJsonArray } from "@/lib/cmsJson";

/* ─────────────────────────────────────────
   1. Quick Search / Filter Bar
───────────────────────────────────────── */
export function SearchBar() {
  const [filters, setFilters] = useState({
    status: "",
    type: "",
    location: "",
    budget: "",
  });

  const set = (k, v) => setFilters((f) => ({ ...f, [k]: v }));

  const buildUrl = () => {
    const p = new URLSearchParams();
    if (filters.type) p.set("type", filters.type);
    if (filters.status) p.set("status", filters.status);
    if (filters.location) p.set("location", filters.location);
    if (filters.budget) p.set("budget", filters.budget);
    return `/projects?${p.toString()}`;
  };

  return (
    <div className="srch-root">
      <div className="container srch-inner">
        <div className="srch-fields">
          <div className="srch-field">
            <label className="srch-label">Project Status</label>
            <select
              className="srch-select"
              value={filters.status}
              onChange={(e) => set("status", e.target.value)}
            >
              <option value="">Any</option>
              <option value="On Going">On Going</option>
              <option value="Possession Soon">Possession Soon</option>
              <option value="Under Construction">Under Construction</option>
              <option value="Ready To Move">Ready To Move</option>
            </select>
          </div>
          <div className="srch-field">
            <label className="srch-label">Project Type</label>
            <select
              className="srch-select"
              value={filters.type}
              onChange={(e) => set("type", e.target.value)}
            >
              <option value="">Any</option>
              <option value="commercial">Commercial</option>
              <option value="residential">Residential</option>
            </select>
          </div>
          <div className="srch-field">
            <label className="srch-label">Location</label>
            <select
              className="srch-select"
              value={filters.location}
              onChange={(e) => set("location", e.target.value)}
            >
              <option value="">Any</option>
              <option value="Yamuna Expressway">Yamuna Expressway</option>
              <option value="Greater Noida West">Greater Noida West</option>
              <option value="Noida Extension">Noida Extension</option>
              <option value="Crossings Republik">Crossings Republik</option>
              <option value="Mohan Nagar">Mohan Nagar</option>
            </select>
          </div>
          <div className="srch-field">
            <label className="srch-label">Budget</label>
            <select
              className="srch-select"
              value={filters.budget}
              onChange={(e) => set("budget", e.target.value)}
            >
              <option value="">Any</option>
              <option value="0-30">Under ₹30 Lacs</option>
              <option value="30-60">₹30 – ₹60 Lacs</option>
              <option value="60-100">₹60 Lacs – ₹1 Cr</option>
              <option value="100+">₹1 Cr+</option>
            </select>
          </div>
          <Link href={buildUrl()} className="srch-btn">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
            Search
          </Link>
        </div>
      </div>
      <style jsx global>{`
        .srch-root {
          background: var(--green, #006833);
          padding: 28px 0;
          box-shadow: 0 6px 24px rgba(0, 104, 51, 0.25);
        }
        .srch-inner {
        }
        .srch-fields {
          display: flex !important;
          align-items: flex-end !important;
          gap: 12px;
          flex-wrap: wrap;
        }
        .srch-field {
          display: flex !important;
          flex-direction: column !important;
          gap: 6px;
          flex: 1;
          min-width: 140px;
        }
        .srch-label {
          font-size: 10px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1.2px;
          color: rgba(255, 255, 255, 0.7);
        }
        .srch-select {
          height: 44px;
          border: 1.5px solid rgba(255, 255, 255, 0.25);
          border-radius: 6px;
          background: rgba(255, 255, 255, 0.1);
          color: white;
          padding: 0 12px;
          font-size: 13.5px;
          font-weight: 500;
          cursor: pointer;
          transition: border-color 0.2s;
          appearance: none;
          backdrop-filter: blur(4px);
        }
        .srch-select:focus {
          outline: none;
          border-color: white;
          background: rgba(255, 255, 255, 0.18);
        }
        .srch-select option {
          background: var(--green-dark, #004d26);
          color: white;
        }
        .srch-btn {
          display: inline-flex !important;
          align-items: center !important;
          justify-content: center !important;
          gap: 8px;
          height: 44px;
          padding: 0 28px;
          background: var(--red, #eb3237);
          color: white;
          border-radius: 6px;
          font-size: 13px;
          font-weight: 800;
          text-decoration: none;
          white-space: nowrap;
          transition: all 0.2s;
          flex-shrink: 0;
          letter-spacing: 0.3px;
        }
        .srch-btn:hover {
          background: var(--red-dark, #c01a1e);
          transform: translateY(-1px);
        }
        @media (max-width: 768px) {
          .srch-fields {
            flex-direction: column;
          }
          .srch-field {
            min-width: 100%;
          }
        }
      `}</style>
    </div>
  );
}

/* ─────────────────────────────────────────
   2. Certifications / RERA + CREDAI Banner
───────────────────────────────────────── */
export function CertificationsSection({ settings = {} }) {
  const heading =
    settings.cert_heading || "RERA Registered Projects & Member of CREDAI";
  const logo1 = settings.cert_logo_1 || "";
  const logo1Alt = settings.cert_logo_1_alt || "RERA Approved";
  const logo2 = settings.cert_logo_2 || "";
  const logo2Alt = settings.cert_logo_2_alt || "Member of CREDAI";
  const partnerLogos = (settings.cert_partner_logos || "")
    .split("\n")
    .map((u) => u.trim())
    .filter(Boolean);

  return (
    <section className="cert-root">
      <div className="container">
        {/* Heading */}
        <h2 className="cert-heading">{heading}</h2>

        {/* Two main cert logos */}
        {(logo1 || logo2) && (
          <div className="cert-logos">
            {logo1 && (
              <div className="cert-logo-wrap">
                <img src={logo1} alt={logo1Alt} className="cert-logo-img" />
              </div>
            )}
            {logo2 && (
              <div className="cert-logo-wrap">
                <img src={logo2} alt={logo2Alt} className="cert-logo-img" />
              </div>
            )}
          </div>
        )}

        {/* Partner / project logos strip */}
        {partnerLogos.length > 0 && (
          <>
            <div className="cert-partners">
              {partnerLogos.map((src, i) => (
                <div key={i} className="cert-partner-item">
                  <img
                    src={src}
                    alt={`Partner ${i + 1}`}
                    className="cert-partner-img"
                  />
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      <style jsx global>{`
        .cert-root {
          background: #ffffff;
          padding: 30px 0 20px;
          border-bottom: 1px solid #f0f0f0;
        }

        /* Heading */
        .cert-heading {
          text-align: center;
          font-size: clamp(20px, 5.4vw, 40px);
          font-weight: 900;
          color: var(--green, #006833);
          margin-bottom: 10px;
          letter-spacing: -0.3px;
        }

        /* Two cert logos */
        .cert-logos {
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          gap: 24px;
          margin-bottom: 0;
          flex-wrap: wrap;
        }
        .cert-logo-wrap {
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          padding: 12px 24px;
        }
        .cert-logo-img {
          max-height: 140px;
          max-width: 220px;
          width: auto;
          display: block;
          transition: transform 0.2s;
        }
        .cert-logo-img:hover {
          transform: scale(1.04);
        }

        /* Divider */
        .cert-divider {
          width: 100%;
          height: 1px;
          background: linear-gradient(
            90deg,
            transparent,
            #e5e7eb 20%,
            #e5e7eb 80%,
            transparent
          );
          margin: 20px 0 36px;
        }

        /* Partner logos strip */
        .cert-partners {
          display: flex !important;
          flex-wrap: wrap !important;
          align-items: center !important;
          justify-content: center !important;
          gap: 12px 24px;
        }
        .cert-partner-item {
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          padding: 8px 12px;
          border-radius: 6px;
          transition: background 0.2s;
        }
        .cert-partner-item:hover {
          background: #f9fafb;
        }
        .cert-partner-img {
          max-height: 105px;
          max-width: 145px;
          width: auto;
          object-fit: contain;
          display: block;
          filter: grayscale(20%);
          opacity: 0.88;
          transition: all 0.2s;
        }
        .cert-partner-img:hover {
          filter: grayscale(0%);
          opacity: 1;
        }

        @media (max-width: 768px) {
          .cert-logos {
            gap: 32px;
          }
          .cert-logo-img {
            max-height: 80px;
            max-width: 180px;
          }
          .cert-partner-img {
            max-height: 38px;
            max-width: 110px;
          }
          .cert-partners {
            gap: 8px 16px;
          }
        }
      `}</style>
    </section>
  );
}

/* ─────────────────────────────────────────
   3. Trust / Intro Banner
───────────────────────────────────────── */
export function TrustBanner({ settings = {} }) {
  const fromJson = parseJsonArray(settings.trust_banner_stats_json, []).filter(
    (s) => String(s.num || "").trim() && String(s.label || "").trim(),
  );
  const stats =
    fromJson.length > 0
      ? fromJson.map((s) => ({
          num: String(s.num).trim(),
          label: String(s.label).trim(),
        }))
      : [
          { num: settings.stat_years || "25+", label: "Years of Experience" },
          { num: settings.stat_projects || "50+", label: "Projects Delivered" },
          { num: settings.stat_families || "10,000+", label: "Happy Families" },
          { num: settings.stat_assets || "₹500Cr+", label: "Assets Delivered" },
        ];
  return (
    <div className="tb-root">
      <div className="container tb-inner">
        <div className="tb-left">
          <div className="tb-tag">
            {settings.trust_tag || "A Name You Can Trust Upon"}
          </div>
          <h2 className="tb-title">
            {settings.site_name || "Saviour Builders"}
          </h2>
          <p className="tb-desc">
            {settings.trust_intro ||
              "Saviour Builders are one of the leading real estate developers in Delhi NCR, dedicated to the highest standards, systems and performance necessary to fulfill all of your real estate dreams."}
          </p>
          {/* <div className="tb-creds">
            {settings.trust_credential_1 && (
              <div className="tb-cred">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
                {settings.trust_credential_1}
              </div>
            )}
            {settings.trust_credential_2 && (
              <div className="tb-cred">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="12" cy="8" r="7" />
                  <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
                </svg>
                {settings.trust_credential_2}
              </div>
            )}
          </div> */}
        </div>
        <div className="tb-right">
          {stats.map((s) => (
            <div key={s.label} className="tb-stat">
              <span className="tb-stat-num">{s.num}</span>
              <span className="tb-stat-label">{s.label}</span>
            </div>
          ))}
        </div>
      </div>
      <style jsx global>{`
        .tb-root {
          background: #fff;
          padding: 32px 0;
          border-bottom: 1px solid #f0f0f0;
        }
        .tb-inner {
          display: grid !important;
          grid-template-columns: 1.2fr 1fr;
          gap: 72px;
          align-items: center;
        }
        .tb-tag {
          display: inline-block;
          background: var(--red-pale, #fef2f2);
          color: var(--red, #eb3237);
          font-size: 11px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 2px;
          padding: 6px 16px;
          border-radius: 4px;
          margin-bottom: 16px;
        }
        .tb-title {
          font-size: clamp(32px, 4vw, 52px);
          font-weight: 900;
          color: #111;
          line-height: 1.1;
          margin-bottom: 20px;
        }
        .tb-desc {
          font-size: 15px;
          color: #555;
          line-height: 1.85;
          margin-bottom: 28px;
        }
        .tb-creds {
          display: flex !important;
          gap: 20px;
          flex-wrap: wrap;
        }
        .tb-cred {
          display: flex !important;
          align-items: center !important;
          gap: 8px;
          background: var(--green-pale, #e8f5ee);
          color: var(--green-dark, #004d26);
          padding: 10px 16px;
          border-radius: 6px;
          font-size: 13px;
          font-weight: 700;
        }
        .tb-cred svg {
          color: var(--green, #006833);
          flex-shrink: 0;
        }
        .tb-right {
          display: grid !important;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 1px;
          background: #e8e8e8;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.07);
        }
        .tb-stat {
          background: white;
          padding: 32px 24px;
          display: flex !important;
          flex-direction: column !important;
          align-items: center;
          gap: 6px;
          transition: background 0.2s;
        }
        .tb-stat:hover {
          background: var(--green-pale, #e8f5ee);
        }
        .tb-stat-num {
          font-size: clamp(28px, 3.5vw, 42px);
          font-weight: 900;
          color: var(--green, #006833);
          line-height: 1;
        }
        .tb-stat-label {
          font-size: 12px;
          color: #666;
          text-transform: uppercase;
          letter-spacing: 0.8px;
          text-align: center;
        }
        @media (max-width: 1024px) {
          .tb-inner {
            grid-template-columns: 1fr;
            gap: 48px;
          }
        }
      `}</style>
    </div>
  );
}

/* ─────────────────────────────────────────
   3. About Section
───────────────────────────────────────── */
export function AboutSection({ settings = {}, willShowFull = true }) {
  const img =
    settings.about_image ||
    "https://saviourgroup.in/wp-content/uploads/2025/05/about.png";
  const fullImg = settings.about_full_image || "";
  const badgeNum = settings.about_badge_num || "25+";
  const badgeTxt = settings.about_badge_text || "Years of Excellence";
  const heading = settings.about_heading || "About Us";
  const subtitle =
    settings.about_subtitle ||
    "Building dreams and delivering excellence across Delhi-NCR since 1999.";
  const desc1 =
    settings.about_desc_1 ||
    "M/s Saviour Builders Pvt. Ltd. (Saviour Group) is one of the leading real estate developers in Delhi-NCR.";
  const desc2 =
    settings.about_desc_2 ||
    "From building small residential projects to creating multi-dimensional mega townships, the Saviour Group has done it all.";
  const points = (
    settings.about_points ||
    "Quality Policy\nOn-Time Delivery\nTransparent Dealings\nAfter-Sales Support"
  )
    .split("\n")
    .map((p) => p.trim())
    .filter(Boolean);
  const ctaLabel = settings.about_cta_label || "Read Our Story";
  const ctaUrl = settings.about_cta_url || "/about-us";

  return (
    <section className={`as-root ${!willShowFull ? "hide-padding" : ""}`}>
      {willShowFull && (
        <div className="container as-inner">
          <div className="as-img-col">
            <div className="as-frame">
              <Image
                src={img}
                alt="About Saviour Group"
                fill
                className="as-img"
                sizes="(max-width:768px) 100vw, 50vw"
              />
              <div className="as-img-overlay" />
            </div>
            <div className="as-badge">
              <span className="as-badge-num">{badgeNum}</span>
              <span className="as-badge-txt">{badgeTxt}</span>
            </div>
          </div>
          <div className="as-content">
            <SectionHeading title={heading} subtitle={subtitle} />
            <p className="as-text">{desc1}</p>
            <p className="as-text">{desc2}</p>
            <div className="as-points">
              {points.map((p) => (
                <div key={p} className="as-point">
                  <div className="as-point-dot">
                    <svg
                      width="10"
                      height="10"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3.5"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                  {p}
                </div>
              ))}
            </div>
            <Link href={ctaUrl} className="as-btn">
              {ctaLabel} <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      )}
      {fullImg && (
        <div
          className={`as-full-wrap ${!willShowFull ? "hide-margin-top" : ""}`}
        >
          <Image
            src={fullImg}
            alt={`${heading} banner`}
            fill
            className=""
            sizes="100vw"
            style={{ padding: "28px" }}
          />
        </div>
      )}
      <style jsx global>{`
        .hide-padding {
          padding: 0 !important;
        }
        .as-root {
          padding: 30px 0;
          background: var(--green-pale, #e8f5ee);
        }
        .as-inner {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 72px;
          align-items: center;
        }
        .as-img-col {
          position: relative;
        }
        .as-frame {
          position: relative;
          height: 500px;
          border-radius: 14px;
          overflow: hidden;
          box-shadow: 0 20px 64px rgba(0, 104, 51, 0.2);
        }
        .as-img {
          object-fit: cover;
        }
        .as-img-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            135deg,
            rgba(0, 104, 51, 0.15),
            transparent
          );
        }
        .as-badge {
          position: absolute;
          bottom: -20px;
          right: -20px;
          background: var(--green, #006833);
          color: white;
          border-radius: 12px;
          padding: 20px 24px;
          display: flex !important;
          align-items: center !important;
          gap: 12px;
          box-shadow: 0 12px 40px rgba(0, 104, 51, 0.35);
        }
        .as-badge-num {
          font-size: 36px;
          font-weight: 900;
          line-height: 1;
        }
        .as-badge-txt {
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          opacity: 0.85;
          line-height: 1.5;
        }
        .as-content {
          padding-bottom: 20px;
        }
        .as-text {
          font-size: 15px;
          color: #444;
          line-height: 1.85;
          margin-bottom: 16px;
        }
        .as-points {
          display: grid !important;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 12px 16px;
          margin: 24px 0 32px;
          max-width: 100%;
        }
        .as-point {
          display: flex !important;
          align-items: center !important;
          gap: 10px;
          font-size: 13.5px;
          font-weight: 600;
          color: #222;
        }
        .as-point-dot {
          width: 22px;
          height: 22px;
          min-width: 22px;
          border-radius: 50%;
          background: var(--green, #006833);
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          color: white;
          flex-shrink: 0;
        }
        .as-btn {
          display: inline-flex !important;
          align-items: center !important;
          gap: 10px;
          background: linear-gradient(
            135deg,
            var(--green, #006833),
            var(--green-dark, #004d26)
          );
          color: white;
          padding: 14px 30px;
          border-radius: 8px;
          font-weight: 700;
          font-size: 14px;
          text-decoration: none;
          transition: all 0.25s;
          box-shadow: 0 6px 20px rgba(0, 104, 51, 0.3);
        }
        .as-btn:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 32px rgba(0, 104, 51, 0.4);
        }
        .as-full-wrap {
          position: relative;
          width: 100%;
          height: max(240px, min(46vw, 560px));
          margin-top: 56px;
          border-top: 1px solid rgba(0, 104, 51, 0.12);
          border-bottom: 1px solid rgba(0, 104, 51, 0.12);
          overflow: hidden;
        }
        .as-full-img {
          object-fit: cover;
          object-position: center;
        }
        .hide-margin-top {
          margin-top: 0;
        }
        @media (max-width: 1024px) {
          .as-inner {
            grid-template-columns: 1fr;
            gap: 48px;
          }
          .as-frame {
            height: 360px;
          }
          .as-badge {
            right: 0;
            bottom: 0;
          }
        }
      `}</style>
    </section>
  );
}

/* ─────────────────────────────────────────
   4. Mission & Vision
───────────────────────────────────────── */
export function MissionVisionSection({ settings = {} }) {
  const cards = [
    {
      cls: "mv-mission",
      icon: (
        <svg
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <circle cx="12" cy="12" r="10" />
          <circle cx="12" cy="12" r="6" />
          <circle cx="12" cy="12" r="2" />
        </svg>
      ),
      iconCls: "mv-icon-green",
      title: settings.mission_title || "Our Mission",
      text:
        settings.mission_desc ||
        "To provide an outstanding level of Houses & service to our buyers, dedicated to the highest standards and performance necessary to fulfill all of your real estate dreams.",
    },
    {
      cls: "mv-vision",
      icon: (
        <svg
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      ),
      iconCls: "mv-icon-red",
      title: settings.vision_title || "Our Vision",
      text:
        settings.vision_desc ||
        'We believe real estate is more than just building four walls — it\'s about "Building a Better Life".',
    },
    {
      cls: "mv-quality",
      icon: (
        <svg
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
      ),
      iconCls: "mv-icon-green",
      title: settings.quality_title || "Quality Policy",
      text:
        settings.quality_desc ||
        "We are committed to delight our customers by improving their quality of life through ethical practices and continuous improvement.",
    },
  ];
  return (
    <section className="mv-root">
      <div className="container mv-grid">
        {cards.map((c) => (
          <div key={c.title} className={`mv-card ${c.cls}`}>
            <div className="mv-card-inner">
              <div className={`mv-icon-wrap ${c.iconCls}`}>{c.icon}</div>
              <h3 className="mv-title">{c.title}</h3>
            </div>
            <p className="mv-text">{c.text}</p>
          </div>
        ))}
      </div>
      <style jsx global>{`
        .mv-card-inner {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 10px;
        }
        .mv-root {
          padding: 30px 0;
          background: #fff;
        }
        .mv-grid {
          display: grid !important;
          grid-template-columns: repeat(3, 1fr);
          gap: 28px;
        }
        .mv-card {
          padding: 40px 32px;
          border-radius: 14px;
          background: #fafafa;
          border: 1px solid #eee;
          transition: all 0.3s;
        }
        .mv-card:hover {
          box-shadow: 0 16px 48px rgba(0, 0, 0, 0.1);
          transform: translateY(-6px);
        }
        .mv-mission:hover {
          border-color: var(--green, #006833);
        }
        .mv-vision:hover {
          border-color: var(--red, #eb3237);
        }
        .mv-quality:hover {
          border-color: var(--green, #006833);
        }
        .mv-icon-wrap {
          width: 26px;
          height: 26px;
          border-radius: 14px;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
        }
        .mv-icon-green {
          color: var(--green, #006833);
        }
        .mv-icon-red {
          color: var(--red, #eb3237);
        }
        .mv-title {
          font-size: 20px;
          font-weight: 800;
          color: #111;
        }
        .mv-text {
          font-size: 14.5px;
          color: #555;
          line-height: 1.8;
        }
        @media (max-width: 768px) {
          .mv-grid {
            grid-template-columns: 1fr;
            gap: 20px;
          }
        }
      `}</style>
    </section>
  );
}

/* ─────────────────────────────────────────
   5. Projects Section
───────────────────────────────────────── */
export function ProjectsSection({ projects, settings = {} }) {
  return (
    <section className="prs-root">
      <div className="container">
        <div className="prs-header">
          <SectionHeading
            title={
              settings.projects_section_title || "Current & Future Projects"
            }
            subtitle={
              settings.projects_section_subtitle ||
              "We build value. We build you."
            }
          />
          <div className="prs-tabs">
            <Link href="/projects" className="prs-tab prs-tab-active">
              All Projects
            </Link>
            <Link href="/projects?type=residential" className="prs-tab">
              Residential
            </Link>
            <Link href="/projects?type=commercial" className="prs-tab">
              Commercial
            </Link>
          </div>
        </div>
        <div className="prs-grid">
          {projects.map((p) => (
            <PropertyCard key={p._id?.toString() ?? p.slug} project={p} />
          ))}
        </div>
        <div className="prs-cta-row">
          <Link href="/projects" className="prs-cta-btn">
            {settings.projects_section_cta || "View All Projects"}{" "}
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
      <style jsx global>{`
        .prs-root {
          padding: 30px 0;
          background: #f7f9f8;
        }
        .prs-header {
          display: flex !important;
          align-items: flex-end !important;
          justify-content: space-between;
          margin-bottom: 40px;
          flex-wrap: wrap;
          gap: 16px;
        }
        .prs-header .sh-wrap {
          margin-bottom: 0;
        }
        .prs-tabs {
          display: flex !important;
          gap: 4px;
          background: white;
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          padding: 4px;
        }
        .prs-tab {
          padding: 8px 18px;
          border-radius: 6px;
          font-size: 13px;
          font-weight: 600;
          color: #555;
          text-decoration: none;
          transition: all 0.2s;
          white-space: nowrap;
        }
        .prs-tab:hover {
          background: var(--green-pale, #e8f5ee);
          color: var(--green, #006833);
        }
        .prs-tab-active {
          background: var(--green, #006833);
          color: white;
        }
        .prs-tab-active:hover {
          background: var(--green-dark, #004d26);
          color: white;
        }
        .prs-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 28px;
          margin-bottom: 48px;
        }
        .prs-cta-row {
          text-align: center;
        }
        .prs-cta-btn {
          display: inline-flex !important;
          align-items: center !important;
          gap: 10px;
          border: 2px solid var(--green, #006833);
          color: var(--green, #006833);
          padding: 13px 32px;
          border-radius: 8px;
          font-weight: 700;
          font-size: 14px;
          text-decoration: none;
          transition: all 0.25s;
        }
        .prs-cta-btn:hover {
          background: var(--green, #006833);
          color: white;
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(0, 104, 51, 0.3);
        }
        @media (max-width: 1024px) {
          .prs-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          .prs-header {
            flex-direction: column;
            align-items: flex-start;
          }
        }
        @media (max-width: 640px) {
          .prs-grid {
            grid-template-columns: 1fr;
            gap: 20px;
          }
        }
      `}</style>
    </section>
  );
}

/* ─────────────────────────────────────────
   5b. Townships ("Our Presence in Leading Townships")
───────────────────────────────────────── */
export function TownshipsSection({ townships = [], settings = {} }) {
  if (!townships?.length) return null;

  const ctaLabel = settings.townships_section_cta_label || "View Projects";

  return (
    <section className="twn-root">
      <div className="container">
        <SectionHeading
          centered
          title={
            settings.townships_section_title ||
            "Our Presence in Leading Townships"
          }
          subtitle={
            settings.townships_section_subtitle ||
            "Discover signature developments across Delhi-NCR\u2019s most desirable corridors."
          }
        />

        <div className="twn-grid">
          {townships.map((t, i) => {
            const num = String(i + 1).padStart(2, "0");
            const hasLink = Boolean(t.link);
            const CardEl = hasLink ? Link : "div";
            const cardProps = hasLink
              ? { href: t.link, className: "twn-card twn-card-link" }
              : { className: "twn-card" };

            return (
              <CardEl key={t._id ?? `${t.area}-${i}`} {...cardProps}>
                <div className="twn-media">
                  {t.image ? (
                    <img
                      src={t.image}
                      alt={t.area || ""}
                      className="twn-img"
                      loading="lazy"
                    />
                  ) : (
                    <div className="twn-img-fallback" aria-hidden="true">
                      <MapPin size={40} strokeWidth={1.5} />
                    </div>
                  )}
                  <span className="twn-number" aria-hidden="true">
                    {num}
                  </span>
                  <span className="twn-pin" aria-hidden="true">
                    <MapPin size={22} strokeWidth={2.2} />
                  </span>
                </div>
                <div className="twn-body">
                  {(t.line1 || t.line2) && (
                    <div className="twn-lines">
                      {t.line1 && (
                        <span className="twn-line">
                          <CheckCircle size={13} strokeWidth={2.4} aria-hidden="true" />
                          {t.line1}
                        </span>
                      )}
                      {t.line2 && (
                        <span className="twn-line">
                          <CheckCircle size={13} strokeWidth={2.4} aria-hidden="true" />
                          {t.line2}
                        </span>
                      )}
                    </div>
                  )}
                  <h3 className="twn-area">{t.area}</h3>
                  {t.city && <p className="twn-city">{t.city}</p>}
                  <span className="twn-divider" aria-hidden="true" />
                  <span className="twn-cta">
                    {ctaLabel}
                    <ArrowRight size={14} />
                  </span>
                </div>
              </CardEl>
            );
          })}
        </div>
      </div>

      <style jsx global>{`
        .twn-root {
          padding: 30px 0 30px;
          background: #ffffff;
        }
        .twn-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 28px;
        }
        .twn-card {
          position: relative;
          display: flex !important;
          flex-direction: column !important;
          background: var(--green-dark, #004d26);
          border-radius: 14px;
          overflow: hidden;
          color: #ffffff;
          text-decoration: none !important;
          box-shadow: 0 10px 28px rgba(0, 104, 51, 0.12);
          transition:
            transform 0.35s cubic-bezier(0.22, 1, 0.36, 1),
            box-shadow 0.35s ease;
          isolation: isolate;
        }
        .twn-card-link:hover {
          transform: translateY(-6px);
          box-shadow: 0 22px 48px rgba(0, 104, 51, 0.28);
        }
        .twn-card-link:focus-visible {
          outline: 3px solid var(--red, #eb3237);
          outline-offset: 3px;
        }

        .twn-media {
          position: relative;
          width: 100%;
          aspect-ratio: 16 / 11;
          overflow: hidden;
          background: var(--green, #006833);
        }
        .twn-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 0.6s ease;
        }
        .twn-card-link:hover .twn-img {
          transform: scale(1.06);
        }
        .twn-img-fallback {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: rgba(255, 255, 255, 0.45);
          background: linear-gradient(
            135deg,
            var(--green, #006833),
            var(--green-dark, #004d26)
          );
        }

        /* Numbered badge */
        .twn-number {
          position: absolute;
          top: 12px;
          left: 12px;
          width: 38px;
          height: 38px;
          border-radius: 50%;
          background: rgba(0, 77, 38, 0.85);
          color: #ffffff;
          border: 1.5px solid var(--red, #eb3237);
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 0.5px;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          backdrop-filter: blur(4px);
          z-index: 2;
        }

        /* Floating pin where image meets dark body */
        .twn-pin {
          position: absolute;
          left: 50%;
          bottom: -22px;
          transform: translateX(-50%);
          width: 46px;
          height: 46px;
          border-radius: 50%;
          background: var(--green-dark, #004d26);
          color: #ffffff;
          border: 2px solid var(--red, #eb3237);
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          box-shadow: 0 6px 14px rgba(0, 0, 0, 0.25);
          z-index: 3;
        }

        .twn-body {
          padding: 36px 24px 22px;
          text-align: center;
          display: flex !important;
          flex-direction: column !important;
          align-items: center !important;
          gap: 6px;
        }
        .twn-lines {
          display: flex !important;
          flex-direction: column !important;
          align-items: center !important;
          gap: 5px;
          margin-bottom: 4px;
        }
        .twn-line {
          display: inline-flex !important;
          align-items: center !important;
          gap: 6px;
          font-size: 12.5px;
          font-weight: 600;
          line-height: 1.3;
          color: rgba(255, 255, 255, 0.82);
        }
        .twn-line svg {
          color: var(--red, #eb3237);
          flex-shrink: 0;
        }
        .twn-area {
          font-size: clamp(20px, 1.7vw, 24px);
          font-weight: 700;
          color: #ffffff;
          letter-spacing: -0.2px;
          line-height: 1.25;
          margin: 0;
        }
        .twn-city {
          font-size: 13.5px;
          color: rgba(255, 255, 255, 0.62);
          letter-spacing: 0.2px;
          margin: 0;
        }
        .twn-divider {
          display: block;
          width: 56px;
          height: 1px;
          background: rgba(255, 255, 255, 0.18);
          margin: 14px auto 8px;
        }
        .twn-cta {
          display: inline-flex !important;
          align-self: flex-end !important;
          align-items: center !important;
          gap: 8px;
          font-size: 11.5px;
          font-weight: 700;
          letter-spacing: 1.8px;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.78);
          transition:
            color 0.25s ease,
            gap 0.25s ease;
        }
        .twn-card-link:hover .twn-cta {
          color: var(--red-light, #ff4d52);
          gap: 12px;
        }

        @media (max-width: 1024px) {
          .twn-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 22px;
          }
        }
        @media (max-width: 640px) {
          .twn-root {
            padding: 40px 0 48px;
          }
          .twn-grid {
            grid-template-columns: 1fr;
            gap: 20px;
          }
          .twn-body {
            padding: 32px 20px 20px;
          }
        }
      `}</style>
    </section>
  );
}

/* ─────────────────────────────────────────
   6. Why Choose Us (3 pillars)
───────────────────────────────────────── */
export function WhyUsSection({ settings = {} }) {
  const pillars = [
    {
      icon: settings.why_1_icon || "🏆",
      title: settings.why_1_title || "Quality Policy",
      desc:
        settings.why_1_desc ||
        "We are committed to delight our customers by improving their quality of life through ethical practices and continuous improvement.",
      color: "green",
    },
    {
      icon: settings.why_2_icon || "🌿",
      title: settings.why_2_title || "Green & Clean Environment",
      desc:
        settings.why_2_desc ||
        'Each urban area of Saviour Builders is built on the basis of "A place where living is in harmony with nature" — with greeneries, parks, and water surfaces arranged harmoniously.',
      color: "red",
    },
    {
      icon: settings.why_3_icon || "💎",
      title: settings.why_3_title || "We Build Value",
      desc:
        settings.why_3_desc ||
        "With our projects spanning residential, commercial and corporate construction, we aim to deliver excellence and comfort with fairness and transparency.",
      color: "green",
    },
  ];
  return (
    <section className="wu-root">
      <div className="container">
        <SectionHeading
          title="Why Choose Us"
          subtitle={
            settings.why_section_subtitle ||
            "Providing quality spaces through continuous innovation."
          }
          centered
          light
        />
        <div className="wu-grid">
          {pillars.map((p, i) => (
            <div key={p.title} className={`wu-card wu-${p.color}`}>
              <div className="wu-num">0{i + 1}</div>
              <div className="wu-icon">{p.icon}</div>
              <h3 className="wu-title">{p.title}</h3>
              <p className="wu-desc">{p.desc}</p>
              <div className={`wu-line wu-line-${p.color}`} />
            </div>
          ))}
        </div>
      </div>
      <style jsx global>{`
        .wu-root {
          padding: 30px 0;
          background: linear-gradient(
            160deg,
            var(--dark-900, #020c05) 0%,
            var(--dark-800, #041208) 60%,
            var(--dark-700, #062010) 100%
          );
        }
        .wu-grid {
          display: grid !important;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
        }
        .wu-card {
          padding: 40px 32px;
          border-radius: 14px;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.08);
          transition: all 0.3s;
          position: relative;
          overflow: hidden;
        }
        .wu-card:hover {
          background: rgba(255, 255, 255, 0.08);
          transform: translateY(-6px);
        }
        .wu-green:hover {
          border-color: rgba(0, 104, 51, 0.5);
        }
        .wu-red:hover {
          border-color: rgba(235, 50, 55, 0.5);
        }
        .wu-num {
          font-size: 64px;
          font-weight: 900;
          color: rgba(255, 255, 255, 0.04);
          position: absolute;
          top: 12px;
          right: 20px;
          line-height: 1;
        }
        .wu-icon {
          font-size: 40px;
          margin-bottom: 18px;
          display: block;
        }
        .wu-title {
          font-size: 20px;
          font-weight: 800;
          color: white;
          margin-bottom: 14px;
        }
        .wu-desc {
          font-size: 14px;
          color: rgba(255, 255, 255, 0.55);
          line-height: 1.8;
          margin-bottom: 24px;
        }
        .wu-line {
          height: 3px;
          border-radius: 2px;
          width: 40px;
        }
        .wu-line-green {
          background: var(--green, #006833);
        }
        .wu-line-red {
          background: var(--red, #eb3237);
        }
        @media (max-width: 1024px) {
          .wu-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @media (max-width: 640px) {
          .wu-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}

/* ─────────────────────────────────────────
   7. Launching Soon Banner
───────────────────────────────────────── */
export function LaunchingSoonBanner({ data = {} }) {
  const badge = data.launching_soon_badge || "Launching Soon";
  const title = data.launching_soon_title || "Vridhi+ Premium Tower";
  const desc =
    data.launching_soon_desc ||
    "Step into your dream world where luxury meets lifestyle. Surrounded by a lush 7.5-acre park, Vridhi+ Premium Tower offers an eco-friendly environment, grand commercial spaces, and beautifully crafted 3 & 4 BHK premium residences — limited to just 192 units.";
  const tags = (
    data.launching_soon_tags ||
    "🌳 7.5-Acre Park,🏠 3 & 4 BHK,✨ 192 Units Only,🏙️ Premium Location"
  ).split(",");
  const ctaLabel = data.launching_soon_cta_label || "Register Your Interest";
  const ctaUrl = data.launching_soon_cta_url || "/contact-us";
  const secLabel = data.launching_soon_secondary_label || "View All Projects";
  const secUrl = data.launching_soon_secondary_url || "/projects";

  return (
    <div className="ls-root">
      <div className="container ls-outer">
        <div className="ls-glass">
          <div className="ls-badge">
            <span className="ls-badge-dot" />
            {badge}
          </div>
          <h2 className="ls-title">{title}</h2>
          <p className="ls-sub">{desc}</p>
          <div className="ls-actions">
            <Link href={ctaUrl} className="ls-btn-primary">
              {ctaLabel}
            </Link>
          </div>
        </div>
      </div>
      <style jsx global>{`
        .ls-root {
          padding: 30px 0;
          background: linear-gradient(
            135deg,
            #f0faf5 0%,
            #e8f5ee 40%,
            #fef2f2 100%
          );
          position: relative;
          overflow: hidden;
        }
        .ls-root::before {
          content: "";
          position: absolute;
          top: -80px;
          right: -80px;
          width: 400px;
          height: 400px;
          border-radius: 50%;
          background: radial-gradient(
            circle,
            rgba(0, 104, 51, 0.08) 0%,
            transparent 70%
          );
          pointer-events: none;
        }
        .ls-root::after {
          content: "";
          position: absolute;
          bottom: -60px;
          left: -60px;
          width: 320px;
          height: 320px;
          border-radius: 50%;
          background: radial-gradient(
            circle,
            rgba(235, 50, 55, 0.07) 0%,
            transparent 70%
          );
          pointer-events: none;
        }
        .ls-outer {
          position: relative;
          z-index: 1;
        }
        .ls-glass {
          background: rgba(255, 255, 255, 0.7);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.9);
          border-radius: 24px;
          padding: 30px 30px;
          text-align: center;
          max-width: 860px;
          margin: 0 auto;
          box-shadow:
            0 8px 48px rgba(0, 104, 51, 0.1),
            0 2px 8px rgba(0, 0, 0, 0.04);
        }
        .ls-badge {
          display: inline-flex !important;
          align-items: center !important;
          gap: 8px;
          background: var(--red-pale, #fef2f2);
          color: var(--red, #eb3237);
          border: 1px solid rgba(235, 50, 55, 0.2);
          padding: 6px 18px;
          border-radius: 20px;
          font-size: 11px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 2px;
          margin-bottom: 22px;
        }
        .ls-badge-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: var(--red, #eb3237);
          animation: lsDotPulse 1.4s ease-in-out infinite;
        }
        @keyframes lsDotPulse {
          0%,
          100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.4;
            transform: scale(0.75);
          }
        }
        .ls-title {
          font-size: clamp(28px, 4.5vw, 52px);
          font-weight: 900;
          color: #111;
          line-height: 1.15;
          margin-bottom: 18px;
        }
        .ls-title span {
          color: var(--green, #006833);
        }
        .ls-sub {
          font-size: 15.5px;
          color: #555;
          line-height: 1.85;
          max-width: 680px;
          margin: 0 auto 28px;
        }
        .ls-tags {
          display: flex !important;
          justify-content: center !important;
          gap: 10px;
          flex-wrap: wrap;
          margin-bottom: 36px;
        }
        .ls-tag {
          background: white;
          color: #333;
          border: 1px solid #e0e0e0;
          padding: 8px 18px;
          border-radius: 20px;
          font-size: 13px;
          font-weight: 600;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        }
        .ls-actions {
          display: flex !important;
          justify-content: center !important;
          gap: 14px;
          flex-wrap: wrap;
        }
        .ls-btn-primary {
          display: inline-flex !important;
          align-items: center !important;
          padding: 14px 32px;
          background: linear-gradient(
            135deg,
            var(--green, #006833),
            var(--green-dark, #004d26)
          );
          color: white;
          border-radius: 8px;
          font-weight: 700;
          font-size: 14px;
          text-decoration: none;
          transition: all 0.25s;
          box-shadow: 0 6px 20px rgba(0, 104, 51, 0.3);
        }
        .ls-btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 32px rgba(0, 104, 51, 0.4);
        }
        .ls-btn-outline {
          display: inline-flex !important;
          align-items: center !important;
          padding: 14px 32px;
          border: 2px solid var(--green, #006833);
          color: var(--green, #006833);
          border-radius: 8px;
          font-weight: 700;
          font-size: 14px;
          text-decoration: none;
          transition: all 0.25s;
          background: transparent;
        }
        .ls-btn-outline:hover {
          background: var(--green, #006833);
          color: white;
          transform: translateY(-2px);
        }
        @media (max-width: 640px) {
          .ls-glass {
            padding: 40px 24px;
            border-radius: 16px;
          }
        }
      `}</style>
    </div>
  );
}

/* ─────────────────────────────────────────
   8. Residential & Commercial + Investor
───────────────────────────────────────── */
export function DevelopmentsSection({ settings = {} }) {
  const segments = [
    {
      title: settings.dev_1_title,
      desc: settings.dev_1_desc,
      link: settings.dev_1_link,
      img:
        settings.dev_1_image ||
        "https://saviourgroup.in/wp-content/uploads/2024/11/SAVVIOUR-1-1.png",
      tag: settings.dev_1_tag,
      color: "green",
    },
    {
      title: settings.dev_2_title,
      desc: settings.dev_2_desc,
      link: settings.dev_2_link,
      img:
        settings.dev_2_image ||
        "https://saviourgroup.in/wp-content/uploads/2024/11/mart.png",
      tag: settings.dev_2_tag,
      color: "green",
    },
    {
      title: settings.dev_3_title,
      desc: settings.dev_3_desc,
      link: settings.dev_3_link,
      img:
        settings.dev_3_image ||
        "https://saviourgroup.in/wp-content/uploads/2025/05/about.png",
      tag: settings.dev_3_tag,
      color: "green",
    },
  ];

  return (
    <section className="dev-root">
      <div className="container">
        <SectionHeading
          title={settings.dev_section_title || "Explore More"}
          subtitle={
            settings.dev_section_subtitle ||
            "Residential, commercial and investor opportunities across Delhi-NCR."
          }
          centered
        />
        <div className="dev-grid">
          {segments.map((s) => (
            <div key={s.title} className="dev-card">
              <div className="dev-img-wrap">
                <Image
                  src={s.img}
                  alt={s.title}
                  fill
                  className="dev-img"
                  sizes="(max-width:768px) 100vw, 33vw"
                />
                <div className="dev-img-overlay" />
              </div>
              <div className="dev-body">
                <h3 className="dev-title">{s.title}</h3>
                <p className="dev-desc">{s.desc}</p>
                <Link href={s.link} className={`dev-btn dev-btn-${s.color}`}>
                  Explore More <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
      <style jsx global>{`
        .dev-root {
          padding: 30px 0;
          background: white;
        }
        .dev-grid {
          display: grid !important;
          grid-template-columns: repeat(3, 1fr);
          gap: 28px;
        }
        .dev-card {
          border-radius: 14px;
          overflow: hidden;
          box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
          border: 1px solid #eee;
          transition:
            transform 0.3s,
            box-shadow 0.3s;
        }
        .dev-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 56px rgba(0, 0, 0, 0.14);
        }
        .dev-img-wrap {
          position: relative;
          height: 220px;
          overflow: hidden;
        }
        .dev-img {
          object-fit: cover;
          transition: transform 0.5s;
        }
        .dev-card:hover .dev-img {
          transform: scale(1.06);
        }
        .dev-img-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to bottom,
            transparent 40%,
            rgba(2, 45, 18, 0.65) 100%
          );
        }
        .dev-tag {
          position: absolute;
          bottom: 14px;
          left: 14px;
          padding: 4px 12px;
          border-radius: 4px;
          font-size: 10px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.8px;
        }
        .dev-tag-green {
          background: var(--green, #006833);
          color: white;
        }
        .dev-tag-red {
          background: var(--red, #eb3237);
          color: white;
        }
        .dev-body {
          padding: 24px;
        }
        .dev-title {
          font-size: 19px;
          font-weight: 800;
          color: #111;
          margin-bottom: 12px;
          line-height: 1.3;
        }
        .dev-desc {
          font-size: 13.5px;
          color: #555;
          line-height: 1.75;
          margin-bottom: 20px;
        }
        .dev-btn {
          display: inline-flex !important;
          align-items: center !important;
          gap: 8px;
          padding: 10px 22px;
          border-radius: 6px;
          font-size: 13px;
          font-weight: 700;
          text-decoration: none;
          transition: all 0.2s;
        }
        .dev-btn-green {
          background: var(--green-pale, #e8f5ee);
          color: var(--green, #006833);
        }
        .dev-btn-green:hover {
          background: var(--green, #006833);
          color: white;
        }
        .dev-btn-red {
          background: var(--red-pale, #fef2f2);
          color: var(--red, #eb3237);
        }
        .dev-btn-red:hover {
          background: var(--red, #eb3237);
          color: white;
        }
        @media (max-width: 1024px) {
          .dev-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @media (max-width: 640px) {
          .dev-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}

/* ─────────────────────────────────────────
   9. Blog Section
───────────────────────────────────────── */
export function BlogSection({ posts, settings = {} }) {
  return (
    <section className="bls-root">
      <div className="container">
        <div className="bls-header">
          <SectionHeading
            title={settings.blog_section_title || "News & Events"}
            subtitle={
              settings.blog_section_subtitle ||
              "From our blog — stay informed with the latest insights."
            }
          />
          <Link href="/blog" className="bls-all-link">
            {settings.blog_section_view_all || "View All"}{" "}
            <ArrowRight size={14} />
          </Link>
        </div>
        <div className="bls-grid">
          {posts.map((p) => (
            <BlogCard key={p._id?.toString() ?? p.slug} post={p} />
          ))}
        </div>
      </div>
      <style jsx global>{`
        .bls-root {
          padding: 30px 0;
          background: #f7f9f8;
        }
        .bls-header {
          display: flex !important;
          align-items: flex-end !important;
          justify-content: space-between;
          margin-bottom: 40px;
        }
        .bls-header .sh-wrap {
          margin-bottom: 0;
        }
        .bls-all-link {
          display: inline-flex !important;
          align-items: center !important;
          gap: 6px;
          font-size: 13px;
          font-weight: 700;
          color: var(--green, #006833);
          text-decoration: none;
          white-space: nowrap;
          padding-bottom: 4px;
          border-bottom: 2px solid var(--green-pale, #e8f5ee);
          transition: border-color 0.2s;
        }
        .bls-all-link:hover {
          border-color: var(--green, #006833);
        }
        .bls-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 28px;
        }
        @media (max-width: 1024px) {
          .bls-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          .bls-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 12px;
          }
        }
        @media (max-width: 640px) {
          .bls-grid {
            grid-template-columns: 1fr;
            gap: 20px;
          }
        }
      `}</style>
    </section>
  );
}

/* ─────────────────────────────────────────
   10. Testimonials
───────────────────────────────────────── */
const TESTIMONIALS_AUTOPLAY_MS = 3000;

function getTestimonialsPerPage(width) {
  if (width <= 640) return 1;
  if (width <= 1024) return 2;
  return 3;
}

export function TestimonialsSection({ testimonials = [], settings = {} }) {
  const slides = Array.isArray(testimonials) ? testimonials : [];
  const total = slides.length;
  const [perPage, setPerPage] = useState(3);
  const [active, setActive] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const update = () => setPerPage(getTestimonialsPerPage(window.innerWidth));
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const maxIndex = Math.max(0, total - perPage);

  useEffect(() => {
    if (active > maxIndex) setActive(0);
  }, [active, maxIndex]);

  const goTo = useCallback(
    (idx) => {
      const span = maxIndex + 1;
      if (span <= 1) return;
      const next = ((idx % span) + span) % span;
      setActive(next);
    },
    [maxIndex],
  );

  useEffect(() => {
    if (maxIndex === 0 || isPaused) return undefined;
    if (
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
    ) {
      return undefined;
    }
    const id = window.setInterval(() => {
      setActive((prev) => (prev >= maxIndex ? 0 : prev + 1));
    }, TESTIMONIALS_AUTOPLAY_MS);
    return () => window.clearInterval(id);
  }, [maxIndex, isPaused, active]);

  useEffect(() => {
    const handleVisibility = () => setIsPaused(document.hidden);
    document.addEventListener("visibilitychange", handleVisibility);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibility);
  }, []);

  if (total === 0) return null;

  const slideWidthPct = 100 / perPage;
  const dotsCount = maxIndex + 1;

  return (
    <section className="ts-root">
      <div className="container">
        <SectionHeading
          title={settings.testimonials_section_title || "What Clients Say"}
          subtitle={
            settings.testimonials_section_subtitle ||
            "Real stories from real buyers — this is what we live for."
          }
          centered
          light
        />
        <div
          className="ts-carousel"
          role="region"
          aria-roledescription="carousel"
          aria-label="Client testimonials"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onFocus={() => setIsPaused(true)}
          onBlur={() => setIsPaused(false)}
        >
          <div className="ts-viewport">
            <div
              className="ts-track"
              style={{ transform: `translateX(-${active * slideWidthPct}%)` }}
            >
              {slides.map((t, i) => {
                const isVisible = i >= active && i < active + perPage;
                return (
                  <div
                    key={t._id?.toString() ?? `${t.name}-${i}`}
                    className="ts-slide"
                    style={{ flex: `0 0 ${slideWidthPct}%` }}
                    role="group"
                    aria-roledescription="slide"
                    aria-label={`${i + 1} of ${total}`}
                    aria-hidden={!isVisible}
                  >
                    <TestimonialCard testimonial={t} />
                  </div>
                );
              })}
            </div>
          </div>
          {dotsCount > 1 && (
            <div
              className="ts-dots"
              role="tablist"
              aria-label="Select testimonial"
            >
              {Array.from({ length: dotsCount }).map((_, i) => (
                <button
                  key={`ts-dot-${i}`}
                  type="button"
                  className={`ts-dot${i === active ? " is-active" : ""}`}
                  onClick={() => goTo(i)}
                  role="tab"
                  aria-selected={i === active}
                  aria-label={`Go to testimonials ${i + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
      <style jsx global>{`
        .ts-root {
          padding: 30px 0;
          background: linear-gradient(
            160deg,
            var(--dark-700, #062010) 0%,
            var(--dark-800, #041208) 100%
          );
        }
        .ts-carousel {
          margin-top: 32px;
        }
        .ts-viewport {
          overflow: hidden;
        }
        .ts-track {
          display: flex;
          transition: transform 0.5s ease;
          will-change: transform;
        }
        .ts-slide {
          min-width: 0;
          padding: 4px 12px;
          box-sizing: border-box;
        }
        .ts-dots {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 10px;
          margin-top: 28px;
          flex-wrap: wrap;
        }
        .ts-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          border: none;
          padding: 0;
          cursor: pointer;
          background: rgba(255, 255, 255, 0.25);
          transition:
            background 0.2s ease,
            width 0.2s ease;
        }
        .ts-dot:hover {
          background: rgba(255, 255, 255, 0.5);
        }
        .ts-dot:focus-visible {
          outline: 2px solid var(--red, #eb3237);
          outline-offset: 3px;
        }
        .ts-dot.is-active {
          background: var(--red, #eb3237);
          width: 28px;
          border-radius: 999px;
        }
        @media (prefers-reduced-motion: reduce) {
          .ts-track {
            transition: none;
          }
        }
      `}</style>
    </section>
  );
}

/* ─────────────────────────────────────────
   11. Contact CTA Section
───────────────────────────────────────── */
export function ContactSection({ settings = {} }) {
  const phone = settings.site_phone || "+91 0120-4104506";
  const phone2 = settings.site_phone_2 || "+91 9206-001-002";
  const email = settings.site_email || "sales@saviourindia.com";
  const address =
    settings.site_address || "C Block-110, Sector 65, Noida – 201301";

  return (
    <section className="cs-root">
      <div className="container cs-inner">
        <div className="cs-info">
          <SectionHeading title="Get in Touch" light />
          <p className="cs-desc">
            {settings.contact_section_desc ||
              "Looking for your dream home or the perfect commercial investment? Our experts are ready to guide you through every step — from choosing the right property to final possession."}
          </p>
          <ul className="cs-list">
            {[
              {
                icon: "📞",
                label: "Phone (Toll Free)",
                val: phone,
                href: `tel:${phone.replace(/\s/g, "")}`,
              },
              {
                icon: "✉️",
                label: "Email",
                val: email,
                href: `mailto:${email}`,
              },
              { icon: "📍", label: "Office", val: address },
            ].map((item) => (
              <li key={item.label} className="cs-item">
                <div className="cs-icon">{item.icon}</div>
                <div>
                  <p className="cs-item-label">{item.label}</p>
                  {item.href ? (
                    <a href={item.href} className="cs-item-val">
                      {item.val}
                    </a>
                  ) : (
                    <span className="cs-item-val">{item.val}</span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="cs-form-col">
          <div className="cs-form-card">
            <h3 className="cs-form-title">
              {settings.contact_form_title || "Send a Message"}
            </h3>
            <ContactForm
              tabConnectLabel={settings.contact_form_tab_connect_label || ""}
              tabVisitLabel={settings.contact_form_tab_visit_label || ""}
            />
          </div>
        </div>
      </div>
      <style jsx global>{`
        .cs-root {
          padding: 30px 0;
          background: linear-gradient(
            135deg,
            var(--green-deep, #022d12) 0%,
            var(--dark-800, #041208) 100%
          );
        }
        .cs-inner {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 64px;
          align-items: start;
        }
        .cs-desc {
          font-size: 15px;
          color: rgba(255, 255, 255, 0.6);
          line-height: 1.85;
          margin-bottom: 36px;
        }
        .cs-list {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 18px;
        }
        .cs-item {
          display: flex !important;
          align-items: flex-start !important;
          gap: 14px;
        }
        .cs-icon {
          font-size: 22px;
          flex-shrink: 0;
        }
        .cs-item-label {
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 1.2px;
          color: var(--red, #eb3237);
          margin: 0 0 2px;
        }
        .cs-item-val {
          font-size: 14.5px;
          color: rgba(255, 255, 255, 0.75);
          text-decoration: none;
          transition: color 0.15s;
        }
        a.cs-item-val:hover {
          color: white;
        }
        .cs-form-card {
          background: white;
          border-radius: 16px;
          padding: 40px 36px;
          box-shadow: 0 24px 72px rgba(0, 0, 0, 0.35);
        }
        .cs-form-title {
          font-size: 22px;
          font-weight: 800;
          color: #111;
          margin-bottom: 28px;
          padding-bottom: 16px;
          border-bottom: 3px solid var(--red, #eb3237);
          display: inline-block;
        }
        @media (max-width: 1024px) {
          .cs-inner {
            grid-template-columns: 1fr;
            gap: 48px;
          }
        }
      `}</style>
    </section>
  );
}
