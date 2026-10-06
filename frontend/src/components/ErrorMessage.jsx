import ErrorState from './ErrorState';

/**
 * ErrorMessage – user-friendly error alert component. Sanitizes internal error details.
 *
 * Props:
 *   message {string} - optional error text override
 *   onRetry {function} - callback to retry action
 */
export default function ErrorMessage({
  message = 'We encountered an error while loading the product menu. Please try again.',
  onRetry
}) {
  return <ErrorState message={message} onRetry={onRetry} />;
}

export { ErrorState };
