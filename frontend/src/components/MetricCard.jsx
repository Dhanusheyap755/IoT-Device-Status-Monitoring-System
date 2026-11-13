import React from 'react';

export default function MetricCard({
  title,
  value,
  subtext,
  icon,
  trend,
  colorScheme = 'blue',
  onClick,
}) {
  const schemes = {
    blue: 'border-blue-100 hover:border-blue-300 bg-white text-blue-900',
    green: 'border-emerald-100 hover:border-emerald-300 bg-white text-emerald-900',
    amber: 'border-amber-100 hover:border-amber-300 bg-white text-amber-900',
    rose: 'border-rose-100 hover:border-rose-300 bg-white text-rose-900',
    purple: 'border-indigo-100 hover:border-indigo-300 bg-white text-indigo-900',
  };

  const iconBgs = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-emerald-50 text-emerald-600',
    amber: 'bg-amber-50 text-amber-600',
    rose: 'bg-rose-50 text-rose-600',
    purple: 'bg-indigo-50 text-indigo-600',
  };

  return (
    <div
      onClick={onClick}
      className={`relative p-5 rounded-xl border shadow-sm transition-all duration-200 ${
        schemes[colorScheme] || schemes.blue
      } ${onClick ? 'cursor-pointer hover:shadow-md' : ''}`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{title}</p>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-bold tracking-tight text-gray-900">{value}</span>
            {trend && <span className="text-xs font-medium text-gray-500">{trend}</span>}
          </div>
        </div>
        {icon && (
          <div className={`p-3 rounded-lg ${iconBgs[colorScheme] || iconBgs.blue}`}>
            {icon}
          </div>
        )}
      </div>
      {subtext && <p className="mt-2 text-xs text-gray-500">{subtext}</p>}
    </div>
  );
}
