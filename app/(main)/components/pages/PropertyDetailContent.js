'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import Lightbox from 'yet-another-react-lightbox';
import { MapPin, Maximize2, IndianRupee, Building2, CheckCircle, Tag, FileText, Video } from 'lucide-react';
import PageBanner from '../ui/PageBanner';
import PropertyCard from '../ui/PropertyCard';
import ContactForm from '../shared/ContactForm';
import PropertyPromoCarousel from '../shared/PropertyPromoCarousel';

export default function PropertyDetailContent({ project, relatedProjects, bannerImage = '', sidebarImages = [] }) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [lightboxSources, setLightboxSources] = useState([]);

  const pricingRows = getPricingRows(project);
  const typeSlug  = resolveTypeSlug(project);
  const typeName  = project.typeName || project.type?.name || (typeSlug === 'commercial' ? 'Commercial' : typeSlug === 'residential' ? 'Residential' : '');
  const amenities = (project.amenities || []).filter(a => a?.name);
  const specs     = (project.specifications || []).filter(s => s?.name);
  const hasFloors = hasFloorPlans(project);
  const galleryImages = (project.gallery || []).filter(Boolean);
  const openLightbox = (sources, index = 0) => {
    if (!Array.isArray(sources) || sources.length === 0) return;
    setLightboxSources(sources);
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  return (
    <>
      <PageBanner
        title={project.title}
        breadcrumbs={[{ label: 'Projects', href: '/projects' }, { label: project.title }]}
        image={bannerImage}
      />
      <div className="detail-layout container">
        <div className="detail-main">
          <PropertyGallery project={project} onOpenLightbox={openLightbox} />
          <ProjectInfo project={project} />
          {project.overview && <ProjectOverview html={project.overview} />}
          {project.highlights?.length > 0 && <ProjectHighlights highlights={project.highlights} />}
          {pricingRows.length > 0 && <PricingTable rows={pricingRows} />}
          {amenities.length > 0 && <AmenitiesSection amenities={amenities} />}
          {specs.length > 0 && <SpecificationsSection specs={specs} />}
          {hasFloors && <FloorPlans floorPlans={project.floorPlans} masterPlan={project.masterPlan} onOpenLightbox={openLightbox} />}
          {galleryImages.length > 0 && <GallerySection images={galleryImages} title={project.title} onOpenLightbox={openLightbox} />}
          {project.video && <VideoSection url={project.video} title={project.title} />}
        </div>
        <aside className="detail-sidebar">
          <PropertyMeta project={project} typeName={typeName} typeSlug={typeSlug} />
          <PropertyPromoCarousel images={sidebarImages} />
          <div className="sidebar-form-box">
            <h3 className="sidebar-form-title">Contact Us</h3>
            <ContactForm projectName={project.title} />
          </div>
        </aside>
      </div>

      {relatedProjects?.length > 0 && (
        <div className="detail-layout detail-layout-related container">
          <div className="detail-main">
            <RelatedProjects projects={relatedProjects} />
          </div>
        </div>
      )}
      <Lightbox
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        index={lightboxIndex}
        slides={lightboxSources.map((src) => ({ src }))}
      />

      <style jsx global>{`
        .section-h2 { font-size: 20px; font-weight: 800; color: #111827; margin-bottom: 0; }
        .section-divider { width: 44px; height: 3px; background: linear-gradient(90deg, var(--green,#006833), var(--red,#eb3237)); border-radius: 2px; margin: 8px 0 20px; }
        .detail-layout { display: grid; grid-template-columns: 1fr 360px; gap: 40px; padding-top: 48px; padding-bottom: 30px; align-items: start; }
        .detail-layout-related { padding-top: 0; padding-bottom: 80px; }
        .detail-sidebar { display: flex; flex-direction: column; gap: 24px; align-self: stretch; }
        .sidebar-form-box { background: white; border-radius: 12px; padding: 24px; box-shadow: 0 4px 24px rgba(0,0,0,0.10); border: 1px solid #eee; position: sticky; top: 100px; z-index: 3; }
        .sidebar-form-title { font-size: 18px; font-weight: 700; color: #1f2937; margin-bottom: 14px; padding-bottom: 10px; border-bottom: 2px solid var(--green,#006833); display: inline-block; }
        /* Compact the sidebar contact form so it fits without scrolling.
           Higher specificity (.sidebar-form-box ...) overrides ContactForm's
           single-column container/viewport fallbacks. */
        .sidebar-form-box .cf-wrap { gap: 12px; }
        .sidebar-form-box .cf-tabs { flex-direction: row; }
        .sidebar-form-box .contact-form { grid-template-columns: 1fr 1fr; gap: 10px 12px; }
        .sidebar-form-box .form-group { gap: 4px; }
        .sidebar-form-box .form-label { font-size: 10.5px; letter-spacing: 0.2px; }
        .sidebar-form-box .form-input { min-height: 40px; padding: 9px 11px; font-size: 14px; }
        .sidebar-form-box .submit-btn { padding: 11px 24px; font-size: 14px; }
        @media (max-width: 1024px) { .detail-layout { grid-template-columns: 1fr; } .sidebar-form-box { position: static; } .detail-sidebar { order: -1; align-self: auto; } .detail-layout-related { padding-bottom: 60px; } }
      `}</style>
    </>
  );
}

