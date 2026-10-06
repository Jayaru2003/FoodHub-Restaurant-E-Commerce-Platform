import React from 'react';

/**
 * DeleteConfirmation Component
 * Reusable modal for asking user confirmation before deleting a product, category, or other resource.
 */
export default function DeleteConfirmation({
  isOpen,
  title = 'Delete Item',
  productName = '',
  itemName = '',
  confirmLabel = null,
  message = null,
  onConfirm,
  onCancel,
  deleting = false,
}) {
  if (!isOpen) return null;

  const displayName = itemName || productName;
  const buttonText = confirmLabel || (title.startsWith('Delete') ? title : `Delete`);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs animate-fadeIn">
      <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl transition-all">
        
        {/* Warning Icon */}
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-rose-100 text-rose-600 mb-4">
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </div>

        <div className="text-center">
          <h3 className="text-lg font-extrabold text-slate-900">{title}</h3>
          <p className="mt-2 text-xs font-medium text-slate-500">
            {message ? message : (
              <>
                Are you sure you want to delete <span className="font-bold text-slate-800">"{displayName}"</span>? This action cannot be undone.
              </>
            )}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={deleting}
            className="w-full sm:w-auto rounded-xl border border-slate-300 px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={deleting}
            className="w-full sm:w-auto rounded-xl bg-rose-600 px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-rose-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {deleting && (
              <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
            )}
            {deleting ? 'Deleting...' : buttonText}
          </button>
        </div>
      </div>
    </div>
  );
}
