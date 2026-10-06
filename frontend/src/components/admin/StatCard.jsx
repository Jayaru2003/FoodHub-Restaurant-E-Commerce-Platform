import React from 'react';

/**
 * StatCard Component
 * Displays summary metrics on the Admin Dashboard.
 */
export default function StatCard({ title, value, icon, description, badgeText, badgeColor = 'bg-slate-100 text-slate-700' }) {
  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition hover:shadow-md">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
          {title}
        </span>
        {icon && (
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
            {icon}
          </div>
        )}
      </div>

      <div className="mt-3 flex items-baseline justify-between">
        <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
          {value}
        </span>
        {badgeText && (
          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${badgeColor}`}>
            {badgeText}
          </span>
        )}
      </div>

      {description && (
        <p className="mt-2 text-xs font-medium text-slate-500">
          {description}
        </p>
      )}
    </div>
  );
}
