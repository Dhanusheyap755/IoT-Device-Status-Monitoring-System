import React from 'react';
import { InfoIcon, AlertTriangleIcon, XCircleIcon } from './Icons';

export default function AlertBadge({ severity = 'Info', size = 'sm' }) {
  const normalized = severity || 'Info';

  const config = {
    Info: {
      bg: 'bg-blue-50 text-blue-700 border-blue-200',
      icon: <InfoIcon size={14} className="text-blue-600" />,
    },
    Warning: {
      bg: 'bg-amber-50 text-amber-800 border-amber-200',
      icon: <AlertTriangleIcon size={14} className="text-amber-600" />,
    },
    Error: {
      bg: 'bg-rose-50 text-rose-700 border-rose-200',
      icon: <XCircleIcon size={14} className="text-rose-600" />,
    },
    Critical: {
      bg: 'bg-red-100 text-red-900 border-red-300 font-bold',
      icon: <XCircleIcon size={14} className="text-red-700" />,
    },
  }[normalized] || {
    bg: 'bg-gray-100 text-gray-700 border-gray-200',
    icon: <InfoIcon size={14} />,
  };

  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${config.bg}`}
    >
      {config.icon}
      <span>{normalized}</span>
    </span>
  );
}
