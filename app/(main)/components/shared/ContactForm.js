'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import {
  User,
  Mail,
  Phone,
  MessageSquare,
  Send,
  CheckCircle,
  CalendarClock,
  Calendar,
  Clock,
  ShieldCheck,
} from 'lucide-react';
import {
  validateLeadFormFields,
  resolveLeadProjectField,
  submitLeadRequest,
  generateMathChallenge,
  getTodayDateString,
  getMinDateTimeLocalString,
} from '@/lib/leadSubmission';
import './ContactForm.css';

const INITIAL = {
  name: '',
  email: '',
  phone: '',
  message: '',
  preferredDateTime: '',
  visitDate: '',
  visitTime: '',
  captchaAnswer: '',
};

const DEFAULT_CONNECT_LABEL = 'Connect with an Agent';
const DEFAULT_VISIT_LABEL = 'Book a Visit';

/**
 * @param {string} [projectName]
 * @param {string} [pageLabel]
 * @param {string} [tabConnectLabel]
 * @param {string} [tabVisitLabel]
 */
export default function ContactForm({
  projectName = '',
  pageLabel = '',
  tabConnectLabel = '',
  tabVisitLabel = '',
  onSuccess,
}) {
  const pathname = usePathname() || '/';
  const [tab, setTab] = useState('connect');
  const [form, setForm] = useState({ ...INITIAL });
  const [challenge, setChallenge] = useState(() => generateMathChallenge());
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const regenerateChallenge = () => setChallenge(generateMathChallenge());

  const connectLabel = tabConnectLabel?.trim() || DEFAULT_CONNECT_LABEL;
  const visitLabel = tabVisitLabel?.trim() || DEFAULT_VISIT_LABEL;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const switchTab = (next) => {
    if (next === tab) return;
    setTab(next);
    setErrors({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validateLeadFormFields({
      ...form,
      formType: tab,
      captchaA: challenge.a,
      captchaB: challenge.b,
      captchaOp: challenge.op,
      captchaAnswer: form.captchaAnswer,
    });
    if (Object.keys(errs).length) {
      setErrors({ ...errs, form: 'Please complete all required fields before submitting.' });
      if (errs.captchaAnswer) {
        setForm((prev) => ({ ...prev, captchaAnswer: '' }));
        regenerateChallenge();
      }
      requestAnimationFrame(() => {
        const panel = document.getElementById('cf-panel');
        const firstInvalid =
          panel?.querySelector('.form-input.error, .cf-captcha-answer.error') ||
          panel?.querySelector('.error-msg');
        firstInvalid?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      });
      return;
    }
    setErrors({});
    const project = resolveLeadProjectField({ projectName, pageLabel, pathname });
    const payload = {
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      message: form.message.trim(),
      project,
      formType: tab,
      preferredDateTime: tab === 'connect' ? form.preferredDateTime.trim() : '',
      visitDate: tab === 'visit' ? form.visitDate.trim() : '',
      visitTime: tab === 'visit' ? form.visitTime.trim() : '',
      captchaA: challenge.a,
      captchaB: challenge.b,
      captchaOp: challenge.op,
      captchaAnswer: form.captchaAnswer.trim(),
    };

    setLoading(true);
    try {
      const { ok, data } = await submitLeadRequest(payload);
      if (ok) {
        setSuccess(true);
        setForm({ ...INITIAL });
        setErrors({});
        regenerateChallenge();
        onSuccess?.();
      } else {
        setErrors({ submit: data.error || 'Something went wrong. Please try again.' });
        if (data.error?.toLowerCase().includes('incorrect') || data.error?.toLowerCase().includes('calculation')) {
          setForm((prev) => ({ ...prev, captchaAnswer: '' }));
          regenerateChallenge();
        }
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

  const isConnect = tab === 'connect';
  const submitText = isConnect ? 'Send Enquiry' : 'Confirm Visit';
  const todayStr = getTodayDateString();
  const visitTimeMin =
    !isConnect && form.visitDate === todayStr
      ? (() => {
          const now = new Date();
          const pad = (n) => String(n).padStart(2, '0');
          return `${pad(now.getHours())}:${pad(now.getMinutes())}`;
        })()
      : undefined;

  return (
    <div className="cf-wrap">
      <div className="cf-tabs" role="tablist" aria-label="Enquiry type">
        <button
          type="button"
          role="tab"
          id="cf-tab-connect"
          aria-selected={isConnect}
          aria-controls="cf-panel"
          className={`cf-tab${isConnect ? ' cf-tab-active' : ''}`}
          onClick={() => switchTab('connect')}
        >
          {connectLabel}
        </button>
        <button
          type="button"
          role="tab"
          id="cf-tab-visit"
          aria-selected={!isConnect}
          aria-controls="cf-panel"
          className={`cf-tab${!isConnect ? ' cf-tab-active' : ''}`}
          onClick={() => switchTab('visit')}
        >
          {visitLabel}
        </button>
      </div>

      <form
        id="cf-panel"
        role="tabpanel"
        aria-labelledby={isConnect ? 'cf-tab-connect' : 'cf-tab-visit'}
        onSubmit={handleSubmit}
        className="contact-form"
        noValidate
      >
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

        {isConnect ? (
          <div className="form-group">
            <label htmlFor="preferredDateTime" className="form-label">
              <CalendarClock size={14} /> Preferred Date &amp; Time
            </label>
            <input
              id="preferredDateTime"
              name="preferredDateTime"
              type="datetime-local"
              value={form.preferredDateTime}
              onChange={handleChange}
              className={`form-input${errors.preferredDateTime ? ' error' : ''}`}
              min={getMinDateTimeLocalString()}
            />
            {errors.preferredDateTime && (
              <span className="error-msg">{errors.preferredDateTime}</span>
            )}
          </div>
        ) : (
          <div className="form-group">
            <label htmlFor="visitDate" className="form-label">
              <Calendar size={14} /> Visit Date <span className="req">*</span>
            </label>
            <input
              id="visitDate"
              name="visitDate"
              type="date"
              value={form.visitDate}
              onChange={handleChange}
              className={`form-input${errors.visitDate ? ' error' : ''}`}
              min={getTodayDateString()}
            />
            {errors.visitDate && <span className="error-msg">{errors.visitDate}</span>}
          </div>
        )}

        {!isConnect && (
          <div className="form-group">
            <label htmlFor="visitTime" className="form-label">
              <Clock size={14} /> Visit Time <span className="req">*</span>
            </label>
            <input
              id="visitTime"
              name="visitTime"
              type="time"
              value={form.visitTime}
              onChange={handleChange}
              className={`form-input${errors.visitTime ? ' error' : ''}`}
              min={visitTimeMin}
            />
            {errors.visitTime && <span className="error-msg">{errors.visitTime}</span>}
          </div>
        )}

        <div className={`form-group${isConnect ? ' span-2' : ''}`}>
          <label htmlFor="message" className="form-label">
            <MessageSquare size={14} /> Message
          </label>
          <input
            id="message"
            name="message"
            type="text"
            value={form.message}
            onChange={handleChange}
            placeholder="How can we help you?"
            className="form-input"
          />
        </div>

        <div className={`form-group span-2 cf-captcha${errors.captchaAnswer ? ' cf-captcha-error' : ''}`}>
          <label htmlFor="captchaAnswer" className="form-label">
            <ShieldCheck size={14} /> Security check <span className="req">*</span>
          </label>
          <div className="cf-captcha-card">
            <div className="cf-captcha-equation" aria-hidden="true">
              <span className="cf-captcha-chip cf-captcha-num">{challenge.a}</span>
              <span className="cf-captcha-chip cf-captcha-op">{challenge.op}</span>
              <span className="cf-captcha-chip cf-captcha-num">{challenge.b}</span>
              <span className="cf-captcha-equals">=</span>
              <input
                id="captchaAnswer"
                name="captchaAnswer"
                type="number"
                inputMode="numeric"
                value={form.captchaAnswer}
                onChange={handleChange}
                placeholder="?"
                className={`cf-captcha-answer${errors.captchaAnswer ? ' error' : ''}`}
                autoComplete="off"
                aria-label={`Answer: ${challenge.a} ${challenge.op} ${challenge.b}`}
                aria-describedby={errors.captchaAnswer ? 'captcha-error' : 'captcha-hint'}
              />
            </div>
          </div>
          {errors.captchaAnswer && (
            <span id="captcha-error" className="error-msg">
              {errors.captchaAnswer}
            </span>
          )}
        </div>

        {errors.form && <div className="submit-error span-2">{errors.form}</div>}

        {errors.submit && <div className="submit-error span-2">{errors.submit}</div>}

        <button type="submit" className="submit-btn span-2" disabled={loading}>
          {loading ? (
            <span className="loading-dots">
              Sending<span>.</span>
              <span>.</span>
              <span>.</span>
            </span>
          ) : (
            <>
              <Send size={16} /> {submitText}
            </>
          )}
        </button>
      </form>
    </div>
  );
}
