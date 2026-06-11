"use client";

import { ensureAboutBlocks } from "@/lib/aboutBlocks";
import { Award, Eye, Heart, Shield, Target } from "lucide-react";
import Image from "next/image";
import PageBanner from "../ui/PageBanner";
import SectionHeading from "../ui/SectionHeading";
import {
  CertificationsSection,
  MissionVisionSection,
  WhyUsSection,
} from "./HomePageContent";

const MV_ICONS = [Target, Eye, Heart, Award];

const FALLBACK_IMG =
  "https://saviourgroup.in/wp-content/uploads/2025/05/about.png";

export default function AboutPageContent({ sections = {}, settings = {} }) {
  const pageTitle = sections.page_title?.trim() || "About Us";
  const bannerLabel = pageTitle;
  const blocks = ensureAboutBlocks(sections);

  return (
    <>
      <PageBanner title={bannerLabel} breadcrumbs={[{ label: bannerLabel }]} image={settings.banner_image_about || settings.banner_image_default || ''} />
      {blocks.map((block, bi) => (
        <AboutBlock
          key={block.id || `${block.kind}-${bi}`}
          block={block}
          sections={sections}
          settings={settings}
          pageTitle={pageTitle}
        />
      ))}
      <MissionVisionSection settings={settings} />
      <WhyUsSection settings={settings} />
    </>
  );
}

function AboutBlock({ block, sections, settings, pageTitle }) {
  switch (block.kind) {
    case "intro_split":
      return (
        <IntroSplitBlock
          block={block}
          sections={sections}
          settings={settings}
          pageTitle={pageTitle}
        />
      );
    case "stats_row":
      return <StatsRowBlock block={block} />;
    case "html_section":
      return <HtmlSectionBlock block={block} />;
    default:
      return null;
  }
}

/**
 * Two pill-style credential badges (RERA + CREDAI) shown inside the About
 * page intro. Labels are pulled from the existing `trust_credential_*`
 * settings used by the homepage TrustBanner; icons are intentionally static
 * (Shield + Award) so the visual identity stays consistent and doesn't
 * require the admin to pick icons.
 */
function AboutCredentialBadges({ settings }) {
  const cred1 = (settings.trust_credential_1 || "").trim();
  const cred2 = (settings.trust_credential_2 || "").trim();
  if (!cred1 && !cred2) return null;

  return (
    <div className="about-cred-row">
      {cred1 && (
        <span className="about-cred-pill">
          <span className="about-cred-icon" aria-hidden="true">
            <Shield size={18} strokeWidth={1.8} />
          </span>
          <span className="about-cred-label">{cred1}</span>
        </span>
      )}
      {cred2 && (
        <span className="about-cred-pill">
          <span className="about-cred-icon" aria-hidden="true">
            <Award size={18} strokeWidth={1.8} />
          </span>
          <span className="about-cred-label">{cred2}</span>
        </span>
      )}
      <style jsx global>{`
        .about-cred-row {
          display: flex !important;
          flex-wrap: wrap;
          gap: 12px;
          justify-content: center;
        }
        .about-cred-pill {
          display: inline-flex !important;
          align-items: center !important;
          gap: 10px;
          padding: 10px 18px;
          background: var(--green-pale, #e8f5ee);
          border: 1px solid rgba(0, 104, 51, 0.22);
          border-radius: 999px;
          color: var(--green-dark, #004d26);
          font-size: 14px;
          font-weight: 700;
          letter-spacing: 0.1px;
          transition:
            transform 0.18s ease,
            box-shadow 0.18s ease,
            background 0.18s ease;
        }
        .about-cred-pill:hover {
          background: #d4ecdf;
          transform: translateY(-1px);
          box-shadow: 0 6px 14px rgba(0, 104, 51, 0.14);
        }
        .about-cred-icon {
          display: inline-flex !important;
          align-items: center !important;
          justify-content: center !important;
          color: var(--green, #006833);
          flex-shrink: 0;
        }
        .about-cred-label {
          line-height: 1;
        }
        @media (max-width: 480px) {
          .about-cred-pill {
            font-size: 13px;
            padding: 9px 14px;
          }
        }
      `}</style>
    </div>
  );
}