/* ── helpers ─────────────────────────────── */
function resolveTypeSlug(project) {
  if (typeof project?.type === 'string') return project.type.toLowerCase();
  if (project?.type?.slug) return project.type.slug.toLowerCase();
  if (project?.typeName) return project.typeName.toLowerCase();
  return '';
}

function hasFloorPlans(project) {
  const fps = Array.isArray(project?.floorPlans) ? project.floorPlans : [];
  const valid = fps.filter(fp => {
    if (typeof fp === 'string') return !!fp;
    return !!(fp?.image || fp?.image);
  });
  return valid.length > 0 || !!project?.masterPlan;
}

function getPricingRows(project) {
  if (Array.isArray(project?.priceTable) && project.priceTable.length > 0) {
    return project.priceTable
      .map(row => ({ floor: row?.type || row?.size || 'Price', size: row?.size || '', price: row?.price || '' }))
      .filter(row => row.price);
  }
  if (Array.isArray(project?.pricePerSqft)) {
    return project.pricePerSqft
      .map(row => {
        if (typeof row === 'string') return { floor: 'Price', size: '', price: row };
        return { floor: row?.floor || row?.type || row?.size || 'Price', size: row?.size || '', price: row?.price || '' };
      })
      .filter(row => row.price);
  }
  if (typeof project?.pricePerSqft === 'string' && project.pricePerSqft.trim()) {
    return [{ floor: 'Price/Sq.Ft', size: '', price: project.pricePerSqft.trim() }];
  }
  return [];
}

function SectionHeader({ title }) {
  return (
    <>
      <h2 className="section-h2">{title}</h2>
      <div className="section-divider" />
    </>
  );
}

/* ── Gallery ─────────────────────────────── */
function PropertyGallery({ project, onOpenLightbox }) {
  const images = project.gallery?.length ? project.gallery : [project.thumbnail].filter(Boolean);
  if (!images.length) return null;
  return (
    <div className="gallery-wrap">
      <div
        className="gallery-main"
        role="button"
        tabIndex={0}
        aria-label="Open project images"
        onClick={() => onOpenLightbox(images, 0)}
        onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onOpenLightbox(images, 0)}
      >
        <Image src={images[0]} alt={project.title} fill className="gallery-main-img" sizes="(max-width:768px) 100vw, 65vw" priority />
        {(project.status || project.badge) && (
          <div className="gallery-badges">
            {project.status && <span className="gbadge gbadge-status">{project.status}</span>}
            {project.badge  && <span className="gbadge gbadge-offer">{project.badge}</span>}
          </div>
        )}
      </div>
      <style jsx global>{`
        .gallery-wrap { margin-bottom: 36px; }
        .gallery-main { position: relative; height: 460px; border-radius: 12px; overflow: hidden; box-shadow: 0 8px 32px rgba(0,0,0,0.12); cursor: pointer; }
        .gallery-main-img { object-fit: cover; }
        .gallery-badges { position: absolute; top: 16px; left: 16px; display: flex; gap: 8px; flex-wrap: wrap; }
        .gbadge { padding: 5px 14px; border-radius: 4px; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; }
        .gbadge-status { background: var(--red,#eb3237); color: white; }
        .gbadge-offer  { background: var(--green,#006833); color: white; }
        @media (max-width: 640px) { .gallery-main { height: 260px; } }
      `}</style>
    </div>
  );
}

