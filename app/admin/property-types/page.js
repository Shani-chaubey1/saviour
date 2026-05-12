'use client';
import { useState, useEffect } from 'react';
import ConfirmModal from '../_components/ConfirmModal';
import { useToast } from '../_components/Toast';

export default function PropertyTypesPage() {
  const { toast } = useToast();
  const [types, setTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newName, setNewName] = useState('');
  const [adding, setAdding] = useState(false);
  const [editing, setEditing] = useState(null);
  const [editName, setEditName] = useState('');
  const [confirm, setConfirm] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetch('/api/admin/property-types')
      .then((r) => r.json())
      .then((d) => { setTypes(d.types || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newName.trim()) return;
    setAdding(true);
    try {
      const res = await fetch('/api/admin/property-types', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newName.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setTypes((prev) => [...prev, data.type]);
      setNewName('');
      toast({ message: 'Property type added', type: 'success' });
    } catch (err) {
      toast({ message: err.message || 'Failed to add', type: 'error' });
    } finally {
      setAdding(false);
    }
  };

  const handleEdit = async (id) => {
    if (!editName.trim()) return;
    try {
      const res = await fetch(`/api/admin/property-types/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: editName.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setTypes((prev) => prev.map((t) => (t._id === id ? data.type : t)));
      setEditing(null);
      toast({ message: 'Updated successfully', type: 'success' });
    } catch (err) {
      toast({ message: err.message || 'Failed to update', type: 'error' });
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await fetch(`/api/admin/property-types/${confirm._id}`, { method: 'DELETE' });
      setTypes((prev) => prev.filter((t) => t._id !== confirm._id));
      toast({ message: 'Deleted successfully', type: 'success' });
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
          <h1 className="page-title">Property Types</h1>
          <p className="page-subtitle">Manage categories for classifying projects</p>
        </div>
      </div>

      <div className="layout">
        <div className="card add-card">
          <h2 className="card-title">Add New Type</h2>
          <form onSubmit={handleAdd} className="add-form">
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="e.g. Residential, Commercial, Mixed Use"
              required
            />
            <button type="submit" className="btn-primary" disabled={adding}>
              {adding ? 'Adding...' : '+ Add Type'}
            </button>
          </form>
        </div>

        <div className="card list-card">
          <h2 className="card-title">All Types <span className="count">({types.length})</span></h2>
          {loading ? (
            <div className="loading">Loading...</div>
          ) : types.length === 0 ? (
            <div className="empty">No property types yet. Add one above.</div>
          ) : (
            <div className="types-list">
              {types.map((type) => (
                <div key={type._id} className="type-item">
                  {editing === type._id ? (
                    <div className="edit-row">
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        autoFocus
                        onKeyDown={(e) => e.key === 'Enter' && handleEdit(type._id)}
                      />
                      <button className="btn-save" onClick={() => handleEdit(type._id)}>✓ Save</button>
                      <button className="btn-cancel-sm" onClick={() => setEditing(null)}>✕</button>
                    </div>
                  ) : (
                    <>
                      <div className="type-info">
                        <span className="type-name">{type.name}</span>
                        <span className="type-slug">/{type.slug}</span>
                      </div>
                      <div className="type-actions">
                        <button className="btn-icon btn-edit" onClick={() => { setEditing(type._id); setEditName(type.name); }}>✏</button>
                        <button className="btn-icon btn-delete" onClick={() => setConfirm(type)}>🗑</button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <ConfirmModal isOpen={!!confirm} title="Delete Type?" message={`Delete "${confirm?.name}"? Projects using this type will need to be updated.`} onConfirm={handleDelete} onCancel={() => setConfirm(null)} loading={deleting} />

      <style jsx global>{`
        .page-header { margin-bottom: 24px; }
        .page-title { font-size: 24px; font-weight: 800; color: #111827; margin-bottom: 4px; }
        .page-subtitle { color: #6b7280; font-size: 14px; }
        .layout { display: grid; grid-template-columns: 350px 1fr; gap: 20px; align-items: start; }
        .card { background: white; border-radius: 12px; padding: 20px; box-shadow: 0 1px 4px rgba(0,0,0,0.06); border: 1px solid #f3f4f6; }
        .card-title { font-size: 15px; font-weight: 700; color: #111827; margin-bottom: 16px; }
        .count { font-size: 13px; font-weight: 500; color: #9ca3af; }
        .add-form { display: flex; flex-direction: column; gap: 10px; }
        .add-form input { padding: 10px 12px; border: 1px solid #d1d5db; border-radius: 8px; font-size: 14px; outline: none; }
        .add-form input:focus { border-color: #006833; }
        .btn-primary { padding: 10px; background: #006833; color: white; border: none; border-radius: 8px; font-size: 14px; font-weight: 600; cursor: pointer; }
        .btn-primary:disabled { opacity: 0.7; cursor: not-allowed; }
        .loading, .empty { padding: 20px; text-align: center; color: #9ca3af; font-size: 13.5px; }
        .types-list { display: flex; flex-direction: column; gap: 4px; }
        .type-item { display: flex; align-items: center; justify-content: space-between; padding: 10px 12px; border-radius: 8px; border: 1px solid #f3f4f6; transition: background 0.15s; }
        .type-item:hover { background: #f9fafb; }
        .type-info { display: flex; flex-direction: column; gap: 2px; }
        .type-name { font-size: 14px; font-weight: 500; color: #111827; }
        .type-slug { font-size: 11px; color: #9ca3af; font-family: monospace; }
        .type-actions { display: flex; gap: 6px; }
        .btn-icon { width: 28px; height: 28px; border-radius: 6px; display: flex; align-items: center; justify-content: center; font-size: 12px; cursor: pointer; border: none; }
        .btn-edit { background: #dbeafe; color: #1d4ed8; }
        .btn-delete { background: #fdeaeb; color: #eb3237; }
        .edit-row { display: flex; gap: 8px; align-items: center; width: 100%; }
        .edit-row input { flex: 1; padding: 6px 10px; border: 1px solid #006833; border-radius: 6px; font-size: 13.5px; outline: none; }
        .btn-save { padding: 6px 10px; background: #006833; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 12px; font-weight: 600; white-space: nowrap; }
        .btn-cancel-sm { padding: 6px 8px; background: #f3f4f6; color: #6b7280; border: none; border-radius: 6px; cursor: pointer; font-size: 12px; }
        @media (max-width: 768px) { .layout { grid-template-columns: 1fr; } }
      `}</style>
    </div>
  );
}
