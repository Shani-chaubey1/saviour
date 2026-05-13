'use client';

import Image from 'next/image';
import { Target, Eye, Heart, Award } from 'lucide-react';
import PageBanner from '../ui/PageBanner';
import SectionHeading from '../ui/SectionHeading';
import { TrustBanner, CertificationsSection } from './HomePageContent';
import { ensureAboutBlocks } from '@/lib/aboutBlocks';

const MV_ICONS = [Target, Eye, Heart, Award];

const FALLBACK_IMG = 'https://saviourgroup.in/wp-content/uploads/2025/05/about.png';

export default function AboutPageContent({ sections = {}, settings = {} }) {
  const pageTitle = sections.page_title?.trim() || 'About Us';
  const bannerLabel = pageTitle;
  const blocks = ensureAboutBlocks(sections);

  return (
    <>
      <PageBanner title={bannerLabel} breadcrumbs={[{ label: bannerLabel }]} />
      {blocks.map((block, bi) => (
        <AboutBlock key={block.id || `${block.kind}-${bi}`} block={block} sections={sections} settings={settings} pageTitle={pageTitle} />
      ))}
      <TrustBanner settings={settings} />
      <CertificationsSection settings={settings} />
    </>
  );
}

function AboutBlock({ block, sections, settings, pageTitle }) {
  switch (block.kind) {
    case 'intro_split':
      return <IntroSplitBlock block={block} sections={sections} settings={settings} pageTitle={pageTitle} />;
    case 'stats_row':
      return <StatsRowBlock block={block} />;
    case 'team':
      return <TeamBlock block={block} />;
    case 'chairman':
      return <ChairmanBlock block={block} />;
    case 'mission_grid':
      return <MissionGridBlock block={block} />;
    case 'html_section':
      return <HtmlSectionBlock block={block} />;
    default:
      return null;
  }
}

function IntroSplitBlock({ block, sections, settings, pageTitle }) {
  const sideImage = (block.image || '').trim() || settings.about_image || FALLBACK_IMG;
  const title = (block.title || '').trim() || pageTitle;
  const subtitle = (block.subtitle || '').trim() || sections.tagline?.trim();

  return (
    <section className="about-sec">
      <div className="container about-grid">
        <div className="about-text-col">
          <SectionHeading title={title} subtitle={subtitle || undefined} />
          {block.html?.trim() ? (
            <div className="about-intro-html" dangerouslySetInnerHTML={{ __html: block.html }} />
          ) : null}
        </div>
        <div className="about-img-col">
          <Image
            src={sideImage}
            alt={title}
            fill
            className="about-img"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        </div>
      </div>
      <style jsx global>{`
        .about-sec { padding: 80px 0; background: white; }
        .about-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 64px; align-items: start; }
        .about-text-col p,
        .about-intro-html { font-size: 15px; color: #555; line-height: 1.8; margin-bottom: 16px; }
        .about-intro-html p { font-size: 15px; color: #555; line-height: 1.8; margin-bottom: 16px; }
        .about-img-col { position: relative; height: 540px; border-radius: 12px; overflow: hidden; box-shadow: 0 16px 48px rgba(0,0,0,0.12); }
        .about-img { object-fit: cover; }
        @media (max-width: 1024px) { .about-grid { grid-template-columns: 1fr; gap: 40px; } .about-img-col { height: 360px; } }
      `}</style>
    </section>
  );
}