function IntroSplitBlock({ block, sections, settings, pageTitle }) {
  const sideImage =
    (block.image || "").trim() || settings.about_image || FALLBACK_IMG;
  const title = (block.title || "").trim() || pageTitle;
  const subtitle = (block.subtitle || "").trim() || sections.tagline?.trim();

  return (
    <section className="about-sec">
      <div className="container about-grid">
        <div className="about-text-col">
          <SectionHeading title={title} subtitle={subtitle || undefined} />
          {block.html?.trim() ? (
            <div
              className="about-intro-html"
              dangerouslySetInnerHTML={{ __html: block.html }}
            />
          ) : null}
        </div>
        <div className="about-img-col-wrap">
          <div className="about-img-col">
            <Image
              src={sideImage}
              alt={title}
              fill
              className="about-img"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
          <AboutCredentialBadges settings={settings} />
        </div>
      </div>
      <style jsx global>{`
        .about-sec {
          padding: 30px 0;
          background: white;
        }
        .about-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 64px;
          align-items: start;
        }
        .about-text-col p,
        .about-intro-html {
          font-size: 15px;
          color: #555;
          line-height: 1.8;
          margin-bottom: 16px;
        }
        .about-intro-html p {
          font-size: 15px;
          color: #555;
          line-height: 1.8;
          margin-bottom: 16px;
        }
        .about-img-col-wrap {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }
        .about-img-col {
          position: relative;
          height: 540px;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 16px 48px rgba(0, 0, 0, 0.12);
        }
        .about-img {
          object-fit: cover;
        }
        @media (max-width: 1024px) {
          .about-grid {
            grid-template-columns: 1fr;
            gap: 40px;
          }
          .about-img-col {
            height: 360px;
          }
        }
      `}</style>
    </section>
  );
}

function StatsRowBlock({ block }) {
  const items = (block.items || [])
    .filter((r) => String(r.num || "").trim() && String(r.label || "").trim())
    .map((r) => ({ num: r.num, label: r.label }));
  if (!items.length) return null;

  return (
    <section className="about-stats-sec">
      <div className="container">
        <div className="stats-row-dynamic">
          {items.map((s) => (
            <div key={`${s.num}-${s.label}`} className="stat-item">
              <span className="stat-num">{s.num}</span>
              <span className="stat-label">{s.label}</span>
            </div>
          ))}
        </div>
      </div>
      <style jsx global>{`
        .about-stats-sec {
          background: white;
        }
        .stats-row-dynamic {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
          gap: 16px;
          padding-top: 8px;
        }
        .stat-item {
          text-align: center;
          padding: 32px 24px;
          border-radius: 8px;
          background: #f8f9fa;
        }
        .stat-num {
          display: block;
          font-size: 36px;
          font-weight: 900;
          color: #e67e22;
          line-height: 1;
          margin-bottom: 6px;
        }
        .stat-label {
          font-size: 15px;
          color: #666;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          font-weight: 600;
        }
      `}</style>
    </section>
  );
}

