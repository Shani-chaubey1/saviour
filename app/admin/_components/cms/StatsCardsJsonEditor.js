'use client';

import { parseJsonArray, stringifyJsonArray } from '@/lib/cmsJson';

export default function StatsCardsJsonEditor({ value, onChange, label, hint }) {
  const items = parseJsonArray(value, [{ num: '', label: '' }]);

  const update = (next) => onChange(stringifyJsonArray(next));
  const setRow = (i, field, v) => {
    const next = items.map((row, j) => (j === i ? { ...row, [field]: v } : row));
    update(next);
  };
  const add = () => update([...items, { num: '', label: '' }]);
  const remove = (i) => update(items.filter((_, j) => j !== i));

  return (
    <div className="jc-wrap">
      <label className="jc-label">
        {label}
        {hint && <span className="jc-hint">{hint}</span>}
      </label>
      <div className="jc-list">
        {items.map((row, i) => (
          <div key={i} className="jc-row">
            <input
              type="text"
              className="jc-inp"
              placeholder="Number (e.g. 25+)"
              value={row.num ?? ''}
              onChange={(e) => setRow(i, 'num', e.target.value)}
            />
            <input
              type="text"
              className="jc-inp jc-grow"
              placeholder="Label"
              value={row.label ?? ''}
              onChange={(e) => setRow(i, 'label', e.target.value)}
            />
            <button type="button" className="jc-del" onClick={() => remove(i)} aria-label="Remove">
              ✕
            </button>
          </div>
        ))}
      </div>
      <button type="button" className="jc-add" onClick={add}>
        + Add stat card
      </button>
      <style jsx global>{`
        .jc-wrap { display: flex; flex-direction: column; gap: 10px; }
        .jc-label { font-size: 13px; font-weight: 600; color: #374151; }
        .jc-hint { display: block; font-size: 11.5px; font-weight: 400; color: #9ca3af; margin-top: 2px; }
        .jc-list { display: flex; flex-direction: column; gap: 8px; }
        .jc-row { display: flex !important; align-items: center; gap: 8px; flex-wrap: wrap; }
        .jc-inp {
          padding: 8px 12px; border: 1.5px solid #e5e7eb; border-radius: 8px; font-size: 14px;
          min-width: 100px;
        }
        .jc-inp:focus { outline: none; border-color: #006833; }
        .jc-grow { flex: 1; min-width: 160px; }
        .jc-del {
          width: 36px; height: 36px; border-radius: 8px; border: 1px solid #fecaca;
          background: #fef2f2; color: #b91c1c; cursor: pointer; font-size: 14px;
        }
        .jc-del:hover { background: #fee2e2; }
        .jc-add {
          align-self: flex-start; padding: 8px 14px; border-radius: 8px; border: 1px dashed #006833;
          background: #f0faf5; color: #006833; font-size: 13px; font-weight: 600; cursor: pointer;
        }
        .jc-add:hover { background: #d1fae5; }
      `}</style>
    </div>
  );
}