function StatsRowBlock({ block }) {
  const items = (block.items || [])
    .filter((r) => String(r.num || '').trim() && String(r.label || '').trim())
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
        .about-stats-sec { padding: 0 0 48px; background: white; margin-top: -24px; }
        .stats-row-dynamic {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
          gap: 16px;
          padding-top: 8px;
          border-top: 2px solid #f0f0f0;
        }
        .stat-item { text-align: center; padding: 16px 8px; border-radius: 8px; background: #f8f9fa; }
        .stat-num { display: block; font-size: 28px; font-weight: 900; color: #e67e22; line-height: 1; margin-bottom: 6px; }
        .stat-label { font-size: 12px; color: #666; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600; }
      `}</style>
    </section>
  );
}

function TeamBlock({ block }) {
  const heading = (block.title || '').trim() || 'Management';
  const team = (block.members || []).filter((m) => (m.name || '').trim());
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
                  src={(m.image || '').trim() || FALLBACK_IMG}
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
        .mgmt-sec { padding: 80px 0; background: #f8f9fa; }
        .mgmt-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 32px; }
        .mgmt-card { background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.08); transition: all 0.3s ease; }
        .mgmt-card:hover { transform: translateY(-6px); box-shadow: 0 12px 40px rgba(0,0,0,0.15); }
        .mgmt-img-wrap { position: relative; height: 300px; overflow: hidden; }
        .mgmt-img { object-fit: cover; }
        .mgmt-body { padding: 20px; text-align: center; border-top: 3px solid #e67e22; }
        .mgmt-name { font-size: 18px; font-weight: 700; color: #2c3e50; margin-bottom: 6px; }
        .mgmt-role { font-size: 13px; color: #e67e22; font-weight: 600; text-transform: uppercase; letter-spacing: 0.3px; }
      `}</style>
    </section>
  );
}

function ChairmanBlock({ block }) {
  const img = (block.image || '').trim() || FALLBACK_IMG;
  const sigName = (block.signatureName || '').trim();
  const sigTitle = (block.signatureTitle || '').trim();

  if (!block.html?.trim()) return null;

  return (
    <section className="chairman-sec">
      <div className="container chairman-inner">
        <div className="chairman-img-wrap">
          <Image src={img} alt="Chairman's Message" fill className="chairman-img" sizes="(max-width: 1024px) 100vw, 40vw" />
          <div className="quote-mark">&ldquo;</div>
        </div>
        <div className="chairman-content">
          <SectionHeading title="Chairman's Message" />
          <div className="chairman-message-html" dangerouslySetInnerHTML={{ __html: block.html }} />
          {(sigName || sigTitle) && (
            <div className="chairman-sig">
              {sigName && <strong>{sigName}</strong>}
              {sigTitle && <span>{sigTitle}</span>}
            </div>
          )}
        </div>
      </div>
      <style jsx global>{`
        .chairman-sec { padding: 80px 0; background: white; }
        .chairman-inner { display: grid; grid-template-columns: 0.8fr 1.2fr; gap: 64px; align-items: start; }
        .chairman-img-wrap { position: relative; height: 440px; border-radius: 12px; overflow: hidden; box-shadow: 0 16px 48px rgba(0,0,0,0.12); }
        .chairman-img { object-fit: cover; }
        .quote-mark { position: absolute; top: -10px; left: 16px; font-size: 120px; color: #e67e22; opacity: 0.15; font-family: Georgia, serif; line-height: 1; }
        .chairman-quote { font-size: 17px; color: #2c3e50; font-style: italic; font-weight: 600; line-height: 1.8; border-left: 4px solid #e67e22; padding-left: 20px; margin-bottom: 20px; }
        .chairman-content p { font-size: 15px; color: #555; line-height: 1.8; margin-bottom: 16px; }
        .chairman-message-html { font-size: 15px; color: #555; line-height: 1.8; }
        .chairman-message-html p { margin-bottom: 16px; }
        .chairman-sig { margin-top: 24px; display: flex; flex-direction: column; gap: 4px; padding-top: 16px; border-top: 2px solid #f0f0f0; }
        .chairman-sig strong { font-size: 17px; color: #2c3e50; }
        .chairman-sig span { font-size: 13px; color: #e67e22; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600; }
        @media (max-width: 1024px) { .chairman-inner { grid-template-columns: 1fr; gap: 40px; } .chairman-img-wrap { height: 320px; } }
      `}</style>
    </section>
  );
}

function MissionGridBlock({ block }) {
  const items = (block.items || []).filter((x) => (x.title || '').trim() && (x.text || '').trim());
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
        .mvv-sec { padding: 80px 0; background: #f8f9fa; }
        .mvv-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 24px; }
        .mvv-card { background: white; border-radius: 12px; padding: 32px 24px; text-align: center; box-shadow: 0 4px 20px rgba(0,0,0,0.06); transition: all 0.3s ease; border-top: 4px solid transparent; }
        .mvv-card:hover { border-top-color: #e67e22; transform: translateY(-6px); box-shadow: 0 12px 40px rgba(0,0,0,0.12); }
        .mvv-icon { display: inline-flex; align-items: center; justify-content: center; width: 80px; height: 80px; background: linear-gradient(135deg, rgba(230,126,34,0.12), rgba(211,84,0,0.06)); border-radius: 50%; color: #e67e22; margin-bottom: 20px; }
        .mvv-title { font-size: 18px; font-weight: 700; color: #2c3e50; margin-bottom: 12px; }
        .mvv-desc { font-size: 14px; color: #666; line-height: 1.7; }
      `}</style>
    </section>
  );
}

function HtmlSectionBlock({ block }) {
  if (!block.html?.trim()) return null;
  return (
    <section className="ab-html-sec">
      <div className="container">
        {(block.title || '').trim() ? <SectionHeading title={block.title.trim()} centered /> : null}
        <div className="ab-html-inner" dangerouslySetInnerHTML={{ __html: block.html }} />
      </div>
      <style jsx global>{`
        .ab-html-sec { padding: 64px 0; background: white; }
        .ab-html-inner { font-size: 15px; color: #555; line-height: 1.85; }
        .ab-html-inner p { margin-bottom: 16px; }
      `}</style>
    </section>
  );
}
