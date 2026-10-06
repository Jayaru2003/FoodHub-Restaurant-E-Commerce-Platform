import LoadingState from './LoadingState';

/**
 * LoadingSpinner – displays a modern animated spinner with customizable loading text.
 * Reuses or wraps LoadingState for consistent design across the app.
 */
export default function LoadingSpinner({ label = 'Loading delicious dishes...' }) {
  return <LoadingState label={label} />;
}

export { LoadingState };
