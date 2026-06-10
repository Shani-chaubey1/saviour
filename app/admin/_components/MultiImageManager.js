'use client';
import { useState, useRef } from 'react';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '../../../lib/firebase';

const ALLOWED = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];

async function uploadOne(file, onProgress) {
  const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, '-');
  const storageRef = ref(storage, `saviour-uploads/${Date.now()}-${safeName}`);
  return new Promise((resolve, reject) => {
    const task = uploadBytesResumable(storageRef, file, { contentType: file.type });
    task.on(
      'state_changed',
      (snap) => onProgress && onProgress(Math.round((snap.bytesTransferred / snap.totalBytes) * 100)),
      reject,
      async () => resolve(await getDownloadURL(task.snapshot.ref))
    );
  });
}

/**
 * MultiImageManager
 * value    — newline-separated URL string (matches Setting storage format)
 * onChange — called with updated newline-separated URL string
 */
export default function MultiImageManager({ value = '', onChange, label = 'Images', hint = '' }) {
  const [urlInput, setUrlInput] = useState('');
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0, pct: 0 });
  const [error, setError] = useState('');
  const inputRef = useRef(null);

  const urls = value.split('\n').map(u => u.trim()).filter(Boolean);

  const pushUrls = (newOnes) => onChange([...urls, ...newOnes].join('\n'));

  const remove = (idx) => onChange(urls.filter((_, i) => i !== idx).join('\n'));

  const move = (idx, dir) => {
    const target = idx + dir;
    if (target < 0 || target >= urls.length) return;
    const next = [...urls];
    [next[idx], next[target]] = [next[target], next[idx]];
    onChange(next.join('\n'));
  };

  const addUrl = () => {
    const u = urlInput.trim();
    if (!u) return;
    if (urls.includes(u)) { setError('URL already added.'); return; }
    setError('');
    pushUrls([u]);
    setUrlInput('');
  };

  const handleFiles = async (files) => {
    const list = Array.from(files);
    if (!list.length) return;
    const invalid = list.find(f => !ALLOWED.includes(f.type));
    if (invalid) { setError('Only JPG, PNG, WebP, GIF, SVG allowed.'); return; }

    setError('');
    setUploading(true);
    setProgress({ current: 0, total: list.length, pct: 0 });
    const results = [];
    try {
      for (let i = 0; i < list.length; i++) {
        const url = await uploadOne(list[i], (pct) =>
          setProgress({ current: i + 1, total: list.length, pct })
        );
        results.push(url);
        setProgress({ current: i + 1, total: list.length, pct: 100 });
      }
      pushUrls(results);
    } catch (err) {
      setError('Upload failed: ' + (err?.message || 'unknown'));
    } finally {
      setUploading(false);
      setProgress({ current: 0, total: 0, pct: 0 });
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  return (
    <div className="mim-wrap">
      <div className="mim-header">
        <span className="mim-label">{label}</span>
        {hint && <span className="mim-hint">{hint}</span>}
      </div>

      {/* Add by URL */}
      <div className="mim-url-row">
        <input
          type="text"
          className="mim-url-input"
          value={urlInput}
          onChange={e => setUrlInput(e.target.value)}
          placeholder="Paste image URL and press Add"
          onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addUrl())}
        />
        <button type="button" className="mim-add-btn" onClick={addUrl} disabled={!urlInput.trim()}>
          + Add URL
        </button>
      </div>

      {/* Upload from device */}
      <div className="mim-upload-row">
        <button
          type="button"
          className={`mim-upload-btn${uploading ? ' mim-busy' : ''}`}
          onClick={() => !uploading && inputRef.current?.click()}
          disabled={uploading}
        >
          {uploading ? (
            <>
              <span className="mim-spinner" />
              Uploading {progress.current}/{progress.total} — {progress.pct}%
            </>
          ) : (
            <>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
              </svg>
              Upload Images from Device
            </>
          )}
        </button>
        <span className="mim-count">{urls.length} image{urls.length !== 1 ? 's' : ''}</span>
      </div>

      {uploading && (
        <div className="mim-bar-track">
          <div className="mim-bar-fill" style={{ width: `${progress.pct}%` }} />
        </div>
      )}

      {error && <p className="mim-error">{error}</p>}

      {/* Grid preview */}
      {urls.length > 0 && (
        <div className="mim-grid">
          {urls.map((src, i) => (
            <div key={i} className="mim-item">
              <img src={src} alt="" className="mim-img" />
              <div className="mim-overlay">
                <button
                  type="button"
                  className="mim-remove"
                  onClick={() => remove(i)}
                  title="Remove"
                  aria-label="Remove image"
                >
                  ✕
                </button>
              </div>
              <div className="mim-reorder">
                <button
                  type="button"
                  className="mim-move"
                  onClick={() => move(i, -1)}
                  disabled={i === 0}
                  title="Move left / up"
                  aria-label="Move image earlier"
                >
                  ‹
                </button>
                <button
                  type="button"
                  className="mim-move"
                  onClick={() => move(i, 1)}
                  disabled={i === urls.length - 1}
                  title="Move right / down"
                  aria-label="Move image later"
                >
                  ›
                </button>
              </div>
              <span className="mim-index">{i + 1}</span>
            </div>
          ))}
        </div>
      )}

      {urls.length === 0 && !uploading && (
        <div className="mim-empty">No images yet. Upload or add URLs above.</div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        style={{ display: 'none' }}
        onChange={e => handleFiles(e.target.files)}
      />

      <style jsx global>{`
        .mim-wrap { display: flex; flex-direction: column !important; gap: 10px; }

        .mim-header { display: flex !important; flex-direction: column !important; gap: 3px; }
        .mim-label { font-size: 13px; font-weight: 600; color: #374151; }
        .mim-hint  { font-size: 11.5px; color: #9ca3af; }

        /* URL row */
        .mim-url-row { display: flex !important; gap: 8px; align-items: center !important; }
        .mim-url-input {
          flex: 1; padding: 10px 14px;
          border: 1.5px solid #e5e7eb; border-radius: 8px;
          font-size: 14px; color: #111; outline: none; font-family: inherit;
          transition: border-color 0.2s;
        }
        .mim-url-input:focus { border-color: #006833; box-shadow: 0 0 0 3px rgba(0,104,51,0.08); }
        .mim-add-btn {
          padding: 10px 18px; border-radius: 8px;
          background: #f0faf4; color: #006833;
          border: 1.5px solid #006833;
          font-size: 13px; font-weight: 700; cursor: pointer; white-space: nowrap;
          transition: all 0.18s;
        }
        .mim-add-btn:hover:not(:disabled) { background: #006833; color: white; }
        .mim-add-btn:disabled { opacity: 0.45; cursor: not-allowed; }

        /* Upload row */
        .mim-upload-row { display: flex !important; align-items: center !important; gap: 12px; }
        .mim-upload-btn {
          display: inline-flex !important; align-items: center !important; gap: 7px;
          padding: 10px 18px; border-radius: 8px;
          background: #006833; color: white;
          border: none; font-size: 13px; font-weight: 600;
          cursor: pointer; transition: background 0.18s;
        }
        .mim-upload-btn:hover:not(:disabled) { background: #004d26; }
        .mim-upload-btn:disabled, .mim-upload-btn.mim-busy { opacity: 0.7; cursor: wait; }
        .mim-count { font-size: 12px; color: #6b7280; font-weight: 500; }

        .mim-spinner {
          width: 14px; height: 14px;
          border: 2px solid rgba(255,255,255,0.3); border-top-color: white;
          border-radius: 50%; animation: mimSpin 0.7s linear infinite;
          display: inline-block;
        }
        @keyframes mimSpin { to { transform: rotate(360deg); } }

        /* Progress bar */
        .mim-bar-track {
          width: 100%; height: 3px; background: #e5e7eb; border-radius: 2px; overflow: hidden;
        }
        .mim-bar-fill {
          height: 100%;
          background: linear-gradient(90deg, #006833, #00a04d);
          border-radius: 2px; transition: width 0.15s;
        }

        .mim-error { font-size: 12px; color: #eb3237; margin: 0; }

        /* Image grid */
        .mim-grid {
          display: grid !important;
          grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
          gap: 10px;
          margin-top: 4px;
        }
        .mim-item {
          position: relative; border-radius: 8px; overflow: hidden;
          border: 1.5px solid #e5e7eb; background: #f9fafb;
          aspect-ratio: 1;
        }
        .mim-img { width: 100%; height: 100%; object-fit: contain; display: block; padding: 6px; }
        .mim-overlay {
          position: absolute; inset: 0;
          background: rgba(0,0,0,0); display: flex;
          align-items: flex-start; justify-content: flex-end; padding: 6px;
          transition: background 0.18s;
        }
        .mim-item:hover .mim-overlay { background: rgba(0,0,0,0.12); }
        .mim-remove {
          width: 22px; height: 22px; border-radius: 50%;
          background: rgba(235,50,55,0.9); color: white;
          border: 1.5px solid white; font-size: 9px;
          cursor: pointer; display: flex; align-items: center; justify-content: center;
          line-height: 1; opacity: 0; transition: opacity 0.18s;
          box-shadow: 0 1px 4px rgba(0,0,0,0.25);
        }
        .mim-item:hover .mim-remove { opacity: 1; }
        .mim-reorder {
          position: absolute; bottom: 4px; right: 4px;
          display: flex !important; gap: 4px;
          opacity: 0; transition: opacity 0.18s;
        }
        .mim-item:hover .mim-reorder { opacity: 1; }
        .mim-move {
          width: 22px; height: 22px; border-radius: 6px;
          background: rgba(0,104,51,0.92); color: white;
          border: 1.5px solid white; font-size: 13px; line-height: 1;
          cursor: pointer; display: flex; align-items: center; justify-content: center;
          box-shadow: 0 1px 4px rgba(0,0,0,0.25);
        }
        .mim-move:hover:not(:disabled) { background: #004d26; }
        .mim-move:disabled { opacity: 0.4; cursor: not-allowed; }
        .mim-index {
          position: absolute; bottom: 4px; left: 6px;
          font-size: 10px; font-weight: 700; color: rgba(0,0,0,0.4);
        }

        .mim-empty {
          padding: 24px; text-align: center;
          border: 2px dashed #e5e7eb; border-radius: 10px;
          color: #9ca3af; font-size: 13px;
        }
      `}</style>
    </div>
  );
}
