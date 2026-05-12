'use client';

import ImageField from '../ImageField';
import RichEditor from '../RichEditor';
import StatsCardsJsonEditor from './StatsCardsJsonEditor';
import { parseJsonArray, stringifyJsonArray } from '@/lib/cmsJson';

const KINDS = [
  { value: 'intro_split', label: 'Intro + image (split)' },
  { value: 'stats_row', label: 'Stat cards row' },
  { value: 'team', label: 'Team / management cards' },
  { value: 'chairman', label: "Chairman's message" },
  { value: 'mission_grid', label: 'Mission / vision grid' },
  { value: 'html_section', label: 'Full-width HTML block' },
];

function newId() {
  return `blk-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function emptyBlock(kind) {
  switch (kind) {
    case 'intro_split':
      return {
        id: newId(),
        kind,
        title: '',
        subtitle: '',
        html: '',
        image: '',
      };
    case 'stats_row':
      return { id: newId(), kind, items: [{ num: '', label: '' }] };
    case 'team':
      return {
        id: newId(),
        kind,
        title: 'Management',
        members: [{ name: '', role: '', image: '' }],
      };
    case 'chairman':
      return {
        id: newId(),
        kind,
        html: '',
        image: '',
        signatureName: '',
        signatureTitle: '',
      };
    case 'mission_grid':
      return {
        id: newId(),
        kind,
        items: [{ title: '', text: '' }],
      };
    case 'html_section':
      return { id: newId(), kind, title: '', html: '' };
    default:
      return { id: newId(), kind: 'html_section', title: '', html: '' };
  }
}

export default function AboutBlocksEditor({ value, onChange, label, hint }) {
  const blocks = Array.isArray(value) ? value : [];

  const setBlocks = (next) => onChange(next);
  const patchBlock = (i, partial) => {
    const next = blocks.map((b, j) => (j === i ? { ...b, ...partial } : b));
    setBlocks(next);
  };
  const removeBlock = (i) => setBlocks(blocks.filter((_, j) => j !== i));
  const moveBlock = (i, dir) => {
    const j = i + dir;
    if (j < 0 || j >= blocks.length) return;
    const next = [...blocks];
    [next[i], next[j]] = [next[j], next[i]];
    setBlocks(next);
  };

  const addKind = (e) => {
    const kind = e.target.value;
    if (!kind) return;
    e.target.value = '';
    setBlocks([...blocks, emptyBlock(kind)]);
  };

  return (
    <div className="ab-wrap">
      <label className="ab-label">
        {label}
        {hint && <span className="ab-hint">{hint}</span>}
      </label>
      <p className="ab-tip">Add blocks in any order. Each block type can appear multiple times. Images use upload + preview.</p>

      <div className="ab-list">
        {blocks.map((block, i) => (
          <div key={block.id || i} className="ab-card">
            <div className="ab-card-head">
              <span className="ab-kind-badge">{KINDS.find((k) => k.value === block.kind)?.label || block.kind}</span>
              <div className="ab-card-actions">
                <button type="button" className="ab-icon-btn" onClick={() => moveBlock(i, -1)} disabled={i === 0} aria-label="Move up">
                  ↑
                </button>
                <button type="button" className="ab-icon-btn" onClick={() => moveBlock(i, 1)} disabled={i === blocks.length - 1} aria-label="Move down">
                  ↓
                </button>
                <button type="button" className="ab-del" onClick={() => removeBlock(i)} aria-label="Remove block">
                  Remove
                </button>
              </div>
            </div>

            {block.kind === 'intro_split' && (
              <div className="ab-fields">
                <input
                  type="text"
                  className="ab-inp"
                  placeholder="Title"
                  value={block.title ?? ''}
                  onChange={(e) => patchBlock(i, { title: e.target.value })}
                />
                <input
                  type="text"
                  className="ab-inp"
                  placeholder="Subtitle (optional)"
                  value={block.subtitle ?? ''}
                  onChange={(e) => patchBlock(i, { subtitle: e.target.value })}
                />
                <RichEditor value={block.html ?? ''} onChange={(html) => patchBlock(i, { html })} />
                <ImageField
                  value={block.image ?? ''}
                  onChange={(url) => patchBlock(i, { image: url })}
                  label="Side image"
                  hint="Shown next to the text on desktop."
                  previewW={280}
                  previewH={160}
                />
              </div>
            )}

            {block.kind === 'stats_row' && (
              <StatsCardsJsonEditor
                value={stringifyJsonArray(block.items || [])}
                onChange={(json) => patchBlock(i, { items: parseJsonArray(json, []) })}
                label="Stats"
                hint="Number + label per card."
              />
            )}

            {block.kind === 'team' && (
              <div className="ab-fields">
                <input
                  type="text"
                  className="ab-inp"
                  placeholder="Section title (e.g. Management)"
                  value={block.title ?? ''}
                  onChange={(e) => patchBlock(i, { title: e.target.value })}
                />
                {(block.members || []).map((m, mi) => (
                  <div key={mi} className="ab-member">
                    <ImageField
                      value={m.image ?? ''}
                      onChange={(url) => {
                        const members = [...(block.members || [])];
                        members[mi] = { ...m, image: url };
                        patchBlock(i, { members });
                      }}
                      label={`Member ${mi + 1} photo`}
                      previewW={160}
                      previewH={120}
                    />
                    <input
                      type="text"
                      className="ab-inp"
                      placeholder="Name"
                      value={m.name ?? ''}
                      onChange={(e) => {
                        const members = [...(block.members || [])];
                        members[mi] = { ...m, name: e.target.value };
                        patchBlock(i, { members });
                      }}
                    />
                    <input
                      type="text"
                      className="ab-inp"
                      placeholder="Role"
                      value={m.role ?? ''}
                      onChange={(e) => {
                        const members = [...(block.members || [])];
                        members[mi] = { ...m, role: e.target.value };
                        patchBlock(i, { members });
                      }}
                    />
                    <button
                      type="button"
                      className="ab-del-sm"
                      onClick={() => {
                        const members = (block.members || []).filter((_, j) => j !== mi);
                        patchBlock(i, { members: members.length ? members : [{ name: '', role: '', image: '' }] });
                      }}
                    >
                      Remove member
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  className="ab-add-sm"
                  onClick={() => patchBlock(i, { members: [...(block.members || []), { name: '', role: '', image: '' }] })}
                >
                  + Add team member
                </button>
              </div>
            )}

            {block.kind === 'chairman' && (
              <div className="ab-fields">
                <ImageField
                  value={block.image ?? ''}
                  onChange={(url) => patchBlock(i, { image: url })}
                  label="Photo"
                  previewW={220}
                  previewH={180}
                />
                <RichEditor value={block.html ?? ''} onChange={(html) => patchBlock(i, { html })} />
                <input
                  type="text"
                  className="ab-inp"
                  placeholder="Signature name"
                  value={block.signatureName ?? ''}
                  onChange={(e) => patchBlock(i, { signatureName: e.target.value })}
                />
                <input
                  type="text"
                  className="ab-inp"
                  placeholder="Signature title"
                  value={block.signatureTitle ?? ''}
                  onChange={(e) => patchBlock(i, { signatureTitle: e.target.value })}
                />
              </div>
            )}

            {block.kind === 'mission_grid' && (
              <div className="ab-fields">
                {(block.items || []).map((row, ri) => (
                  <div key={ri} className="ab-mission-row">
                    <input
                      type="text"
                      className="ab-inp"
                      placeholder="Card title"
                      value={row.title ?? ''}
                      onChange={(e) => {
                        const items = [...(block.items || [])];
                        items[ri] = { ...row, title: e.target.value };
                        patchBlock(i, { items });
                      }}
                    />
                    <textarea
                      className="ab-ta"
                      rows={3}
                      placeholder="Card text"
                      value={row.text ?? ''}
                      onChange={(e) => {
                        const items = [...(block.items || [])];
                        items[ri] = { ...row, text: e.target.value };
                        patchBlock(i, { items });
                      }}
                    />
                    <button
                      type="button"
                      className="ab-del-sm"
                      onClick={() => {
                        const items = (block.items || []).filter((_, j) => j !== ri);
                        patchBlock(i, { items: items.length ? items : [{ title: '', text: '' }] });
                      }}
                    >
                      Remove card
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  className="ab-add-sm"
                  onClick={() => patchBlock(i, { items: [...(block.items || []), { title: '', text: '' }] })}
                >
                  + Add card
                </button>
              </div>
            )}

            {block.kind === 'html_section' && (
              <div className="ab-fields">
                <input
                  type="text"
                  className="ab-inp"
                  placeholder="Optional heading"
                  value={block.title ?? ''}
                  onChange={(e) => patchBlock(i, { title: e.target.value })}
                />
                <RichEditor value={block.html ?? ''} onChange={(html) => patchBlock(i, { html })} />
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="ab-add-row">
        <select className="ab-select" defaultValue="" onChange={addKind} aria-label="Add block type">
          <option value="" disabled>
            + Add block…
          </option>
          {KINDS.map((k) => (
            <option key={k.value} value={k.value}>
              {k.label}
            </option>
          ))}
        </select>
      </div>

      <style jsx global>{`
        .ab-wrap { display: flex; flex-direction: column; gap: 12px; max-width: 880px; }
        .ab-label { font-size: 13px; font-weight: 600; color: #374151; }
        .ab-hint { display: block; font-size: 11.5px; font-weight: 400; color: #9ca3af; margin-top: 2px; }
        .ab-tip { font-size: 12px; color: #6b7280; margin: 0; }
        .ab-list { display: flex; flex-direction: column; gap: 16px; }
        .ab-card {
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          padding: 16px;
          background: #fafafa;
        }
        .ab-card-head {
          display: flex !important;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 14px;
          flex-wrap: wrap;
        }
        .ab-kind-badge {
          font-size: 12px;
          font-weight: 700;
          color: #006833;
          background: #e8f5ee;
          padding: 4px 10px;
          border-radius: 6px;
        }
        .ab-card-actions { display: flex !important; gap: 6px; align-items: center; }
        .ab-icon-btn {
          width: 32px;
          height: 32px;
          border-radius: 6px;
          border: 1px solid #d1d5db;
          background: white;
          cursor: pointer;
          font-size: 14px;
        }
        .ab-icon-btn:disabled { opacity: 0.4; cursor: not-allowed; }
        .ab-del {
          padding: 6px 12px;
          border-radius: 6px;
          border: 1px solid #fecaca;
          background: #fef2f2;
          color: #b91c1c;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
        }
        .ab-fields { display: flex; flex-direction: column; gap: 12px; }
        .ab-inp {
          padding: 8px 12px;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          font-size: 14px;
        }
        .ab-inp:focus { outline: none; border-color: #006833; }
        .ab-ta {
          padding: 8px 12px;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          font-size: 14px;
          resize: vertical;
          font-family: inherit;
        }
        .ab-member {
          border: 1px dashed #cbd5e1;
          border-radius: 10px;
          padding: 12px;
          display: flex;
          flex-direction: column;
          gap: 8px;
          background: white;
        }
        .ab-mission-row {
          border: 1px dashed #cbd5e1;
          border-radius: 10px;
          padding: 12px;
          display: flex;
          flex-direction: column;
          gap: 8px;
          background: white;
        }
        .ab-del-sm,
        .ab-add-sm {
          align-self: flex-start;
          padding: 6px 12px;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          border: 1px dashed #006833;
          background: #f0faf5;
          color: #006833;
        }
        .ab-del-sm {
          border-color: #fecaca;
          background: #fef2f2;
          color: #b91c1c;
        }
        .ab-add-row { margin-top: 4px; }
        .ab-select {
          padding: 10px 14px;
          border-radius: 8px;
          border: 1.5px solid #006833;
          background: white;
          font-size: 14px;
          font-weight: 600;
          color: #006833;
          min-width: 220px;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
}
