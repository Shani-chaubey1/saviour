'use client';
import { useState, useEffect, useCallback } from 'react';
import { useToast } from '../_components/Toast';

const STATUS_OPTIONS = ['new', 'contacted', 'closed'];

export default function EnquiriesPage() {
  const { toast } = useToast();
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [expanded, setExpanded] = useState(null);

  const fetchEnquiries = useCallback(() => {
    setLoading(true);
    const params = new URLSearchParams({ limit: 50 });
    if (statusFilter) params.set('status', statusFilter);
    fetch(`/api/admin/enquiries?${params}`)
      .then((r) => r.json())
      .then((d) => { setEnquiries(d.enquiries || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, [statusFilter]);

  useEffect(() => { fetchEnquiries(); }, [fetchEnquiries]);

  const updateStatus = async (id, status) => {
    try {
      const res = await fetch('/api/admin/enquiries', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setEnquiries((prev) => prev.map((e) => (e._id === id ? { ...e, status } : e)));
      toast({ message: 'Status updated', type: 'success' });
    } catch {
      toast({ message: 'Failed to update status', type: 'error' });
    }
  };

  const counts = {
    all: enquiries.length,
    new: enquiries.filter((e) => e.status === 'new').length,
    contacted: enquiries.filter((e) => e.status === 'contacted').length,
    closed: enquiries.filter((e) => e.status === 'closed').length,
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Enquiries</h1>
          <p className="page-subtitle">All website enquiries and leads</p>
        </div>
        <div className="count-pills">
          <button className={`pill ${!statusFilter ? 'active' : ''}`} onClick={() => setStatusFilter('')}>All ({counts.all})</button>
          <button className={`pill new-pill ${statusFilter === 'new' ? 'active' : ''}`} onClick={() => setStatusFilter('new')}>New ({counts.new})</button>
          <button className={`pill contacted-pill ${statusFilter === 'contacted' ? 'active' : ''}`} onClick={() => setStatusFilter('contacted')}>Contacted ({counts.contacted})</button>
          <button className={`pill closed-pill ${statusFilter === 'closed' ? 'active' : ''}`} onClick={() => setStatusFilter('closed')}>Closed ({counts.closed})</button>
        </div>
      </div>

      <div className="card">
        {loading ? (
          <div className="loading-state">Loading...</div>
        ) : enquiries.length === 0 ? (
          <div className="empty-state"><p className="empty-icon">📬</p><p>No enquiries found</p></div>
        ) : (
          <div className="enq-list">
            {enquiries.map((e) => (
              <div key={e._id} className={`enq-item ${expanded === e._id ? 'expanded' : ''}`}>
                <div className="enq-main" onClick={() => setExpanded(expanded === e._id ? null : e._id)}>
                  <div className="enq-avatar">{e.name?.[0]?.toUpperCase()}</div>
                  <div className="enq-info">
                    <p className="enq-name">
                      {e.name}
                      <span className={`enq-type ${e.formType === 'visit' ? 'enq-type-visit' : 'enq-type-connect'}`}>
                        {e.formType === 'visit' ? 'Book a Visit' : 'Connect'}
                      </span>
                    </p>
                    <p className="enq-contact">{e.email} {e.phone ? `· ${e.phone}` : ''}</p>
                  </div>
                  <div className="enq-meta">
                    {e.project && <span className="enq-project">{e.project}</span>}
                    <span className="enq-date">{new Date(e.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="enq-status">
                    <select
                      value={e.status}
                      onChange={(ev) => { ev.stopPropagation(); updateStatus(e._id, ev.target.value); }}
                      className={`status-select status-${e.status}`}
                      onClick={(ev) => ev.stopPropagation()}
                    >
                      {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                    </select>
                  </div>
                  <span className="enq-chevron">{expanded === e._id ? '▲' : '▼'}</span>
                </div>
                {expanded === e._id && (
                  <div className="enq-details">
                    {e.formType === 'visit' && (e.visitDate || e.visitTime) && (
                      <div className="enq-row">
                        <span className="enq-row-label">Visit:</span>
                        <span className="enq-row-value">
                          {e.visitDate || '—'} {e.visitTime ? `at ${e.visitTime}` : ''}
                        </span>
                      </div>
                    )}
                    {e.formType !== 'visit' && e.preferredDateTime && (
                      <div className="enq-row">
                        <span className="enq-row-label">Preferred Time:</span>
                        <span className="enq-row-value">
                          {new Date(e.preferredDateTime).toLocaleString()}
                        </span>
                      </div>
                    )}
                    {e.message && (
                      <div className="enq-row">
                        <span className="enq-row-label">Message:</span>
                        <span className="enq-row-value">{e.message}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <style jsx global>{`
        .page-header { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 24px; flex-wrap: wrap; gap: 12px; }
        .page-title { font-size: 24px; font-weight: 800; color: #111827; margin-bottom: 4px; }
        .page-subtitle { color: #6b7280; font-size: 14px; }
        .count-pills { display: flex; gap: 6px; flex-wrap: wrap; }
        .pill { padding: 5px 12px; border-radius: 20px; border: 1px solid #e5e7eb; background: white; cursor: pointer; font-size: 12.5px; transition: all 0.15s; }
        .pill:hover { background: #f9fafb; }
        .pill.active { background: #374151; color: white; border-color: #374151; }
        .new-pill.active { background: #d97706; border-color: #d97706; }
        .contacted-pill.active { background: #006833; border-color: #006833; }
        .closed-pill.active { background: #9ca3af; border-color: #9ca3af; }
        .card { background: white; border-radius: 12px; box-shadow: 0 1px 4px rgba(0,0,0,0.06); border: 1px solid #f3f4f6; overflow: hidden; }
        .loading-state, .empty-state { padding: 48px; text-align: center; color: #9ca3af; }
        .empty-icon { font-size: 40px; margin-bottom: 8px; }
        .enq-list { display: flex; flex-direction: column; }
        .enq-item { border-bottom: 1px solid #f9fafb; }
        .enq-item:last-child { border-bottom: none; }
        .enq-item.expanded { background: #fafbfc; }
        .enq-main { display: flex; align-items: center; gap: 12px; padding: 14px 16px; cursor: pointer; }
        .enq-main:hover { background: #f9fafb; }
        .enq-avatar { width: 36px; height: 36px; background: #006833; color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 14px; flex-shrink: 0; }
        .enq-info { flex: 1; min-width: 0; }
        .enq-name { font-weight: 600; color: #111827; font-size: 13.5px; }
        .enq-contact { font-size: 12px; color: #9ca3af; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .enq-meta { display: flex; flex-direction: column; gap: 2px; align-items: flex-end; }
        .enq-project { font-size: 12px; background: #f3f4f6; color: #374151; padding: 2px 8px; border-radius: 4px; }
        .enq-date { font-size: 11px; color: #9ca3af; }
        .status-select { padding: 4px 8px; border-radius: 20px; border: none; font-size: 12px; font-weight: 600; cursor: pointer; outline: none; }
        .status-select.status-new { background: #fef3c7; color: #d97706; }
        .status-select.status-contacted { background: #d1fae5; color: #059669; }
        .status-select.status-closed { background: #f3f4f6; color: #9ca3af; }
        .enq-chevron { font-size: 10px; color: #9ca3af; flex-shrink: 0; }
        .enq-type { font-size: 10px; font-weight: 700; padding: 2px 8px; border-radius: 10px; margin-left: 8px; letter-spacing: 0.3px; text-transform: uppercase; vertical-align: middle; }
        .enq-type-connect { background: #dbeafe; color: #1d4ed8; }
        .enq-type-visit { background: #fef3c7; color: #b45309; }
        .enq-details { padding: 8px 16px 16px 64px; display: flex; flex-direction: column; gap: 8px; border-top: 1px solid #f3f4f6; }
        .enq-row { display: flex; gap: 8px; align-items: flex-start; flex-wrap: wrap; }
        .enq-row-label { font-size: 12px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.4px; flex-shrink: 0; min-width: 110px; }
        .enq-row-value { font-size: 13.5px; color: #374151; line-height: 1.6; flex: 1; min-width: 0; word-break: break-word; }
      `}</style>
    </div>
  );
}
