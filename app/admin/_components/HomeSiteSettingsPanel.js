'use client';

import { useState, useEffect } from 'react';
import { useToast } from './Toast';
import ImageField from './ImageField';
import MultiImageManager from './MultiImageManager';
import StatsCardsJsonEditor from './cms/StatsCardsJsonEditor';
import LinkListJsonEditor from './cms/LinkListJsonEditor';
import SocialIconsJsonEditor from './cms/SocialIconsJsonEditor';
import FooterContactJsonEditor from './cms/FooterContactJsonEditor';
import { SITE_SETTINGS_GROUPS } from '../_data/siteSettingsGroups';

export default function HomeSiteSettingsPanel() {
  const { toast } = useToast();
  const [values, setValues] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeGroup, setActiveGroup] = useState('general');

  useEffect(() => {
    fetch('/api/admin/settings', { credentials: 'same-origin' })
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
        credentials: 'same-origin',
        body: JSON.stringify({ settings: values }),
      });
      if (!res.ok) throw new Error('Failed');
      toast({ message: 'Site settings saved successfully!', type: 'success' });
    } catch {
      toast({ message: 'Failed to save settings', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const currentGroup = SITE_SETTINGS_GROUPS.find((g) => g.id === activeGroup) || SITE_SETTINGS_GROUPS[0];

  return (
    <div className="hssp-root">
      <div className="hssp-header">
        <button className="hssp-save-btn" type="button" onClick={handleSave} disabled={saving || loading}>
          {saving ? (
            <>
              <span className="hssp-spinner" />
              Saving…
            </>
          ) : (
            <>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
              Save all site settings
            </>
          )}
        </button>
      </div>

      <div className="hssp-layout">
        <nav className="hssp-nav">
          {SITE_SETTINGS_GROUPS.map((g) => (
            <button
              key={g.id}
              type="button"
              className={`hssp-nav-item${activeGroup === g.id ? ' hssp-nav-active' : ''}`}
              onClick={() => setActiveGroup(g.id)}
            >
              {g.label}
            </button>
          ))}
        </nav>

        <div className="hssp-panel">
          {loading ? (
            <div className="hssp-loading">Loading settings…</div>
          ) : (
            <>
              <h2 className="hssp-group-title">{currentGroup.label}</h2>
              <div className="hssp-fields">
                {currentGroup.fields.map((f) => (
                  <div key={f.key} className="hssp-field">
                    {f.type === 'multi_image' ? (
                      <MultiImageManager
                        value={values[f.key] || ''}
                        onChange={(val) => setValues((prev) => ({ ...prev, [f.key]: val }))}
                        label={f.label}
                        hint={f.hint}
                      />
                    ) : f.type === 'stats_cards_json' ? (
                      <StatsCardsJsonEditor
                        value={values[f.key] || ''}
                        onChange={(val) => setValues((prev) => ({ ...prev, [f.key]: val }))}
                        label={f.label}
                        hint={f.hint}
                      />
                    ) : f.type === 'link_list_json' ? (
                      <LinkListJsonEditor
                        value={values[f.key] || ''}
                        onChange={(val) => setValues((prev) => ({ ...prev, [f.key]: val }))}
                        label={f.label}
                        hint={f.hint}
                      />
                    ) : f.type === 'social_icons_json' ? (
                      <SocialIconsJsonEditor
                        value={values[f.key] || ''}
                        onChange={(val) => setValues((prev) => ({ ...prev, [f.key]: val }))}
                        label={f.label}
                        hint={f.hint}
                      />
                    ) : f.type === 'footer_contact_json' ? (
                      <FooterContactJsonEditor
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
                        <label className="hssp-label">
                          {f.label}
                          {f.hint && <span className="hssp-hint">{f.hint}</span>}
                        </label>
                        {f.type === 'textarea' ? (
                          <textarea
                            className="hssp-textarea"
                            value={values[f.key] || ''}
                            onChange={set(f.key)}
                            rows={4}
                            placeholder={`Enter ${f.label.toLowerCase()}`}
                          />
                        ) : (
                          <input
                            type="text"
                            className="hssp-input"
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
              <div className="hssp-panel-footer">
                <button type="button" className="hssp-save-btn" onClick={handleSave} disabled={saving}>
                  {saving ? 'Saving…' : 'Save settings'}
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <style jsx global>{`
        .hssp-root { padding-bottom: 40px; }
        .hssp-header { display: flex !important; align-items: center !important; justify-content: flex-end; margin-bottom: 20px; flex-wrap: wrap; gap: 12px; }

        .hssp-save-btn {
          display: inline-flex !important; align-items: center !important; gap: 8px;
          padding: 10px 22px; background: #006833; color: white;
          border: none; border-radius: 8px; font-size: 14px; font-weight: 600;
          cursor: pointer; transition: all 0.2s;
        }
        .hssp-save-btn:hover:not(:disabled) { background: #004d26; }
        .hssp-save-btn:disabled { opacity: 0.6; cursor: not-allowed; }
        .hssp-spinner { width: 14px; height: 14px; border: 2px solid rgba(255,255,255,0.3); border-top-color: white; border-radius: 50%; animation: hsspSpin 0.7s linear infinite; display: inline-block; }
        @keyframes hsspSpin { to { transform: rotate(360deg); } }

        .hssp-layout { display: grid !important; grid-template-columns: 220px 1fr; gap: 24px; align-items: start; }
        @media(max-width:768px){ .hssp-layout{ grid-template-columns: 1fr !important; } .hssp-nav{ display: flex !important; flex-wrap: wrap; gap: 6px; } }

        .hssp-nav { background: white; border-radius: 12px; padding: 10px; box-shadow: 0 1px 4px rgba(0,0,0,0.06); border: 1px solid #f0f0f0; display: flex !important; flex-direction: column !important; gap: 2px; }
        .hssp-nav-item { width: 100%; text-align: left; padding: 10px 14px; border-radius: 8px; border: none; background: transparent; font-size: 13px; font-weight: 500; color: #444; cursor: pointer; transition: all 0.18s; }
        .hssp-nav-item:hover { background: #f0faf5; color: #006833; }
        .hssp-nav-active { background: #006833 !important; color: white !important; font-weight: 700; }

        .hssp-panel { background: white; border-radius: 12px; padding: 28px 32px; box-shadow: 0 1px 4px rgba(0,0,0,0.06); border: 1px solid #f0f0f0; }
        .hssp-loading { text-align: center; padding: 48px; color: #999; }
        .hssp-group-title { font-size: 17px; font-weight: 800; color: #111; margin-bottom: 24px; padding-bottom: 14px; border-bottom: 2px solid #f0f0f0; }

        .hssp-fields { display: flex !important; flex-direction: column !important; gap: 20px; }
        .hssp-field { display: flex !important; flex-direction: column !important; gap: 6px; }
        .hssp-label { font-size: 13px; font-weight: 600; color: #374151; }
        .hssp-hint { display: block; font-size: 11.5px; font-weight: 400; color: #9ca3af; margin-top: 2px; }
        .hssp-input, .hssp-textarea {
          padding: 10px 14px; border: 1.5px solid #e5e7eb; border-radius: 8px;
          font-size: 14px; color: #111; outline: none; font-family: inherit;
          transition: border-color 0.2s;
        }
        .hssp-input:focus, .hssp-textarea:focus { border-color: #006833; box-shadow: 0 0 0 3px rgba(0,104,51,0.1); }
        .hssp-textarea { resize: vertical; min-height: 90px; }

        .hssp-panel-footer { margin-top: 28px; padding-top: 20px; border-top: 1px solid #f0f0f0; display: flex !important; justify-content: flex-end; }
      `}</style>
    </div>
  );
}
