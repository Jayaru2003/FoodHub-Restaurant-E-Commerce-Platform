import React from 'react';

/**
 * LoadingState Component
 * Standard spinner component for async data loading states.
 */
export default function LoadingState({ message, label = 'Loading delicious things...' }) {
  const displayMsg = message || label;
  return (
    <div className="flex min-h-48 flex-col items-center justify-center gap-4 rounded-3xl bg-white p-8 text-center shadow-soft">
      <span className="h-9 w-9 animate-spin rounded-full border-4 border-orange-100 border-t-orange-600" />
      <p className="text-sm font-medium text-slate-500">{displayMsg}</p>
    </div>
  );
}
