'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import RichEditor from '../../_components/RichEditor';
import { useToast } from '../../_components/Toast';

const PAGE_CONFIGS = {
  home: {
    title: 'Homepage',
    sections: [
      { key: 'hero_title', label: 'Hero Title', type: 'text' },
      { key: 'hero_subtitle', label: 'Hero Subtitle', type: 'text' },
      { key: 'about_title', label: 'About Section Title', type: 'text' },
      { key: 'about_content', label: 'About Section Content', type: 'textarea' },
      { key: 'why_us_title', label: 'Why Us Section Title', type: 'text' },
    ],
  },
  'about-us': {
    title: 'About Us',
    sections: [
      { key: 'page_title', label: 'Page Title', type: 'text' },
      { key: 'intro', label: 'Introduction', type: 'editor' },
      { key: 'chairman_message', label: "Chairman's Message", type: 'editor' },
      { key: 'mission', label: 'Mission Statement', type: 'textarea' },
      { key: 'vision', label: 'Vision Statement', type: 'textarea' },
      { key: 'tagline', label: 'Company Tagline', type: 'text' },
    ],
  },
  'contact-us': {
    title: 'Contact Us',
    sections: [
      { key: 'address', label: 'Office Address', type: 'textarea' },
      { key: 'phone', label: 'Phone Number', type: 'text' },
      { key: 'email', label: 'Email Address', type: 'text' },
      { key: 'working_hours', label: 'Working Hours', type: 'text' },
      { key: 'map_embed', label: 'Google Maps Embed URL', type: 'text' },
    ],
  },
  projects: {
    title: 'Commercial Projects',
    sections: [
      { key: 'page_title', label: 'Page Title', type: 'text' },
      { key: 'description', label: 'Page Description', type: 'textarea' },
    ],
  },
  'resedential-projects': {
    title: 'Residential Projects',
    sections: [
      { key: 'page_title', label: 'Page Title', type: 'text' },
      { key: 'description', label: 'Page Description', type: 'textarea' },
    ],
  },
};

export default function EditPagePage() {
  const { toast } = useToast();
  const params = useParams();
  const slug = params?.slug;
  const [sections, setSections] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const config = slug ? PAGE_CONFIGS[slug] : null;

  useEffect(() => {
    if (!slug) return;
    fetch(`/api/admin/pages/${slug}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.page) setSections(d.page.sections || {});
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [slug]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/pages/${slug}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug, title: config?.title || slug, sections }),
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

  if (!config) {
    return (
      <div className="error-page">
        <h1>Page not found</h1>
        <Link href="/admin/pages">← Back to Pages</Link>
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Edit: {config.title}</h1>
          <p className="page-subtitle">Manage content sections for this page</p>
        </div>
        <div className="header-actions">
          <Link href="/admin/pages" className="btn-back">← Back</Link>
          <button className="btn-primary" onClick={handleSave} disabled={saving}>
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      {loading ? (
        <div className="loading">Loading page data...</div>
      ) : (
        <div className="sections-grid">
          {config.sections.map((section) => (
            <div key={section.key} className="section-card">
              <label className="section-label">{section.label}</label>
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
            </div>
          ))}
        </div>
      )}

      <style jsx global>{`
        .page-header { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 24px; flex-wrap: wrap; gap: 12px; }
        .page-title { font-size: 24px; font-weight: 800; color: #111827; margin-bottom: 4px; }
        .page-subtitle { color: #6b7280; font-size: 14px; }
        .header-actions { display: flex; gap: 10px; align-items: center; flex-shrink: 0; }
        .btn-back { padding: 8px 16px; background: white; border: 1px solid #e5e7eb; border-radius: 8px; color: #374151; text-decoration: none; font-size: 13.5px; }
        .btn-primary { padding: 9px 20px; background: #006833; color: white; border: none; border-radius: 8px; font-size: 14px; font-weight: 600; cursor: pointer; }
        .btn-primary:disabled { opacity: 0.7; cursor: not-allowed; }
        .loading { padding: 40px; text-align: center; color: #9ca3af; }
        .sections-grid { display: flex; flex-direction: column; gap: 16px; max-width: 800px; }
        .section-card { background: white; border-radius: 12px; padding: 20px; box-shadow: 0 1px 4px rgba(0,0,0,0.06); border: 1px solid #f3f4f6; display: flex; flex-direction: column; gap: 8px; }
        .section-label { font-size: 13px; font-weight: 600; color: #374151; }
        .section-card input, .section-card textarea {
          padding: 10px 12px; border: 1px solid #d1d5db; border-radius: 8px; font-size: 14px; outline: none; font-family: inherit;
        }
        .section-card input:focus, .section-card textarea:focus { border-color: #006833; box-shadow: 0 0 0 2px rgba(0,104,51,0.12); }
        .section-card textarea { resize: vertical; }
        .error-page { padding: 40px; text-align: center; }
      `}</style>
    </div>
  );
}
