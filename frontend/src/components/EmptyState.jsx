import React from 'react';

/**
 * EmptyState Component
 * Displays a friendly empty placeholder when no items/products are found.
 *
 * Props:
 *   title {string}
 *   description {string}
 *   message {string} - alias for description
 *   onReset {function}
 *   actionLabel {string}
 *   onAction {function}
 */
export default function EmptyState({
  title = 'No dishes found',
  description,
  message = 'We could not find any menu items matching your search or filters. Try adjusting your criteria.',
  onReset,
  actionLabel,
  onAction,
}) {
  const displayMsg = description || message;
  const handleButtonClick = onAction || onReset;
  const buttonText = actionLabel || (onReset ? 'Reset All Filters' : 'Action');

  return (
    <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-200 bg-white p-12 text-center shadow-soft">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-50 text-3xl">
        🔍
      </div>
      <h3 className="text-xl font-bold text-slate-800">{title}</h3>
      <p className="mt-2 max-w-md text-sm text-slate-500">{displayMsg}</p>
      {handleButtonClick && (
        <button
          type="button"
          onClick={handleButtonClick}
          className="mt-6 rounded-2xl bg-orange-600 px-6 py-3 text-sm font-bold text-white shadow-md transition hover:bg-orange-700"
        >
          {buttonText}
        </button>
      )}
    </div>
  );
}
