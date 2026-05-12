'use client';
import { useState, useRef } from 'react';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '../../../lib/firebase';

const ALLOWED = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];

async function uploadToFirebase(file) {
  const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, '-');
  const path = `saviour-uploads/${Date.now()}-${safeName}`;
  const storageRef = ref(storage, path);
  return new Promise((resolve, reject) => {
    const task = uploadBytesResumable(storageRef, file, { contentType: file.type });
    task.on('state_changed', null, reject, async () => {
      resolve(await getDownloadURL(task.snapshot.ref));
    });
  });
}

/**
 * ImageField — URL input + Firebase upload + fixed preview.
 * Props:
 *   value      {string}   current URL
 *   onChange   {fn}       called with new URL string
 *   label      {string}
 *   hint       {string}
 *   previewW   {number}   preview width  (default 240)
 *   previewH   {number}   preview height (default 140)
 */
export default function ImageField({
  value = '',
  onChange,
  label = 'Image',
  hint = '',
  previewW = 240,
  previewH = 140,
}) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');
  const inputRef = useRef(null);

  const handleFile = async (file) => {
    if (!file) return;
    if (!ALLOWED.includes(file.type)) {
      setError('Only JPG, PNG, WebP, GIF, SVG allowed.');
      return;
    }
    setError('');
    setUploading(true);
    setProgress(0);
    try {
      const storageRef = ref(storage, `saviour-uploads/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '-')}`);
      const task = uploadBytesResumable(storageRef, file, { contentType: file.type });
      await new Promise((resolve, reject) => {
        task.on(
          'state_changed',
          (snap) => setProgress(Math.round((snap.bytesTransferred / snap.totalBytes) * 100)),
          reject,
          async () => {
            const url = await getDownloadURL(task.snapshot.ref);
            onChange(url);
            resolve();
          }
        );
      });
    } catch (err) {
      setError('Upload failed: ' + (err?.message || 'unknown error'));
    } finally {
      setUploading(false);
      setProgress(0);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  return (
    <div className="if-wrap">
      <label className="if-label">
        {label}
        {hint && <span className="if-hint">{hint}</span>}
      </label>

      {/* URL row */}
      <div className="if-url-row">
        <input
          type="text"
          className="if-url-input"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Paste image URL or upload below"
        />
        <button
          type="button"
          className={`if-upload-btn${uploading ? ' if-busy' : ''}`}
          onClick={() => !uploading && inputRef.current?.click()}
          disabled={uploading}
          title="Upload from device"
        >
          {uploading ? (
            <span className="if-spinner" />
          ) : (
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="17 8 12 3 7 8"/>
              <line x1="12" y1="3" x2="12" y2="15"/>
            </svg>
          )}
          {uploading ? `${progress}%` : 'Upload'}
        </button>
      </div>

      {/* Upload progress bar */}
      {uploading && (
        <div className="if-bar-track">
          <div className="if-bar-fill" style={{ width: `${progress}%` }} />
        </div>
      )}

      {/* Preview */}
      {value && !uploading && (
        <div className="if-preview" style={{ width: previewW, height: previewH }}>
          <img src={value} alt="preview" className="if-preview-img" />
          <button
            type="button"
            className="if-preview-clear"
            onClick={() => onChange('')}
            title="Remove image"
            aria-label="Remove image"
          >
            ✕
          </button>
        </div>
      )}

      {error && <p className="if-error">{error}</p>}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={(e) => handleFile(e.target.files?.[0])}
      />

      <style jsx global>{`
        .if-wrap { display: flex; flex-direction: column !important; gap: 8px; }

        .if-label { font-size: 13px; font-weight: 600; color: #374151; }
        .if-hint { display: block; font-size: 11.5px; font-weight: 400; color: #9ca3af; margin-top: 2px; }

        .if-url-row {
          display: flex !important; align-items: center !important; gap: 8px;
        }
        .if-url-input {
          flex: 1;
          padding: 10px 14px;
          border: 1.5px solid #e5e7eb; border-radius: 8px;
          font-size: 14px; color: #111; outline: none; font-family: inherit;
          transition: border-color 0.2s;
        }
        .if-url-input:focus { border-color: #006833; box-shadow: 0 0 0 3px rgba(0,104,51,0.1); }

        .if-upload-btn {
          display: inline-flex !important; align-items: center !important; gap: 6px;
          padding: 10px 16px; border-radius: 8px;
          background: #006833; color: white;
          border: none; font-size: 13px; font-weight: 600; cursor: pointer;
          transition: background 0.2s; white-space: nowrap; flex-shrink: 0;
        }
        .if-upload-btn:hover:not(:disabled) { background: #004d26; }
        .if-upload-btn:disabled, .if-upload-btn.if-busy { opacity: 0.7; cursor: wait; }

        .if-spinner {
          width: 14px; height: 14px;
          border: 2px solid rgba(255,255,255,0.3); border-top-color: white;
          border-radius: 50%; animation: ifSpin 0.7s linear infinite;
          display: inline-block; flex-shrink: 0;
        }
        @keyframes ifSpin { to { transform: rotate(360deg); } }

        .if-bar-track {
          width: 100%; height: 3px; background: #e5e7eb;
          border-radius: 2px; overflow: hidden;
        }
        .if-bar-fill {
          height: 100%;
          background: linear-gradient(90deg, #006833, #00a04d);
          border-radius: 2px; transition: width 0.15s;
        }

        .if-preview {
          position: relative; border-radius: 10px;
          overflow: hidden; border: 1.5px solid #e5e7eb;
          background: #f3f4f6; flex-shrink: 0;
        }
        .if-preview-img {
          width: 100%; height: 100%;
          object-fit: cover; display: block;
        }
        .if-preview-clear {
          position: absolute; top: 6px; right: 6px;
          width: 22px; height: 22px; border-radius: 50%;
          background: rgba(235,50,55,0.9); color: white;
          border: 2px solid white; font-size: 9px;
          cursor: pointer; display: flex; align-items: center;
          justify-content: center; line-height: 1;
          box-shadow: 0 2px 6px rgba(0,0,0,0.2);
        }
        .if-preview-clear:hover { background: #c01a1e; }

        .if-error { font-size: 12px; color: #eb3237; margin: 0; }
      `}</style>
    </div>
  );
}
