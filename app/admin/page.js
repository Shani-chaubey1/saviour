'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function DashboardPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/dashboard')
      .then((r) => r.json())
      .then((d) => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const stats = data?.stats || {};
  const enquiries = data?.recentEnquiries || [];

  const STAT_CARDS = [
    { label: 'Total Projects', value: stats.projects ?? '—', icon: '🏗', color: '#006833', href: '/admin/projects' },
    { label: 'Published Blogs', value: stats.posts ?? '—', icon: '📝', color: '#2563eb', href: '/admin/blogs' },
    { label: 'Total Enquiries', value: stats.enquiries ?? '—', icon: '📬', color: '#eb3237', href: '/admin/enquiries' },
    { label: 'Testimonials', value: stats.testimonials ?? '—', icon: '💬', color: '#7c3aed', href: '/admin/testimonials' },
    { label: 'Admin Users', value: stats.admins ?? '—', icon: '👥', color: '#0891b2', href: '/admin/admins' },
  ];

  const QUICK_ACTIONS = [
    { label: 'Add Project', href: '/admin/projects/new', icon: '🏗', color: '#006833' },
    { label: 'Add Blog', href: '/admin/blogs/new', icon: '📝', color: '#2563eb' },
    { label: 'Add Admin', href: '/admin/admins/new', icon: '👤', color: '#eb3237' },
    { label: 'Manage Types', href: '/admin/property-types', icon: '🏷', color: '#7c3aed' },
    { label: 'Amenities', href: '/admin/amenities', icon: '✨', color: '#0891b2' },
    { label: 'Settings', href: '/admin/settings', icon: '⚙', color: '#6b7280' },
  ];

  return (
    <div className="ad-page">
      <div className="ad-page-header">
        <div>
          <h1 className="ad-page-title">Dashboard</h1>
          <p className="ad-page-subtitle">Welcome back! Here's what's happening.</p>
        </div>
      </div>

      {loading ? (
        <div className="ad-skeleton-grid">
          {[...Array(5)].map((_, i) => <div key={i} className="ad-skeleton-card" />)}
        </div>
      ) : (
        <div className="ad-stats-grid">
          {STAT_CARDS.map((s) => (
            <Link key={s.label} href={s.href} className="ad-stat-card">
              <div className="ad-stat-icon" style={{ background: s.color + '18' }}>
                <span style={{ fontSize: 26 }}>{s.icon}</span>
              </div>
              <div className="ad-stat-info">
                <p className="ad-stat-value" style={{ color: s.color }}>{s.value}</p>
                <p className="ad-stat-label">{s.label}</p>
              </div>
              <div className="ad-stat-arrow">→</div>
            </Link>
          ))}
        </div>
      )}

      <div className="ad-dashboard-bottom">
        <div className="ad-card">
          <div className="ad-card-header">
            <h2 className="ad-card-title">Quick Actions</h2>
          </div>
          <div className="ad-actions-grid">
            {QUICK_ACTIONS.map((a) => (
              <Link key={a.label} href={a.href} className="ad-action-btn" style={{ borderColor: a.color + '33' }}>
                <span className="ad-action-icon" style={{ background: a.color + '18' }}>{a.icon}</span>
                <span className="ad-action-label">{a.label}</span>
              </Link>
            ))}
          </div>
        </div>

        <div className="ad-card">
          <div className="ad-card-header">
            <h2 className="ad-card-title">Recent Enquiries</h2>
            <Link href="/admin/enquiries" className="ad-card-link">View all →</Link>
          </div>
          {enquiries.length === 0 ? (
            <p className="ad-empty-text">No enquiries yet.</p>
          ) : (
            <div className="ad-enquiry-list">
              {enquiries.map((e) => (
                <div key={e._id} className="ad-enquiry-item">
                  <div className="ad-enquiry-avatar">{e.name?.[0]?.toUpperCase()}</div>
                  <div className="ad-enquiry-info">
                    <p className="ad-enquiry-name">{e.name}</p>
                    <p className="ad-enquiry-meta">{e.email} · {e.project || 'General'}</p>
                  </div>
                  <span className={`ad-enquiry-status ad-status-${e.status}`}>{e.status}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <style jsx global>{`
        .ad-page-header { margin-bottom: 24px; }
        .ad-page-title { font-size: 24px; font-weight: 800; color: #111827; margin-bottom: 4px; }
        .ad-page-subtitle { color: #6b7280; font-size: 14px; }
        .ad-skeleton-grid, .ad-stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 16px;
          margin-bottom: 24px;
        }
        .ad-skeleton-card {
          height: 100px;
          background: linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 50%, #f3f4f6 75%);
          border-radius: 12px;
          animation: shimmer 1.5s infinite;
        }
        @keyframes shimmer {
          0% { background-position: -200px 0; }
          100% { background-position: 200px 0; }
        }
        .ad-stat-card {
          background: white;
          border-radius: 12px;
          padding: 20px;
          display: flex !important;
          align-items: center !important;
          flex-direction: row !important;
          gap: 14px;
          text-decoration: none;
          box-shadow: 0 1px 4px rgba(0,0,0,0.06);
          border: 1px solid #f3f4f6;
          transition: all 0.2s;
        }
        .ad-stat-card:hover { transform: translateY(-2px); box-shadow: 0 4px 16px rgba(0,0,0,0.1); }
        .ad-stat-icon {
          width: 52px;
          height: 52px;
          border-radius: 10px;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          flex-shrink: 0;
        }
        .ad-stat-info { flex: 1; }
        .ad-stat-value { font-size: 26px; font-weight: 800; line-height: 1.1; }
        .ad-stat-label { font-size: 12px; color: #6b7280; margin-top: 2px; }
        .ad-stat-arrow { color: #d1d5db; font-size: 18px; }
        .ad-dashboard-bottom { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
        .ad-card {
          background: white;
          border-radius: 12px;
          padding: 20px;
          box-shadow: 0 1px 4px rgba(0,0,0,0.06);
          border: 1px solid #f3f4f6;
        }
        .ad-card-header { display: flex !important; align-items: center !important; justify-content: space-between; margin-bottom: 16px; }
        .ad-card-title { font-size: 15px; font-weight: 700; color: #111827; }
        .ad-card-link { font-size: 12px; color: #006833; text-decoration: none; font-weight: 500; }
        .ad-actions-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
        .ad-action-btn {
          display: flex !important;
          align-items: center !important;
          flex-direction: row !important;
          gap: 10px;
          padding: 12px;
          border: 1px solid;
          border-radius: 8px;
          text-decoration: none;
          background: white;
          transition: all 0.2s;
        }
        .ad-action-btn:hover { background: #f9fafb; transform: translateY(-1px); }
        .ad-action-icon {
          width: 32px;
          height: 32px;
          border-radius: 6px;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          font-size: 16px;
          flex-shrink: 0;
        }
        .ad-action-label { font-size: 13px; font-weight: 500; color: #374151; }
        .ad-empty-text { color: #9ca3af; font-size: 14px; text-align: center; padding: 20px 0; }
        .ad-enquiry-list { display: flex !important; flex-direction: column !important; gap: 12px; }
        .ad-enquiry-item { display: flex !important; align-items: center !important; flex-direction: row !important; gap: 10px; }
        .ad-enquiry-avatar {
          width: 36px;
          height: 36px;
          background: #006833;
          color: white;
          border-radius: 50%;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          font-size: 14px;
          font-weight: 700;
          flex-shrink: 0;
        }
        .ad-enquiry-info { flex: 1; min-width: 0; }
        .ad-enquiry-name { font-size: 13px; font-weight: 600; color: #111827; }
        .ad-enquiry-meta { font-size: 11px; color: #9ca3af; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .ad-enquiry-status {
          padding: 3px 8px;
          border-radius: 20px;
          font-size: 11px;
          font-weight: 600;
          text-transform: capitalize;
          flex-shrink: 0;
        }
        .ad-status-new { background: #fef3c7; color: #d97706; }
        .ad-status-contacted { background: #d1fae5; color: #059669; }
        .ad-status-closed { background: #f3f4f6; color: #6b7280; }
        @media (max-width: 900px) { .ad-dashboard-bottom { grid-template-columns: 1fr; } }
        @media (max-width: 640px) { .ad-stats-grid { grid-template-columns: 1fr 1fr; } }
      `}</style>
    </div>
  );
}
