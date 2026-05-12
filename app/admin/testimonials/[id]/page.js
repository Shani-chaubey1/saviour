'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useToast } from '../../_components/Toast';
import ImageField from '../../_components/ImageField';

export default function EditTestimonialPage({ params }) {
  const { toast } = useToast();
  const router = useRouter();
  const [form, setForm] = useState({ name: '', role: '', project: '', content: '', rating: 5, avatar: '', isActive: true });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    fetch('/api/admin/testimonials')
      .then((r) => r.json())
      .then((d) => {
        const found = (d.testimonials || []).find((t) => t._id === params.id);
        if (found) setForm({ name: found.name, role: found.role || '', project: found.project || '', content: found.content, rating: found.rating, avatar: found.avatar || '', isActive: found.isActive });
        setFetching(false);
      })
      .catch(() => setFetching(false));
  }, [params.id]);

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/testimonials/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      toast({ message: 'Testimonial updated', type: 'success' });
      router.push('/admin/testimonials');
    } catch (err) {
      toast({ message: err.message || 'Failed to update', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <div className="loading">Loading...</div>;

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Edit Testimonial</h1>
        <Link href="/admin/testimonials" className="btn-back">← Back</Link>
      </div>
      <div className="card">
        <form onSubmit={handleSubmit} className="form">
          <div className="form-row">
            <div className="form-group">
              <label>Customer Name *</label>
              <input type="text" value={form.name} onChange={set('name')} required />
            </div>
            <div className="form-group">
              <label>Role / Designation</label>
              <input type="text" value={form.role} onChange={set('role')} />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Project</label>
              <input type="text" value={form.project} onChange={set('project')} />
            </div>
            <div className="form-group">
              <label>Rating</label>
              <select value={form.rating} onChange={set('rating')}>
                {[5,4,3,2,1].map((r) => <option key={r} value={r}>{r} Stars</option>)}
              </select>
            </div>
          </div>
          <div className="form-group">
            <label>Review Content *</label>
            <textarea value={form.content} onChange={set('content')} rows={5} required />
          </div>
          <div className="form-group">
            <ImageField
              value={form.avatar}
              onChange={(url) => setForm((p) => ({ ...p, avatar: url }))}
              label="Customer Photo (optional)"
              hint="Square photo, min 80×80px recommended"
              previewW={100}
              previewH={100}
            />
          </div>
          <div className="form-group">
            <label className="checkbox-label">
              <input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} />
              Show on website
            </label>
          </div>
          <div className="form-actions">
            <Link href="/admin/testimonials" className="btn-cancel">Cancel</Link>
            <button type="submit" className="btn-primary" disabled={loading}>{loading ? 'Saving...' : 'Save Changes'}</button>
          </div>
        </form>
      </div>
      <style jsx global>{`
        .loading { padding: 40px; text-align: center; color: #9ca3af; }
        .page-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px; }
        .page-title { font-size: 24px; font-weight: 800; color: #111827; }
        .btn-back { padding: 8px 16px; background: white; border: 1px solid #e5e7eb; border-radius: 8px; color: #374151; text-decoration: none; font-size: 13.5px; }
        .card { background: white; border-radius: 12px; padding: 28px; box-shadow: 0 1px 4px rgba(0,0,0,0.06); border: 1px solid #f3f4f6; max-width: 720px; }
        .form { display: flex; flex-direction: column; gap: 20px; }
        .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
        .form-group { display: flex; flex-direction: column; gap: 6px; }
        .form-group label { font-size: 13px; font-weight: 600; color: #374151; }
        .checkbox-label { flex-direction: row; align-items: center; gap: 8px; cursor: pointer; }
        .form-group input, .form-group select, .form-group textarea { padding: 9px 12px; border: 1px solid #d1d5db; border-radius: 8px; font-size: 14px; outline: none; font-family: inherit; }
        .form-group textarea { resize: vertical; }
        .form-actions { display: flex; justify-content: flex-end; gap: 10px; }
        .btn-cancel { padding: 10px 20px; background: white; border: 1px solid #e5e7eb; border-radius: 8px; color: #374151; text-decoration: none; font-size: 14px; }
        .btn-primary { padding: 10px 24px; background: #006833; color: white; border: none; border-radius: 8px; font-size: 14px; font-weight: 600; cursor: pointer; }
        .btn-primary:disabled { opacity: 0.7; cursor: not-allowed; }
        @media (max-width: 640px) { .form-row { grid-template-columns: 1fr; } }
      `}</style>
    </div>
  );
}
