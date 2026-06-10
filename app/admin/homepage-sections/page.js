'use client';

import { useState, useEffect } from 'react';
import { FaArrowUp, FaArrowDown } from 'react-icons/fa';
import { useToast } from '../_components/Toast';

const ORDER_KEY = 'homepage_section_order_json';

const SECTION_LABELS = {
  hero: { label: 'Hero Slider', desc: 'Full-width image slider at the very top' },
  trust: { label: 'Trust Banner', desc: 'Stats strip (years, projects, families…)' },
  certifications: { label: 'Certifications / RERA', desc: 'RERA & CREDAI logos and partners' },
  about: { label: 'About Section', desc: 'Company intro band' },
  projects: { label: 'Current & Future Projects', desc: 'Project cards grid' },
  townships: { label: 'Townships / Locations', desc: 'Location cards' },
  launching: { label: 'Launching Soon Banner', desc: 'Upcoming launch call-to-action' },
  developments: { label: 'Explore More / Developments', desc: 'Residential, commercial & investor links' },
};

const DEFAULT_ORDER = Object.keys(SECTION_LABELS).map((key) => ({ key, enabled: true }));

function parseOrder(raw) {
  let parsed = [];
  try {
    const value = typeof raw === 'string' ? JSON.parse(raw) : raw;
    if (Array.isArray(value)) parsed = value;
  } catch {
    parsed = [];
  }

  const seen = new Set();
  const order = [];
  parsed.forEach((item) => {
    const key = typeof item === 'string' ? item : item?.key;
    if (!key || seen.has(key) || !SECTION_LABELS[key]) return;
    seen.add(key);
    order.push({ key, enabled: item?.enabled !== false });
  });
  DEFAULT_ORDER.forEach(({ key }) => {
    if (!seen.has(key)) order.push({ key, enabled: true });
  });
  return order;
}

