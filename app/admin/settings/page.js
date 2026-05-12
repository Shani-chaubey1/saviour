'use client';
import { useState, useEffect } from 'react';
import { useToast } from '../_components/Toast';
import ImageField from '../_components/ImageField';
import MultiImageManager from '../_components/MultiImageManager';

const GROUPS = [
  {
    id: 'general',
    label: '🏢 General',
    fields: [
      { key: 'site_name', label: 'Site Name', type: 'text' },
      { key: 'site_tagline', label: 'Tagline', type: 'text' },
      { key: 'site_phone', label: 'Phone (Primary / Toll Free)', type: 'text' },
      { key: 'site_phone_2', label: 'Phone (Mobile)', type: 'text' },
      { key: 'site_email', label: 'Email', type: 'text' },
      { key: 'site_address', label: 'Office Address', type: 'textarea' },
    ],
  },
  {
    id: 'stats',
    label: '📊 Homepage Stats',
    fields: [
      { key: 'stat_years', label: 'Years of Experience (e.g. 25+)', type: 'text' },
      { key: 'stat_projects', label: 'Projects Delivered (e.g. 50+)', type: 'text' },
      { key: 'stat_families', label: 'Happy Families (e.g. 10,000+)', type: 'text' },
      { key: 'stat_assets', label: 'Assets Delivered (e.g. ₹500Cr+)', type: 'text' },
    ],
  },
  {
    id: 'social',
    label: '🔗 Social Media',
    fields: [
      { key: 'site_facebook', label: 'Facebook URL', type: 'text' },
      { key: 'site_instagram', label: 'Instagram URL', type: 'text' },
      { key: 'site_youtube', label: 'YouTube URL', type: 'text' },
      { key: 'site_twitter', label: 'Twitter / X URL', type: 'text' },
    ],
  },
  {
    id: 'certifications',
    label: '🏅 Certifications Banner (Below Hero)',
    fields: [
      { key: 'cert_heading', label: 'Section Heading', type: 'text', hint: 'e.g. RERA Registered Projects & Member of CREDAI' },
      { key: 'cert_logo_1', label: 'Certification Logo 1 (RERA)', type: 'image', hint: 'Large certification logo — e.g. RERA Approved seal' },
      { key: 'cert_logo_1_alt', label: 'Logo 1 Alt Text', type: 'text' },
      { key: 'cert_logo_2', label: 'Certification Logo 2 (CREDAI)', type: 'image', hint: 'Large certification logo — e.g. CREDAI Member badge' },
      { key: 'cert_logo_2_alt', label: 'Logo 2 Alt Text', type: 'text' },
      { key: 'cert_partner_logos', label: 'Partner / Project Logos', type: 'multi_image', hint: 'Upload or paste URLs. Each logo appears in the strip below the RERA/CREDAI badges.' },
    ],
  },
  {
    id: 'trust',
    label: '🏆 Trust Banner (Homepage)',
    fields: [
      { key: 'trust_intro', label: 'Intro Paragraph', type: 'textarea', hint: 'The paragraph below the company name in the Trust Banner.' },
      { key: 'trust_credential_1', label: 'Credential Badge 1 (e.g. RERA Registered Projects)', type: 'text' },
      { key: 'trust_credential_2', label: 'Credential Badge 2 (e.g. Member of CREDAI)', type: 'text' },
    ],
  },
  {
    id: 'about',
    label: '🌿 About Section (Homepage)',
    fields: [
      { key: 'about_heading', label: 'Section Heading', type: 'text' },
      { key: 'about_subtitle', label: 'Section Subtitle', type: 'text' },
      { key: 'about_desc_1', label: 'Paragraph 1', type: 'textarea' },
      { key: 'about_desc_2', label: 'Paragraph 2', type: 'textarea' },
      { key: 'about_image', label: 'Side Image', type: 'image', hint: 'Shown left of the about text.' },
      { key: 'about_full_image', label: 'Bottom Full-Width Image', type: 'image', hint: 'Displayed as a full-width band below the about section.' },
      { key: 'about_badge_num', label: 'Badge Number (e.g. 25+)', type: 'text' },
      { key: 'about_badge_text', label: 'Badge Text (e.g. Years of Excellence)', type: 'text' },
      { key: 'about_points', label: 'Bullet Points', type: 'textarea', hint: 'One point per line.' },
      { key: 'about_cta_label', label: 'CTA Button Label', type: 'text' },
      { key: 'about_cta_url', label: 'CTA Button URL', type: 'text' },
    ],
  },
  {
    id: 'mission',
    label: '🎯 Mission / Vision / Quality (Homepage)',
    fields: [
      { key: 'mission_title', label: 'Card 1 Title', type: 'text' },
      { key: 'mission_desc', label: 'Card 1 Description', type: 'textarea' },
      { key: 'vision_title', label: 'Card 2 Title', type: 'text' },
      { key: 'vision_desc', label: 'Card 2 Description', type: 'textarea' },
      { key: 'quality_title', label: 'Card 3 Title', type: 'text' },
      { key: 'quality_desc', label: 'Card 3 Description', type: 'textarea' },
    ],
  },
  {
    id: 'whyus',
    label: '💡 Why Choose Us (Homepage)',
    fields: [
      { key: 'why_1_title', label: 'Pillar 1 Title', type: 'text' },
      { key: 'why_1_desc', label: 'Pillar 1 Description', type: 'textarea' },
      { key: 'why_2_title', label: 'Pillar 2 Title', type: 'text' },
      { key: 'why_2_desc', label: 'Pillar 2 Description', type: 'textarea' },
      { key: 'why_3_title', label: 'Pillar 3 Title', type: 'text' },
      { key: 'why_3_desc', label: 'Pillar 3 Description', type: 'textarea' },
    ],
  },
  {
    id: 'launching',
    label: '🚀 Launching Soon Banner (Homepage)',
    fields: [
      { key: 'launching_soon_title', label: 'Project Name', type: 'text' },
      { key: 'launching_soon_desc', label: 'Description', type: 'textarea' },
      { key: 'launching_soon_tags', label: 'Tags (comma-separated)', type: 'text', hint: 'e.g. 🌳 7.5-Acre Park,🏠 3 & 4 BHK,✨ 192 Units Only' },
    ],
  },
  {
    id: 'developments',
    label: '🏗️ Developments Section (Homepage)',
    fields: [
      { key: 'dev_1_title', label: 'Card 1 Title', type: 'text' },
      { key: 'dev_1_desc', label: 'Card 1 Description', type: 'textarea' },
      { key: 'dev_1_image', label: 'Card 1 Image', type: 'image' },
      { key: 'dev_1_link', label: 'Card 1 Link', type: 'text' },
      { key: 'dev_1_tag', label: 'Card 1 Tag Label (e.g. Residential)', type: 'text' },
      { key: 'dev_2_title', label: 'Card 2 Title', type: 'text' },
      { key: 'dev_2_desc', label: 'Card 2 Description', type: 'textarea' },
      { key: 'dev_2_image', label: 'Card 2 Image', type: 'image' },
      { key: 'dev_2_link', label: 'Card 2 Link', type: 'text' },
      { key: 'dev_2_tag', label: 'Card 2 Tag Label (e.g. Commercial)', type: 'text' },
      { key: 'dev_3_title', label: 'Card 3 Title', type: 'text' },
      { key: 'dev_3_desc', label: 'Card 3 Description', type: 'textarea' },
      { key: 'dev_3_image', label: 'Card 3 Image', type: 'image' },
      { key: 'dev_3_link', label: 'Card 3 Link', type: 'text' },
      { key: 'dev_3_tag', label: 'Card 3 Tag Label (e.g. Investor)', type: 'text' },
    ],
  },
  {
    id: 'seo',
    label: '🔍 SEO & Analytics',
    fields: [
      { key: 'meta_title', label: 'Default Meta Title', type: 'text' },
      { key: 'meta_description', label: 'Default Meta Description', type: 'textarea' },
      { key: 'google_analytics_id', label: 'Google Analytics ID', type: 'text' },
    ],
  },
];

