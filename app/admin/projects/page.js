'use client';
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import ConfirmModal from '../_components/ConfirmModal';
import { useToast } from '../_components/Toast';

const STATUS_COLORS = {
  'For Sale': { bg: '#e8f5ef', color: '#006833' },
  'Sold Out': { bg: '#fdeaeb', color: '#eb3237' },
  'Upcoming': { bg: '#fef3c7', color: '#d97706' },
  'Possession Soon': { bg: '#dbeafe', color: '#1d4ed8' },
  'Under Construction': { bg: '#f3e8ff', color: '#7c3aed' },
  'Ready to Move': { bg: '#d1fae5', color: '#059669' },
};

export default function ProjectsPage() {
  const { toast } = useToast();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [search, setSearch] = useState('');
  const [confirm, setConfirm] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchProjects = useCallback(() => {
    setLoading(true);
    setErrorMsg('');
    const params = new URLSearchParams({ page, limit: 15 });
    if (search) params.set('search', search);
    fetch(`/api/admin/projects?${params}`)
      .then(async (r) => {
        const d = await r.json();
        if (!r.ok) throw new Error(d.error || 'Failed to load projects');
        return d;
      })
      .then((d) => {
        setProjects(d.projects || []);
        setTotalPages(d.pages || 1);
        setLoading(false);
      })
      .catch((err) => {
        setProjects([]);
        setLoading(false);
        setErrorMsg(err.message || 'Failed to load projects');
      });
  }, [page, search]);

  useEffect(() => { fetchProjects(); }, [fetchProjects]);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/projects/${confirm._id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');
      setProjects((prev) => prev.filter((p) => p._id !== confirm._id));
      toast({ message: 'Project deleted', type: 'success' });
    } catch {
      toast({ message: 'Failed to delete', type: 'error' });
    } finally {
      setDeleting(false);
      setConfirm(null);
    }
  };

  const statusStyle = (status) => STATUS_COLORS[status] || { bg: '#f3f4f6', color: '#6b7280' };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Projects</h1>
          <p className="page-subtitle">Manage all real estate projects</p>
        </div>
        <Link href="/admin/projects/new" className="btn-primary">+ Add Project</Link>
      </div>

      <div className="card">
        <div className="toolbar">
          <input
            type="text"
            placeholder="Search projects..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="search-input"
          />
        </div>

        {loading ? (
          <div className="loading-state">Loading...</div>
        ) : errorMsg ? (
          <div className="empty-state">
            <p className="empty-icon">⚠️</p>
            <p>{errorMsg}</p>
          </div>
        ) : projects.length === 0 ? (
          <div className="empty-state">
            <p className="empty-icon">🏗</p>
            <p>No projects found</p>
            <Link href="/admin/projects/new" className="btn-primary">Add First Project</Link>
          </div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Project</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th>Price</th>
                  <th>RERA</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {projects.map((p) => {
                  const s = statusStyle(p.status);
                  return (
                    <tr key={p._id}>
                      <td>
                        <div className="proj-cell">
                          {p.thumbnail ? (
                            <img src={p.thumbnail} alt={p.title} className="proj-thumb" />
                          ) : (
                            <div className="proj-thumb-placeholder">🏗</div>
                          )}
                          <div>
                            <p className="proj-title">{p.title}</p>
                            <p className="proj-slug">/properties/{p.slug}</p>
                          </div>
                        </div>
                      </td>
                      <td><span className="type-tag">{p.type?.name || p.typeName || '—'}</span></td>
                      <td>
                        <span className="badge" style={{ background: s.bg, color: s.color }}>
                          {p.status || '—'}
                        </span>
                      </td>
                      <td className="muted">{p.price || '—'}</td>
                      <td className="muted">{p.rera || '—'}</td>
                      <td>
                        <div className="actions">
                          <Link href={`/admin/projects/${p._id}`} className="btn-icon btn-edit">✏</Link>
                          <a href={`/properties/${p.slug}`} target="_blank" className="btn-icon btn-view">👁</a>
                          <button className="btn-icon btn-delete" onClick={() => setConfirm(p)}>🗑</button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {totalPages > 1 && (
          <div className="pagination">
            <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>← Prev</button>
            <span>{page} / {totalPages}</span>
            <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}>Next →</button>
          </div>
        )}
      </div>

      <ConfirmModal
        isOpen={!!confirm}
        title="Delete Project?"
        message={`Delete "${confirm?.title}"? This cannot be undone.`}
        onConfirm={handleDelete}
        onCancel={() => setConfirm(null)}
        loading={deleting}
      />

      <style jsx global>{`
        .page-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px; flex-wrap: wrap; gap: 12px; }
        .page-title { font-size: 24px; font-weight: 800; color: #111827; margin-bottom: 4px; }
        .page-subtitle { color: #6b7280; font-size: 14px; }
        .btn-primary { padding: 9px 18px; background: #006833; color: white; border: none; border-radius: 8px; font-size: 13.5px; font-weight: 600; cursor: pointer; text-decoration: none; transition: background 0.2s; }
        .btn-primary:hover { background: #004d26; }
        .card { background: white; border-radius: 12px; box-shadow: 0 1px 4px rgba(0,0,0,0.06); border: 1px solid #f3f4f6; overflow: hidden; }
        .toolbar { padding: 16px; border-bottom: 1px solid #f9fafb; }
        .search-input { width: 280px; padding: 8px 12px; border: 1px solid #d1d5db; border-radius: 8px; font-size: 13.5px; outline: none; }
        .search-input:focus { border-color: #006833; }
        .loading-state, .empty-state { padding: 48px; text-align: center; color: #9ca3af; }
        .empty-icon { font-size: 40px; margin-bottom: 8px; }
        .table-wrap { overflow-x: auto; }
        table { width: 100%; border-collapse: collapse; }
        thead th { background: #f9fafb; padding: 10px 16px; text-align: left; font-size: 12px; font-weight: 600; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 1px solid #f3f4f6; white-space: nowrap; }
        tbody tr { border-bottom: 1px solid #f9fafb; transition: background 0.15s; }
        tbody tr:last-child { border-bottom: none; }
        tbody tr:hover { background: #f9fafb; }
        tbody td { padding: 12px 16px; font-size: 13.5px; color: #374151; vertical-align: middle; }
        .proj-cell { display: flex; align-items: center; gap: 10px; }
        .proj-thumb { width: 44px; height: 44px; object-fit: cover; border-radius: 6px; border: 1px solid #f3f4f6; flex-shrink: 0; }
        .proj-thumb-placeholder { width: 44px; height: 44px; background: #f3f4f6; border-radius: 6px; display: flex; align-items: center; justify-content: center; font-size: 20px; flex-shrink: 0; }
        .proj-title { font-weight: 600; color: #111827; font-size: 13.5px; max-width: 200px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .proj-slug { font-size: 11px; color: #9ca3af; }
        .type-tag { padding: 2px 8px; background: #f3f4f6; color: #6b7280; border-radius: 4px; font-size: 12px; }
        .badge { padding: 3px 10px; border-radius: 20px; font-size: 12px; font-weight: 600; white-space: nowrap; }
        .muted { color: #9ca3af; font-size: 12px; }
        .actions { display: flex; gap: 6px; }
        .btn-icon { width: 30px; height: 30px; border-radius: 6px; display: flex; align-items: center; justify-content: center; font-size: 13px; cursor: pointer; border: none; text-decoration: none; transition: all 0.15s; }
        .btn-edit { background: #dbeafe; color: #1d4ed8; }
        .btn-edit:hover { background: #bfdbfe; }
        .btn-view { background: #f3f4f6; color: #374151; }
        .btn-view:hover { background: #e5e7eb; }
        .btn-delete { background: #fdeaeb; color: #eb3237; }
        .btn-delete:hover { background: #fca5a8; }
        .pagination { display: flex; align-items: center; justify-content: center; gap: 16px; padding: 16px; border-top: 1px solid #f3f4f6; }
        .pagination button { padding: 6px 14px; border: 1px solid #e5e7eb; border-radius: 6px; background: white; cursor: pointer; font-size: 13px; }
        .pagination button:disabled { opacity: 0.4; cursor: not-allowed; }
        .pagination span { font-size: 13px; color: #6b7280; }
      `}</style>
    </div>
  );
}