/* ── Gallery Grid (all images, like floor plans) ── */
function GallerySection({ images, title, onOpenLightbox }) {
  if (!images?.length) return null;
  return (
    <div className="gal-wrap">
      <SectionHeader title="Gallery" />
      <div className="gal-grid">
        {images.map((img, i) => (
          <div
            key={i}
            className="gal-item"
            role="button"
            tabIndex={0}
            aria-label={`Open image ${i + 1}`}
            onClick={() => onOpenLightbox(images, i)}
            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onOpenLightbox(images, i)}
          >
            <Image src={img} alt={`${title} ${i + 1}`} fill className="gal-img" sizes="(max-width:768px) 100vw, 40vw" />
          </div>
        ))}
      </div>
      <style jsx global>{`
        .gal-wrap { margin-bottom: 36px; }
        .gal-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; }
        .gal-item { position: relative; height: 300px; border-radius: 10px; overflow: hidden; border: 1px solid #e5e7eb; background: #f8f9fa; cursor: pointer; }
        .gal-img { object-fit: cover; transition: transform 0.4s; }
        .gal-item:hover .gal-img { transform: scale(1.05); }
        @media (max-width: 640px) { .gal-grid { grid-template-columns: 1fr; } .gal-item { height: 220px; } }
      `}</style>
    </div>
  );
}

/* ── Project Info ─────────────────────────── */
function ProjectInfo({ project }) {
  const metaItems = [
    project.location    && { icon: <MapPin size={15}/>, text: project.location },
    project.area        && { icon: <Maximize2 size={15}/>, text: project.area },
    project.price       && { icon: <IndianRupee size={15}/>, text: project.price },
    project.configuration && { icon: <Building2 size={15}/>, text: project.configuration },
    project.rera        && { icon: <FileText size={15}/>, text: `RERA: ${project.rera}` },
  ].filter(Boolean);

  return (
    <div className="info-wrap">
      <h1 className="info-title">{project.title}</h1>
      {metaItems.length > 0 && (
        <div className="info-meta">
          {metaItems.map((item, i) => (
            <div key={i} className="info-meta-item">
              {item.icon}<span>{item.text}</span>
            </div>
          ))}
        </div>
      )}
      {(project.description || project.excerpt) && (
        <div className="info-section">
          <SectionHeader title="About Project" />
          <p className="info-description">{project.description || project.excerpt}</p>
          {project.features?.length > 0 && (
            <ul className="feature-list">
              {project.features.map((f, i) => (
                <li key={i} className="feature-item"><CheckCircle size={15} /><span>{f}</span></li>
              ))}
            </ul>
          )}
        </div>
      )}
      <style jsx global>{`
        .info-wrap { margin-bottom: 36px; }
        .info-title { font-size: clamp(22px,3vw,32px); font-weight: 800; color: #111827; margin-bottom: 16px; line-height: 1.2; }
        .info-meta { display: flex; flex-wrap: wrap; gap: 10px 24px; padding: 18px 20px; background: var(--green-pale,#e8f5ee); border-radius: 10px; margin-bottom: 28px; border-left: 4px solid var(--green,#006833); }
        .info-meta-item { display: flex; align-items: center; gap: 7px; font-size: 13.5px; color: #1f2937; font-weight: 600; }
        .info-meta-item svg { color: var(--green,#006833); flex-shrink: 0; }
        .info-section { margin-top: 4px; }
        .info-description { font-size: 15px; color: #4b5563; line-height: 1.85; white-space: pre-line; }
        .feature-list { list-style: none; margin-top: 16px; display: flex; flex-direction: column; gap: 10px; }
        .feature-item { display: flex; align-items: flex-start; gap: 10px; font-size: 14px; color: #374151; }
        .feature-item svg { color: var(--green,#006833); flex-shrink: 0; margin-top: 2px; }
      `}</style>
    </div>
  );
}

