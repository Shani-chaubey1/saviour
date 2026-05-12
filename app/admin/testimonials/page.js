'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import ConfirmModal from '../_components/ConfirmModal';
import { useToast } from '../_components/Toast';

export default function TestimonialsPage() {
  const { toast } = useToast();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirm, setConfirm] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetch('/api/admin/testimonials')
      .then((r) => r.json())
      .then((d) => { setItems(d.testimonials || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await fetch(`/api/admin/testimonials/${confirm._id}`, { method: 'DELETE' });
      setItems((prev) => prev.filter((t) => t._id !== confirm._id));
      toast({ message: 'Testimonial deleted', type: 'success' });
    } catch {
      toast({ message: 'Failed to delete', type: 'error' });
    } finally {
      setDeleting(false);
      setConfirm(null);
    }
  };

  const toggleActive = async (item) => {
    const res = await fetch(`/api/admin/testimonials/${item._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isActive: !item.isActive }),
    });
    const data = await res.json();
    if (res.ok) setItems((prev) => prev.map((t) => (t._id === item._id ? data.testimonial : t)));
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Testimonials</h1>
          <p className="page-subtitle">Manage customer reviews and feedback</p>
        </div>
        <Link href="/admin/testimonials/new" className="btn-primary">+ Add Testimonial</Link>
      </div>

      <div className="card">
        {loading ? (
          <div className="loading-state">Loading...</div>
        ) : items.length === 0 ? (
          <div className="empty-state"><p className="empty-icon">💬</p><p>No testimonials yet</p></div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Person</th>
                  <th>Project</th>
                  <th>Rating</th>
                  <th>Active</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((t) => (
                  <tr key={t._id}>
                    <td>
                      <div className="person-cell">
                        <div className="person-avatar">{t.name?.[0]?.toUpperCase()}</div>
                        <div>
                          <p className="person-name">{t.name}</p>
                          <p className="person-role">{t.role || '—'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="muted">{t.project || '—'}</td>
                    <td><span className="rating">{'★'.repeat(t.rating)}</span></td>
                    <td>
                      <button className={`toggle-btn ${t.isActive ? 'active' : 'inactive'}`} onClick={() => toggleActive(t)}>
                        {t.isActive ? '● Active' : '○ Hidden'}
                      </button>
                    </td>
                    <td>
                      <div className="actions">
                        <Link href={`/admin/testimonials/${t._id}`} className="btn-icon btn-edit">✏</Link>
                        <button className="btn-icon btn-delete" onClick={() => setConfirm(t)}>🗑</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <ConfirmModal isOpen={!!confirm} title="Delete Testimonial?" message={`Delete testimonial from ${confirm?.name}?`} onConfirm={handleDelete} onCancel={() => setConfirm(null)} loading={deleting} />

      <style jsx global>{`
        .page-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px; flex-wrap: wrap; gap: 12px; }
        .page-title { font-size: 24px; font-weight: 800; color: #111827; margin-bottom: 4px; }
        .page-subtitle { color: #6b7280; font-size: 14px; }
        .btn-primary { padding: 9px 18px; background: #006833; color: white; border: none; border-radius: 8px; font-size: 13.5px; font-weight: 600; cursor: pointer; text-decoration: none; }
        .card { background: white; border-radius: 12px; box-shadow: 0 1px 4px rgba(0,0,0,0.06); border: 1px solid #f3f4f6; overflow: hidden; }
        .loading-state, .empty-state { padding: 48px; text-align: center; color: #9ca3af; }
        .empty-icon { font-size: 40px; margin-bottom: 8px; }
        .table-wrap { overflow-x: auto; }
        table { width: 100%; border-collapse: collapse; }
        thead th { background: #f9fafb; padding: 10px 16px; text-align: left; font-size: 12px; font-weight: 600; color: #6b7280; text-transform: uppercase; border-bottom: 1px solid #f3f4f6; }
        tbody tr { border-bottom: 1px solid #f9fafb; }
        tbody tr:last-child { border-bottom: none; }
        tbody tr:hover { background: #f9fafb; }
        tbody td { padding: 12px 16px; font-size: 13.5px; color: #374151; vertical-align: middle; }
        .person-cell { display: flex; align-items: center; gap: 10px; }
        .person-avatar { width: 36px; height: 36px; background: #7c3aed; color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 14px; flex-shrink: 0; }
        .person-name { font-weight: 600; color: #111827; }
        .person-role { font-size: 12px; color: #9ca3af; }
        .muted { color: #9ca3af; font-size: 12px; }
        .rating { color: #f59e0b; font-size: 14px; }
        .toggle-btn { padding: 3px 10px; border-radius: 20px; font-size: 12px; font-weight: 600; border: none; cursor: pointer; }
        .toggle-btn.active { background: #e8f5ef; color: #006833; }
        .toggle-btn.inactive { background: #f3f4f6; color: #9ca3af; }
        .actions { display: flex; gap: 6px; }
        .btn-icon { width: 30px; height: 30px; border-radius: 6px; display: flex; align-items: center; justify-content: center; font-size: 13px; cursor: pointer; border: none; text-decoration: none; }
        .btn-edit { background: #dbeafe; color: #1d4ed8; }
        .btn-delete { background: #fdeaeb; color: #eb3237; }
      `}</style>
    </div>
  );
}
