'use client';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import BlogForm from '../../_components/BlogForm';

export default function EditBlogPage() {
  const params = useParams();
  const postId = params?.id;
  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Edit Blog Post</h1>
          <p className="page-subtitle">Update your article content</p>
        </div>
        <Link href="/admin/blogs" className="btn-back">← Back</Link>
      </div>
      <BlogForm postId={postId} />
      <style jsx global>{`
        .page-header { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 20px; gap: 12px; }
        .page-title { font-size: 24px; font-weight: 800; color: #111827; margin-bottom: 4px; }
        .page-subtitle { color: #6b7280; font-size: 14px; }
        .btn-back { padding: 8px 16px; background: white; border: 1px solid #e5e7eb; border-radius: 8px; color: #374151; text-decoration: none; font-size: 13.5px; flex-shrink: 0; }
      `}</style>
    </div>
  );
}
