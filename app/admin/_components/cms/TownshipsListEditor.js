'use client';

/**
 * Inline CRUD for the homepage "Our Presence in Leading Townships" cards.
 *
 * Each township is its own Mongo document under the Township model, so this
 * editor talks directly to /api/admin/townships and doesn't depend on the
 * parent settings panel's "Save all" button — every action persists
 * immediately and the parent stays unaware of the underlying collection.
 */

import { useEffect, useState } from 'react';
import { useToast } from '../Toast';
import ImageField from '../ImageField';

const EMPTY_FORM = {
  area: '',
  city: '',
  line1: '',
  line2: '',
  image: '',
  link: '',
  order: 0,
  isActive: true,
};

export default function TownshipsListEditor({ label, hint }) {
  const { toast } = useToast();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const [draft, setDraft] = useState(null);
  const [savingRowId, setSavingRowId] = useState(null);

  useEffect(() => {
    let cancelled = false;
    fetch('/api/admin/townships', { credentials: 'same-origin', cache: 'no-store' })
      .then((r) => r.json())
      .then((d) => {
        if (cancelled) return;
        setItems(Array.isArray(d.townships) ? d.townships : []);
      })
      .catch(() => toast({ message: 'Could not load townships', type: 'error' }))
      .finally(() => !cancelled && setLoading(false));
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openEdit = (item) => {
    setDraft({
      area: item.area || '',
      city: item.city || '',
      line1: item.line1 || '',
      line2: item.line2 || '',
      image: item.image || '',
      link: item.link || '',
      order: Number(item.order) || 0,
      isActive: Boolean(item.isActive),
    });
    setExpandedId(item._id);
  };

  const openCreate = () => {
    setDraft({ ...EMPTY_FORM, order: items.length });
    setExpandedId('new');
  };

  const closeForm = () => {
    setExpandedId(null);
    setDraft(null);
  };

  const handleSave = async () => {
    if (!draft) return;
    if (!String(draft.area || '').trim()) {
      toast({ message: 'Area name is required', type: 'error' });
      return;
    }
    setSavingRowId(expandedId);
    try {
      const isNew = expandedId === 'new';
      const url = isNew
        ? '/api/admin/townships'
        : `/api/admin/townships/${expandedId}`;
      const res = await fetch(url, {
        method: isNew ? 'POST' : 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({ ...draft, order: Number(draft.order) || 0 }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Save failed');
      setItems((prev) => {
        if (isNew) return [...prev, data.township];
        return prev.map((t) => (t._id === expandedId ? data.township : t));
      });
      toast({ message: isNew ? 'Township added' : 'Township updated', type: 'success' });
      closeForm();
    } catch (err) {
      toast({ message: err.message || 'Failed to save', type: 'error' });
    } finally {
      setSavingRowId(null);
    }
  };

  const handleDelete = async (item) => {
    if (!window.confirm(`Remove "${item.area}" from this section?`)) return;
    try {
      const res = await fetch(`/api/admin/townships/${item._id}`, {
        method: 'DELETE',
        credentials: 'same-origin',
      });
      if (!res.ok) throw new Error('Delete failed');
      setItems((prev) => prev.filter((t) => t._id !== item._id));
      if (expandedId === item._id) closeForm();
      toast({ message: 'Township removed', type: 'success' });
    } catch (err) {
      toast({ message: err.message || 'Failed to delete', type: 'error' });
    }
  };

  const toggleActive = async (item) => {
    try {
      const res = await fetch(`/api/admin/townships/${item._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({ isActive: !item.isActive }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Update failed');
      setItems((prev) => prev.map((t) => (t._id === item._id ? data.township : t)));
    } catch (err) {
      toast({ message: err.message || 'Failed to update', type: 'error' });
    }
  };

  const renderForm = () => {
    if (!draft) return null;
    const update = (key, val) => setDraft((d) => ({ ...d, [key]: val }));
    const isSaving = savingRowId === expandedId;
    return (
      <div className="twle-form">
        <div className="twle-row">
          <div className="twle-field">
            <label>Area / Township name *</label>
            <input
              type="text"
              value={draft.area}
              onChange={(e) => update('area', e.target.value)}
              placeholder="e.g. Gaur Yamuna City"
            />
          </div>
          <div className="twle-field">
            <label>City / Location</label>
            <input
              type="text"
              value={draft.city}
              onChange={(e) => update('city', e.target.value)}
              placeholder="e.g. Yamuna Expressway"
            />
          </div>
        </div>
        <div className="twle-row">
          <div className="twle-field">
            <label>Highlight line 1 (above name)</label>
            <input
              type="text"
              value={draft.line1}
              onChange={(e) => update('line1', e.target.value)}
              placeholder="e.g. 7.5-Acre Central Park"
            />
          </div>
          <div className="twle-field">
            <label>Highlight line 2 (above name)</label>
            <input
              type="text"
              value={draft.line2}
              onChange={(e) => update('line2', e.target.value)}
              placeholder="e.g. Ready-to-move Shops & Offices"
            />
          </div>
        </div>
        <div className="twle-row">
          <div className="twle-field">
            <label>Redirection URL</label>
            <input
              type="text"
              value={draft.link}
              onChange={(e) => update('link', e.target.value)}
              placeholder="/projects?location=…"
            />
          </div>
          <div className="twle-field twle-narrow">
            <label>Display order</label>
            <input
              type="number"
              min="0"
              value={draft.order}
              onChange={(e) => update('order', e.target.value)}
            />
          </div>
        </div>
        <ImageField
          value={draft.image}
          onChange={(url) => update('image', url)}
          label="Hero image"
          hint="Wide landscape image, min 800×500 px recommended."
          previewW={260}
          previewH={155}
        />
        <label className="twle-checkbox">
          <input
            type="checkbox"
            checked={draft.isActive}
            onChange={(e) => update('isActive', e.target.checked)}
          />
          Show on website
        </label>
        <div className="twle-form-actions">
          <button type="button" className="twle-btn-ghost" onClick={closeForm}>
            Cancel
          </button>
          <button
            type="button"
            className="twle-btn-primary"
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? 'Saving…' : expandedId === 'new' ? 'Add township' : 'Save changes'}
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="twle-wrap">
      <label className="twle-label">
        {label || 'Townships (cards)'}
        {hint && <span className="twle-hint">{hint}</span>}
      </label>

      {loading ? (
        <div className="twle-loading">Loading townships…</div>
      ) : (
        <>
          <div className="twle-list">
            {items.length === 0 && (
              <div className="twle-empty">
                No townships yet. Click <strong>Add township</strong> below to create the first card.
              </div>
            )}

            {items.map((item) => {
              const isOpen = expandedId === item._id;
              return (
                <div key={item._id} className={`twle-item${isOpen ? ' twle-item-open' : ''}`}>
                  <div className="twle-summary">
                    <div className="twle-thumb">
                      {item.image
                        ? <img src={item.image} alt="" />
                        : <span className="twle-thumb-fallback">📍</span>}
                    </div>
                    <div className="twle-meta">
                      <p className="twle-name">{item.area || 'Untitled'}</p>
                      <p className="twle-sub">
                        {item.city || '—'}
                        {item.link && <span className="twle-link-pill">{item.link}</span>}
                      </p>
                    </div>
                    <div className="twle-actions">
                      <button
                        type="button"
                        className={`twle-toggle ${item.isActive ? 'on' : 'off'}`}
                        onClick={() => toggleActive(item)}
                        title={item.isActive ? 'Hide from website' : 'Show on website'}
                      >
                        {item.isActive ? '● Active' : '○ Hidden'}
                      </button>
                      <button
                        type="button"
                        className="twle-btn-icon twle-btn-edit"
                        onClick={() => (isOpen ? closeForm() : openEdit(item))}
                        title={isOpen ? 'Close' : 'Edit'}
                      >
                        {isOpen ? '▴' : '✏'}
                      </button>
                      <button
                        type="button"
                        className="twle-btn-icon twle-btn-del"
                        onClick={() => handleDelete(item)}
                        title="Delete"
                      >
                        🗑
                      </button>
                    </div>
                  </div>
                  {isOpen && renderForm()}
                </div>
              );
            })}

            {expandedId === 'new' && (
              <div className="twle-item twle-item-open twle-item-new">
                <div className="twle-summary twle-summary-new">
                  <span className="twle-new-tag">New township</span>
                </div>
                {renderForm()}
              </div>
            )}
          </div>

          {expandedId !== 'new' && (
            <button type="button" className="twle-add" onClick={openCreate}>
              + Add township
            </button>
          )}
        </>
      )}

      <style jsx global>{`
        .twle-wrap { display: flex; flex-direction: column; gap: 10px; }
        .twle-label { font-size: 13px; font-weight: 600; color: #374151; }
        .twle-hint { display: block; font-size: 11.5px; font-weight: 400; color: #9ca3af; margin-top: 2px; }
        .twle-loading, .twle-empty {
          padding: 18px; border: 1px dashed #e5e7eb; border-radius: 10px;
          background: #fafafa; color: #6b7280; font-size: 13px; text-align: center;
        }

        .twle-list { display: flex; flex-direction: column; gap: 10px; }
        .twle-item {
          background: white; border: 1px solid #ececec; border-radius: 12px; overflow: hidden;
          transition: box-shadow 0.18s, border-color 0.18s;
        }
        .twle-item:hover { border-color: #d4d4d4; }
        .twle-item-open { border-color: #006833; box-shadow: 0 4px 14px rgba(0,104,51,0.08); }
        .twle-item-new { border-style: dashed; border-color: #006833; }

        .twle-summary {
          display: flex !important; align-items: center !important; gap: 12px;
          padding: 10px 12px;
        }
        .twle-summary-new { padding: 12px 16px; }
        .twle-new-tag {
          font-size: 12px; font-weight: 700; color: #006833;
          background: #e8f5ef; padding: 4px 10px; border-radius: 999px; letter-spacing: 0.4px;
          text-transform: uppercase;
        }

        .twle-thumb {
          width: 56px; height: 42px; border-radius: 8px; overflow: hidden;
          background: #f3f4f6; display: flex !important; align-items: center !important; justify-content: center !important;
          flex-shrink: 0;
        }
        .twle-thumb img { width: 100%; height: 100%; object-fit: cover; }
        .twle-thumb-fallback { font-size: 18px; opacity: 0.6; }

        .twle-meta { flex: 1; min-width: 0; }
        .twle-name { font-weight: 600; color: #111827; font-size: 14px; }
        .twle-sub {
          font-size: 12px; color: #6b7280; margin-top: 2px;
          display: flex; align-items: center; gap: 8px; flex-wrap: wrap;
        }
        .twle-link-pill {
          background: #f3f4f6; color: #4b5563; padding: 1px 8px; border-radius: 999px;
          font-size: 11px; font-family: monospace; max-width: 220px;
          overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
        }

        .twle-actions {
          display: flex !important; align-items: center !important; gap: 6px; flex-shrink: 0;
        }
        .twle-toggle {
          padding: 4px 10px; border-radius: 999px; font-size: 11.5px; font-weight: 600;
          border: none; cursor: pointer; min-width: 70px;
        }
        .twle-toggle.on { background: #e8f5ef; color: #006833; }
        .twle-toggle.off { background: #f3f4f6; color: #9ca3af; }

        .twle-btn-icon {
          width: 30px; height: 30px; border-radius: 7px; display: flex !important;
          align-items: center !important; justify-content: center !important;
          font-size: 13px; cursor: pointer; border: none;
        }
        .twle-btn-edit { background: #dbeafe; color: #1d4ed8; }
        .twle-btn-edit:hover { background: #bfdbfe; }
        .twle-btn-del { background: #fdeaeb; color: #eb3237; }
        .twle-btn-del:hover { background: #fbd2d4; }

        /* form */
        .twle-form {
          padding: 16px 16px 18px;
          border-top: 1px solid #f0f0f0;
          background: #fafafa;
          display: flex; flex-direction: column; gap: 14px;
        }
        .twle-row { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
        .twle-field { display: flex; flex-direction: column; gap: 5px; }
        .twle-field label { font-size: 12.5px; font-weight: 600; color: #374151; }
        .twle-field input {
          padding: 8px 12px; border: 1.5px solid #e5e7eb; border-radius: 8px;
          font-size: 13.5px; outline: none; background: white;
        }
        .twle-field input:focus { border-color: #006833; box-shadow: 0 0 0 3px rgba(0,104,51,0.1); }
        .twle-narrow input { max-width: 140px; }

        .twle-checkbox {
          display: inline-flex !important; align-items: center !important; gap: 8px;
          font-size: 13px; color: #374151; cursor: pointer;
        }

        .twle-form-actions {
          display: flex !important; justify-content: flex-end; gap: 8px; margin-top: 4px;
        }
        .twle-btn-ghost {
          padding: 8px 16px; border: 1px solid #e5e7eb; background: white;
          border-radius: 8px; color: #374151; font-size: 13px; cursor: pointer;
        }
        .twle-btn-primary {
          padding: 8px 18px; background: #006833; color: white; border: none;
          border-radius: 8px; font-size: 13px; font-weight: 600; cursor: pointer;
        }
        .twle-btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }

        .twle-add {
          align-self: flex-start; padding: 9px 16px; border-radius: 8px; border: 1px dashed #006833;
          background: #f0faf5; color: #006833; font-size: 13px; font-weight: 600; cursor: pointer;
        }
        .twle-add:hover { background: #d1fae5; }

        @media (max-width: 640px) {
          .twle-row { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}
