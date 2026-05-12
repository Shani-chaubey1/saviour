'use client';
import { useState, useEffect } from 'react';
import ConfirmModal from '../_components/ConfirmModal';
import IconPicker from '../_components/IconPicker';
import { useToast } from '../_components/Toast';

const EMPTY_FORM = { name: '', icon: 'FaCheck' };

export default function AmenitiesPage() {
  const { toast } = useToast();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(EMPTY_FORM);
  const [adding, setAdding] = useState(false);
  const [editing, setEditing] = useState(null);
  const [editForm, setEditForm] = useState(EMPTY_FORM);
  const [confirm, setConfirm] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetch('/api/admin/amenities')
      .then((r) => r.json())
      .then((d) => { setItems(d.amenities || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    setAdding(true);
    try {
      const res = await fetch('/api/admin/amenities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setItems((prev) => [...prev, data.amenity]);
      setForm(EMPTY_FORM);
      toast({ message: 'Amenity added', type: 'success' });
    } catch (err) {
      toast({ message: err.message || 'Failed to add', type: 'error' });
    } finally {
      setAdding(false);
    }
  };

  const handleEditSave = async (id) => {
    try {
      const res = await fetch(`/api/admin/amenities/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setItems((prev) => prev.map((a) => (a._id === id ? data.amenity : a)));
      setEditing(null);
      toast({ message: 'Updated', type: 'success' });
    } catch (err) {
      toast({ message: err.message || 'Failed', type: 'error' });
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await fetch(`/api/admin/amenities/${confirm._id}`, { method: 'DELETE' });
      setItems((prev) => prev.filter((a) => a._id !== confirm._id));
      toast({ message: 'Deleted', type: 'success' });
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
          <h1 className="page-title">Amenities</h1>
          <p className="page-subtitle">Manage project amenities with icons</p>
        </div>
      </div>

      <div className="layout">
        <div className="card">
          <h2 className="card-title">Add Amenity</h2>
          <form onSubmit={handleAdd} className="add-form">
            <div className="form-group">
              <label>Amenity Name *</label>
              <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Swimming Pool" required />
            </div>
            <div className="form-group">
              <label>Icon (react-icons name)</label>
              <IconPicker value={form.icon} onChange={(icon) => setForm({ ...form, icon })} />
            </div>
            <button type="submit" className="btn-primary" disabled={adding}>{adding ? 'Adding...' : '+ Add Amenity'}</button>
          </form>
        </div>

        <div className="card">
          <h2 className="card-title">All Amenities <span className="count">({items.length})</span></h2>
          {loading ? <div className="loading">Loading...</div> : items.length === 0 ? (
            <div className="empty">No amenities yet.</div>
          ) : (
            <div className="items-grid">
              {items.map((item) => (
                <div key={item._id} className="item-card">
                  {editing === item._id ? (
                    <div className="edit-form">
                      <input type="text" value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} />
                      <IconPicker value={editForm.icon} onChange={(icon) => setEditForm({ ...editForm, icon })} />
                      <div className="edit-actions">
                        <button className="btn-save-sm" onClick={() => handleEditSave(item._id)}>Save</button>
                        <button className="btn-cancel-sm" onClick={() => setEditing(null)}>Cancel</button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="item-icon-box">
                        <span className="icon-label">{item.icon}</span>
                      </div>
                      <span className="item-name">{item.name}</span>
                      <div className="item-actions">
                        <button className="btn-icon btn-edit" onClick={() => { setEditing(item._id); setEditForm({ name: item.name, icon: item.icon }); }}>✏</button>
                        <button className="btn-icon btn-delete" onClick={() => setConfirm(item)}>🗑</button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <ConfirmModal isOpen={!!confirm} title="Delete Amenity?" message={`Delete "${confirm?.name}"?`} onConfirm={handleDelete} onCancel={() => setConfirm(null)} loading={deleting} />

      <style jsx global>{`
        .page-header { margin-bottom: 24px; }
        .page-title { font-size: 24px; font-weight: 800; color: #111827; margin-bottom: 4px; }
        .page-subtitle { color: #6b7280; font-size: 14px; }
        .layout { display: grid; grid-template-columns: 320px 1fr; gap: 20px; align-items: start; }
        .card { background: white; border-radius: 12px; padding: 20px; box-shadow: 0 1px 4px rgba(0,0,0,0.06); border: 1px solid #f3f4f6; }
        .card-title { font-size: 15px; font-weight: 700; color: #111827; margin-bottom: 16px; }
        .count { font-size: 13px; font-weight: 500; color: #9ca3af; }
        .add-form { display: flex; flex-direction: column; gap: 14px; }
        .form-group { display: flex; flex-direction: column; gap: 6px; }
        .form-group label { font-size: 13px; font-weight: 600; color: #374151; }
        .form-group input { padding: 9px 12px; border: 1px solid #d1d5db; border-radius: 8px; font-size: 14px; outline: none; }
        .form-group input:focus { border-color: #006833; }
        .btn-primary { padding: 10px; background: #006833; color: white; border: none; border-radius: 8px; font-size: 14px; font-weight: 600; cursor: pointer; }
        .btn-primary:disabled { opacity: 0.7; cursor: not-allowed; }
        .loading, .empty { padding: 20px; text-align: center; color: #9ca3af; font-size: 13.5px; }
        .items-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 10px; }
        .item-card { padding: 12px; border: 1px solid #f3f4f6; border-radius: 8px; transition: all 0.15s; }
        .item-card:hover { border-color: #d1d5db; }
        .item-icon-box { background: #e8f5ef; border-radius: 6px; padding: 6px 8px; margin-bottom: 6px; display: inline-block; }
        .icon-label { font-family: monospace; font-size: 11px; color: #006833; font-weight: 600; }
        .item-name { font-size: 13.5px; font-weight: 500; color: #111827; display: block; margin-bottom: 8px; }
        .item-actions { display: flex; gap: 6px; }
        .btn-icon { width: 26px; height: 26px; border-radius: 5px; display: flex; align-items: center; justify-content: center; font-size: 11px; cursor: pointer; border: none; }
        .btn-edit { background: #dbeafe; color: #1d4ed8; }
        .btn-delete { background: #fdeaeb; color: #eb3237; }
        .edit-form { display: flex; flex-direction: column; gap: 8px; }
        .edit-form input { padding: 7px 10px; border: 1px solid #006833; border-radius: 6px; font-size: 13px; outline: none; }
        .edit-actions { display: flex; gap: 6px; }
        .btn-save-sm { padding: 5px 10px; background: #006833; color: white; border: none; border-radius: 6px; font-size: 12px; cursor: pointer; font-weight: 600; }
        .btn-cancel-sm { padding: 5px 8px; background: #f3f4f6; color: #6b7280; border: none; border-radius: 6px; font-size: 12px; cursor: pointer; }
        @media (max-width: 768px) { .layout { grid-template-columns: 1fr; } }
      `}</style>
    </div>
  );
}