/* ── Overview (rich HTML) ─────────────────── */
function ProjectOverview({ html }) {
  return (
    <div className="overview-wrap">
      <SectionHeader title="Project Overview" />
      <div className="overview-body" dangerouslySetInnerHTML={{ __html: html }} />
      <style jsx global>{`
        .overview-wrap { margin-bottom: 36px; }
        .overview-body { font-size: 15px; color: #4b5563; line-height: 1.85; }
        .overview-body h2, .overview-body h3 { color: #111827; font-weight: 700; margin: 20px 0 8px; }
        .overview-body h2 { font-size: 20px; }
        .overview-body h3 { font-size: 17px; }
        .overview-body p  { margin-bottom: 12px; }
        .overview-body ul, .overview-body ol { padding-left: 20px; margin-bottom: 12px; }
        .overview-body li { margin-bottom: 6px; }
        .overview-body strong { color: #111827; }
      `}</style>
    </div>
  );
}

/* ── Pricing ──────────────────────────────── */
function PricingTable({ rows }) {
  const hasSize = rows.some(r => r.size);
  return (
    <div className="pricing-wrap">
      <SectionHeader title="Pricing" />
      <div className={`price-table${hasSize ? '' : ' price-table--nosize'}`}>
        <div className="price-row price-header">
          <span>Configuration</span>
          {hasSize && <span>Minimum Size</span>}
          <span>Price</span>
        </div>
        {rows.map((row, i) => (
          <div key={i} className="price-row">
            <span className="price-floor">{row.floor}</span>
            {hasSize && <span className="price-size">{row.size || '—'}</span>}
            <span className="price-val">{row.price}</span>
          </div>
        ))}
      </div>
      <style jsx global>{`
        .pricing-wrap { margin-bottom: 36px; }
        .price-table { border: 1px solid #e5e7eb; border-radius: 10px; overflow: hidden; }
        .price-row { display: grid; grid-template-columns: 1fr auto 1fr; justify-content: space-between; align-items: center; padding: 13px 20px; border-bottom: 1px solid #f0f0f0; transition: background 0.15s; gap: 12px; }
        .price-table--nosize .price-row { grid-template-columns: 1fr 1fr; }
        .price-row:last-child { border-bottom: none; }
        .price-row:hover { background: var(--green-pale,#e8f5ee); }
        .price-header { background: #f9fafb; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.6px; color: #9ca3af; }
        .price-header span:last-child { text-align: right; }
        .price-table .price-row > span:last-child { text-align: right; }
        .price-header:hover { background: #f9fafb; }
        .price-floor { font-size: 14px; font-weight: 600; color: #374151; }
        .price-size  { font-size: 13.5px; color: #6b7280; text-align: center; }
        .price-val   { font-size: 14px; font-weight: 700; color: var(--green,#006833); text-align: right; }
      `}</style>
    </div>
  );
}

/* ── Highlights ───────────────────────────── */
function ProjectHighlights({ highlights }) {
  return (
    <div className="highlights-wrap">
      <SectionHeader title="Project Highlights" />
      <div className="highlights-grid">
        {highlights.map((h, i) => (
          <div key={i} className="highlight-item">
            <CheckCircle size={16} />
            <span>{h}</span>
          </div>
        ))}
      </div>
      <style jsx global>{`
        .highlights-wrap { margin-bottom: 36px; }
        .highlights-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; }
        .highlight-item { display: flex; align-items: flex-start; gap: 10px; font-size: 14px; color: #374151; background: #f9fafb; border: 1px solid #f3f4f6; border-radius: 8px; padding: 12px 14px; line-height: 1.5; }
        .highlight-item svg { color: var(--green,#006833); flex-shrink: 0; margin-top: 2px; }
        @media (max-width: 640px) { .highlights-grid { grid-template-columns: 1fr; } }
      `}</style>
    </div>
  );
}

