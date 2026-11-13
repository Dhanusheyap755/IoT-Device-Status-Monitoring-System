import React from 'react';

export default function StatusPill({ state, size = 'md' }) {
  const normalized = state || 'Registered';

  const config = {
    Active: {
      bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      dot: 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]',
      label: 'Active',
    },
    Registered: {
      bg: 'bg-amber-50 text-amber-700 border-amber-200',
      dot: 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]',
      label: 'Registered (q0)',
    },
    Disconnected: {
      bg: 'bg-rose-50 text-rose-700 border-rose-200',
      dot: 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.5)]',
      label: 'Disconnected',
    },
  }[normalized] || {
    bg: 'bg-gray-100 text-gray-700 border-gray-200',
    dot: 'bg-gray-400',
    label: normalized,
  };

  const sizeClass = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-xs font-semibold';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border ${config.bg} ${sizeClass} transition-colors tracking-wide`}
    >
      <span className={`w-2 h-2 rounded-full ${config.dot} animate-pulse`} />
      {config.label}
    </span>
  );
}
