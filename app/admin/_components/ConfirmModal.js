'use client';

export default function ConfirmModal({ isOpen, title, message, onConfirm, onCancel, loading }) {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <div className="modal-icon">⚠️</div>
        <h3 className="modal-title">{title || 'Are you sure?'}</h3>
        <p className="modal-message">{message || 'This action cannot be undone.'}</p>
        <div className="modal-actions">
          <button className="btn-cancel" onClick={onCancel} disabled={loading}>
            Cancel
          </button>
          <button className="btn-confirm" onClick={onConfirm} disabled={loading}>
            {loading ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
      <style jsx global>{`
        .modal-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.5);
          z-index: 100;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }
        .modal {
          background: white;
          border-radius: 12px;
          padding: 32px;
          max-width: 400px;
          width: 100%;
          text-align: center;
          box-shadow: 0 20px 60px rgba(0,0,0,0.2);
          animation: scaleIn 0.2s ease;
        }
        .modal-icon { font-size: 40px; margin-bottom: 12px; }
        .modal-title { font-size: 18px; font-weight: 700; color: #111827; margin-bottom: 8px; }
        .modal-message { font-size: 14px; color: #6b7280; margin-bottom: 24px; }
        .modal-actions { display: flex; gap: 12px; justify-content: center; }
        .btn-cancel {
          padding: 10px 24px;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          background: white;
          color: #374151;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }
        .btn-cancel:hover { background: #f9fafb; }
        .btn-cancel:disabled { opacity: 0.5; cursor: not-allowed; }
        .btn-confirm {
          padding: 10px 24px;
          border: none;
          border-radius: 8px;
          background: #eb3237;
          color: white;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }
        .btn-confirm:hover { background: #cc1e23; }
        .btn-confirm:disabled { opacity: 0.7; cursor: not-allowed; }
        @keyframes scaleIn {
          from { transform: scale(0.9); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
