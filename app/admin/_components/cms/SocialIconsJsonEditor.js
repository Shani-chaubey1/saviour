'use client';

import DynamicFaIcon from '@/app/(main)/components/shared/DynamicFaIcon';
import { parseJsonArray, stringifyJsonArray } from '@/lib/cmsJson';

export default function SocialIconsJsonEditor({ value, onChange, label, hint }) {
  const items = parseJsonArray(value, [{ icon: 'FaFacebook', color: '#1877f2', url: '', label: 'Facebook' }]);

  const update = (next) => onChange(stringifyJsonArray(next));
  const setRow = (i, field, v) => {
    const next = items.map((row, j) => (j === i ? { ...row, [field]: v } : row));
    update(next);
  };
  const add = () => update([...items, { icon: 'FaInstagram', color: '#e4405f', url: '', label: 'Social' }]);
  const remove = (i) => update(items.filter((_, j) => j !== i));

  return (
    <div className="so-wrap">
      <label className="so-label">
        {label}
        {hint && <span className="so-hint">{hint}</span>}
      </label>
      <p className="so-tip">Icon: react-icons name, e.g. FaFacebook, FaInstagram, FaYoutube, FaTwitter, FaLinkedin</p>
      <div className="so-list">
        {items.map((row, i) => (
          <div key={i} className="so-card">
            <div className="so-preview" style={{ color: row.color || '#fff' }}>
              <DynamicFaIcon name={row.icon} size={18} />
            </div>
            <div className="so-fields">
              <input
                type="text"
                className="so-inp"
                placeholder="FaFacebook"
                value={row.icon ?? ''}
                onChange={(e) => setRow(i, 'icon', e.target.value)}
              />
              <input
                type="color"
                className="so-color"
                value={row.color?.startsWith('#') ? row.color : '#1877f2'}
                onChange={(e) => setRow(i, 'color', e.target.value)}
                title="Icon color"
              />
              <input
                type="text"
                className="so-inp so-grow"
                placeholder="URL"
                value={row.url ?? ''}
                onChange={(e) => setRow(i, 'url', e.target.value)}
              />
              <input
                type="text"
                className="so-inp"
                placeholder="Aria label"
                value={row.label ?? ''}
                onChange={(e) => setRow(i, 'label', e.target.value)}
              />
            </div>
            <button type="button" className="so-del" onClick={() => remove(i)} aria-label="Remove">
              ✕
            </button>
          </div>
        ))}
      </div>
      <button type="button" className="so-add" onClick={add}>
        + Add social icon
      </button>
      <style jsx global>{`
        .so-wrap { display: flex; flex-direction: column; gap: 8px; }
        .so-label { font-size: 13px; font-weight: 600; color: #374151; }
        .so-hint { display: block; font-size: 11.5px; color: #9ca3af; margin-top: 2px; }
        .so-tip { font-size: 12px; color: #6b7280; margin: 0; }
        .so-list { display: flex; flex-direction: column; gap: 10px; }
        .so-card {
          display: flex !important; align-items: flex-start; gap: 10px;
          padding: 12px; border: 1px solid #e5e7eb; border-radius: 10px; background: #fafafa;
        }
        .so-preview {
          width: 40px; height: 40px; border-radius: 8px; background: #111827;
          display: flex !important; align-items: center; justify-content: center; flex-shrink: 0;
        }
        .so-fields { flex: 1; display: flex; flex-wrap: wrap; gap: 8px; align-items: center; }
        .so-inp {
          padding: 6px 10px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 13px;
        }
        .so-inp:focus { outline: none; border-color: #006833; }
        .so-grow { flex: 1; min-width: 180px; }
        .so-color { width: 40px; height: 34px; padding: 2px; border: 1px solid #d1d5db; border-radius: 6px; cursor: pointer; }
        .so-del {
          width: 32px; height: 32px; border-radius: 6px; border: 1px solid #fecaca;
          background: #fef2f2; color: #b91c1c; cursor: pointer; flex-shrink: 0;
        }
        .so-add {
          align-self: flex-start; padding: 8px 14px; border-radius: 8px; border: 1px dashed #006833;
          background: #f0faf5; color: #006833; font-size: 13px; font-weight: 600; cursor: pointer;
        }
      `}</style>
    </div>
  );
}
