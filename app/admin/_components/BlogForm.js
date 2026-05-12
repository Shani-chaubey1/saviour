'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ImageField from './ImageField';
import RichEditor from './RichEditor';
import { useToast } from './Toast';

const EMPTY_POST = {
  title: '', slug: '', excerpt: '', content: '',
  thumbnail: '', category: 'General', tags: '', author: 'Admin',
  status: 'draft',
};

function toSlug(str) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export default function BlogForm({ postId }) {
  const { toast } = useToast();
  const router = useRouter();
  const isEdit = !!postId;

  const [form, setForm] = useState(EMPTY_POST);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);

  useEffect(() => {
    if (!isEdit) return;
    if (!postId) return;
    fetch(`/api/admin/blogs/${postId}`, { credentials: 'include', cache: 'no-store' })
      .then(async (r) => {
        const d = await r.json().catch(() => ({}));
        if (!r.ok) throw new Error(d.error || r.status);
        if (d.post) {
          setForm({ ...EMPTY_POST, ...d.post, tags: (d.post.tags || []).join(', ') });
        }
      })
      .catch(() => toast({ message: 'Could not load post', type: 'error' }))
      .finally(() => setFetching(false));
  }, [isEdit, postId]);

  const set = (key) => (e) => {
    const val = e.target.value;
    setForm((prev) => {
      const next = { ...prev, [key]: val };
      if (key === 'title' && !isEdit) next.slug = toSlug(val);
      return next;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title) return toast({ message: 'Title is required', type: 'error' });
    setLoading(true);
    const payload = { ...form, tags: form.tags ? form.tags.split(',').map((t) => t.trim()).filter(Boolean) : [] };
    try {
      const url = isEdit ? `/api/admin/blogs/${postId}` : '/api/admin/blogs';
      const res = await fetch(url, {
        method: isEdit ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      toast({ message: `Post ${isEdit ? 'updated' : 'created'} successfully`, type: 'success' });
      router.push('/admin/blogs');
    } catch (err) {
      toast({ message: err.message || 'Failed to save', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <div className="loading">Loading post...</div>;

  return (
    <form onSubmit={handleSubmit} className="blog-form">
      <div className="form-layout">
        <div className="main-col">
          <div className="card">
            <div className="card-title">Post Content</div>
            <div className="form-group">
              <label>Title *</label>
              <input type="text" value={form.title} onChange={set('title')} placeholder="Blog post title" required />
            </div>
            <div className="form-group">
              <label>Slug</label>
              <input type="text" value={form.slug} onChange={set('slug')} placeholder="post-url-slug" />
            </div>
            <div className="form-group">
              <label>Excerpt</label>
              <textarea value={form.excerpt} onChange={set('excerpt')} rows={3} placeholder="Brief description for listing pages..." />
            </div>
            <div className="form-group">
              <RichEditor
                label="Content *"
                value={form.content}
                onChange={(c) => setForm((p) => ({ ...p, content: c }))}
              />
            </div>
          </div>
        </div>

        <div className="side-col">
          <div className="card">
            <div className="card-title">Publish</div>
            <div className="form-group">
              <label>Status</label>
              <select value={form.status} onChange={set('status')}>
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>
            <div className="form-group">
              <label>Author</label>
              <input type="text" value={form.author} onChange={set('author')} placeholder="Author name" />
            </div>
            <div className="form-actions">
              <Link href="/admin/blogs" className="btn-cancel">Cancel</Link>
              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? 'Saving...' : isEdit ? 'Update Post' : 'Publish'}
              </button>
            </div>
          </div>

          <div className="card">
            <div className="card-title">Details</div>
            <div className="form-group">
              <label>Category</label>
              <input type="text" value={form.category} onChange={set('category')} placeholder="e.g. Real Estate, News" />
            </div>
            <div className="form-group">
              <label>Tags <span className="hint">(comma separated)</span></label>
              <input type="text" value={form.tags} onChange={set('tags')} placeholder="noida, property, investment" />
            </div>
          </div>

          <div className="card">
            <div className="card-title">Featured Image</div>
            <ImageField
              value={form.thumbnail || ''}
              onChange={(url) => setForm((p) => ({ ...p, thumbnail: url }))}
              label="Thumbnail"
              hint="Recommended: 800×500px"
              previewW={280}
              previewH={160}
            />
          </div>
        </div>
      </div>

      <style jsx global>{`
        .blog-form { display: flex; flex-direction: column; }
        .loading { padding: 40px; text-align: center; color: #9ca3af; }
        .form-layout { display: grid; grid-template-columns: 1fr 300px; gap: 20px; align-items: start; }
        .main-col, .side-col { display: flex; flex-direction: column; gap: 16px; }
        .card { background: white; border-radius: 12px; padding: 20px; box-shadow: 0 1px 4px rgba(0,0,0,0.06); border: 1px solid #f3f4f6; display: flex; flex-direction: column; gap: 16px; }
        .card-title { font-size: 14px; font-weight: 700; color: #111827; padding-bottom: 12px; border-bottom: 1px solid #f3f4f6; }
        .form-group { display: flex; flex-direction: column; gap: 6px; }
        .form-group label { font-size: 13px; font-weight: 600; color: #374151; }
        .hint { font-weight: 400; color: #9ca3af; font-size: 11px; }
        .form-group input, .form-group select, .form-group textarea {
          padding: 9px 12px; border: 1px solid #d1d5db; border-radius: 8px; font-size: 14px; outline: none; font-family: inherit; background: white;
        }
        .form-group input:focus, .form-group select:focus, .form-group textarea:focus { border-color: #006833; box-shadow: 0 0 0 2px rgba(0,104,51,0.12); }
        .form-group textarea { resize: vertical; }
        .form-actions { display: flex; flex-direction: column; gap: 8px; }
        .btn-cancel { padding: 10px; background: white; border: 1px solid #e5e7eb; border-radius: 8px; color: #374151; text-decoration: none; font-size: 14px; text-align: center; }
        .btn-primary { padding: 10px; background: #006833; color: white; border: none; border-radius: 8px; font-size: 14px; font-weight: 600; cursor: pointer; text-align: center; }
        .btn-primary:disabled { opacity: 0.7; cursor: not-allowed; }
        @media (max-width: 900px) { .form-layout { grid-template-columns: 1fr; } }
      `}</style>
    </form>
  );
}