/* ── Amenities ────────────────────────────── */
function AmenitiesSection({ amenities }) {
  return (
    <div className="amenities-wrap">
      <SectionHeader title="Amenities" />
      <div className="amenities-grid">
        {amenities.map((a, i) => (
          <div key={i} className="amenity-chip">
            <Tag size={13} />
            <span>{a.name}</span>
          </div>
        ))}
      </div>
      <style jsx global>{`
        .amenities-wrap { margin-bottom: 36px; }
        .amenities-grid { display: flex; flex-wrap: wrap; gap: 10px; }
        .amenity-chip { display: inline-flex; align-items: center; gap: 6px; padding: 7px 14px; background: var(--green-pale,#e8f5ee); border: 1px solid rgba(0,104,51,0.18); border-radius: 20px; font-size: 13px; font-weight: 600; color: var(--green-dark,#004d26); }
        .amenity-chip svg { color: var(--green,#006833); flex-shrink: 0; }
      `}</style>
    </div>
  );
}

/* ── Specifications ───────────────────────── */
function SpecificationsSection({ specs }) {
  return (
    <div className="specs-wrap">
      <SectionHeader title="Specifications" />
      <div className="specs-grid">
        {specs.map((s, i) => (
          <div key={i} className="spec-item">
            <CheckCircle size={14} />
            <span>{s.name}</span>
          </div>
        ))}
      </div>
      <style jsx global>{`
        .specs-wrap { margin-bottom: 36px; }
        .specs-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px; }
        .spec-item { display: flex; align-items: flex-start; gap: 8px; font-size: 13.5px; color: #374151; padding: 10px 14px; background: #f9fafb; border-radius: 8px; border: 1px solid #f3f4f6; line-height: 1.4; }
        .spec-item svg { color: var(--red,#eb3237); flex-shrink: 0; margin-top: 1px; }
        @media (max-width: 640px) { .specs-grid { grid-template-columns: 1fr; } }
      `}</style>
    </div>
  );
}

/* ── Floor Plans ──────────────────────────── */
function FloorPlans({ floorPlans, masterPlan, onOpenLightbox }) {
  const plans = Array.isArray(floorPlans)
    ? floorPlans.map((fp, i) => {
        if (typeof fp === 'string') return { label: `Floor Plan ${i + 1}`, image: fp };
        return { label: fp?.title || fp?.label || `Floor Plan ${i + 1}`, image: fp?.image || '' };
      }).filter(fp => fp.image)
    : [];

  const all = [...plans, ...(masterPlan ? [{ label: 'Master Plan', image: masterPlan }] : [])];
  if (!all.length) return null;
  const floorImages = all.map((p) => p.image).filter(Boolean);

  return (
    <div className="fp-wrap">
      <SectionHeader title="Floor Plans" />
      <div className="fp-grid">
        {all.map((plan, i) => (
          <div
            key={i}
            className="fp-item"
            role="button"
            tabIndex={0}
            aria-label={`Open ${plan.label}`}
            onClick={() => onOpenLightbox(floorImages, i)}
            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onOpenLightbox(floorImages, i)}
          >
            <span className="fp-label">{plan.label}</span>
            <Image src={plan.image} alt={plan.label} fill className="fp-img" sizes="(max-width:768px) 100vw, 40vw" />
          </div>
        ))}
      </div>
      <style jsx global>{`
        .fp-wrap { margin-bottom: 36px; }
        .fp-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; }
        .fp-item { position: relative; height: 300px; border-radius: 10px; overflow: hidden; border: 1px solid #e5e7eb; background: #f8f9fa; }
        .fp-label { position: absolute; bottom: 0; left: 0; right: 0; z-index: 2; background: rgba(0,0,0,0.55); color: white; font-size: 12px; font-weight: 600; padding: 7px 12px; text-align: center; }
        .fp-img { object-fit: contain; padding: 8px; }
        @media (max-width: 640px) { .fp-grid { grid-template-columns: 1fr; } .fp-item { height: 220px; } }
      `}</style>
    </div>
  );
}