export default function HomepageSectionsAdmin() {
  const { toast } = useToast();
  const [order, setOrder] = useState(DEFAULT_ORDER);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch('/api/admin/settings', { credentials: 'same-origin' })
      .then((r) => r.json())
      .then((data) => {
        if (data.settings) setOrder(parseOrder(data.settings[ORDER_KEY]));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const move = (index, dir) => {
    const target = index + dir;
    if (target < 0 || target >= order.length) return;
    setOrder((prev) => {
      const next = [...prev];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  };

  const toggle = (index) => {
    setOrder((prev) => prev.map((s, i) => (i === index ? { ...s, enabled: !s.enabled } : s)));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({ settings: { [ORDER_KEY]: JSON.stringify(order) } }),
      });
      if (!res.ok) throw new Error('Failed');
      toast({ message: 'Homepage order saved successfully!', type: 'success' });
    } catch {
      toast({ message: 'Failed to save homepage order', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="hso-root">
      <div className="hso-header">
        <div>
          <h1 className="hso-title">Homepage Sections</h1>
          <p className="hso-subtitle">
            Rearrange the order of homepage sections and toggle their visibility. The website homepage
            renders sections in this exact order.
          </p>
        </div>
        <button className="hso-save-btn" type="button" onClick={handleSave} disabled={saving || loading}>
          {saving ? 'Saving…' : 'Save order'}
        </button>
      </div>

      {loading ? (
        <div className="hso-loading">Loading sections…</div>
      ) : (
        <ul className="hso-list">
          {order.map((s, i) => {
            const meta = SECTION_LABELS[s.key] || { label: s.key, desc: '' };
            return (
              <li key={s.key} className={`hso-item${s.enabled ? '' : ' hso-disabled'}`}>
                <span className="hso-index">{i + 1}</span>
                <div className="hso-info">
                  <span className="hso-name">{meta.label}</span>
                  <span className="hso-desc">{meta.desc}</span>
                </div>
                <label className="hso-toggle" title={s.enabled ? 'Visible' : 'Hidden'}>
                  <input type="checkbox" checked={s.enabled} onChange={() => toggle(i)} />
                  <span>{s.enabled ? 'Visible' : 'Hidden'}</span>
                </label>
                <div className="hso-arrows">
                  <button
                    type="button"
                    className="hso-arrow"
                    onClick={() => move(i, -1)}
                    disabled={i === 0}
                    aria-label={`Move ${meta.label} up`}
                  >
                    <FaArrowUp size={12} />
                  </button>
                  <button
                    type="button"
                    className="hso-arrow"
                    onClick={() => move(i, 1)}
                    disabled={i === order.length - 1}
                    aria-label={`Move ${meta.label} down`}
                  >
                    <FaArrowDown size={12} />
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      <div className="hso-footer">
        <button type="button" className="hso-save-btn" onClick={handleSave} disabled={saving || loading}>
          {saving ? 'Saving…' : 'Save order'}
        </button>
      </div>

      <style jsx global>{`
        .hso-root { padding-bottom: 40px; }
        .hso-header { display: flex !important; align-items: flex-start !important; justify-content: space-between; margin-bottom: 24px; flex-wrap: wrap; gap: 12px; }
        .hso-title { font-size: 24px; font-weight: 800; color: #111827; margin-bottom: 4px; }
        .hso-subtitle { color: #6b7280; font-size: 14px; max-width: 680px; }
        .hso-save-btn { display: inline-flex !important; align-items: center !important; gap: 8px; padding: 10px 22px; background: #006833; color: white; border: none; border-radius: 8px; font-size: 14px; font-weight: 600; cursor: pointer; transition: all 0.2s; white-space: nowrap; }
        .hso-save-btn:hover:not(:disabled) { background: #004d26; }
        .hso-save-btn:disabled { opacity: 0.6; cursor: not-allowed; }
        .hso-loading { text-align: center; padding: 48px; color: #999; }

        .hso-list { list-style: none; margin: 0; padding: 0; display: flex !important; flex-direction: column !important; gap: 10px; }
        .hso-item { display: flex !important; align-items: center !important; gap: 14px; background: white; border: 1px solid #f0f0f0; border-radius: 12px; padding: 14px 18px; box-shadow: 0 1px 4px rgba(0,0,0,0.06); transition: opacity 0.2s; }
        .hso-item.hso-disabled { opacity: 0.55; }
        .hso-index { width: 28px; height: 28px; flex-shrink: 0; border-radius: 50%; background: #f0faf5; color: #006833; font-weight: 700; font-size: 13px; display: flex !important; align-items: center !important; justify-content: center !important; }
        .hso-info { display: flex !important; flex-direction: column !important; gap: 2px; flex: 1; min-width: 0; }
        .hso-name { font-size: 14.5px; font-weight: 700; color: #111827; }
        .hso-desc { font-size: 12.5px; color: #9ca3af; }
        .hso-toggle { display: inline-flex !important; align-items: center !important; gap: 6px; font-size: 12.5px; font-weight: 600; color: #374151; cursor: pointer; user-select: none; flex-shrink: 0; }
        .hso-toggle input { width: 16px; height: 16px; accent-color: #006833; cursor: pointer; }
        .hso-arrows { display: flex !important; flex-direction: column !important; gap: 4px; flex-shrink: 0; }
        .hso-arrow { width: 30px; height: 24px; border-radius: 6px; border: 1px solid #e5e7eb; background: #f9fafb; color: #374151; cursor: pointer; display: flex !important; align-items: center !important; justify-content: center !important; transition: all 0.18s; }
        .hso-arrow:hover:not(:disabled) { background: #006833; border-color: #006833; color: white; }
        .hso-arrow:disabled { opacity: 0.4; cursor: not-allowed; }

        .hso-footer { margin-top: 28px; display: flex !important; justify-content: flex-end; }
        @media (max-width: 600px) {
          .hso-item { flex-wrap: wrap; }
          .hso-info { flex-basis: 100%; order: 3; }
        }
      `}</style>
    </div>
  );
}
