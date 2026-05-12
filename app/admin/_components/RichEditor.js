'use client';
import dynamic from 'next/dynamic';
import { useMemo } from 'react';

const JoditEditor = dynamic(() => import('jodit-react'), {
  ssr: false,
  loading: () => <div className="editor-skeleton">Loading editor...</div>,
});

const JODIT_CONFIG = {
  readonly: false,
  height: 400,
  toolbarAdaptive: false,
  buttons: [
    'bold', 'italic', 'underline', 'strikethrough', '|',
    'ul', 'ol', '|',
    'h1', 'h2', 'h3', 'paragraph', '|',
    'link', 'image', '|',
    'align', '|',
    'undo', 'redo', '|',
    'fullsize', 'preview', 'source',
  ],
  style: { fontFamily: 'inherit', fontSize: '14px' },
  uploader: { insertImageAsBase64URI: true },
  showCharsCounter: false,
  showWordsCounter: false,
  showXPathInStatusbar: false,
};

export default function RichEditor({ value, onChange, label }) {
  const config = useMemo(() => JODIT_CONFIG, []);

  return (
    <div className="editor-wrap">
      {label && <label className="editor-label">{label}</label>}
      <div className="editor-container">
        <JoditEditor
          value={value || ''}
          config={config}
          onBlur={(content) => onChange(content)}
        />
      </div>
      <style jsx global>{`
        .editor-wrap { display: flex; flex-direction: column; gap: 6px; }
        .editor-label {
          font-size: 13px;
          font-weight: 600;
          color: #374151;
        }
        .editor-container :global(.jodit-container) {
          border-radius: 8px !important;
          overflow: hidden;
          border-color: #d1d5db !important;
        }
        .editor-container :global(.jodit-toolbar) {
          background: #f9fafb !important;
          border-bottom-color: #e5e7eb !important;
        }
        .editor-skeleton {
          height: 400px;
          background: #f9fafb;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #9ca3af;
          font-size: 14px;
        }
      `}</style>
    </div>
  );
}
