'use client';
import { useState, useRef } from 'react';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '../../../lib/firebase';

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];

async function uploadToFirebase(file) {
  const ext = file.name.split('.').pop().toLowerCase();
  const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, '-');
  const path = `saviour-uploads/${Date.now()}-${safeName}`;
  const storageRef = ref(storage, path);

  return new Promise((resolve, reject) => {
    const task = uploadBytesResumable(storageRef, file, { contentType: file.type });
    task.on(
      'state_changed',
      null,
      (err) => reject(err),
      async () => {
        const url = await getDownloadURL(task.snapshot.ref);
        resolve(url);
      }
    );
  });
}

export default function ImageUpload({
  value,
  onChange,
  label = 'Upload Image',
  multiple = false,
}) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');
  const inputRef = useRef(null);

  const handleUpload = async (files) => {
    if (!files || files.length === 0) return;
    setError('');

    const invalid = Array.from(files).find((f) => !ALLOWED_TYPES.includes(f.type));
    if (invalid) { setError('Only JPG, PNG, WebP, GIF, SVG allowed.'); return; }

    setUploading(true);
    setProgress(0);

    try {
      const urls = [];
      for (let i = 0; i < files.length; i++) {
        const url = await uploadToFirebase(files[i]);
        urls.push(url);
        setProgress(Math.round(((i + 1) / files.length) * 100));
      }
      if (multiple) {
        onChange([...(value || []), ...urls]);
      } else {
        onChange(urls[0]);
      }
    } catch (err) {
      setError('Upload failed: ' + (err.message || 'unknown error'));
    } finally {
      setUploading(false);
      setProgress(0);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  const removeImage = (index) => {
    if (multiple) {
      onChange((value || []).filter((_, i) => i !== index));
    } else {
      onChange('');
    }
  };

  const images = multiple ? (value || []) : (value ? [value] : []);

  return (
    <div className="iu-wrap">
      {images.length > 0 && (
        <div className="iu-grid">
          {images.map((src, idx) => (
            <div key={idx} className="iu-item">
              <div className="iu-img-box">
                <img src={src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
              </div>
              <button type="button" className="iu-remove" onClick={() => removeImage(idx)} aria-label="Remove image">✕</button>
            </div>
          ))}
        </div>
      )}

      <div
        className={`iu-dropzone${uploading ? ' iu-uploading' : ''}`}
        onClick={() => !uploading && inputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => { e.preventDefault(); if (!uploading) handleUpload(Array.from(e.dataTransfer.files)); }}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && !uploading && inputRef.current?.click()}
        aria-label={label}
      >
        {uploading ? (
          <div className="iu-progress-wrap">
            <div className="iu-spinner" />
            <span className="iu-progress-text">Uploading… {progress}%</span>
            <div className="iu-bar-track"><div className="iu-bar-fill" style={{ width: `${progress}%` }} /></div>
          </div>
        ) : (
          <>
            <div className="iu-upload-icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="17 8 12 3 7 8"/>
                <line x1="12" y1="3" x2="12" y2="15"/>
              </svg>
            </div>
            <span className="iu-label">{label}</span>
            <span className="iu-hint">Click or drag & drop · JPG, PNG, WebP</span>
          </>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple={multiple}
        style={{ display: 'none' }}
        onChange={(e) => handleUpload(Array.from(e.target.files))}
      />

      {error && <p className="iu-error">{error}</p>}

      <style jsx global>{`
        .iu-wrap { display: flex; flex-direction: column; gap: 10px; }

        .iu-grid { display: flex; flex-wrap: wrap; gap: 10px; }
        .iu-item { position: relative; }
        .iu-img-box {
          width: 90px; height: 90px; border-radius: 8px; overflow: hidden;
          border: 1.5px solid #e5e7eb; background: #f9fafb;
        }
        .iu-remove {
          position: absolute; top: -7px; right: -7px;
          width: 22px; height: 22px;
          background: #eb3237; color: white; border: 2px solid white;
          border-radius: 50%; font-size: 10px; cursor: pointer;
          display: flex; align-items: center; justify-content: center; line-height: 1;
          box-shadow: 0 2px 6px rgba(235,50,55,0.4);
        }

        .iu-dropzone {
          border: 2px dashed #d1d5db; border-radius: 10px; padding: 24px 16px;
          display: flex; flex-direction: column; align-items: center; gap: 6px;
          cursor: pointer; transition: all 0.2s; background: #fafafa; text-align: center;
          outline: none;
        }
        .iu-dropzone:hover, .iu-dropzone:focus { border-color: #006833; background: #f0faf4; }
        .iu-dropzone.iu-uploading { cursor: wait; opacity: 0.85; }

        .iu-upload-icon { color: #9ca3af; transition: color 0.2s; }
        .iu-dropzone:hover .iu-upload-icon { color: #006833; }

        .iu-label { font-size: 13px; font-weight: 600; color: #374151; }
        .iu-hint { font-size: 11px; color: #9ca3af; }

        .iu-progress-wrap { display: flex; flex-direction: column; align-items: center; gap: 8px; width: 100%; }
        .iu-spinner {
          width: 28px; height: 28px; border: 3px solid #e5e7eb;
          border-top-color: #006833; border-radius: 50%;
          animation: iu-spin 0.7s linear infinite;
        }
        @keyframes iu-spin { to { transform: rotate(360deg); } }
        .iu-progress-text { font-size: 13px; color: #374151; font-weight: 500; }
        .iu-bar-track { width: 100%; max-width: 200px; height: 4px; background: #e5e7eb; border-radius: 2px; overflow: hidden; }
        .iu-bar-fill { height: 100%; background: linear-gradient(90deg, #006833, #00a04d); border-radius: 2px; transition: width 0.2s; }

        .iu-error { font-size: 12px; color: #eb3237; margin: 0; }
      `}</style>
    </div>
  );
}
