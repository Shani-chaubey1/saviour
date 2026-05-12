'use client';

import { parseJsonArray, stringifyJsonArray } from '@/lib/cmsJson';

export default function LinkListJsonEditor({ value, onChange, label, hint }) {
  const items = parseJsonArray(value, [{ label: '', href: '' }]);

  const update = (next) => onChange(stringifyJsonArray(next));
  const setRow = (i, field, v) => {
    const next = items.map((row, j) => (j === i ? { ...row, [field]: v } : row));
    update(next);
  };
  const add = () => update([...items, { label: '', href: '' }]);
  const remove = (i) => update(items.filter((_, j) => j !== i));

  return (
    <div className="jl-wrap">
      <label className="jl-label">
        {label}
        {hint && <span className="jl-hint">{hint}</span>}
      </label>
      <div className="jl-list">
        {items.map((row, i) => (
          <div key={i} className="jl-row">
            <input
              type="text"
              className="jl-inp"
              placeholder="Label"
              value={row.label ?? ''}
              onChange={(e) => setRow(i, 'label', e.target.value)}
            />
            <input
              type="text"
              className="jl-inp jl-grow"
              placeholder="URL (e.g. /about-us or https://...)"
              value={row.href ?? ''}
              onChange={(e) => setRow(i, 'href', e.target.value)}
            />
            <button type="button" className="jl-del" onClick={() => remove(i)} aria-label="Remove">
              ✕
            </button>
          </div>
        ))}
      </div>
      <button type="button" className="jl-add" onClick={add}>
        + Add link
      </button>
      <style jsx global>{`
        .jl-wrap { display: flex; flex-direction: column; gap: 10px; }
        .jl-label { font-size: 13px; font-weight: 600; color: #374151; }
        .jl-hint { display: block; font-size: 11.5px; font-weight: 400; color: #9ca3af; margin-top: 2px; }
        .jl-list { display: flex; flex-direction: column; gap: 8px; }
        .jl-row { display: flex !important; align-items: center; gap: 8px; flex-wrap: wrap; }
        .jl-inp {
          padding: 8px 12px; border: 1.5px solid #e5e7eb; border-radius: 8px; font-size: 14px;
          min-width: 120px;
        }
        .jl-inp:focus { outline: none; border-color: #006833; }
        .jl-grow { flex: 1; min-width: 200px; }
        .jl-del {
          width: 36px; height: 36px; border-radius: 8px; border: 1px solid #fecaca;
          background: #fef2f2; color: #b91c1c; cursor: pointer;
        }
        .jl-add {
          align-self: flex-start; padding: 8px 14px; border-radius: 8px; border: 1px dashed #006833;
          background: #f0faf5; color: #006833; font-size: 13px; font-weight: 600; cursor: pointer;
        }
      `}</style>
    </div>
  );
}
