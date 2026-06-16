'use client';

/**
 * Inline CRUD for the homepage hero slider banner images.
 *
 * Each slide is its own Mongo document under the HeroSlide model, so this
 * editor talks directly to /api/admin/hero-slides and persists every action
 * immediately — independent of the parent settings panel's "Save all" button.
 */

import { useEffect, useState } from 'react';
import { useToast } from '../Toast';
import ImageField from '../ImageField';

const EMPTY_FORM = {
  image: '',
  title: '',
  link: '',
  order: 0,
  isActive: true,
};

export default function HeroSlidesListEditor({ label, hint }) {
  const { toast } = useToast();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const [draft, setDraft] = useState(null);
  const [savingRowId, setSavingRowId] = useState(null);

  useEffect(() => {
    let cancelled = false;
    fetch('/api/admin/hero-slides', { credentials: 'same-origin', cache: 'no-store' })
      .then((r) => r.json())
      .then((d) => {
        if (cancelled) return;
        setItems(Array.isArray(d.slides) ? d.slides : []);
      })
      .catch(() => toast({ message: 'Could not load hero slides', type: 'error' }))
      .finally(() => !cancelled && setLoading(false));
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openEdit = (item) => {
    setDraft({
      image: item.image || '',
      title: item.title || '',
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
    if (!String(draft.image || '').trim()) {
      toast({ message: 'Banner image is required', type: 'error' });
      return;
    }
    setSavingRowId(expandedId);
    try {
      const isNew = expandedId === 'new';
      const url = isNew
        ? '/api/admin/hero-slides'
        : `/api/admin/hero-slides/${expandedId}`;
      const res = await fetch(url, {
        method: isNew ? 'POST' : 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({ ...draft, order: Number(draft.order) || 0 }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Save failed');
      setItems((prev) => {
        if (isNew) return [...prev, data.slide];
        return prev.map((s) => (s._id === expandedId ? data.slide : s));
      });
      toast({ message: isNew ? 'Hero slide added' : 'Hero slide updated', type: 'success' });
      closeForm();
    } catch (err) {
      toast({ message: err.message || 'Failed to save', type: 'error' });
    } finally {
      setSavingRowId(null);
    }
  };

  // Auto-persist the slide the moment an image is uploaded/changed so a banner
  // is never lost just because the "Add slide" button wasn't clicked. For a new
  // slide this creates the record (then keeps editing it); for an existing one
  // it saves the image change immediately. `url` is passed explicitly to avoid
  // the React state race (draft.image hasn't updated yet on this tick).
  const handleImageChange = async (url) => {
    setDraft((d) => ({ ...d, image: url }));
    const trimmed = String(url || '').trim();
    if (!trimmed) return; // image cleared — nothing to persist

    setSavingRowId(expandedId);
    try {
      const isNew = expandedId === 'new';
      const apiUrl = isNew
        ? '/api/admin/hero-slides'
        : `/api/admin/hero-slides/${expandedId}`;
      const res = await fetch(apiUrl, {
        method: isNew ? 'POST' : 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({ ...draft, image: trimmed, order: Number(draft.order) || 0 }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Save failed');
      const saved = data.slide;
      setItems((prev) => {
        if (isNew) return [...prev, saved];
        return prev.map((s) => (s._id === expandedId ? saved : s));
      });
      // Switch the open form from "new" to the freshly created record so caption
      // / link edits update it instead of creating duplicates.
      if (isNew && saved?._id) {
        setExpandedId(saved._id);
        setDraft({
          image: saved.image || '',
          title: saved.title || '',
          link: saved.link || '',
          order: Number(saved.order) || 0,
          isActive: Boolean(saved.isActive),
        });
      }
      toast({ message: 'Banner image saved', type: 'success' });
    } catch (err) {
      toast({ message: err.message || 'Failed to save banner', type: 'error' });
    } finally {
      setSavingRowId(null);
    }
  };

  const handleDelete = async (item) => {
    if (!window.confirm('Remove this banner from the hero slider?')) return;
    try {
      const res = await fetch(`/api/admin/hero-slides/${item._id}`, {
        method: 'DELETE',
        credentials: 'same-origin',
      });
      if (!res.ok) throw new Error('Delete failed');
      setItems((prev) => prev.filter((s) => s._id !== item._id));
      if (expandedId === item._id) closeForm();
      toast({ message: 'Hero slide removed', type: 'success' });
    } catch (err) {
      toast({ message: err.message || 'Failed to delete', type: 'error' });
    }
  };

  const toggleActive = async (item) => {
    try {
      const res = await fetch(`/api/admin/hero-slides/${item._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({ isActive: !item.isActive }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Update failed');
      setItems((prev) => prev.map((s) => (s._id === item._id ? data.slide : s)));
    } catch (err) {
      toast({ message: err.message || 'Failed to update', type: 'error' });
    }
  };

  const renderForm = () => {
    if (!draft) return null;
    const update = (key, val) => setDraft((d) => ({ ...d, [key]: val }));
    const isSaving = savingRowId === expandedId;
    return (
      <div className="hsle-form">
        <ImageField
          value={draft.image}
          onChange={handleImageChange}
          label="Banner image *"
          hint="Wide landscape image — 1920×780 px recommended. Saves automatically as soon as the image uploads."
          previewW={320}
          previewH={150}
        />
        <div className="hsle-row">
          <div className="hsle-field">
            <label>Caption / alt text</label>
            <input
              type="text"
              value={draft.title}
              onChange={(e) => update('title', e.target.value)}
              placeholder="e.g. Lord Krishna Mart — Yamuna Expressway"
            />
          </div>
          <div className="hsle-field">
            <label>Redirection URL (optional)</label>
            <input
              type="text"
              value={draft.link}
              onChange={(e) => update('link', e.target.value)}
              placeholder="/projects/lord-krishna-mart"
            />
          </div>
        </div>
        <div className="hsle-row">
          <div className="hsle-field hsle-narrow">
            <label>Display order</label>
            <input
              type="number"
              min="0"
              value={draft.order}
              onChange={(e) => update('order', e.target.value)}
            />
          </div>
        </div>
        <label className="hsle-checkbox">
          <input
            type="checkbox"
            checked={draft.isActive}
            onChange={(e) => update('isActive', e.target.checked)}
          />
          Show in slider
        </label>
        <div className="hsle-form-actions">
          <button type="button" className="hsle-btn-ghost" onClick={closeForm}>
            Cancel
          </button>
          <button
            type="button"
            className="hsle-btn-primary"
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? 'Saving…' : expandedId === 'new' ? 'Add slide' : 'Save changes'}
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="hsle-wrap">
      <label className="hsle-label">
        {label || 'Hero slider banners'}
        {hint && <span className="hsle-hint">{hint}</span>}
      </label>

      {loading ? (
        <div className="hsle-loading">Loading hero slides…</div>
      ) : (
        <>
          <div className="hsle-list">
            {items.length === 0 && (
              <div className="hsle-empty">
                No hero banners yet. Click <strong>Add slide</strong> below to upload the first banner.
                Until then, the slider falls back to the latest project images.
              </div>
            )}

            {items.map((item, i) => {
              const isOpen = expandedId === item._id;
              return (
                <div key={item._id} className={`hsle-item${isOpen ? ' hsle-item-open' : ''}`}>
                  <div className="hsle-summary">
                    <div className="hsle-thumb">
                      {item.image
                        ? <img src={item.image} alt="" />
                        : <span className="hsle-thumb-fallback">🖼️</span>}
                    </div>
                    <div className="hsle-meta">
                      <p className="hsle-name">{item.title || `Slide ${i + 1}`}</p>
                      <p className="hsle-sub">
                        {item.link
                          ? <span className="hsle-link-pill">{item.link}</span>
                          : <span className="hsle-muted">No link</span>}
                      </p>
                    </div>
                    <div className="hsle-actions">
                      <button
                        type="button"
                        className={`hsle-toggle ${item.isActive ? 'on' : 'off'}`}
                        onClick={() => toggleActive(item)}
                        title={item.isActive ? 'Hide from slider' : 'Show in slider'}
                      >
                        {item.isActive ? '● Active' : '○ Hidden'}
                      </button>
                      <button
                        type="button"
                        className="hsle-btn-icon hsle-btn-edit"
                        onClick={() => (isOpen ? closeForm() : openEdit(item))}
                        title={isOpen ? 'Close' : 'Edit'}
                      >
                        {isOpen ? '▴' : '✏'}
                      </button>
                      <button
                        type="button"
                        className="hsle-btn-icon hsle-btn-del"
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
              <div className="hsle-item hsle-item-open hsle-item-new">
                <div className="hsle-summary hsle-summary-new">
                  <span className="hsle-new-tag">New slide</span>
                </div>
                {renderForm()}
              </div>
            )}
          </div>

          {expandedId !== 'new' && (
            <button type="button" className="hsle-add" onClick={openCreate}>
              + Add slide
            </button>
          )}
        </>
      )}

      <style jsx global>{`
        .hsle-wrap { display: flex; flex-direction: column; gap: 10px; }
        .hsle-label { font-size: 13px; font-weight: 600; color: #374151; }
        .hsle-hint { display: block; font-size: 11.5px; font-weight: 400; color: #9ca3af; margin-top: 2px; }
        .hsle-loading, .hsle-empty {
          padding: 18px; border: 1px dashed #e5e7eb; border-radius: 10px;
          background: #fafafa; color: #6b7280; font-size: 13px; text-align: center;
        }

        .hsle-list { display: flex; flex-direction: column; gap: 10px; }
        .hsle-item {
          background: white; border: 1px solid #ececec; border-radius: 12px; overflow: hidden;
          transition: box-shadow 0.18s, border-color 0.18s;
        }
        .hsle-item:hover { border-color: #d4d4d4; }
        .hsle-item-open { border-color: #006833; box-shadow: 0 4px 14px rgba(0,104,51,0.08); }
        .hsle-item-new { border-style: dashed; border-color: #006833; }

        .hsle-summary {
          display: flex !important; align-items: center !important; gap: 12px;
          padding: 10px 12px;
        }
        .hsle-summary-new { padding: 12px 16px; }
        .hsle-new-tag {
          font-size: 12px; font-weight: 700; color: #006833;
          background: #e8f5ef; padding: 4px 10px; border-radius: 999px; letter-spacing: 0.4px;
          text-transform: uppercase;
        }

        .hsle-thumb {
          width: 72px; height: 42px; border-radius: 8px; overflow: hidden;
          background: #f3f4f6; display: flex !important; align-items: center !important; justify-content: center !important;
          flex-shrink: 0;
        }
        .hsle-thumb img { width: 100%; height: 100%; object-fit: cover; }
        .hsle-thumb-fallback { font-size: 18px; opacity: 0.6; }

        .hsle-meta { flex: 1; min-width: 0; }
        .hsle-name { font-weight: 600; color: #111827; font-size: 14px; }
        .hsle-sub {
          font-size: 12px; color: #6b7280; margin-top: 2px;
          display: flex; align-items: center; gap: 8px; flex-wrap: wrap;
        }
        .hsle-muted { color: #b0b4ba; }
        .hsle-link-pill {
          background: #f3f4f6; color: #4b5563; padding: 1px 8px; border-radius: 999px;
          font-size: 11px; font-family: monospace; max-width: 220px;
          overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
        }

        .hsle-actions {
          display: flex !important; align-items: center !important; gap: 6px; flex-shrink: 0;
        }
        .hsle-toggle {
          padding: 4px 10px; border-radius: 999px; font-size: 11.5px; font-weight: 600;
          border: none; cursor: pointer; min-width: 70px;
        }
        .hsle-toggle.on { background: #e8f5ef; color: #006833; }
        .hsle-toggle.off { background: #f3f4f6; color: #9ca3af; }

        .hsle-btn-icon {
          width: 30px; height: 30px; border-radius: 7px; display: flex !important;
          align-items: center !important; justify-content: center !important;
          font-size: 13px; cursor: pointer; border: none;
        }
        .hsle-btn-edit { background: #dbeafe; color: #1d4ed8; }
        .hsle-btn-edit:hover { background: #bfdbfe; }
        .hsle-btn-del { background: #fdeaeb; color: #eb3237; }
        .hsle-btn-del:hover { background: #fbd2d4; }

        /* form */
        .hsle-form {
          padding: 16px 16px 18px;
          border-top: 1px solid #f0f0f0;
          background: #fafafa;
          display: flex; flex-direction: column; gap: 14px;
        }
        .hsle-row { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
        .hsle-field { display: flex; flex-direction: column; gap: 5px; }
        .hsle-field label { font-size: 12.5px; font-weight: 600; color: #374151; }
        .hsle-field input {
          padding: 8px 12px; border: 1.5px solid #e5e7eb; border-radius: 8px;
          font-size: 13.5px; outline: none; background: white;
        }
        .hsle-field input:focus { border-color: #006833; box-shadow: 0 0 0 3px rgba(0,104,51,0.1); }
        .hsle-narrow input { max-width: 140px; }

        .hsle-checkbox {
          display: inline-flex !important; align-items: center !important; gap: 8px;
          font-size: 13px; color: #374151; cursor: pointer;
        }

        .hsle-form-actions {
          display: flex !important; justify-content: flex-end; gap: 8px; margin-top: 4px;
        }
        .hsle-btn-ghost {
          padding: 8px 16px; border: 1px solid #e5e7eb; background: white;
          border-radius: 8px; color: #374151; font-size: 13px; cursor: pointer;
        }
        .hsle-btn-primary {
          padding: 8px 18px; background: #006833; color: white; border: none;
          border-radius: 8px; font-size: 13px; font-weight: 600; cursor: pointer;
        }
        .hsle-btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }

        .hsle-add {
          align-self: flex-start; padding: 9px 16px; border-radius: 8px; border: 1px dashed #006833;
          background: #f0faf5; color: #006833; font-size: 13px; font-weight: 600; cursor: pointer;
        }
        .hsle-add:hover { background: #d1fae5; }

        @media (max-width: 640px) {
          .hsle-row { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}
