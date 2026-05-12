'use client';

import { useState } from 'react';
import { User, Mail, Phone, MessageSquare, Send, CheckCircle } from 'lucide-react';

const INITIAL = { name: '', email: '', phone: '', message: '', captcha: '' };

export default function ContactForm({ projectSlug = '' }) {
  const [form, setForm] = useState({ ...INITIAL });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const captchaAnswer = 7; // 2 + 5

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    if (!form.phone.trim()) errs.phone = 'Phone number is required';
    else if (!/^[0-9+\-\s]{7,15}$/.test(form.phone)) errs.phone = 'Enter a valid phone number';
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Enter a valid email';
    if (parseInt(form.captcha, 10) !== captchaAnswer) errs.captcha = 'Incorrect answer';
    return errs;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, project: projectSlug }),
      });
      if (res.ok) {
        setSuccess(true);
        setForm({ ...INITIAL });
        setErrors({});
      } else {
        const data = await res.json();
        setErrors({ submit: data.error || 'Something went wrong. Please try again.' });
      }
    } catch {
      setErrors({ submit: 'Network error. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="success-state">
        <CheckCircle size={56} color="#27ae60" />
        <h3>Thank You!</h3>
        <p>Your enquiry has been submitted. Our team will contact you shortly.</p>
        <button onClick={() => setSuccess(false)} className="btn-back">Submit Another</button>
        <style jsx global>{`
          .success-state {
            text-align: center;
            padding: 48px 24px;
          }
          .success-state h3 {
            font-size: 24px;
            font-weight: 700;
            color: #2c3e50;
            margin: 16px 0 8px;
          }
          .success-state p {
            color: #666;
            font-size: 15px;
          }
          .btn-back {
            margin-top: 20px;
            padding: 10px 24px;
            background: linear-gradient(135deg, #e67e22, #d35400);
            color: white;
            border: none;
            border-radius: 6px;
            font-weight: 700;
            font-size: 14px;
            cursor: pointer;
            transition: transform 0.2s;
          }
          .btn-back:hover { transform: translateY(-2px); }
        `}</style>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="contact-form" noValidate>
      <div className="form-group">
        <label htmlFor="name" className="form-label">
          <User size={14} /> Your Name <span className="req">*</span>
        </label>
        <input
          id="name"
          name="name"
          type="text"
          value={form.name}
          onChange={handleChange}
          placeholder="Enter your full name"
          className={`form-input${errors.name ? ' error' : ''}`}
          autoComplete="name"
        />
        {errors.name && <span className="error-msg">{errors.name}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="email" className="form-label">
          <Mail size={14} /> Your Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Enter your email address"
          className={`form-input${errors.email ? ' error' : ''}`}
          autoComplete="email"
        />
        {errors.email && <span className="error-msg">{errors.email}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="phone" className="form-label">
          <Phone size={14} /> Your Number <span className="req">*</span>
        </label>
        <input
          id="phone"
          name="phone"
          type="tel"
          value={form.phone}
          onChange={handleChange}
          placeholder="Enter your phone number"
          className={`form-input${errors.phone ? ' error' : ''}`}
          autoComplete="tel"
        />
        {errors.phone && <span className="error-msg">{errors.phone}</span>}
      </div>

      {errors.submit && (
        <div className="submit-error">{errors.submit}</div>
      )}

      <button type="submit" className="submit-btn" disabled={loading}>
        {loading ? (
          <span className="loading-dots">Sending<span>.</span><span>.</span><span>.</span></span>
        ) : (
          <>
            <Send size={16} /> Send Message
          </>
        )}
      </button>

      <style jsx global>{`
        .contact-form {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .form-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .form-label {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 13px;
          font-weight: 600;
          color: #2c3e50;
          text-transform: uppercase;
          letter-spacing: 0.3px;
        }
        .form-label svg {
          color: #e67e22;
        }
        .req {
          color: #e74c3c;
        }
        .form-input {
          padding: 12px 16px;
          border: 1.5px solid #e0e0e0;
          border-radius: 6px;
          font-size: 15px;
          font-family: inherit;
          color: #222;
          background: white;
          transition: border-color 0.2s, box-shadow 0.2s;
          outline: none;
          width: 100%;
        }
        .form-input:focus {
          border-color: #e67e22;
          box-shadow: 0 0 0 3px rgba(230,126,34,0.12);
        }
        .form-input.error {
          border-color: #e74c3c;
        }
        .form-input.error:focus {
          box-shadow: 0 0 0 3px rgba(231,76,60,0.12);
        }
        .form-textarea {
          resize: vertical;
          min-height: 100px;
        }
        .captcha-input {
          max-width: 120px;
        }
        .error-msg {
          font-size: 12px;
          color: #e74c3c;
          font-weight: 500;
        }
        .submit-error {
          background: rgba(231,76,60,0.08);
          border: 1px solid rgba(231,76,60,0.2);
          color: #e74c3c;
          padding: 12px 16px;
          border-radius: 6px;
          font-size: 14px;
        }
        .submit-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          background: linear-gradient(135deg, #e67e22, #d35400);
          color: white;
          border: none;
          border-radius: 6px;
          padding: 14px 32px;
          font-size: 15px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          cursor: pointer;
          transition: all 0.3s ease;
          font-family: inherit;
          align-self: flex-start;
        }
        .submit-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(230,126,34,0.35);
        }
        .submit-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
        .loading-dots span {
          animation: blink 1.4s infinite both;
        }
        .loading-dots span:nth-child(2) { animation-delay: 0.2s; }
        .loading-dots span:nth-child(3) { animation-delay: 0.4s; }
        @keyframes blink {
          0%, 80%, 100% { opacity: 0; }
          40% { opacity: 1; }
        }
      `}</style>
    </form>
  );
}
