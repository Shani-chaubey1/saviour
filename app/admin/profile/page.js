'use client';
import { useState, useEffect } from 'react';
import { useToast } from '../_components/Toast';
import ImageField from '../_components/ImageField';

export default function ProfilePage() {
  const { toast } = useToast();
  const [admin, setAdmin] = useState(null);
  const [form, setForm] = useState({ name: '', avatar: '' });
  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const [pwLoading, setPwLoading] = useState(false);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);

  useEffect(() => {
    fetch('/api/admin/auth/me')
      .then((r) => r.json())
      .then((d) => {
        if (d.admin) {
          setAdmin(d.admin);
          setForm({ name: d.admin.name || '', avatar: d.admin.avatar || '' });
        }
      });
  }, []);

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/admin/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: form.name, avatar: form.avatar }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setAdmin(data.admin);
      toast({ message: 'Profile updated successfully', type: 'success' });
    } catch (err) {
      toast({ message: err.message || 'Failed to update', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSave = async (e) => {
    e.preventDefault();
    if (pwForm.newPassword !== pwForm.confirmPassword) {
      toast({ message: 'Passwords do not match', type: 'error' });
      return;
    }
    if (pwForm.newPassword.length < 6) {
      toast({ message: 'Password must be at least 6 characters', type: 'error' });
      return;
    }
    setPwLoading(true);
    try {
      const res = await fetch('/api/admin/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword: pwForm.currentPassword, newPassword: pwForm.newPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setPwForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      toast({ message: 'Password changed successfully', type: 'success' });
    } catch (err) {
      toast({ message: err.message || 'Failed to change password', type: 'error' });
    } finally {
      setPwLoading(false);
    }
  };

  const initials = admin?.name?.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2) || 'AD';

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">My Profile</h1>
        <p className="page-subtitle">Manage your personal info and password</p>
      </div>

      <div className="profile-grid">
        <div className="profile-avatar-card">
          <div className="big-avatar">{admin?.avatar ? (
            <img src={admin.avatar} alt={admin.name} className="avatar-img" />
          ) : (
            initials
          )}</div>
          <h3 className="avatar-name">{admin?.name || 'Loading...'}</h3>
          <p className="avatar-email">{admin?.email}</p>
          <span className="avatar-role">{admin?.role === 'super_admin' ? 'Super Admin' : 'Admin'}</span>
        </div>

        <div className="profile-forms">
          <div className="card">
            <h2 className="card-title">Personal Information</h2>
            <form onSubmit={handleProfileSave} className="form">
              <div className="form-row">
                <div className="form-group">
                  <label>Full Name</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Your full name"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Email Address</label>
                  <input type="email" value={admin?.email || ''} disabled className="disabled-input" />
                </div>
              </div>
              <div className="form-group">
                <ImageField
                  value={form.avatar}
                  onChange={(url) => setForm({ ...form, avatar: url })}
                  label="Profile Photo"
                  hint="Square photo recommended (min 200×200px)"
                  previewW={120}
                  previewH={120}
                />
              </div>
              <div className="form-actions">
                <button type="submit" className="btn-primary" disabled={loading}>
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>

          <div className="card">
            <h2 className="card-title">Change Password</h2>
            <form onSubmit={handlePasswordSave} className="form">
              <div className="form-group">
                <label>Current Password</label>
                <div className="pw-wrap">
                  <input
                    type={showCurrent ? 'text' : 'password'}
                    value={pwForm.currentPassword}
                    onChange={(e) => setPwForm({ ...pwForm, currentPassword: e.target.value })}
                    placeholder="Enter current password"
                    required
                  />
                  <button type="button" className="eye-btn" onClick={() => setShowCurrent(!showCurrent)}>
                    {showCurrent ? '🙈' : '👁'}
                  </button>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>New Password</label>
                  <div className="pw-wrap">
                    <input
                      type={showNew ? 'text' : 'password'}
                      value={pwForm.newPassword}
                      onChange={(e) => setPwForm({ ...pwForm, newPassword: e.target.value })}
                      placeholder="Min. 6 characters"
                      required
                    />
                    <button type="button" className="eye-btn" onClick={() => setShowNew(!showNew)}>
                      {showNew ? '🙈' : '👁'}
                    </button>
                  </div>
                </div>
                <div className="form-group">
                  <label>Confirm New Password</label>
                  <input
                    type="password"
                    value={pwForm.confirmPassword}
                    onChange={(e) => setPwForm({ ...pwForm, confirmPassword: e.target.value })}
                    placeholder="Re-enter new password"
                    required
                  />
                </div>
              </div>
              <div className="form-actions">
                <button type="submit" className="btn-primary" disabled={pwLoading}>
                  {pwLoading ? 'Changing...' : 'Change Password'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .page-header { margin-bottom: 24px; }
        .page-title { font-size: 24px; font-weight: 800; color: #111827; margin-bottom: 4px; }
        .page-subtitle { color: #6b7280; font-size: 14px; }
        .profile-grid { display: grid; grid-template-columns: 240px 1fr; gap: 20px; align-items: start; }
        .profile-avatar-card {
          background: white;
          border-radius: 12px;
          padding: 28px 20px;
          text-align: center;
          box-shadow: 0 1px 4px rgba(0,0,0,0.06);
          border: 1px solid #f3f4f6;
          position: sticky;
          top: 80px;
        }
        .big-avatar {
          width: 80px;
          height: 80px;
          background: #006833;
          color: white;
          font-size: 28px;
          font-weight: 800;
          border-radius: 50%;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 12px;
          overflow: hidden;
        }
        .avatar-img { width: 100%; height: 100%; object-fit: cover; }
        .avatar-name { font-size: 16px; font-weight: 700; color: #111827; margin-bottom: 4px; }
        .avatar-email { font-size: 12px; color: #6b7280; margin-bottom: 10px; word-break: break-all; }
        .avatar-role {
          padding: 4px 12px;
          background: #e8f5ef;
          color: #006833;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
        }
        .profile-forms { display: flex; flex-direction: column; gap: 20px; }
        .card {
          background: white;
          border-radius: 12px;
          padding: 24px;
          box-shadow: 0 1px 4px rgba(0,0,0,0.06);
          border: 1px solid #f3f4f6;
        }
        .card-title { font-size: 16px; font-weight: 700; color: #111827; margin-bottom: 20px; padding-bottom: 12px; border-bottom: 1px solid #f3f4f6; }
        .form { display: flex; flex-direction: column; gap: 16px; }
        .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        .form-group { display: flex; flex-direction: column; gap: 6px; }
        .form-group label { font-size: 13px; font-weight: 600; color: #374151; }
        .form-group input {
          padding: 10px 12px;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          font-size: 14px;
          outline: none;
          transition: border-color 0.2s;
        }
        .form-group input:focus { border-color: #006833; box-shadow: 0 0 0 2px rgba(0,104,51,0.15); }
        .disabled-input { background: #f9fafb; color: #9ca3af; cursor: not-allowed; }
        .pw-wrap { position: relative; }
        .pw-wrap input { width: 100%; box-sizing: border-box; padding-right: 40px; }
        .eye-btn { position: absolute; right: 10px; top: 50%; transform: translateY(-50%); background: none; border: none; cursor: pointer; font-size: 15px; }
        .form-actions { display: flex; justify-content: flex-end; }
        .btn-primary {
          padding: 10px 24px;
          background: #006833;
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s;
        }
        .btn-primary:hover { background: #004d26; }
        .btn-primary:disabled { opacity: 0.7; cursor: not-allowed; }
        @media (max-width: 900px) {
          .profile-grid { grid-template-columns: 1fr; }
          .profile-avatar-card { position: static; }
          .form-row { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}
