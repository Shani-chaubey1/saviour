'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { User, Mail, Phone, MessageSquare, Send, CheckCircle } from 'lucide-react';
import {
  validateLeadFormFields,
  resolveLeadProjectField,
  submitLeadRequest,
} from '@/lib/leadSubmission';
import './ContactForm.css';

const INITIAL = { name: '', email: '', phone: '', message: '' };

/**
 * @param {string} [projectName] – Property / project display name (detail page).
 * @param {string} [pageLabel] – Override source label when not a project page (e.g. "Blog — Post title").
 */
export default function ContactForm({ projectName = '', pageLabel = '' }) {
  const pathname = usePathname() || '/';
  const [form, setForm] = useState({ ...INITIAL });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validateLeadFormFields(form);
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    const project = resolveLeadProjectField({ projectName, pageLabel, pathname });
    const payload = {
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      message: form.message.trim(),
      project,
    };

    setLoading(true);
    try {
      const { ok, data } = await submitLeadRequest(payload);
      if (ok) {
        setSuccess(true);
        setForm({ ...INITIAL });
        setErrors({});
      } else {
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
        <CheckCircle size={56} color="#27ae60" className="w-full" />
        <h3>Thank You!</h3>
        <p>Your enquiry has been submitted. Our team will contact you shortly.</p>
        <button type="button" onClick={() => setSuccess(false)} className="btn-back">
          Submit Another
        </button>
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

      <div className="form-group">
        <label htmlFor="message" className="form-label">
          <MessageSquare size={14} /> Message
        </label>
        <textarea
          id="message"
          name="message"
          value={form.message}
          onChange={handleChange}
          placeholder="How can we help you?"
          rows={3}
          className="form-input form-textarea"
        />
      </div>

      {errors.submit && <div className="submit-error">{errors.submit}</div>}

      <button type="submit" className="submit-btn" disabled={loading}>
        {loading ? (
          <span className="loading-dots">
            Sending<span>.</span>
            <span>.</span>
            <span>.</span>
          </span>
        ) : (
          <>
            <Send size={16} /> Send Message
          </>
        )}
      </button>
    </form>
  );
}
