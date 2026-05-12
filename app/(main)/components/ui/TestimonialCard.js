'use client';

export default function TestimonialCard({ testimonial }) {
  const { name, role, company, content, rating = 5 } = testimonial;
  const initials = name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '?';
  return (
    <div className="tc-card">
      <div className="tc-top">
        <div className="tc-stars">
          {Array.from({ length: rating }).map((_, i) => (
            <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill="#eb3237"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
          ))}
        </div>
        <div className="tc-quote">"</div>
      </div>
      <p className="tc-content">{content}</p>
      <div className="tc-author">
        <div className="tc-avatar">{initials}</div>
        <div>
          <p className="tc-name">{name}</p>
          <p className="tc-role">{role}{company ? `, ${company}` : ''}</p>
        </div>
      </div>
      <style jsx global>{`
        .tc-card { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1); border-radius: 14px; padding: 28px 24px; display: flex; flex-direction: column; gap: 16px; transition: all 0.3s; position: relative; overflow: hidden; }
        .tc-card::before { content: ''; position: absolute; top: 0; left: 0; width: 4px; height: 100%; background: linear-gradient(to bottom, var(--green,#006833), var(--red,#eb3237)); opacity: 0; transition: opacity 0.3s; }
        .tc-card:hover { background: rgba(255,255,255,0.07); transform: translateY(-4px); }
        .tc-card:hover::before { opacity: 1; }
        .tc-top { display: flex !important; align-items: center !important; justify-content: space-between; }
        .tc-stars { display: flex !important; gap: 2px; }
        .tc-quote { font-size: 64px; line-height: 0.6; color: var(--green,#006833); opacity: 0.3; font-family: Georgia,serif; font-weight: 900; }
        .tc-content { font-size: 14px; color: rgba(255,255,255,0.75); line-height: 1.75; font-style: italic; flex: 1; }
        .tc-author { display: flex !important; align-items: center !important; gap: 12px; padding-top: 16px; border-top: 1px solid rgba(255,255,255,0.08); }
        .tc-avatar { width: 42px; height: 42px; min-width: 42px; border-radius: 50%; background: linear-gradient(135deg, var(--green,#006833), var(--green-light,#008a40)); display: flex !important; align-items: center !important; justify-content: center !important; color: white; font-size: 14px; font-weight: 800; box-shadow: 0 3px 10px rgba(0,104,51,0.35); }
        .tc-name { font-size: 14px; font-weight: 700; color: white; margin: 0; }
        .tc-role { font-size: 12px; color: rgba(255,255,255,0.45); margin: 0; }
      `}</style>
    </div>
  );
}
