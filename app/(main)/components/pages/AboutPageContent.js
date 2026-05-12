'use client';

import Image from 'next/image';
import { Target, Eye, Heart, Award } from 'lucide-react';
import PageBanner from '../ui/PageBanner';
import SectionHeading from '../ui/SectionHeading';

export default function AboutPageContent() {
  return (
    <>
      <PageBanner title="About Us" breadcrumbs={[{ label: 'About Us' }]} />
      <AboutContent />
      <Management />
      <ChairmanMessage />
      <MissionVision />
    </>
  );
}

function AboutContent() {
  return (
    <section className="about-sec">
      <div className="container about-grid">
        <div className="about-text-col">
          <SectionHeading title="About Us" />
          <p>Saviour Group has a penchant for crafting dreams and desires into reality. It has emerged as one of the prominent entities in the real estate sector and is into residential, commercial and township projects in NCR.</p>
          <p>From building small residential projects to creating multi-dimensional mega townships, the Saviour Group has done it all with complete dedication to reach higher and build better. The group has proved its mettle by delivering some prestigious projects like SPS Residency (Indirapuram), SPS Heights (Indirapuram), Euro Apartments (Sahibabad), SPS Commercial (Indirapuram).</p>
          <p>A team of eminent architects, engineers, planners and business associates have taken the group to an all-time high and, have motivated it to create masterpieces in reality. The group is forging ahead with projects like Saviour Greenisle (Crossings-Republik), Saviour Park (Mohan Nagar, Ghaziabad), Gaur City-1 &amp; 2, Saviour Street &amp; Greenarch at (Greater Noida-West/Noida Extension).</p>
          <p>The recent proud offering by the group is Gaur Yamuna City, a township in 250 acres, as a development partner with Gaursons on Yamuna Expressway.</p>
          <p>We at Saviour, are building homes based on trust and you are invited to build your future with us. We help you live your dream of living in style.</p>
          <div className="stats-row">
            {[
              { num: '25+', label: 'Years Experience' },
              { num: '10K+', label: 'Happy Families' },
              { num: '20+', label: 'Projects Delivered' },
              { num: '30K+', label: 'Monthly Visitors' },
            ].map((s) => (
              <div key={s.label} className="stat-item">
                <span className="stat-num">{s.num}</span>
                <span className="stat-label">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="about-img-col">
          <Image src="https://saviourgroup.in/wp-content/uploads/2025/05/about.png" alt="About Saviour Group" fill className="about-img" sizes="(max-width: 1024px) 100vw, 50vw" />
        </div>
      </div>
      <style jsx global>{`
        .about-sec { padding: 80px 0; background: white; }
        .about-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 64px; align-items: start; }
        .about-text-col p { font-size: 15px; color: #555; line-height: 1.8; margin-bottom: 16px; }
        .stats-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-top: 32px; padding-top: 32px; border-top: 2px solid #f0f0f0; }
        .stat-item { text-align: center; padding: 16px 8px; border-radius: 8px; background: #f8f9fa; }
        .stat-num { display: block; font-size: 28px; font-weight: 900; color: #e67e22; line-height: 1; margin-bottom: 6px; }
        .stat-label { font-size: 12px; color: #666; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600; }
        .about-img-col { position: relative; height: 540px; border-radius: 12px; overflow: hidden; box-shadow: 0 16px 48px rgba(0,0,0,0.12); }
        .about-img { object-fit: cover; }
        @media (max-width: 1024px) { .about-grid { grid-template-columns: 1fr; gap: 40px; } .about-img-col { height: 360px; } .stats-row { grid-template-columns: repeat(2, 1fr); } }
      `}</style>
    </section>
  );
}

function Management() {
  const team = [
    { name: 'Mr. Rajesh Kumar', role: 'Chairman & Managing Director', image: 'https://saviourgroup.in/wp-content/uploads/2025/05/about.png' },
    { name: 'Mr. Suresh Sharma', role: 'Director – Operations', image: 'https://saviourgroup.in/wp-content/uploads/2025/05/about.png' },
    { name: 'Mr. Anil Gupta', role: 'Director – Finance', image: 'https://saviourgroup.in/wp-content/uploads/2025/05/about.png' },
  ];
  return (
    <section className="mgmt-sec">
      <div className="container">
        <SectionHeading title="Management" centered />
        <div className="mgmt-grid">
          {team.map((m) => (
            <div key={m.name} className="mgmt-card">
              <div className="mgmt-img-wrap">
                <Image src={m.image} alt={m.name} fill className="mgmt-img" sizes="(max-width: 768px) 100vw, 33vw" />
              </div>
              <div className="mgmt-body">
                <h3 className="mgmt-name">{m.name}</h3>
                <p className="mgmt-role">{m.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <style jsx global>{`
        .mgmt-sec { padding: 80px 0; background: #f8f9fa; }
        .mgmt-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 32px; }
        .mgmt-card { background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.08); transition: all 0.3s ease; }
        .mgmt-card:hover { transform: translateY(-6px); box-shadow: 0 12px 40px rgba(0,0,0,0.15); }
        .mgmt-img-wrap { position: relative; height: 300px; overflow: hidden; }
        .mgmt-img { object-fit: cover; }
        .mgmt-body { padding: 20px; text-align: center; border-top: 3px solid #e67e22; }
        .mgmt-name { font-size: 18px; font-weight: 700; color: #2c3e50; margin-bottom: 6px; }
        .mgmt-role { font-size: 13px; color: #e67e22; font-weight: 600; text-transform: uppercase; letter-spacing: 0.3px; }
        @media (max-width: 1024px) { .mgmt-grid { grid-template-columns: 1fr 1fr; } }
        @media (max-width: 640px) { .mgmt-grid { grid-template-columns: 1fr; } }
      `}</style>
    </section>
  );
}

function ChairmanMessage() {
  return (
    <section className="chairman-sec">
      <div className="container chairman-inner">
        <div className="chairman-img-wrap">
          <Image src="https://saviourgroup.in/wp-content/uploads/2025/05/about.png" alt="Chairman's Message" fill className="chairman-img" sizes="(max-width: 1024px) 100vw, 40vw" />
          <div className="quote-mark">&ldquo;</div>
        </div>
        <div className="chairman-content">
          <SectionHeading title="Chairman's Message" />
          <p className="chairman-quote">&ldquo;At Saviour Group, we believe that every home we build is a testament to our commitment to quality, integrity, and innovation. Our journey began with a simple vision — to create spaces that not only meet the needs of today but also stand the test of time.&rdquo;</p>
          <p>Over the past two-and-a-half decades, we have built more than just structures — we have built communities, nurtured trust, and fulfilled the dreams of thousands of families across Delhi-NCR.</p>
          <p>As we move forward, we remain committed to pushing the boundaries of real estate development, embracing sustainable practices, and delivering projects that are a source of pride for all stakeholders.</p>
          <div className="chairman-sig">
            <strong>Mr. Rajesh Kumar</strong>
            <span>Chairman &amp; Managing Director, Saviour Group</span>
          </div>
        </div>
      </div>
      <style jsx global>{`
        .chairman-sec { padding: 80px 0; background: white; }
        .chairman-inner { display: grid; grid-template-columns: 0.8fr 1.2fr; gap: 64px; align-items: start; }
        .chairman-img-wrap { position: relative; height: 440px; border-radius: 12px; overflow: hidden; box-shadow: 0 16px 48px rgba(0,0,0,0.12); }
        .chairman-img { object-fit: cover; }
        .quote-mark { position: absolute; top: -10px; left: 16px; font-size: 120px; color: #e67e22; opacity: 0.15; font-family: Georgia, serif; line-height: 1; }
        .chairman-quote { font-size: 17px; color: #2c3e50; font-style: italic; font-weight: 600; line-height: 1.8; border-left: 4px solid #e67e22; padding-left: 20px; margin-bottom: 20px; }
        .chairman-content p { font-size: 15px; color: #555; line-height: 1.8; margin-bottom: 16px; }
        .chairman-sig { margin-top: 24px; display: flex; flex-direction: column; gap: 4px; padding-top: 16px; border-top: 2px solid #f0f0f0; }
        .chairman-sig strong { font-size: 17px; color: #2c3e50; }
        .chairman-sig span { font-size: 13px; color: #e67e22; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600; }
        @media (max-width: 1024px) { .chairman-inner { grid-template-columns: 1fr; gap: 40px; } .chairman-img-wrap { height: 320px; } }
      `}</style>
    </section>
  );
}

function MissionVision() {
  const items = [
    { icon: <Target size={40} />, title: 'Our Mission', desc: 'To deliver world-class real estate projects with unwavering commitment to quality, transparency, and timely delivery while building lasting relationships with our customers.' },
    { icon: <Eye size={40} />, title: 'Our Vision', desc: 'To be the most trusted and preferred real estate brand in India, known for innovation, integrity, and creating sustainable communities for generations.' },
    { icon: <Heart size={40} />, title: 'Our Motto', desc: 'Building homes based on trust — we invite you to build your future with us and help you live your dream of living in style.' },
    { icon: <Award size={40} />, title: 'Our Values', desc: 'Quality, Integrity, Customer-First, Innovation, and Sustainability are the core values that drive every decision we make at Saviour Group.' },
  ];
  return (
    <section className="mvv-sec">
      <div className="container">
        <SectionHeading title="Mission, Vision & Motto" centered />
        <div className="mvv-grid">
          {items.map((item) => (
            <div key={item.title} className="mvv-card">
              <div className="mvv-icon">{item.icon}</div>
              <h3 className="mvv-title">{item.title}</h3>
              <p className="mvv-desc">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
      <style jsx global>{`
        .mvv-sec { padding: 80px 0; background: #f8f9fa; }
        .mvv-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px; }
        .mvv-card { background: white; border-radius: 12px; padding: 32px 24px; text-align: center; box-shadow: 0 4px 20px rgba(0,0,0,0.06); transition: all 0.3s ease; border-top: 4px solid transparent; }
        .mvv-card:hover { border-top-color: #e67e22; transform: translateY(-6px); box-shadow: 0 12px 40px rgba(0,0,0,0.12); }
        .mvv-icon { display: inline-flex; align-items: center; justify-content: center; width: 80px; height: 80px; background: linear-gradient(135deg, rgba(230,126,34,0.12), rgba(211,84,0,0.06)); border-radius: 50%; color: #e67e22; margin-bottom: 20px; }
        .mvv-title { font-size: 18px; font-weight: 700; color: #2c3e50; margin-bottom: 12px; }
        .mvv-desc { font-size: 14px; color: #666; line-height: 1.7; }
        @media (max-width: 1024px) { .mvv-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 640px) { .mvv-grid { grid-template-columns: 1fr; } }
      `}</style>
    </section>
  );
}