/* ── Video ────────────────────────────────── */
function VideoSection({ url, title }) {
  const embedUrl = (() => {
    const ytMatch = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([A-Za-z0-9_-]{11})/);
    if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}`;
    const viMatch = url.match(/vimeo\.com\/(\d+)/);
    if (viMatch) return `https://player.vimeo.com/video/${viMatch[1]}`;
    return null;
  })();

  if (!embedUrl) return null;

  return (
    <div className="video-wrap">
      <SectionHeader title="Project Video" />
      <div className="video-frame">
        <iframe src={embedUrl} title={title} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
      </div>
      <style jsx global>{`
        .video-wrap { margin-bottom: 36px; }
        .video-frame { position: relative; padding-bottom: 56.25%; border-radius: 12px; overflow: hidden; background: #000; box-shadow: 0 8px 32px rgba(0,0,0,0.15); }
        .video-frame iframe { position: absolute; inset: 0; width: 100%; height: 100%; border: none; }
      `}</style>
    </div>
  );
}

/* ── Sidebar Meta ─────────────────────────── */
function PropertyMeta({ project, typeName, typeSlug }) {
  const metaRows = [
    typeName && { label: 'Type', value: typeName, link: `/projects?type=${typeSlug}` },
    project.status       && { label: 'Status', value: project.status },
    project.rera         && { label: 'RERA', value: project.rera },
    project.configuration && { label: 'Configuration', value: project.configuration },
    project.location     && { label: 'Location', value: project.location },
    project.address      && { label: 'Address', value: project.address },
    project.area         && { label: 'Area', value: project.area },
    project.price        && { label: 'Price', value: project.price, highlight: true },
    project.pricePerSqft && typeof project.pricePerSqft === 'string' && { label: 'Price/Sq.Ft', value: project.pricePerSqft },
  ].filter(Boolean);

  return (
    <div className="meta-box">
      <h3 className="meta-box-title">Project Details</h3>
      <div className="meta-list">
        {metaRows.map((row, i) => (
          <div key={i} className="meta-row">
            <span className="meta-label">{row.label}</span>
            {row.link
              ? <Link href={row.link} className="meta-value meta-link">{row.value}</Link>
              : <span className={`meta-value${row.highlight ? ' meta-price' : ''}`}>{row.value}</span>
            }
          </div>
        ))}
      </div>
      <style jsx global>{`
        .meta-box { background: white; border-radius: 12px; padding: 22px 24px; box-shadow: 0 4px 24px rgba(0,0,0,0.08); border: 1px solid #e5e7eb; }
        .meta-box-title { font-size: 16px; font-weight: 800; color: #111827; margin-bottom: 14px; padding-bottom: 10px; border-bottom: 2px solid var(--green,#006833); }
        .meta-list { display: flex; flex-direction: column; }
        .meta-row { display: flex; justify-content: space-between; align-items: flex-start; gap: 12px; padding: 10px 0; border-bottom: 1px solid #f5f5f5; }
        .meta-row:last-child { border-bottom: none; }
        .meta-label { font-size: 12px; color: #9ca3af; font-weight: 700; text-transform: uppercase; letter-spacing: 0.4px; flex-shrink: 0; padding-top: 1px; }
        .meta-value { font-size: 13.5px; color: #1f2937; font-weight: 600; text-align: right; }
        .meta-link { color: var(--green,#006833); text-decoration: none; }
        .meta-link:hover { text-decoration: underline; }
        .meta-price { color: var(--green,#006833); }
      `}</style>
    </div>
  );
}

/* ── Related ──────────────────────────────── */
function RelatedProjects({ projects }) {
  return (
    <div className="related-wrap">
      <SectionHeader title="Related Properties" />
      <div className="related-grid">
        {projects.map((p) => <PropertyCard key={p._id?.toString() ?? p.slug} project={p} />)}
      </div>
      <style jsx global>{`
        .related-wrap { padding-top: 4px; }
        .related-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 24px; }
        @media (max-width: 1024px) { .related-grid { grid-template-columns: repeat(2,1fr); } }
        @media (max-width: 640px)  { .related-grid { grid-template-columns: 1fr; } }
      `}</style>
    </div>
  );
}

/* ── Shared section title/divider styles ──── */
