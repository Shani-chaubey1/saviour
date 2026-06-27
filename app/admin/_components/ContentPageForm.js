'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import RichEditor from './RichEditor';
import ImageField from './ImageField';
import { useToast } from './Toast';

const RESERVED_SLUGS = new Set([
  'about-us',
  'admin',
  'api',
  'blog',
  'contact-us',
  'home',
  'projects',
  'properties',
  'resedential-projects',
  'residential-projects',
]);

const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function slugify(value) {
  return String(value || '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-{2,}/g, '-')
    .replace(/^-|-$/g, '');
}

const EMPTY = {
  title: '',
  slug: '',
  content: '',
  metaTitle: '',
  metaDescription: '',
  bannerImage: '',
  isPublished: true,
  showInFooter: false,
  order: 0,
  showProjects: false,
  projectsLocation: '',
};

export default function ContentPageForm({ pageId }) {
  const router = useRouter();
  const { toast } = useToast();
  const isEdit = Boolean(pageId);
  const [form, setForm] = useState({ ...EMPTY });
  const [slugTouched, setSlugTouched] = useState(false);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isEdit) return;
    let cancelled = false;
    setLoading(true);
    fetch(`/api/admin/content-pages/${pageId}`, { credentials: 'same-origin' })
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return;
        if (!data.page) {
          setError(data.error || 'Page not found');
        } else {
          setForm({
            title: data.page.title || '',
            slug: data.page.slug || '',
            content: data.page.content || '',
            metaTitle: data.page.metaTitle || '',
            metaDescription: data.page.metaDescription || '',
            bannerImage: data.page.bannerImage || '',
            isPublished: data.page.isPublished !== false,
            showInFooter: Boolean(data.page.showInFooter),
            order: Number(data.page.order) || 0,
            showProjects: Boolean(data.page.showProjects),
            projectsLocation: data.page.projectsLocation || '',
          });
          setSlugTouched(true);
        }
      })
      .catch(() => setError('Failed to load page'))
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [isEdit, pageId]);

  const set = (key) => (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleTitleChange = (e) => {
    const value = e.target.value;
    setForm((prev) => {
      const next = { ...prev, title: value };
      if (!slugTouched && !isEdit) {
        next.slug = slugify(value);
      }
      return next;
    });
  };

  const handleSlugChange = (e) => {
    setSlugTouched(true);
    setForm((prev) => ({ ...prev, slug: slugify(e.target.value) }));
  };

  const validationError = useMemo(() => {
    if (!form.title.trim()) return 'Title is required';
    const s = slugify(form.slug);
    if (!s) return 'Slug is required';
    if (!SLUG_RE.test(s)) return 'Slug can only contain lowercase letters, numbers, and hyphens';
    if (RESERVED_SLUGS.has(s)) return `Slug "${s}" is reserved by the site`;
    if (form.showProjects && !form.projectsLocation.trim()) {
      return 'Location filter is required when "Show projects" is enabled';
    }
    return '';
  }, [form.slug, form.title, form.showProjects, form.projectsLocation]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validationError) {
      toast({ message: validationError, type: 'error' });
      return;
    }
    setSaving(true);
    setError('');
    try {
      const payload = {
        title: form.title.trim(),
        slug: slugify(form.slug),
        content: form.content,
        metaTitle: form.metaTitle.trim(),
        metaDescription: form.metaDescription.trim(),
        bannerImage: form.bannerImage.trim(),
        isPublished: form.isPublished,
        showInFooter: form.showInFooter,
        order: Number(form.order) || 0,
        showProjects: form.showProjects,
        projectsLocation: form.showProjects ? form.projectsLocation.trim() : '',
      };
      const url = isEdit
        ? `/api/admin/content-pages/${pageId}`
        : '/api/admin/content-pages';
      const res = await fetch(url, {
        method: isEdit ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Save failed');
      toast({
        message: isEdit ? 'Page updated' : 'Page created',
        type: 'success',
      });
      if (!isEdit) {
        router.push(`/admin/content-pages/${data.page._id}`);
      }
    } catch (err) {
      toast({ message: err.message || 'Save failed', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="cpf-loading">Loading page…</div>;
  }
  if (error && isEdit) {
    return (
      <div className="cpf-error">
        <p>{error}</p>
        <Link href="/admin/content-pages" className="cpf-back-link">← Back to pages</Link>
        <style jsx>{`
          .cpf-error { padding: 32px; background: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; color: #b91c1c; }
          .cpf-back-link { margin-top: 12px; display: inline-block; color: #006833; font-weight: 600; }
        `}</style>
      </div>
    );
  }

  return (
    <form className="cpf-form" onSubmit={handleSubmit} noValidate>
      <div className="cpf-grid">
        <div className="cpf-main">
          <div className="cpf-card">
            <label className="cpf-label">Title <span className="req">*</span></label>
            <input
              type="text"
              className="cpf-input"
              value={form.title}
              onChange={handleTitleChange}
              placeholder="e.g. Disclaimer"
              autoFocus
            />
            <p className="cpf-hint">Used as the page heading and (when meta title is blank) as the browser tab title.</p>

            <label className="cpf-label cpf-label-mt">URL slug <span className="req">*</span></label>
            <div className="cpf-slug-row">
              <span className="cpf-slug-prefix">/</span>
              <input
                type="text"
                className="cpf-input cpf-input-slug"
                value={form.slug}
                onChange={handleSlugChange}
                placeholder="disclaimer"
              />
            </div>
            <p className="cpf-hint">
              Lowercase letters, numbers and hyphens only. Reserved slugs:{' '}
              <code>about-us</code>, <code>blog</code>, <code>contact-us</code>, <code>projects</code>, <code>properties</code>, etc.
            </p>
            {validationError && <p className="cpf-error-msg">{validationError}</p>}
          </div>

          <div className="cpf-card">
            <label className="cpf-label">Page content</label>
            <p className="cpf-hint" style={{ marginBottom: 10 }}>
              Long-form HTML rendered inside a styled article container on the public page.
            </p>
            <RichEditor
              value={form.content}
              onChange={(content) => setForm((prev) => ({ ...prev, content }))}
            />
          </div>

          <div className="cpf-card">
            <h3 className="cpf-section-title">Page banner</h3>
            <ImageField
              value={form.bannerImage}
              onChange={(url) => setForm((prev) => ({ ...prev, bannerImage: url }))}
              label="Banner image"
              hint="Top intro banner on this page. Leave empty to use the global Content Pages banner from Page Banners settings."
              previewW={320}
              previewH={160}
            />
          </div>

          <div className="cpf-card">
            <h3 className="cpf-section-title">SEO</h3>
            <label className="cpf-label">Meta title</label>
            <input
              type="text"
              className="cpf-input"
              value={form.metaTitle}
              onChange={set('metaTitle')}
              placeholder="Leave blank to use the page title"
            />
            <label className="cpf-label cpf-label-mt">Meta description</label>
            <textarea
              className="cpf-input cpf-textarea"
              value={form.metaDescription}
              onChange={set('metaDescription')}
              rows={3}
              placeholder="Short summary shown by search engines."
            />
          </div>
        </div>

        <aside className="cpf-side">
          <div className="cpf-card">
            <h3 className="cpf-section-title">Publishing</h3>
            <label className="cpf-check">
              <input
                type="checkbox"
                checked={form.isPublished}
                onChange={set('isPublished')}
              />
              <span>Published</span>
            </label>
            <p className="cpf-hint">Unpublished pages return a 404 to public visitors.</p>

            <label className="cpf-check cpf-label-mt">
              <input
                type="checkbox"
                checked={form.showInFooter}
                onChange={set('showInFooter')}
              />
              <span>Show in footer quick links</span>
            </label>
            <p className="cpf-hint">Useful for Disclaimer, Privacy Policy, Terms, etc.</p>

            <label className="cpf-label cpf-label-mt">Footer order</label>
            <input
              type="number"
              className="cpf-input"
              value={form.order}
              onChange={set('order')}
              min={0}
            />
            <p className="cpf-hint">Lower numbers appear first.</p>
          </div>

          <div className="cpf-card">
            <h3 className="cpf-section-title">Projects section</h3>
            <label className="cpf-check">
              <input
                type="checkbox"
                checked={form.showProjects}
                onChange={set('showProjects')}
              />
              <span>Show projects button &amp; section</span>
            </label>
            <p className="cpf-hint">
              Appends a projects grid (filtered by the location below) to the
              bottom of this page, plus a CTA button linking to the matching
              listing on the projects page.
            </p>

            {form.showProjects && (
              <>
                <label className="cpf-label cpf-label-mt">
                  Location filter <span className="req">*</span>
                </label>
                <input
                  type="text"
                  className="cpf-input"
                  value={form.projectsLocation}
                  onChange={set('projectsLocation')}
                  placeholder="e.g. Yamuna Expressway"
                />
                <p className="cpf-hint">
                  Case-insensitive substring match against each project&apos;s
                  address or location field — exactly the same matching used
                  on <code>/projects?location=…</code>.
                </p>
              </>
            )}
          </div>

          <div className="cpf-actions">
            <Link href="/admin/content-pages" className="cpf-btn-back">← Back</Link>
            <button type="submit" className="cpf-btn-primary" disabled={saving || Boolean(validationError)}>
              {saving ? 'Saving…' : isEdit ? 'Save changes' : 'Create page'}
            </button>
          </div>
          {isEdit && form.slug && (
            <a
              className="cpf-preview"
              href={`/${form.slug}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              View page →
            </a>
          )}
        </aside>
      </div>

      <style jsx global>{`
        .cpf-form { display: block; }
        .cpf-loading { padding: 48px; text-align: center; color: #9ca3af; }
        .cpf-grid {
          display: grid;
          grid-template-columns: minmax(0, 1fr) 320px;
          gap: 24px;
          align-items: start;
        }
        .cpf-main, .cpf-side { display: flex; flex-direction: column; gap: 16px; }
        .cpf-card {
          background: white;
          border-radius: 12px;
          padding: 20px;
          box-shadow: 0 1px 4px rgba(0,0,0,0.06);
          border: 1px solid #f3f4f6;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .cpf-section-title { font-size: 14px; font-weight: 700; color: #111827; margin: 0 0 6px; }
        .cpf-label { font-size: 13px; font-weight: 600; color: #374151; }
        .cpf-label-mt { margin-top: 8px; }
        .cpf-hint { font-size: 12px; color: #9ca3af; margin: 0; line-height: 1.5; }
        .cpf-hint code { background: #f3f4f6; padding: 1px 5px; border-radius: 4px; font-size: 11.5px; }
        .req { color: #dc2626; }
        .cpf-input, .cpf-textarea {
          width: 100%;
          padding: 10px 12px;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          font-size: 14px;
          outline: none;
          font-family: inherit;
          color: #111827;
          background: white;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .cpf-input:focus, .cpf-textarea:focus {
          border-color: #006833;
          box-shadow: 0 0 0 3px rgba(0,104,51,0.1);
        }
        .cpf-textarea { resize: vertical; min-height: 80px; }
        .cpf-slug-row { display: flex; align-items: stretch; gap: 0; }
        .cpf-slug-prefix {
          display: inline-flex; align-items: center; padding: 0 12px;
          background: #f9fafb; border: 1px solid #d1d5db; border-right: none;
          border-radius: 8px 0 0 8px; color: #6b7280; font-size: 14px; font-family: monospace;
        }
        .cpf-input-slug { border-radius: 0 8px 8px 0; font-family: monospace; }
        .cpf-error-msg { font-size: 12px; color: #dc2626; margin: 4px 0 0; font-weight: 500; }
        .cpf-check { display: flex; align-items: center; gap: 8px; font-size: 13.5px; color: #111827; cursor: pointer; }
        .cpf-check input { width: 16px; height: 16px; accent-color: #006833; }
        .cpf-actions {
          display: flex; align-items: center; justify-content: space-between; gap: 10px;
        }
        .cpf-btn-primary {
          flex: 1; padding: 10px 18px; background: #006833; color: white;
          border: none; border-radius: 8px; font-size: 14px; font-weight: 600;
          cursor: pointer; transition: background 0.2s;
        }
        .cpf-btn-primary:hover:not(:disabled) { background: #004d26; }
        .cpf-btn-primary:disabled { opacity: 0.55; cursor: not-allowed; }
        .cpf-btn-back {
          padding: 9px 14px; background: white; border: 1px solid #e5e7eb;
          border-radius: 8px; color: #374151; text-decoration: none; font-size: 13.5px;
        }
        .cpf-btn-back:hover { background: #f9fafb; }
        .cpf-preview {
          display: inline-block; text-align: center; padding: 8px 12px;
          color: #006833; font-size: 13px; font-weight: 600; text-decoration: none;
        }
        .cpf-preview:hover { text-decoration: underline; }

        @media (max-width: 1024px) {
          .cpf-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </form>
  );
}