function TeamBlock({ block }) {
  const heading = (block.title || "").trim() || "Management";
  const team = (block.members || []).filter((m) => (m.name || "").trim());
  if (!team.length) return null;

  return (
    <section className="mgmt-sec">
      <div className="container">
        <SectionHeading title={heading} centered />
        <div className="mgmt-grid">
          {team.map((m) => (
            <div key={m.name} className="mgmt-card">
              <div className="mgmt-img-wrap">
                <Image
                  src={(m.image || "").trim() || FALLBACK_IMG}
                  alt={m.name}
                  fill
                  className="mgmt-img"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
              <div className="mgmt-body">
                <h3 className="mgmt-name">{m.name}</h3>
                <p className="mgmt-role">{m.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <style jsx global>{`
        .mgmt-sec {
          padding: 30px 0;
          background: #f8f9fa;
        }
        .mgmt-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 32px;
        }
        .mgmt-card {
          background: white;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          transition: all 0.3s ease;
        }
        .mgmt-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
        }
        .mgmt-img-wrap {
          position: relative;
          height: 300px;
          overflow: hidden;
        }
        .mgmt-img {
          object-fit: cover;
        }
        .mgmt-body {
          padding: 20px;
          text-align: center;
          border-top: 3px solid #e67e22;
        }
        .mgmt-name {
          font-size: 18px;
          font-weight: 700;
          color: #2c3e50;
          margin-bottom: 6px;
        }
        .mgmt-role {
          font-size: 13px;
          color: #e67e22;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.3px;
        }
      `}</style>
    </section>
  );
}

function ChairmanBlock({ block }) {
  const img = (block.image || "").trim() || FALLBACK_IMG;
  const sigName = (block.signatureName || "").trim();
  const sigTitle = (block.signatureTitle || "").trim();

  if (!block.html?.trim()) return null;

  return (
    <section className="chairman-sec">
      <div className="container chairman-inner">
        <div className="chairman-img-wrap">
          <Image
            src={img}
            alt="Chairman's Message"
            fill
            className="chairman-img"
            sizes="(max-width: 1024px) 100vw, 40vw"
          />
          <div className="quote-mark">&ldquo;</div>
        </div>
        <div className="chairman-content">
          <SectionHeading title="Chairman's Message" />
          <div
            className="chairman-message-html"
            dangerouslySetInnerHTML={{ __html: block.html }}
          />
          {(sigName || sigTitle) && (
            <div className="chairman-sig">
              {sigName && <strong>{sigName}</strong>}
              {sigTitle && <span>{sigTitle}</span>}
            </div>
          )}
        </div>
      </div>
      <style jsx global>{`
        .chairman-sec {
          padding: 30px 0;
          background: white;
        }
        .chairman-inner {
          display: grid;
          grid-template-columns: 0.8fr 1.2fr;
          gap: 64px;
          align-items: start;
        }
        .chairman-img-wrap {
          position: relative;
          height: 440px;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 16px 48px rgba(0, 0, 0, 0.12);
        }
        .chairman-img {
          object-fit: cover;
        }
        .quote-mark {
          position: absolute;
          top: -10px;
          left: 16px;
          font-size: 120px;
          color: #e67e22;
          opacity: 0.15;
          font-family: Georgia, serif;
          line-height: 1;
        }
        .chairman-quote {
          font-size: 17px;
          color: #2c3e50;
          font-style: italic;
          font-weight: 600;
          line-height: 1.8;
          border-left: 4px solid #e67e22;
          padding-left: 20px;
          margin-bottom: 20px;
        }
        .chairman-content p {
          font-size: 15px;
          color: #555;
          line-height: 1.8;
          margin-bottom: 16px;
        }
        .chairman-message-html {
          font-size: 15px;
          color: #555;
          line-height: 1.8;
        }
        .chairman-message-html p {
          margin-bottom: 16px;
        }
        .chairman-sig {
          margin-top: 24px;
          display: flex;
          flex-direction: column;
          gap: 4px;
          padding-top: 16px;
          border-top: 2px solid #f0f0f0;
        }
        .chairman-sig strong {
          font-size: 17px;
          color: #2c3e50;
        }
        .chairman-sig span {
          font-size: 13px;
          color: #e67e22;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          font-weight: 600;
        }
        @media (max-width: 1024px) {
          .chairman-inner {
            grid-template-columns: 1fr;
            gap: 40px;
          }
          .chairman-img-wrap {
            height: 320px;
          }
        }
      `}</style>
    </section>
  );
}

function MissionGridBlock({ block }) {
  const items = (block.items || []).filter(
    (x) => (x.title || "").trim() && (x.text || "").trim(),
  );
  if (!items.length) return null;

  return (
    <section className="mvv-sec">
      <div className="container">
        <SectionHeading title="Mission, Vision & Motto" centered />
        <div className="mvv-grid">
          {items.map((item, idx) => {
            const Icon = MV_ICONS[idx % MV_ICONS.length];
            return (
              <div key={`${item.title}-${idx}`} className="mvv-card">
                <div className="mvv-icon">
                  <Icon size={40} />
                </div>
                <h3 className="mvv-title">{item.title}</h3>
                <p className="mvv-desc">{item.text}</p>
              </div>
            );
          })}
        </div>
      </div>
      <style jsx global>{`
        .mvv-sec {
          padding: 30px 0;
          background: #f8f9fa;
        }
        .mvv-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 24px;
        }
        .mvv-card {
          background: white;
          border-radius: 12px;
          padding: 32px 24px;
          text-align: center;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
          transition: all 0.3s ease;
          border-top: 4px solid transparent;
        }
        .mvv-card:hover {
          border-top-color: #e67e22;
          transform: translateY(-6px);
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.12);
        }
        .mvv-icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 80px;
          height: 80px;
          background: linear-gradient(
            135deg,
            rgba(230, 126, 34, 0.12),
            rgba(211, 84, 0, 0.06)
          );
          border-radius: 50%;
          color: #e67e22;
          margin-bottom: 20px;
        }
        .mvv-title {
          font-size: 18px;
          font-weight: 700;
          color: #2c3e50;
          margin-bottom: 12px;
        }
        .mvv-desc {
          font-size: 14px;
          color: #666;
          line-height: 1.7;
        }
      `}</style>
    </section>
  );
}

function HtmlSectionBlock({ block }) {
  if (!block.html?.trim()) return null;
  return (
    <section className="ab-html-sec">
      <div className="container">
        {(block.title || "").trim() ? (
          <SectionHeading title={block.title.trim()} centered />
        ) : null}
        <div
          className="ab-html-inner"
          dangerouslySetInnerHTML={{ __html: block.html }}
        />
      </div>
      <style jsx global>{`
        .ab-html-sec {
          padding: 64px 0;
          background: white;
        }
        .ab-html-inner {
          font-size: 15px;
          color: #555;
          line-height: 1.85;
        }
        .ab-html-inner p {
          margin-bottom: 16px;
        }
      `}</style>
    </section>
  );
}
