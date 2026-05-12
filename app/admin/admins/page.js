'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import ConfirmModal from '../_components/ConfirmModal';
import { useToast } from '../_components/Toast';

export default function AdminsPage() {
  const { toast } = useToast();
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);
  const [confirm, setConfirm] = useState(null);

  const fetchAdmins = () => {
    fetch('/api/admin/admins')
      .then((r) => r.json())
      .then((d) => { setAdmins(d.admins || []); setLoading(false); })
      .catch(() => setLoading(false));
  };

  useEffect(() => { fetchAdmins(); }, []);

  const handleDelete = async () => {
    setDeleting(confirm._id);
    try {
      const res = await fetch(`/api/admin/admins/${confirm._id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');
      setAdmins((prev) => prev.filter((a) => a._id !== confirm._id));
      toast({ message: 'Admin deleted', type: 'success' });
    } catch {
      toast({ message: 'Failed to delete', type: 'error' });
    } finally {
      setDeleting(null);
      setConfirm(null);
    }
  };

  const toggleActive = async (admin) => {
    try {
      const res = await fetch(`/api/admin/admins/${admin._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !admin.isActive }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setAdmins((prev) => prev.map((a) => (a._id === admin._id ? data.admin : a)));
      toast({ message: `Admin ${data.admin.isActive ? 'activated' : 'deactivated'}`, type: 'success' });
    } catch {
      toast({ message: 'Failed to update', type: 'error' });
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Admin Users</h1>
          <p className="page-subtitle">Manage administrator accounts</p>
        </div>
        <Link href="/admin/admins/new" className="btn-primary">+ Add Admin</Link>
      </div>

      <div className="card">
        {loading ? (
          <div className="loading-state">Loading...</div>
        ) : admins.length === 0 ? (
          <div className="empty-state">
            <p className="empty-icon">👥</p>
            <p>No admins found</p>
            <Link href="/admin/admins/new" className="btn-primary">Add First Admin</Link>
          </div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Admin</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Last Login</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {admins.map((admin) => (
                  <tr key={admin._id}>
                    <td>
                      <div className="admin-cell">
                        <div className="admin-avatar">{admin.name?.[0]?.toUpperCase()}</div>
                        <div>
                          <p className="admin-name">{admin.name}</p>
                          <p className="admin-email">{admin.email}</p>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className={`badge ${admin.role === 'super_admin' ? 'badge-green' : 'badge-blue'}`}>
                        {admin.role === 'super_admin' ? 'Super Admin' : 'Admin'}
                      </span>
                    </td>
                    <td>
                      <button
                        className={`toggle-btn ${admin.isActive ? 'active' : 'inactive'}`}
                        onClick={() => toggleActive(admin)}
                      >
                        {admin.isActive ? '● Active' : '○ Inactive'}
                      </button>
                    </td>
                    <td className="muted">
                      {admin.lastLogin ? new Date(admin.lastLogin).toLocaleDateString() : 'Never'}
                    </td>
                    <td>
                      <div className="actions">
                        <Link href={`/admin/admins/${admin._id}`} className="btn-icon btn-edit">✏</Link>
                        <button className="btn-icon btn-delete" onClick={() => setConfirm(admin)}>🗑</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <ConfirmModal
        isOpen={!!confirm}
        title="Delete Admin?"
        message={`Are you sure you want to delete ${confirm?.name}? This cannot be undone.`}
        onConfirm={handleDelete}
        onCancel={() => setConfirm(null)}
        loading={!!deleting}
      />

      <style jsx global>{`
        .page-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px; flex-wrap: wrap; gap: 12px; }
        .page-title { font-size: 24px; font-weight: 800; color: #111827; margin-bottom: 4px; }
        .page-subtitle { color: #6b7280; font-size: 14px; }
        .btn-primary {
          padding: 9px 18px;
          background: #006833;
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 13.5px;
          font-weight: 600;
          cursor: pointer;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          transition: background 0.2s;
        }
        .btn-primary:hover { background: #004d26; }
        .card { background: white; border-radius: 12px; box-shadow: 0 1px 4px rgba(0,0,0,0.06); border: 1px solid #f3f4f6; overflow: hidden; }
        .loading-state, .empty-state { padding: 48px; text-align: center; color: #9ca3af; }
        .empty-icon { font-size: 40px; margin-bottom: 8px; }
        .table-wrap { overflow-x: auto; }
        table { width: 100%; border-collapse: collapse; }
        thead th { background: #f9fafb; padding: 10px 16px; text-align: left; font-size: 12px; font-weight: 600; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 1px solid #f3f4f6; }
        tbody tr { border-bottom: 1px solid #f9fafb; transition: background 0.15s; }
        tbody tr:last-child { border-bottom: none; }
        tbody tr:hover { background: #f9fafb; }
        tbody td { padding: 12px 16px; font-size: 13.5px; color: #374151; vertical-align: middle; }
        .admin-cell { display: flex; align-items: center; gap: 10px; }
        .admin-avatar { width: 36px; height: 36px; background: #006833; color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 14px; flex-shrink: 0; }
        .admin-name { font-weight: 600; color: #111827; font-size: 13.5px; }
        .admin-email { font-size: 12px; color: #9ca3af; }
        .badge { padding: 3px 10px; border-radius: 20px; font-size: 12px; font-weight: 600; }
        .badge-green { background: #e8f5ef; color: #006833; }
        .badge-blue { background: #dbeafe; color: #1d4ed8; }
        .toggle-btn { padding: 3px 10px; border-radius: 20px; font-size: 12px; font-weight: 600; border: none; cursor: pointer; }
        .toggle-btn.active { background: #e8f5ef; color: #006833; }
        .toggle-btn.inactive { background: #f3f4f6; color: #9ca3af; }
        .muted { color: #9ca3af; font-size: 12px; }
        .actions { display: flex; gap: 6px; }
        .btn-icon { width: 30px; height: 30px; border-radius: 6px; display: flex; align-items: center; justify-content: center; font-size: 13px; cursor: pointer; border: none; text-decoration: none; transition: all 0.15s; }
        .btn-edit { background: #dbeafe; color: #1d4ed8; }
        .btn-edit:hover { background: #bfdbfe; }
        .btn-delete { background: #fdeaeb; color: #eb3237; }
        .btn-delete:hover { background: #fca5a8; }
      `}</style>
    </div>
  );
}
