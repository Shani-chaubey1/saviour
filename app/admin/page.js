'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import './dashboard-page.css';

export default function DashboardPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/dashboard', { credentials: 'same-origin' })
      .then((r) => r.json())
      .then((d) => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const stats = data?.stats || {};
  const enquiries = data?.recentEnquiries || [];

  const STAT_CARDS = [
    { label: 'Total Projects', value: stats.projects ?? '—', icon: '🏗', color: '#006833', href: '/admin/projects' },
    { label: 'Total Blogs', value: stats.posts ?? '—', icon: '📝', color: '#2563eb', href: '/admin/blogs' },
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
    { label: 'Homepage & site', href: '/admin/pages/home', icon: '⚙', color: '#6b7280' },
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
    </div>
  );
}
