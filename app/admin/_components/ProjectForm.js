'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ImageUpload from './ImageUpload';
import ImageField from './ImageField';
import RichEditor from './RichEditor';
import { useToast } from './Toast';

const STATUSES = ['For Sale', 'Upcoming', 'Under Construction', 'Possession Soon', 'Ready to Move', 'Sold Out'];

const EMPTY_PROJECT = {
  title: '', slug: '', rera: '', configuration: '', address: '', location: '',
  price: '', area: '', pricePerSqft: '', badge: '', excerpt: '',
  overview: '', thumbnail: '', gallery: [], masterPlan: '', video: '',
  status: 'For Sale', type: '', isFeatured: false, isActive: true, order: 0,
  amenities: [], specifications: [], highlights: [''], floorPlans: [], priceTable: [],
};

function toSlug(str) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export default function ProjectForm({ projectId }) {
  const { toast } = useToast();
  const router = useRouter();
  const isEdit = !!projectId;

  const [form, setForm] = useState(EMPTY_PROJECT);
  const [propertyTypes, setPropertyTypes] = useState([]);
  const [allAmenities, setAllAmenities] = useState([]);
  const [allSpecifications, setAllSpecifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);
  const [activeTab, setActiveTab] = useState('basic');

  useEffect(() => {
    const fetchOpts = { credentials: 'include' };
    Promise.all([
      fetch('/api/admin/property-types', fetchOpts).then((r) => r.json()),
      fetch('/api/admin/amenities', fetchOpts).then((r) => r.json()),
      fetch('/api/admin/specifications', fetchOpts).then((r) => r.json()),
    ]).then(([typesData, amenData, specData]) => {
      setPropertyTypes(typesData.types || []);
      setAllAmenities(amenData.amenities || []);
      setAllSpecifications(specData.specifications || []);
    });

    if (isEdit && projectId) {
      fetch(`/api/admin/projects/${projectId}`, { credentials: 'include', cache: 'no-store' })
        .then(async (r) => {
          const d = await r.json().catch(() => ({}));
          if (!r.ok) throw new Error(d.error || r.status);
          if (d.project) {
            const p = d.project;
            setForm({
              ...EMPTY_PROJECT,
              ...p,
              type: p.type?._id || p.type || '',
              amenities: (p.amenities || []).map((a) => a._id || a),
              specifications: (p.specifications || []).map((s) => s._id || s),
              highlights: p.highlights?.length ? p.highlights : [''],
              floorPlans: p.floorPlans || [],
              priceTable: p.priceTable || [],
            });
          }
        })
        .catch(() => toast({ message: 'Could not load project', type: 'error' }))
        .finally(() => setFetching(false));
    }
  }, [isEdit, projectId]);

  const set = (key) => (e) => {
    const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm((prev) => {
      const next = { ...prev, [key]: val };
      if (key === 'title' && !isEdit) next.slug = toSlug(val);
      return next;
    });
  };

  const toggleAmenity = (id) => {
    setForm((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(id) ? prev.amenities.filter((a) => a !== id) : [...prev.amenities, id],
    }));
  };

  const toggleSpec = (id) => {
    setForm((prev) => ({
      ...prev,
      specifications: prev.specifications.includes(id)
        ? prev.specifications.filter((s) => s !== id)
        : [...prev.specifications, id],
    }));
  };

  const updateHighlight = (idx, val) => {
    setForm((prev) => {
      const highlights = [...prev.highlights];
      highlights[idx] = val;
      return { ...prev, highlights };
    });
  };
  const addHighlight = () => setForm((prev) => ({ ...prev, highlights: [...prev.highlights, ''] }));
  const removeHighlight = (idx) =>
    setForm((prev) => ({ ...prev, highlights: prev.highlights.filter((_, i) => i !== idx) }));

  const addFloorPlan = () =>
    setForm((prev) => ({ ...prev, floorPlans: [...prev.floorPlans, { title: '', image: '' }] }));
  const updateFloorPlan = (idx, key, val) => {
    setForm((prev) => {
      const floorPlans = prev.floorPlans.map((fp, i) => (i === idx ? { ...fp, [key]: val } : fp));
      return { ...prev, floorPlans };
    });
  };
  const removeFloorPlan = (idx) =>
    setForm((prev) => ({ ...prev, floorPlans: prev.floorPlans.filter((_, i) => i !== idx) }));

  const addPriceRow = () =>
    setForm((prev) => ({ ...prev, priceTable: [...prev.priceTable, { type: '', size: '', price: '' }] }));
  const updatePriceRow = (idx, key, val) => {
    setForm((prev) => {
      const priceTable = prev.priceTable.map((row, i) => (i === idx ? { ...row, [key]: val } : row));
      return { ...prev, priceTable };
    });
  };
  const removePriceRow = (idx) =>
    setForm((prev) => ({ ...prev, priceTable: prev.priceTable.filter((_, i) => i !== idx) }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title) return toast({ message: 'Title is required', type: 'error' });
    setLoading(true);
    const payload = { ...form, highlights: form.highlights.filter((h) => h.trim()) };
    try {
      const url = isEdit ? `/api/admin/projects/${projectId}` : '/api/admin/projects';
      const method = isEdit ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      toast({ message: `Project ${isEdit ? 'updated' : 'created'} successfully`, type: 'success' });
      router.push('/admin/projects');
    } catch (err) {
      toast({ message: err.message || 'Failed to save', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const TABS = [
    { key: 'basic', label: 'Basic Info' },
    { key: 'media', label: 'Media' },
    { key: 'details', label: 'Details' },
    { key: 'overview', label: 'Overview' },
    { key: 'amenities', label: 'Amenities' },
    { key: 'specs', label: 'Specifications' },
    { key: 'floorplans', label: 'Floor Plans' },
    { key: 'pricing', label: 'Pricing' },
  ];

  if (fetching) return <div className="loading">Loading project...</div>;

  return (
    <form onSubmit={handleSubmit} className="project-form">
      <div className="tabs">
        {TABS.map((t) => (
          <button key={t.key} type="button" className={`tab ${activeTab === t.key ? 'active' : ''}`} onClick={() => setActiveTab(t.key)}>
            {t.label}
          </button>
        ))}
      </div>

      {/* BASIC INFO */}
      {activeTab === 'basic' && (
        <div className="tab-panel">
          <div className="form-row">
            <div className="form-group col-2">
              <label>Project Title *</label>
              <input type="text" value={form.title} onChange={set('title')} placeholder="e.g. Saviour Greenarch" required />
            </div>
            <div className="form-group">
              <label>Slug</label>
              <input type="text" value={form.slug} onChange={set('slug')} placeholder="auto-generated from title" />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>RERA Number</label>
              <input type="text" value={form.rera} onChange={set('rera')} placeholder="UPRERAPRJ123456" />
            </div>
            <div className="form-group">
              <label>Configuration</label>
              <input type="text" value={form.configuration} onChange={set('configuration')} placeholder="e.g. 2/3/4 BHK" />
            </div>
            <div className="form-group">
              <label>Status</label>
              <select value={form.status} onChange={set('status')}>
                {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Property Type</label>
              <select value={form.type} onChange={set('type')}>
                <option value="">Select type...</option>
                {propertyTypes.map((t) => <option key={t._id} value={t._id}>{t.name}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Price</label>
              <input type="text" value={form.price} onChange={set('price')} placeholder="e.g. ₹45 Lacs onwards" />
            </div>
            <div className="form-group">
              <label>Area</label>
              <input type="text" value={form.area} onChange={set('area')} placeholder="e.g. 850-1450 sq.ft" />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Price / Sq.Ft</label>
              <input type="text" value={form.pricePerSqft} onChange={set('pricePerSqft')} placeholder="e.g. ₹5,300/sqft" />
            </div>
            <div className="form-group">
              <label>Location / Neighborhood</label>
              <input type="text" value={form.location} onChange={set('location')} placeholder="e.g. Noida Sector 143" />
            </div>
            <div className="form-group">
              <label>Badge</label>
              <input type="text" value={form.badge} onChange={set('badge')} placeholder="e.g. Hot Offer!" />
            </div>
          </div>
          <div className="form-group">
            <label>Address</label>
            <textarea value={form.address} onChange={set('address')} rows={2} placeholder="Full address" />
          </div>
          <div className="form-group">
            <label>Excerpt / Short Description</label>
            <textarea value={form.excerpt} onChange={set('excerpt')} rows={3} placeholder="Short description for listings" />
          </div>
          <div className="form-group">
            <label>Video URL</label>
            <input type="text" value={form.video} onChange={set('video')} placeholder="YouTube or Vimeo URL" />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Display Order</label>
              <input
                type="number"
                min="0"
                value={form.order ?? 0}
                onChange={(e) => setForm((p) => ({ ...p, order: Number(e.target.value) || 0 }))}
                placeholder="0"
              />
              <span className="form-hint">Lower numbers show first on the public projects listing. Leave 0 to fall back to newest-first.</span>
            </div>
          </div>
          <div className="form-row checkboxes">
            <label className="checkbox-label">
              <input type="checkbox" checked={form.isFeatured} onChange={set('isFeatured')} />
              Featured Project
            </label>
            <label className="checkbox-label">
              <input type="checkbox" checked={form.isActive} onChange={set('isActive')} />
              Active (visible on website)
            </label>
          </div>
        </div>
      )}

      {/* MEDIA */}
      {activeTab === 'media' && (
        <div className="tab-panel">
          <div className="form-group">
            <ImageField
              value={form.thumbnail || ''}
              onChange={(url) => setForm((p) => ({ ...p, thumbnail: url }))}
              label="Thumbnail Image"
              hint="Recommended: 800×500px"
              previewW={280}
              previewH={160}
            />
          </div>
          <div className="form-group">
            <label>Gallery Images</label>
            <ImageUpload value={form.gallery} onChange={(urls) => setForm((p) => ({ ...p, gallery: urls }))} label="Upload Gallery Images" multiple />
          </div>
          <div className="form-group">
            <ImageField
              value={form.masterPlan || ''}
              onChange={(url) => setForm((p) => ({ ...p, masterPlan: url }))}
              label="Master Plan"
              hint="Full floor / site master plan image"
              previewW={280}
              previewH={160}
            />
          </div>
        </div>
      )}

      {/* DETAILS / HIGHLIGHTS */}
      {activeTab === 'details' && (
        <div className="tab-panel">
          <div className="section-title">Project Highlights</div>
          {form.highlights.map((h, i) => (
            <div key={i} className="dynamic-row">
              <input
                type="text"
                value={h}
                onChange={(e) => updateHighlight(i, e.target.value)}
                placeholder={`Highlight ${i + 1}`}
              />
              <button type="button" className="remove-btn" onClick={() => removeHighlight(i)}>✕</button>
            </div>
          ))}
          <button type="button" className="add-btn" onClick={addHighlight}>+ Add Highlight</button>
        </div>
      )}

      {/* OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="tab-panel">
          <RichEditor
            label="Project Overview"
            value={form.overview}
            onChange={(content) => setForm((p) => ({ ...p, overview: content }))}
          />
        </div>
      )}

      {/* AMENITIES */}
      {activeTab === 'amenities' && (
        <div className="tab-panel">
          <p className="section-hint">Select amenities available in this project</p>
          {allAmenities.length === 0 ? (
            <p className="empty-hint">No amenities found. <Link href="/admin/amenities">Manage amenities →</Link></p>
          ) : (
            <div className="checkbox-grid">
              {allAmenities.map((a) => (
                <label key={a._id} className={`check-card ${form.amenities.includes(a._id) ? 'checked' : ''}`}>
                  <input
                    type="checkbox"
                    checked={form.amenities.includes(a._id)}
                    onChange={() => toggleAmenity(a._id)}
                  />
                  <span className="check-icon">{a.icon ? '★' : '✓'}</span>
                  <span className="check-name">{a.name}</span>
                  <span className="check-code">{a.icon}</span>
                </label>
              ))}
            </div>
          )}
        </div>
      )}

      {/* SPECIFICATIONS */}
      {activeTab === 'specs' && (
        <div className="tab-panel">
          <p className="section-hint">Select specifications for this project</p>
          {allSpecifications.length === 0 ? (
            <p className="empty-hint">No specifications found. <Link href="/admin/specifications">Manage specifications →</Link></p>
          ) : (
            <div className="checkbox-grid">
              {allSpecifications.map((s) => (
                <label key={s._id} className={`check-card ${form.specifications.includes(s._id) ? 'checked' : ''}`}>
                  <input
                    type="checkbox"
                    checked={form.specifications.includes(s._id)}
                    onChange={() => toggleSpec(s._id)}
                  />
                  <span className="check-icon">★</span>
                  <span className="check-name">{s.name}</span>
                  <span className="check-code">{s.icon}</span>
                </label>
              ))}
            </div>
          )}
        </div>
      )}

      {/* FLOOR PLANS */}
      {activeTab === 'floorplans' && (
        <div className="tab-panel">
          {form.floorPlans.map((fp, i) => (
            <div key={i} className="floor-plan-row">
              <div className="form-group flex-1">
                <label>Floor Plan Title</label>
                <input
                  type="text"
                  value={fp.title}
                  onChange={(e) => updateFloorPlan(i, 'title', e.target.value)}
                  placeholder="e.g. 2 BHK Type A"
                />
              </div>
              <div className="form-group flex-1">
                <ImageField
                  value={fp.image || ''}
                  onChange={(url) => updateFloorPlan(i, 'image', url)}
                  label="Floor Plan Image"
                  previewW={240}
                  previewH={140}
                />
              </div>
              <button type="button" className="remove-btn-lg" onClick={() => removeFloorPlan(i)}>✕ Remove</button>
            </div>
          ))}
          <button type="button" className="add-btn" onClick={addFloorPlan}>+ Add Floor Plan</button>
        </div>
      )}

      {/* PRICING TABLE */}
      {activeTab === 'pricing' && (
        <div className="tab-panel">
          <p className="section-hint">Add pricing details for different configurations</p>
          {form.priceTable.length > 0 && (
            <div className="price-table">
              <div className="price-table-header">
                <span>Type / Config</span>
                <span>Size</span>
                <span>Price</span>
                <span></span>
              </div>
              {form.priceTable.map((row, i) => (
                <div key={i} className="price-table-row">
                  <input value={row.type} onChange={(e) => updatePriceRow(i, 'type', e.target.value)} placeholder="e.g. 2 BHK" />
                  <input value={row.size} onChange={(e) => updatePriceRow(i, 'size', e.target.value)} placeholder="e.g. 1050 sq.ft" />
                  <input value={row.price} onChange={(e) => updatePriceRow(i, 'price', e.target.value)} placeholder="e.g. ₹55 Lacs" />
                  <button type="button" className="remove-btn" onClick={() => removePriceRow(i)}>✕</button>
                </div>
              ))}
            </div>
          )}
          <button type="button" className="add-btn" onClick={addPriceRow}>+ Add Price Row</button>
        </div>
      )}

      <div className="form-footer">
        <Link href="/admin/projects" className="btn-cancel">Cancel</Link>
        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? 'Saving...' : isEdit ? 'Update Project' : 'Create Project'}
        </button>
      </div>

      <style jsx global>{`
        .project-form { display: flex; flex-direction: column; gap: 0; }
        .loading { padding: 40px; text-align: center; color: #9ca3af; }
        .tabs { display: flex; gap: 4px; background: white; padding: 16px 20px 0; border-radius: 12px 12px 0 0; border: 1px solid #f3f4f6; border-bottom: none; overflow-x: auto; flex-wrap: nowrap; }
        .tab { padding: 8px 14px; background: none; border: none; border-bottom: 2px solid transparent; color: #6b7280; font-size: 13.5px; font-weight: 500; cursor: pointer; white-space: nowrap; transition: all 0.2s; }
        .tab:hover { color: #374151; }
        .tab.active { color: #006833; border-bottom-color: #006833; font-weight: 600; }
        .tab-panel { background: white; border: 1px solid #f3f4f6; border-top: none; border-radius: 0 0 0 0; padding: 24px; display: flex; flex-direction: column; gap: 20px; min-height: 320px; }
        .form-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
        .form-row.checkboxes { grid-template-columns: auto auto; justify-content: start; align-items: center; gap: 24px; }
        .col-2 { grid-column: span 2; }
        .form-group { display: flex; flex-direction: column; gap: 6px; }
        .form-group label { font-size: 13px; font-weight: 600; color: #374151; }
        .form-group input, .form-group select, .form-group textarea {
          padding: 9px 12px;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          font-size: 14px;
          outline: none;
          font-family: inherit;
          background: white;
          transition: border-color 0.2s;
        }
        .form-group input:focus, .form-group select:focus, .form-group textarea:focus {
          border-color: #006833;
          box-shadow: 0 0 0 2px rgba(0,104,51,0.12);
        }
        .form-group textarea { resize: vertical; }
        .form-hint { font-size: 12px; color: #9ca3af; margin-top: 2px; }
        .checkbox-label { display: flex; align-items: center; gap: 8px; font-size: 13.5px; cursor: pointer; color: #374151; }
        .section-title { font-size: 15px; font-weight: 700; color: #111827; margin-bottom: 4px; }
        .section-hint { font-size: 13px; color: #6b7280; }
        .empty-hint { font-size: 13px; color: #9ca3af; }
        .empty-hint a { color: #006833; }
        .dynamic-row { display: flex; gap: 8px; align-items: center; }
        .dynamic-row input { flex: 1; padding: 9px 12px; border: 1px solid #d1d5db; border-radius: 8px; font-size: 14px; outline: none; }
        .dynamic-row input:focus { border-color: #006833; }
        .remove-btn { padding: 6px 10px; background: #fdeaeb; color: #eb3237; border: none; border-radius: 6px; cursor: pointer; font-size: 12px; flex-shrink: 0; }
        .remove-btn:hover { background: #fca5a8; }
        .add-btn { align-self: flex-start; padding: 8px 16px; background: #e8f5ef; color: #006833; border: 1px dashed #006833; border-radius: 8px; font-size: 13.5px; font-weight: 500; cursor: pointer; transition: all 0.2s; }
        .add-btn:hover { background: #d1f0e0; }
        .checkbox-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 10px; }
        .check-card { display: flex; align-items: center; gap: 8px; padding: 10px 12px; border: 1px solid #e5e7eb; border-radius: 8px; cursor: pointer; transition: all 0.15s; }
        .check-card:hover { border-color: #006833; background: #f9fafb; }
        .check-card.checked { border-color: #006833; background: #e8f5ef; }
        .check-card input { accent-color: #006833; }
        .check-icon { font-size: 16px; }
        .check-name { flex: 1; font-size: 13px; font-weight: 500; color: #374151; }
        .check-code { font-size: 10px; color: #9ca3af; font-family: monospace; }
        .floor-plan-row { display: flex; gap: 16px; align-items: flex-end; padding: 16px; background: #f9fafb; border-radius: 8px; border: 1px solid #f3f4f6; }
        .flex-1 { flex: 1; }
        .remove-btn-lg { padding: 9px 14px; background: #fdeaeb; color: #eb3237; border: none; border-radius: 8px; cursor: pointer; font-size: 12px; white-space: nowrap; flex-shrink: 0; }
        .price-table { display: flex; flex-direction: column; gap: 8px; }
        .price-table-header { display: grid; grid-template-columns: 1fr 1fr 1fr 32px; gap: 8px; padding: 8px 0; font-size: 12px; font-weight: 600; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.5px; }
        .price-table-row { display: grid; grid-template-columns: 1fr 1fr 1fr 32px; gap: 8px; align-items: center; }
        .price-table-row input { padding: 8px 10px; border: 1px solid #e5e7eb; border-radius: 6px; font-size: 13.5px; outline: none; }
        .price-table-row input:focus { border-color: #006833; }
        .form-footer { display: flex; justify-content: flex-end; gap: 10px; padding: 16px 24px; background: white; border: 1px solid #f3f4f6; border-top: none; border-radius: 0 0 12px 12px; }
        .btn-cancel { padding: 10px 20px; background: white; border: 1px solid #e5e7eb; border-radius: 8px; color: #374151; text-decoration: none; font-size: 14px; display: flex; align-items: center; }
        .btn-cancel:hover { background: #f9fafb; }
        .btn-primary { padding: 10px 24px; background: #006833; color: white; border: none; border-radius: 8px; font-size: 14px; font-weight: 600; cursor: pointer; transition: background 0.2s; }
        .btn-primary:hover { background: #004d26; }
        .btn-primary:disabled { opacity: 0.7; cursor: not-allowed; }
        @media (max-width: 768px) {
          .form-row { grid-template-columns: 1fr; }
          .col-2 { grid-column: span 1; }
          .floor-plan-row { flex-direction: column; }
        }
      `}</style>
    </form>
  );
}
