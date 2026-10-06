import ErrorState from './ErrorState';

/**
 * ErrorMessage – user-friendly error alert component with optional dismiss callback.
 */
export default function ErrorMessage({
  message = 'We encountered an error. Please try again.',
  onRetry,
  onDismiss,
}) {
  if (onDismiss) {
    return (
      <div className="relative mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 pl-5 text-left text-sm text-red-800 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <span className="text-lg" aria-hidden="true">⚠️</span>
            <div>
              <p className="font-semibold text-red-900">{message}</p>
              {onRetry && (
                <button
                  type="button"
                  onClick={onRetry}
                  className="mt-2 rounded-lg bg-red-700 px-3 py-1 text-xs font-bold text-white hover:bg-red-800"
                >
                  Try again
                </button>
              )}
            </div>
          </div>
          <button
            type="button"
            onClick={onDismiss}
            className="rounded-lg p-1 text-red-600 hover:bg-red-100 hover:text-red-900 font-bold"
            aria-label="Dismiss error"
          >
            ✕
          </button>
        </div>
      </div>
    );
  }

  return <ErrorState message={message} onRetry={onRetry} />;
}

export { ErrorState };
