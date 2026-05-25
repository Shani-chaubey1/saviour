'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import ConfirmModal from '../_components/ConfirmModal';
import { useToast } from '../_components/Toast';

export default function ContentPagesPage() {
  const { toast } = useToast();
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [confirm, setConfirm] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchPages = useCallback(() => {
    setLoading(true);
    fetch('/api/admin/content-pages', { credentials: 'same-origin' })
      .then((r) => r.json())
      .then((d) => {
        setPages(Array.isArray(d.pages) ? d.pages : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => { fetchPages(); }, [fetchPages]);

  const filtered = pages.filter((p) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      p.title?.toLowerCase().includes(q) ||
      p.slug?.toLowerCase().includes(q)
    );
  });

  const handleDelete = async () => {
    if (!confirm) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/content-pages/${confirm._id}`, {
        method: 'DELETE',
        credentials: 'same-origin',
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d.error || 'Delete failed');
      }
      setPages((prev) => prev.filter((p) => p._id !== confirm._id));
      toast({ message: 'Page deleted', type: 'success' });
    } catch (err) {
      toast({ message: err.message || 'Delete failed', type: 'error' });
    } finally {
      setDeleting(false);
      setConfirm(null);
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Content Pages</h1>
          <p className="page-subtitle">
            Build standalone informational pages (Disclaimer, Privacy Policy, Terms, FAQ&hellip;). They render at <code>/your-slug</code>.
          </p>
        </div>
        <Link href="/admin/content-pages/new" className="btn-primary">+ New Page</Link>
      </div>

      <div className="card">
        <div className="toolbar">
          <input
            type="text"
            placeholder="Search by title or slug…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
          />
        </div>

        {loading ? (
          <div className="loading-state">Loading…</div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <p className="empty-icon">📄</p>
            <p>{pages.length === 0 ? 'No content pages yet.' : 'No pages match that search.'}</p>
            {pages.length === 0 && (
              <Link href="/admin/content-pages/new" className="btn-primary">Create your first page</Link>
            )}
          </div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>URL</th>
                  <th>Status</th>
                  <th>Footer</th>
                  <th>Updated</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => (
                  <tr key={p._id}>
                    <td>
                      <Link href={`/admin/content-pages/${p._id}`} className="cell-title">{p.title}</Link>
                    </td>
                    <td><code className="cell-slug">/{p.slug}</code></td>
                    <td>
                      <span className={`status-badge ${p.isPublished ? 'published' : 'draft'}`}>
                        {p.isPublished ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td>
                      {p.showInFooter ? <span className="footer-yes">Yes</span> : <span className="footer-no">—</span>}
                    </td>
                    <td className="muted">{new Date(p.updatedAt).toLocaleDateString()}</td>
                    <td>
                      <div className="actions">
                        <Link href={`/admin/content-pages/${p._id}`} className="btn-icon btn-edit" aria-label="Edit">✏</Link>
                        <a href={`/${p.slug}`} target="_blank" rel="noopener noreferrer" className="btn-icon btn-view" aria-label="View">👁</a>
                        <button
                          type="button"
                          className="btn-icon btn-delete"
                          aria-label="Delete"
                          onClick={() => setConfirm(p)}
                        >🗑</button>
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
        title="Delete Page?"
        message={`Delete "${confirm?.title}"? This cannot be undone.`}
        onConfirm={handleDelete}
        onCancel={() => setConfirm(null)}
        loading={deleting}
      />

      <style jsx global>{`
        .page-header { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 24px; flex-wrap: wrap; gap: 12px; }
        .page-title { font-size: 24px; font-weight: 800; color: #111827; margin-bottom: 4px; }
        .page-subtitle { color: #6b7280; font-size: 14px; max-width: 640px; line-height: 1.5; }
        .page-subtitle code { background: #f3f4f6; padding: 1px 6px; border-radius: 4px; font-size: 12px; }
        .btn-primary { padding: 9px 18px; background: #006833; color: white; border: none; border-radius: 8px; font-size: 13.5px; font-weight: 600; cursor: pointer; text-decoration: none; }
        .btn-primary:hover { background: #004d26; }
        .card { background: white; border-radius: 12px; box-shadow: 0 1px 4px rgba(0,0,0,0.06); border: 1px solid #f3f4f6; overflow: hidden; }
        .toolbar { padding: 14px 16px; border-bottom: 1px solid #f9fafb; }
        .search-input { width: 100%; max-width: 320px; padding: 8px 12px; border: 1px solid #d1d5db; border-radius: 8px; font-size: 13.5px; outline: none; }
        .search-input:focus { border-color: #006833; }
        .loading-state, .empty-state { padding: 48px; text-align: center; color: #9ca3af; }
        .empty-icon { font-size: 40px; margin-bottom: 8px; }
        .table-wrap { overflow-x: auto; }
        table { width: 100%; border-collapse: collapse; }
        thead th { background: #f9fafb; padding: 10px 16px; text-align: left; font-size: 12px; font-weight: 600; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 1px solid #f3f4f6; }
        tbody tr { border-bottom: 1px solid #f9fafb; }
        tbody tr:last-child { border-bottom: none; }
        tbody tr:hover { background: #f9fafb; }
        tbody td { padding: 12px 16px; font-size: 13.5px; color: #374151; vertical-align: middle; }
        .cell-title { color: #111827; font-weight: 600; text-decoration: none; }
        .cell-title:hover { color: #006833; }
        .cell-slug { background: #f3f4f6; padding: 2px 8px; border-radius: 4px; font-size: 12px; color: #4b5563; }
        .status-badge { padding: 3px 10px; border-radius: 20px; font-size: 12px; font-weight: 600; text-transform: capitalize; }
        .status-badge.published { background: #d1fae5; color: #059669; }
        .status-badge.draft { background: #f3f4f6; color: #9ca3af; }
        .footer-yes { font-size: 12.5px; font-weight: 600; color: #006833; }
        .footer-no { font-size: 13px; color: #d1d5db; }
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
