'use client';
import { useState } from 'react';

const POPULAR_ICONS = [
  // Facilities & amenities
  'FaSwimmingPool','FaDumbbell','FaParking','FaLeaf','FaShieldAlt','FaWifi','FaTv',
  'FaUtensils','FaSpa','FaHotTub','FaTree','FaChild','FaBicycle','FaCar','FaBus',
  'FaGamepad','FaMusic','FaFilm','FaBook','FaMedkit','FaFire','FaSnowflake',
  'FaBolt','FaWater','FaHome','FaBuilding','FaStar','FaCheck','FaPlus',
  // Specifications
  'MdFloorPlan','MdBalcony','MdKitchen','MdBathtub','MdBed','MdDoorFront',
  'MdSecurity','MdElevator','MdAir','MdLocalParking','MdGarden','MdPower',
  'MdWater','MdFitnessCenter','MdPool','MdSportsTennis','MdDirectionsBike',
  // General
  'FaRulerCombined','FaCog','FaTools','FaLightbulb','FaMapMarkerAlt','FaPhone',
  'FaEnvelope','FaCertificate','FaAward','FaTrophy','FaHandshake',
];

export default function IconPicker({ value, onChange }) {
  const [search, setSearch] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const filtered = POPULAR_ICONS.filter((icon) =>
    icon.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="picker-wrap">
      <div className="picker-display" onClick={() => setIsOpen(!isOpen)}>
        <code className="icon-value">{value || 'Select icon'}</code>
        <span className="picker-arrow">{isOpen ? '▲' : '▼'}</span>
      </div>

      {isOpen && (
        <div className="picker-dropdown">
          <div className="picker-search">
            <input
              type="text"
              placeholder="Search icons..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              autoFocus
            />
          </div>
          <div className="icon-grid">
            {filtered.map((icon) => (
              <button
                key={icon}
                type="button"
                className={`icon-btn ${value === icon ? 'selected' : ''}`}
                onClick={() => { onChange(icon); setIsOpen(false); }}
                title={icon}
              >
                <span className="icon-name">{icon.replace(/^(Fa|Md|Bi|Gi|Ri|Ai|Fi)/, '')}</span>
              </button>
            ))}
          </div>
          {filtered.length === 0 && (
            <p className="no-icons">No icons found. Type exact icon name below.</p>
          )}
          <div className="manual-input">
            <input
              type="text"
              placeholder="Or type exact icon name (e.g. FaHome)"
              value={value || ''}
              onChange={(e) => onChange(e.target.value)}
            />
          </div>
        </div>
      )}

      <style jsx global>{`
        .picker-wrap { position: relative; }
        .picker-display {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 8px 12px;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          cursor: pointer;
          background: white;
          transition: border-color 0.2s;
        }
        .picker-display:hover { border-color: #006833; }
        .icon-value { font-family: monospace; font-size: 13px; color: #374151; }
        .picker-arrow { font-size: 10px; color: #9ca3af; }
        .picker-dropdown {
          position: absolute;
          top: calc(100% + 4px);
          left: 0;
          right: 0;
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          box-shadow: 0 8px 24px rgba(0,0,0,0.12);
          z-index: 50;
          overflow: hidden;
        }
        .picker-search { padding: 10px; border-bottom: 1px solid #f3f4f6; }
        .picker-search input {
          width: 100%;
          padding: 6px 10px;
          border: 1px solid #e5e7eb;
          border-radius: 6px;
          font-size: 13px;
          outline: none;
        }
        .picker-search input:focus { border-color: #006833; }
        .icon-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(90px, 1fr));
          gap: 4px;
          padding: 8px;
          max-height: 200px;
          overflow-y: auto;
        }
        .icon-btn {
          padding: 6px 4px;
          border: 1px solid #e5e7eb;
          border-radius: 6px;
          background: white;
          cursor: pointer;
          font-size: 10px;
          color: #6b7280;
          text-align: center;
          transition: all 0.15s;
          word-break: break-all;
          line-height: 1.2;
        }
        .icon-btn:hover { border-color: #006833; color: #006833; background: #e8f5ef; }
        .icon-btn.selected { border-color: #006833; background: #006833; color: white; }
        .icon-name { font-size: 10px; }
        .no-icons { padding: 12px; text-align: center; color: #9ca3af; font-size: 13px; }
        .manual-input { padding: 10px; border-top: 1px solid #f3f4f6; }
        .manual-input input {
          width: 100%;
          padding: 6px 10px;
          border: 1px solid #e5e7eb;
          border-radius: 6px;
          font-size: 13px;
          outline: none;
        }
        .manual-input input:focus { border-color: #006833; }
      `}</style>
    </div>
  );
}