export default function SettingsPage() {
  const { toast } = useToast();
  const [values, setValues] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeGroup, setActiveGroup] = useState('general');

  useEffect(() => {
    fetch('/api/admin/settings')
      .then((r) => r.json())
      .then((data) => {
        if (data.settings) setValues(data.settings);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const set = (key) => (e) =>
    setValues((prev) => ({ ...prev, [key]: e.target.value }));

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settings: values }),
      });
      if (!res.ok) throw new Error('Failed');
      toast({ message: 'Settings saved successfully!', type: 'success' });
    } catch {
      toast({ message: 'Failed to save settings', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const currentGroup = GROUPS.find((g) => g.id === activeGroup) || GROUPS[0];

  return (
    <div className="sp-root">
      <div className="sp-header">
        <div>
          <h1 className="sp-title">Site Settings</h1>
          <p className="sp-subtitle">Manage all website content and configuration from here</p>
        </div>
        <button className="sp-save-btn" onClick={handleSave} disabled={saving || loading}>
          {saving ? (
            <>
              <span className="sp-spinner" />
              Saving…
            </>
          ) : (
            <>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
              Save All Settings
            </>
          )}
        </button>
      </div>

      <div className="sp-layout">
        {/* Sidebar nav */}
        <nav className="sp-nav">
          {GROUPS.map((g) => (
            <button
              key={g.id}
              className={`sp-nav-item${activeGroup === g.id ? ' sp-nav-active' : ''}`}
              onClick={() => setActiveGroup(g.id)}
            >
              {g.label}
            </button>
          ))}
        </nav>

        {/* Fields panel */}
        <div className="sp-panel">
          {loading ? (
            <div className="sp-loading">Loading settings…</div>
          ) : (
            <>
              <h2 className="sp-group-title">{currentGroup.label}</h2>
              <div className="sp-fields">
                {currentGroup.fields.map((f) => (
                  <div key={f.key} className="sp-field">
                    {f.type === 'multi_image' ? (
                      <MultiImageManager
                        value={values[f.key] || ''}
                        onChange={(val) => setValues((prev) => ({ ...prev, [f.key]: val }))}
                        label={f.label}
                        hint={f.hint}
                      />
                    ) : f.type === 'image' ? (
                      <ImageField
                        value={values[f.key] || ''}
                        onChange={(url) => setValues((prev) => ({ ...prev, [f.key]: url }))}
                        label={f.label}
                        hint={f.hint}
                        previewW={280}
                        previewH={160}
                      />
                    ) : (
                      <>
                        <label className="sp-label">
                          {f.label}
                          {f.hint && <span className="sp-hint">{f.hint}</span>}
                        </label>
                        {f.type === 'textarea' ? (
                          <textarea
                            className="sp-textarea"
                            value={values[f.key] || ''}
                            onChange={set(f.key)}
                            rows={4}
                            placeholder={`Enter ${f.label.toLowerCase()}`}
                          />
                        ) : (
                          <input
                            type="text"
                            className="sp-input"
                            value={values[f.key] || ''}
                            onChange={set(f.key)}
                            placeholder={`Enter ${f.label.toLowerCase()}`}
                          />
                        )}
                      </>
                    )}
                  </div>
                ))}
              </div>
              <div className="sp-panel-footer">
                <button className="sp-save-btn" onClick={handleSave} disabled={saving}>
                  {saving ? 'Saving…' : 'Save Settings'}
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <style jsx global>{`
        .sp-root { padding-bottom: 40px; }
        .sp-header { display: flex !important; align-items: center !important; justify-content: space-between; margin-bottom: 28px; flex-wrap: wrap; gap: 12px; }
        .sp-title { font-size: 24px; font-weight: 800; color: #111827; margin-bottom: 4px; }
        .sp-subtitle { color: #6b7280; font-size: 14px; }

        .sp-save-btn {
          display: inline-flex !important; align-items: center !important; gap: 8px;
          padding: 10px 22px; background: #006833; color: white;
          border: none; border-radius: 8px; font-size: 14px; font-weight: 600;
          cursor: pointer; transition: all 0.2s;
        }
        .sp-save-btn:hover:not(:disabled) { background: #004d26; }
        .sp-save-btn:disabled { opacity: 0.6; cursor: not-allowed; }
        .sp-spinner { width: 14px; height: 14px; border: 2px solid rgba(255,255,255,0.3); border-top-color: white; border-radius: 50%; animation: spSpin 0.7s linear infinite; display: inline-block; }
        @keyframes spSpin { to { transform: rotate(360deg); } }

        .sp-layout { display: grid !important; grid-template-columns: 220px 1fr; gap: 24px; align-items: start; }
        @media(max-width:768px){ .sp-layout{ grid-template-columns: 1fr !important; } .sp-nav{ display: flex !important; flex-wrap: wrap; gap: 6px; } }

        .sp-nav { background: white; border-radius: 12px; padding: 10px; box-shadow: 0 1px 4px rgba(0,0,0,0.06); border: 1px solid #f0f0f0; display: flex !important; flex-direction: column !important; gap: 2px; }
        .sp-nav-item { width: 100%; text-align: left; padding: 10px 14px; border-radius: 8px; border: none; background: transparent; font-size: 13px; font-weight: 500; color: #444; cursor: pointer; transition: all 0.18s; }
        .sp-nav-item:hover { background: #f0faf5; color: #006833; }
        .sp-nav-active { background: #006833 !important; color: white !important; font-weight: 700; }

        .sp-panel { background: white; border-radius: 12px; padding: 28px 32px; box-shadow: 0 1px 4px rgba(0,0,0,0.06); border: 1px solid #f0f0f0; }
        .sp-loading { text-align: center; padding: 48px; color: #999; }
        .sp-group-title { font-size: 17px; font-weight: 800; color: #111; margin-bottom: 24px; padding-bottom: 14px; border-bottom: 2px solid #f0f0f0; }

        .sp-fields { display: flex !important; flex-direction: column !important; gap: 20px; }
        .sp-field { display: flex !important; flex-direction: column !important; gap: 6px; }
        .sp-label { font-size: 13px; font-weight: 600; color: #374151; }
        .sp-hint { display: block; font-size: 11.5px; font-weight: 400; color: #9ca3af; margin-top: 2px; }
        .sp-input, .sp-textarea {
          padding: 10px 14px; border: 1.5px solid #e5e7eb; border-radius: 8px;
          font-size: 14px; color: #111; outline: none; font-family: inherit;
          transition: border-color 0.2s;
        }
        .sp-input:focus, .sp-textarea:focus { border-color: #006833; box-shadow: 0 0 0 3px rgba(0,104,51,0.1); }
        .sp-textarea { resize: vertical; min-height: 90px; }

        .sp-panel-footer { margin-top: 28px; padding-top: 20px; border-top: 1px solid #f0f0f0; display: flex !important; justify-content: flex-end; }
      `}</style>
    </div>
  );
}
