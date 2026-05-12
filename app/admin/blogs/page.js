'use client';
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import ConfirmModal from '../_components/ConfirmModal';
import { useToast } from '../_components/Toast';

export default function BlogsPage() {
  const { toast } = useToast();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [confirm, setConfirm] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchPosts = useCallback(() => {
    setLoading(true);
    const params = new URLSearchParams({ limit: 20 });
    if (search) params.set('search', search);
    if (statusFilter) params.set('status', statusFilter);
    fetch(`/api/admin/blogs?${params}`)
      .then((r) => r.json())
      .then((d) => { setPosts(d.posts || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, [search, statusFilter]);

  useEffect(() => { fetchPosts(); }, [fetchPosts]);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/blogs/${confirm._id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');
      setPosts((prev) => prev.filter((p) => p._id !== confirm._id));
      toast({ message: 'Blog post deleted', type: 'success' });
    } catch {
      toast({ message: 'Failed to delete', type: 'error' });
    } finally {
      setDeleting(false);
      setConfirm(null);
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Blog Posts</h1>
          <p className="page-subtitle">Manage blog articles and news</p>
        </div>
        <Link href="/admin/blogs/new" className="btn-primary">+ Add Blog Post</Link>
      </div>

      <div className="card">
        <div className="toolbar">
          <input type="text" placeholder="Search posts..." value={search} onChange={(e) => setSearch(e.target.value)} className="search-input" />
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="filter-select">
            <option value="">All Status</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
        </div>

        {loading ? (
          <div className="loading-state">Loading...</div>
        ) : posts.length === 0 ? (
          <div className="empty-state">
            <p className="empty-icon">📝</p>
            <p>No blog posts found</p>
            <Link href="/admin/blogs/new" className="btn-primary">Write First Post</Link>
          </div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Post</th>
                  <th>Category</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {posts.map((p) => (
                  <tr key={p._id}>
                    <td>
                      <div className="post-cell">
                        {p.thumbnail ? (
                          <img src={p.thumbnail} alt={p.title} className="post-thumb" />
                        ) : (
                          <div className="post-thumb-placeholder">📝</div>
                        )}
                        <div>
                          <p className="post-title">{p.title}</p>
                          <p className="post-excerpt">{p.excerpt?.slice(0, 60) || ''}...</p>
                        </div>
                      </div>
                    </td>
                    <td><span className="cat-tag">{p.category || 'General'}</span></td>
                    <td>
                      <span className={`status-badge ${p.status}`}>{p.status}</span>
                    </td>
                    <td className="muted">{new Date(p.createdAt).toLocaleDateString()}</td>
                    <td>
                      <div className="actions">
                        <Link href={`/admin/blogs/${p._id}`} className="btn-icon btn-edit">✏</Link>
                        <a href={`/blog/${p.slug}`} target="_blank" className="btn-icon btn-view">👁</a>
                        <button className="btn-icon btn-delete" onClick={() => setConfirm(p)}>🗑</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <ConfirmModal isOpen={!!confirm} title="Delete Post?" message={`Delete "${confirm?.title}"?`} onConfirm={handleDelete} onCancel={() => setConfirm(null)} loading={deleting} />

      <style jsx global>{`
        .page-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px; flex-wrap: wrap; gap: 12px; }
        .page-title { font-size: 24px; font-weight: 800; color: #111827; margin-bottom: 4px; }
        .page-subtitle { color: #6b7280; font-size: 14px; }
        .btn-primary { padding: 9px 18px; background: #006833; color: white; border: none; border-radius: 8px; font-size: 13.5px; font-weight: 600; cursor: pointer; text-decoration: none; }
        .card { background: white; border-radius: 12px; box-shadow: 0 1px 4px rgba(0,0,0,0.06); border: 1px solid #f3f4f6; overflow: hidden; }
        .toolbar { padding: 16px; border-bottom: 1px solid #f9fafb; display: flex; gap: 10px; flex-wrap: wrap; }
        .search-input { padding: 8px 12px; border: 1px solid #d1d5db; border-radius: 8px; font-size: 13.5px; outline: none; flex: 1; min-width: 200px; }
        .search-input:focus { border-color: #006833; }
        .filter-select { padding: 8px 12px; border: 1px solid #d1d5db; border-radius: 8px; font-size: 13.5px; outline: none; background: white; }
        .loading-state, .empty-state { padding: 48px; text-align: center; color: #9ca3af; }
        .empty-icon { font-size: 40px; margin-bottom: 8px; }
        .table-wrap { overflow-x: auto; }
        table { width: 100%; border-collapse: collapse; }
        thead th { background: #f9fafb; padding: 10px 16px; text-align: left; font-size: 12px; font-weight: 600; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 1px solid #f3f4f6; }
        tbody tr { border-bottom: 1px solid #f9fafb; }
        tbody tr:last-child { border-bottom: none; }
        tbody tr:hover { background: #f9fafb; }
        tbody td { padding: 12px 16px; font-size: 13.5px; color: #374151; vertical-align: middle; }
        .post-cell { display: flex; align-items: center; gap: 10px; }
        .post-thumb { width: 44px; height: 44px; object-fit: cover; border-radius: 6px; flex-shrink: 0; }
        .post-thumb-placeholder { width: 44px; height: 44px; background: #f3f4f6; border-radius: 6px; display: flex; align-items: center; justify-content: center; font-size: 20px; flex-shrink: 0; }
        .post-title { font-weight: 600; color: #111827; max-width: 280px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .post-excerpt { font-size: 11px; color: #9ca3af; max-width: 280px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .cat-tag { padding: 2px 8px; background: #f3f4f6; color: #6b7280; border-radius: 4px; font-size: 12px; }
        .status-badge { padding: 3px 10px; border-radius: 20px; font-size: 12px; font-weight: 600; text-transform: capitalize; }
        .status-badge.published { background: #d1fae5; color: #059669; }
        .status-badge.draft { background: #f3f4f6; color: #9ca3af; }
        .muted { color: #9ca3af; font-size: 12px; }
        .actions { display: flex; gap: 6px; }
        .btn-icon { width: 30px; height: 30px; border-radius: 6px; display: flex; align-items: center; justify-content: center; font-size: 13px; cursor: pointer; border: none; text-decoration: none; }
        .btn-edit { background: #dbeafe; color: #1d4ed8; }
        .btn-view { background: #f3f4f6; color: #374151; }
        .btn-delete { background: #fdeaeb; color: #eb3237; }
      `}</style>
    </div>
  );
}
