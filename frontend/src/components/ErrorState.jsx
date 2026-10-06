export default function ErrorState({ message = 'We could not load this right now.', onRetry }) {
  return (
    <div className="rounded-3xl border border-red-100 bg-red-50 p-8 text-center">
      <p className="font-semibold text-red-800">{message}</p>
      {onRetry && (
        <button onClick={onRetry} className="mt-4 rounded-xl bg-red-700 px-4 py-2 text-sm font-bold text-white hover:bg-red-800">
          Try again
        </button>
      )}
    </div>
  );
}
