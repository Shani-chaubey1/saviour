'use client';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { useToast } from '../../_components/Toast';

export default function EditAdminPage() {
  const { toast } = useToast();
  const router = useRouter();
  const params = useParams();
  const id = params?.id;
  const [form, setForm] = useState({ name: '', email: '', role: 'admin', password: '' });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!id) {
      setFetching(false);
      return;
    }
    fetch(`/api/admin/admins/${id}`, { credentials: 'include', cache: 'no-store' })
      .then(async (r) => {
        const d = await r.json().catch(() => ({}));
        if (!r.ok) throw new Error(d.error || r.status);
        const a = d.admin;
        if (a) setForm({ name: a.name ?? '', email: a.email ?? '', role: a.role ?? 'admin', password: '' });
      })
      .catch(() => toast({ message: 'Could not load admin', type: 'error' }))
      .finally(() => setFetching(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const payload = { name: form.name, email: form.email, role: form.role };
    if (form.password) payload.password = form.password;
    try {
      const res = await fetch(`/api/admin/admins/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      toast({ message: 'Admin updated successfully', type: 'success' });
      router.push('/admin/admins');
    } catch (err) {
      toast({ message: err.message || 'Failed to update', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  if (fetching) return <div className="loading">Loading...</div>;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Edit Admin</h1>
          <p className="page-subtitle">Update administrator account details</p>
        </div>
        <Link href="/admin/admins" className="btn-back">← Back</Link>
      </div>

      <div className="card">
        <form onSubmit={handleSubmit} className="form">
          <div className="form-row">
            <div className="form-group">
              <label>Full Name *</label>
              <input type="text" value={form.name} onChange={set('name')} required />
            </div>
            <div className="form-group">
              <label>Email Address *</label>
              <input type="email" value={form.email} onChange={set('email')} required />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>New Password <span className="optional">(leave blank to keep current)</span></label>
              <input type="password" value={form.password} onChange={set('password')} placeholder="Leave blank to keep current" minLength={6} />
            </div>
            <div className="form-group">
              <label>Role *</label>
              <select value={form.role} onChange={set('role')}>
                <option value="admin">Admin</option>
                <option value="super_admin">Super Admin</option>
              </select>
            </div>
          </div>
          <div className="form-actions">
            <Link href="/admin/admins" className="btn-cancel">Cancel</Link>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>

      <style jsx global>{`
        .loading { padding: 40px; text-align: center; color: #9ca3af; }
        .page-header { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 24px; gap: 12px; }
        .page-title { font-size: 24px; font-weight: 800; color: #111827; margin-bottom: 4px; }
        .page-subtitle { color: #6b7280; font-size: 14px; }
        .btn-back { padding: 8px 16px; background: white; border: 1px solid #e5e7eb; border-radius: 8px; color: #374151; text-decoration: none; font-size: 13.5px; }
        .card { background: white; border-radius: 12px; padding: 28px; box-shadow: 0 1px 4px rgba(0,0,0,0.06); border: 1px solid #f3f4f6; max-width: 720px; }
        .form { display: flex; flex-direction: column; gap: 20px; }
        .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
        .form-group { display: flex; flex-direction: column; gap: 6px; }
        .form-group label { font-size: 13px; font-weight: 600; color: #374151; }
        .optional { font-weight: 400; color: #9ca3af; font-size: 11px; }
        .form-group input, .form-group select { padding: 10px 12px; border: 1px solid #d1d5db; border-radius: 8px; font-size: 14px; outline: none; background: white; }
        .form-group input:focus, .form-group select:focus { border-color: #006833; box-shadow: 0 0 0 2px rgba(0,104,51,0.15); }
        .form-actions { display: flex; justify-content: flex-end; gap: 10px; padding-top: 8px; }
        .btn-cancel { padding: 10px 20px; background: white; border: 1px solid #e5e7eb; border-radius: 8px; color: #374151; text-decoration: none; font-size: 14px; }
        .btn-primary { padding: 10px 24px; background: #006833; color: white; border: none; border-radius: 8px; font-size: 14px; font-weight: 600; cursor: pointer; }
        .btn-primary:disabled { opacity: 0.7; cursor: not-allowed; }
        @media (max-width: 640px) { .form-row { grid-template-columns: 1fr; } }
      `}</style>
    </div>
  );
}
