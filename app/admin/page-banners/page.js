'use client';

import { useState, useEffect } from 'react';
import { useToast } from '../_components/Toast';
import ImageField from '../_components/ImageField';

const BANNER_FIELDS = [
  {
    key: 'banner_image_default',
    label: 'Default Banner (Fallback)',
    hint: 'Used on any page that does not have its own banner image set. Leave empty to use the built-in default.',
  },
  { key: 'banner_image_about', label: 'About Us Page', hint: 'Top intro banner on /about-us' },
  { key: 'banner_image_contact', label: 'Contact Us Page', hint: 'Top intro banner on /contact-us' },
  { key: 'banner_image_projects', label: 'Projects Page (All)', hint: 'Top intro banner on /projects. Also used as fallback for Residential/Commercial when their own banner is empty.' },
  { key: 'banner_image_projects_residential', label: 'Projects Page — Residential', hint: 'Top intro banner on /projects?type=residential. Falls back to the All Projects banner if empty.' },
  { key: 'banner_image_projects_commercial', label: 'Projects Page — Commercial', hint: 'Top intro banner on /projects?type=commercial. Falls back to the All Projects banner if empty.' },
  { key: 'banner_image_blog', label: 'Blog Pages', hint: 'Top intro banner on the blog list and blog post pages' },
  { key: 'banner_image_property', label: 'Property Detail Pages', hint: 'Top intro banner on individual project/property pages' },
  { key: 'banner_image_content', label: 'Content Pages', hint: 'Top intro banner on legal / misc content pages' },
];

const BANNER_KEYS = BANNER_FIELDS.map((f) => f.key);

export default function PageBannersAdmin() {
  const { toast } = useToast();
  const [values, setValues] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch('/api/admin/settings', { credentials: 'same-origin' })
      .then((r) => r.json())
      .then((data) => {
        if (data.settings) {
          const next = {};
          BANNER_KEYS.forEach((k) => { next[k] = data.settings[k] || ''; });
          setValues(next);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({ settings: values }),
      });
      if (!res.ok) throw new Error('Failed');
      toast({ message: 'Page banners saved successfully!', type: 'success' });
    } catch {
      toast({ message: 'Failed to save page banners', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="pba-root">
      <div className="pba-header">
        <div>
          <h1 className="pba-title">Page Banners</h1>
          <p className="pba-subtitle">
            Upload the top intro banner image for each page. Images are shown with a max height of 500px.
            If a page has no image, the default fallback (or the built-in image) is used.
          </p>
        </div>
        <button className="pba-save-btn" type="button" onClick={handleSave} disabled={saving || loading}>
          {saving ? 'Saving…' : 'Save banners'}
        </button>
      </div>

      {loading ? (
        <div className="pba-loading">Loading banners…</div>
      ) : (
        <div className="pba-grid">
          {BANNER_FIELDS.map((f) => (
            <div key={f.key} className="pba-card">
              <ImageField
                value={values[f.key] || ''}
                onChange={(url) => setValues((prev) => ({ ...prev, [f.key]: url }))}
                label={f.label}
                hint={f.hint}
                previewW={320}
                previewH={160}
              />
            </div>
          ))}
        </div>
      )}

      <div className="pba-footer">
        <button type="button" className="pba-save-btn" onClick={handleSave} disabled={saving || loading}>
          {saving ? 'Saving…' : 'Save banners'}
        </button>
      </div>

      <style jsx global>{`
        .pba-root { padding-bottom: 40px; }
        .pba-header { display: flex !important; align-items: flex-start !important; justify-content: space-between; margin-bottom: 24px; flex-wrap: wrap; gap: 12px; }
        .pba-title { font-size: 24px; font-weight: 800; color: #111827; margin-bottom: 4px; }
        .pba-subtitle { color: #6b7280; font-size: 14px; max-width: 680px; }
        .pba-save-btn { display: inline-flex !important; align-items: center !important; gap: 8px; padding: 10px 22px; background: #006833; color: white; border: none; border-radius: 8px; font-size: 14px; font-weight: 600; cursor: pointer; transition: all 0.2s; white-space: nowrap; }
        .pba-save-btn:hover:not(:disabled) { background: #004d26; }
        .pba-save-btn:disabled { opacity: 0.6; cursor: not-allowed; }
        .pba-loading { text-align: center; padding: 48px; color: #999; }
        .pba-grid { display: grid !important; grid-template-columns: repeat(auto-fill, minmax(340px, 1fr)); gap: 20px; }
        .pba-card { background: white; border-radius: 12px; padding: 20px 22px; box-shadow: 0 1px 4px rgba(0,0,0,0.06); border: 1px solid #f0f0f0; }
        .pba-footer { margin-top: 28px; display: flex !important; justify-content: flex-end; }
      `}</style>
    </div>
  );
}
