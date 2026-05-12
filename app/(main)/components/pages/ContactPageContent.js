'use client';

import { Phone, Mail, MapPin, Clock } from 'lucide-react';
import PageBanner from '../ui/PageBanner';
import SectionHeading from '../ui/SectionHeading';
import ContactForm from '../shared/ContactForm';

const DEFAULT_MAP =
  'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3510.4561793905256!2d77.47369!3d28.32944!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjjCsDE5JzQ2LjAiTiA3N8KwMjgnMjUuMyJF!5e0!3m2!1sen!2sin!4v1620000000000!5m2!1sen!2sin';

export default function ContactPageContent({ sections = {}, settings = {} }) {
  const pageTitle = sections.page_title?.trim() || 'Contact Us';
  const introSubtitle =
    sections.intro_subtitle?.trim() ||
    "We'd love to hear from you. Send us a message and we'll get back to you as soon as possible.";
  const phone = sections.phone?.trim() || settings.site_phone_2 || '+91 9206-001-002';
  const email = sections.email?.trim() || settings.site_email || 'info@saviourgroup.in';
  const address =
    sections.address?.trim() ||
    settings.site_address ||
    'Yamuna Expressway, Greater Noida, Uttar Pradesh';
  const hours = sections.working_hours?.trim() || 'Mon – Sat: 9:00 AM – 7:00 PM';
  const mapSrc = sections.map_embed?.trim() || DEFAULT_MAP;
  const formTitle = sections.form_title?.trim() || 'Send Us a Message';

  const phoneHref = phone.replace(/\s/g, '').replace(/^\+/, '');
  const telHref = phoneHref.startsWith('91') ? `tel:+${phoneHref}` : `tel:${phoneHref}`;

  return (
    <>
      <PageBanner title={pageTitle} breadcrumbs={[{ label: pageTitle }]} />
      <section className="contact-pg">
        <div className="container">
          <div className="contact-intro">
            <SectionHeading title={pageTitle} subtitle={introSubtitle} centered />
          </div>
          <div className="contact-grid">
            <div className="contact-info-col">
              <div className="info-cards">
                {[
                  { icon: <Phone size={24} />, title: 'Phone', content: phone, href: telHref },
                  { icon: <Mail size={24} />, title: 'Email', content: email, href: `mailto:${email}` },
                  { icon: <MapPin size={24} />, title: 'Office', content: address, href: null },
                  { icon: <Clock size={24} />, title: 'Working Hours', content: hours, href: null },
                ].map((item) => (
                  <div key={item.title} className="info-card">
                    <div className="info-card-icon">{item.icon}</div>
                    <div className="info-card-body">
                      <h3 className="info-card-title">{item.title}</h3>
                      {item.href ? (
                        <a href={item.href} className="info-card-content link">{item.content}</a>
                      ) : (
                        <p className="info-card-content">{item.content}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <div className="contact-map">
                <iframe
                  src={mapSrc}
                  width="100%"
                  height="300"
                  style={{ border: 0, borderRadius: '12px' }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Office location map"
                />
              </div>
            </div>
            <div className="contact-form-col">
              <div className="form-box">
                <h3 className="form-box-title">{formTitle}</h3>
                <ContactForm pageLabel={pageTitle} />
              </div>
            </div>
          </div>
        </div>
      </section>

      <style jsx global>{`
        .contact-pg { padding: 80px 0; background: white; }
        .contact-intro { margin-bottom: 48px; }
        .contact-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 48px; align-items: start; }
        .info-cards { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 28px; }
        .info-card { display: flex; align-items: flex-start; gap: 14px; padding: 20px; background: #f8f9fa; border-radius: 12px; border: 1px solid #eee; transition: all 0.3s ease; }
        .info-card:hover { border-color: #e67e22; background: rgba(230,126,34,0.04); transform: translateY(-3px); box-shadow: 0 8px 24px rgba(230,126,34,0.1); }
        .info-card-icon { width: 48px; height: 48px; background: linear-gradient(135deg, rgba(230,126,34,0.15), rgba(211,84,0,0.08)); border-radius: 10px; display: flex; align-items: center; justify-content: center; color: #e67e22; flex-shrink: 0; }
        .info-card-title { font-size: 13px; font-weight: 700; color: #888; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px; }
        .info-card-content { font-size: 14px; color: #333; line-height: 1.5; margin: 0; }
        .info-card-content.link { color: #e67e22; text-decoration: none; transition: color 0.2s; }
        .info-card-content.link:hover { color: #d35400; text-decoration: underline; }
        .contact-map { border-radius: 12px; overflow: hidden; }
        .form-box { background: white; border-radius: 12px; padding: 36px; box-shadow: 0 4px 32px rgba(0,0,0,0.08); border: 1px solid #eee; }
        .form-box-title { font-size: 22px; font-weight: 700; color: #2c3e50; margin-bottom: 28px; padding-bottom: 16px; border-bottom: 2px solid #e67e22; display: inline-block; }
        @media (max-width: 1024px) { .contact-grid { grid-template-columns: 1fr; } }
        @media (max-width: 640px) { .info-cards { grid-template-columns: 1fr; } }
      `}</style>
    </>
  );
}
