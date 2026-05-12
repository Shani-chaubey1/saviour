'use client';

import { useState } from 'react';
import { User, Mail, Phone, MessageSquare, Send, CheckCircle } from 'lucide-react';
import './ContactForm.css';

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
</form>
  );
}
