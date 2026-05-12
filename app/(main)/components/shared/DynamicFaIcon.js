'use client';

import * as FaIcons from 'react-icons/fa';

/**
 * Renders a react-icons/fa icon by name, e.g. FaFacebook, FaPhone, FaEnvelope.
 */
export default function DynamicFaIcon({ name, size = 15, className = '', style = {} }) {
  if (!name || typeof name !== 'string') return null;
  const key = name.trim().replace(/^Fa/i, '') === name && !name.startsWith('Fa') ? `Fa${name}` : name;
  const Icon = FaIcons[key] || FaIcons[name] || FaIcons.FaLink;
  return <Icon size={size} className={className} style={style} aria-hidden />;
}
