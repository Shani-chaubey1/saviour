'use client';

import DynamicFaIcon from '@/app/(main)/components/shared/DynamicFaIcon';
import { parseJsonArray, stringifyJsonArray } from '@/lib/cmsJson';

export default function FooterContactJsonEditor({ value, onChange, label, hint }) {
  const items = parseJsonArray(value, [
    { icon: 'FaPhone', label: 'Mobile', value: '+91 9206-001-002', href: 'tel:+919206001002' },
    { icon: 'FaEnvelope', label: 'Email', value: 'info@saviourgroup.in', href: 'mailto:info@saviourgroup.in' },
    { icon: 'FaMapMarkerAlt', label: 'Office', value: 'Yamuna Expressway, Greater Noida', href: '' },
  ]);

  const update = (next) => onChange(stringifyJsonArray(next));
  const setRow = (i, field, v) => {
    const next = items.map((row, j) => (j === i ? { ...row, [field]: v } : row));
    update(next);
  };
  const add = () => update([...items, { icon: 'FaPhone', label: '', value: '', href: '' }]);
  const remove = (i) => update(items.filter((_, j) => j !== i));

  return (
    <div className="fc-wrap">
      <label className="fc-label">
        {label}
        {hint && <span className="fc-hint">{hint}</span>}
      </label>
      <p className="fc-tip">Leave href empty for plain text (e.g. address). Use tel: or mailto: or https://</p>
      <div className="fc-list">
        {items.map((row, i) => (
          <div key={i} className="fc-card">
            <div className="fc-preview">
              <DynamicFaIcon name={row.icon} size={14} style={{ color: 'var(--red,#eb3237)' }} />
            </div>
            <div className="fc-fields">
              <input type="text" className="fc-inp" placeholder="FaPhone" value={row.icon ?? ''} onChange={(e) => setRow(i, 'icon', e.target.value)} />
              <input type="text" className="fc-inp" placeholder="Label (e.g. Phone)" value={row.label ?? ''} onChange={(e) => setRow(i, 'label', e.target.value)} />
              <input type="text" className="fc-inp fc-grow" placeholder="Display value" value={row.value ?? ''} onChange={(e) => setRow(i, 'value', e.target.value)} />
              <input type="text" className="fc-inp fc-grow" placeholder="href (optional)" value={row.href ?? ''} onChange={(e) => setRow(i, 'href', e.target.value)} />
            </div>
            <button type="button" className="fc-del" onClick={() => remove(i)} aria-label="Remove">
              ✕
            </button>
          </div>
        ))}
      </div>
      <button type="button" className="fc-add" onClick={add}>
        + Add contact row
      </button>
      <style jsx global>{`
        .fc-wrap { display: flex; flex-direction: column; gap: 8px; }
        .fc-label { font-size: 13px; font-weight: 600; color: #374151; }
        .fc-hint { display: block; font-size: 11.5px; color: #9ca3af; margin-top: 2px; }
        .fc-tip { font-size: 12px; color: #6b7280; margin: 0; }
        .fc-list { display: flex; flex-direction: column; gap: 10px; }
        .fc-card {
          display: flex !important; align-items: flex-start; gap: 10px;
          padding: 12px; border: 1px solid #e5e7eb; border-radius: 10px; background: #fafafa;
        }
        .fc-preview {
          width: 36px; height: 36px; border-radius: 6px; background: rgba(0,104,51,0.15);
          display: flex !important; align-items: center; justify-content: center; flex-shrink: 0;
        }
        .fc-fields { flex: 1; display: flex; flex-wrap: wrap; gap: 8px; align-items: center; }
        .fc-inp { padding: 6px 10px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 13px; }
        .fc-inp:focus { outline: none; border-color: #006833; }
        .fc-grow { flex: 1; min-width: 140px; }
        .fc-del { width: 32px; height: 32px; border-radius: 6px; border: 1px solid #fecaca; background: #fef2f2; color: #b91c1c; cursor: pointer; }
        .fc-add { align-self: flex-start; padding: 8px 14px; border-radius: 8px; border: 1px dashed #006833; background: #f0faf5; color: #006833; font-size: 13px; font-weight: 600; cursor: pointer; }
      `}</style>
    </div>
  );
}
