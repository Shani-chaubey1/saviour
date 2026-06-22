'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import RichEditor from '../../_components/RichEditor';
import AboutBlocksEditor from '../../_components/cms/AboutBlocksEditor';
import { useToast } from '../../_components/Toast';
import HomeSiteSettingsPanel from '../../_components/HomeSiteSettingsPanel';
import { legacyToAboutBlocks } from '@/lib/aboutBlocks';

const PAGE_CONFIGS = {
  projects: {
    title: 'Projects listing page',
    sections: [
      { key: 'meta_residential_title', label: 'SEO — Residential tab title', type: 'text' },
      { key: 'meta_residential_description', label: 'SEO — Residential tab description', type: 'textarea' },
      { key: 'meta_commercial_title', label: 'SEO — Commercial tab title', type: 'text' },
      { key: 'meta_commercial_description', label: 'SEO — Commercial tab description', type: 'textarea' },
      { key: 'all_title', label: 'All Projects — Page Heading', type: 'text', hint: 'e.g. All Projects' },
      { key: 'all_subtitle', label: 'All Projects — Subtitle', type: 'text' },
      { key: 'residential_title', label: 'Residential tab — Heading', type: 'text' },
      { key: 'residential_subtitle', label: 'Residential tab — Subtitle', type: 'text' },
      { key: 'commercial_title', label: 'Commercial tab — Heading', type: 'text' },
      { key: 'commercial_subtitle', label: 'Commercial tab — Subtitle', type: 'text' },
      { key: 'empty_message', label: 'No Projects Message', type: 'text', hint: 'Shown when no projects are found.' },
    ],
  },
  'about-us': {
    title: 'About Us',
    sections: [
      { key: 'page_title', label: 'Page Title', type: 'text' },
      { key: 'tagline', label: 'Hero subtitle / tagline', type: 'text' },
      {
        key: 'about_blocks',
        label: 'Page sections (blocks)',
        type: 'about_blocks',
        hint: 'Reorder, add multiple intro/stats/team/chairman/mission/HTML blocks. Images support upload.',
      },
    ],
  },
  'contact-us': {
    title: 'Contact Us',
    sections: [
      { key: 'page_title', label: 'Page Title', type: 'text' },
      { key: 'intro_subtitle', label: 'Intro subtitle (below heading)', type: 'textarea' },
      { key: 'phone', label: 'Phone (display)', type: 'text' },
      { key: 'email', label: 'Email (display)', type: 'text' },
      { key: 'address', label: 'Office Address', type: 'textarea' },
      { key: 'working_hours', label: 'Working Hours', type: 'text' },
      { key: 'map_embed', label: 'Google Maps Embed URL', type: 'text' },
      { key: 'form_title', label: 'Form box title', type: 'text' },
    ],
  },
  blog: {
    title: 'Blog listing page',
    sections: [
      { key: 'banner_brand', label: 'Banner brand line', type: 'text' },
      { key: 'section_title', label: 'Section heading', type: 'text' },
      { key: 'section_subtitle', label: 'Section subtitle', type: 'text' },
      { key: 'empty_message', label: 'Empty state message (no posts)', type: 'textarea' },
    ],
  },
};

