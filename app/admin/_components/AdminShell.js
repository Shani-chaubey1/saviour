'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from './Sidebar';
import AdminHeader from './AdminHeader';
import { ToastProvider } from './Toast';

export default function AdminShell({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [admin, setAdmin] = useState(null);
  const router = useRouter();

  useEffect(() => {
    fetch('/api/admin/auth/me')
      .then((r) => r.json())
      .then((data) => {
        if (data.admin) setAdmin(data.admin);
      })
      .catch(() => {});
  }, []);

  return (
    <ToastProvider>
      <div className="admin-shell">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="admin-main">
          <AdminHeader admin={admin} onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
          <div className="admin-content">{children}</div>
        </div>
      </div>
      <style jsx global>{`
        .admin-shell {
          display: flex !important;
          flex-direction: row !important;
          min-height: 100vh;
          background: #f4f6fa;
        }
        .admin-main {
          flex: 1;
          margin-left: 260px;
          display: flex !important;
          flex-direction: column !important;
          min-width: 0;
          min-height: 0;
        }
        .admin-content {
          flex: 1;
          padding: 24px;
          min-height: 0;
          overflow-x: hidden;
          overflow-y: auto;
        }
        @media (max-width: 768px) {
          .admin-main { margin-left: 0; }
          .admin-content { padding: 16px; }
        }
      `}</style>
    </ToastProvider>
  );
}