export default function EditPagePage() {
  const { toast } = useToast();
  const params = useParams();
  const slug = params?.slug;
  const [sections, setSections] = useState({});
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const config = slug === 'home' ? null : slug ? PAGE_CONFIGS[slug] : undefined;

  useEffect(() => {
    if (!slug || slug === 'home') {
      setLoading(false);
      return;
    }
    fetch(`/api/admin/pages/${slug}`, { credentials: 'same-origin' })
      .then((r) => r.json())
      .then((d) => {
        if (d.page) {
          let sec = d.page.sections || {};
          if (slug === 'about-us' && sec.about_blocks === undefined) {
            sec = { ...sec, about_blocks: legacyToAboutBlocks(sec) };
          }
          setSections(sec);
          setMetaTitle(d.page.metaTitle || '');
          setMetaDescription(d.page.metaDescription || '');
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [slug]);

  const handleSave = async () => {
    if (!slug || slug === 'home' || !config) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/pages/${slug}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({
          slug,
          title: config?.title || slug,
          sections,
          metaTitle: metaTitle.trim(),
          metaDescription: metaDescription.trim(),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      toast({ message: 'Page updated successfully', type: 'success' });
    } catch (err) {
      toast({ message: err.message || 'Failed to save', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  if (slug === 'home') {
    return (
      <div>
        <div className="ep-page-header">
          <div>
            <h1 className="ep-page-title">Homepage & site settings</h1>
            <p className="ep-page-subtitle">
              Edit the homepage sections, header/footer contact info, stats, SEO, and all global content previously under Settings.
            </p>
          </div>
          <Link href="/admin/pages" className="ep-btn-back">← All pages</Link>
        </div>
        <HomeSiteSettingsPanel />
        <style jsx global>{`
          .ep-page-header { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 20px; flex-wrap: wrap; gap: 12px; }
          .ep-page-title { font-size: 24px; font-weight: 800; color: #111827; margin-bottom: 4px; }
          .ep-page-subtitle { color: #6b7280; font-size: 14px; max-width: 640px; }
          .ep-btn-back { padding: 8px 16px; background: white; border: 1px solid #e5e7eb; border-radius: 8px; color: #374151; text-decoration: none; font-size: 13.5px; align-self: flex-start; }
        `}</style>
      </div>
    );
  }

  if (!config) {
    return (
      <div className="ep-error-page">
        <h1>Page not found</h1>
        <Link href="/admin/pages">← Back to Pages</Link>
        <style jsx global>{`
          .ep-error-page { padding: 40px; text-align: center; }
        `}</style>
      </div>
    );
  }

  return (
    <div>
      <div className="ep-page-header">
        <div>
          <h1 className="ep-page-title">Edit: {config.title}</h1>
          <p className="ep-page-subtitle">Manage content for this page</p>
        </div>
        <div className="ep-header-actions">
          <Link href="/admin/pages" className="ep-btn-back">← Back</Link>
          <button type="button" className="ep-btn-primary" onClick={handleSave} disabled={saving}>
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      {loading ? (
        <div className="ep-loading">Loading page data...</div>
      ) : (
        <div className="ep-sections-grid">
          <div className="ep-section-card ep-seo-card">
            <h3 className="ep-seo-heading">SEO / Page metadata</h3>
            <p className="ep-seo-hint">Used in the browser tab title and search-engine description for this page.</p>
            <label className="ep-section-label">Meta title</label>
            <input
              type="text"
              value={metaTitle}
              onChange={(e) => setMetaTitle(e.target.value)}
              placeholder="e.g. About Us"
            />
            <label className="ep-section-label">Meta description</label>
            <textarea
              value={metaDescription}
              onChange={(e) => setMetaDescription(e.target.value)}
              rows={3}
              placeholder="Short description for search engines (150–160 characters recommended)"
            />
          </div>
          {config.sections.map((section) => (
            <div key={section.key} className="ep-section-card">
              <label className="ep-section-label">{section.label}</label>
              {section.type === 'text' && (
                <input
                  type="text"
                  value={sections[section.key] || ''}
                  onChange={(e) => setSections((p) => ({ ...p, [section.key]: e.target.value }))}
                  placeholder={`Enter ${section.label.toLowerCase()}...`}
                />
              )}
              {section.type === 'textarea' && (
                <textarea
                  value={sections[section.key] || ''}
                  onChange={(e) => setSections((p) => ({ ...p, [section.key]: e.target.value }))}
                  rows={4}
                  placeholder={`Enter ${section.label.toLowerCase()}...`}
                />
              )}
              {section.type === 'editor' && (
                <RichEditor
                  value={sections[section.key] || ''}
                  onChange={(content) => setSections((p) => ({ ...p, [section.key]: content }))}
                />
              )}
              {section.type === 'about_blocks' && (
                <AboutBlocksEditor
                  value={Array.isArray(sections.about_blocks) ? sections.about_blocks : []}
                  onChange={(blocks) => setSections((p) => ({ ...p, about_blocks: blocks }))}
                  label={section.label}
                  hint={section.hint}
                />
              )}
            </div>
          ))}
        </div>
      )}

      <style jsx global>{`
        .ep-page-header { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 24px; flex-wrap: wrap; gap: 12px; }
        .ep-page-title { font-size: 24px; font-weight: 800; color: #111827; margin-bottom: 4px; }
        .ep-page-subtitle { color: #6b7280; font-size: 14px; }
        .ep-header-actions { display: flex; gap: 10px; align-items: center; flex-shrink: 0; }
        .ep-btn-back { padding: 8px 16px; background: white; border: 1px solid #e5e7eb; border-radius: 8px; color: #374151; text-decoration: none; font-size: 13.5px; }
        .ep-btn-primary { padding: 9px 20px; background: #006833; color: white; border: none; border-radius: 8px; font-size: 14px; font-weight: 600; cursor: pointer; }
        .ep-btn-primary:disabled { opacity: 0.7; cursor: not-allowed; }
        .ep-loading { padding: 40px; text-align: center; color: #9ca3af; }
        .ep-sections-grid { display: flex; flex-direction: column; gap: 16px; max-width: 800px; }
        .ep-seo-card { border-color: #d1fae5; background: #f9fefb; }
        .ep-seo-heading { font-size: 15px; font-weight: 800; color: #111827; margin: 0 0 4px; }
        .ep-seo-hint { font-size: 12px; color: #6b7280; margin: 0 0 8px; }
        .ep-section-card { background: white; border-radius: 12px; padding: 20px; box-shadow: 0 1px 4px rgba(0,0,0,0.06); border: 1px solid #f3f4f6; display: flex; flex-direction: column; gap: 8px; }
        .ep-section-label { font-size: 13px; font-weight: 600; color: #374151; }
        .ep-section-card input, .ep-section-card textarea {
          padding: 10px 12px; border: 1px solid #d1d5db; border-radius: 8px; font-size: 14px; outline: none; font-family: inherit;
        }
        .ep-section-card input:focus, .ep-section-card textarea:focus { border-color: #006833; box-shadow: 0 0 0 2px rgba(0,104,51,0.12); }
        .ep-section-card textarea { resize: vertical; }
      `}</style>
    </div>
  );
}
