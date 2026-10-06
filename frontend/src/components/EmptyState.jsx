/**
 * EmptyState – displayed when no products match the current search or filters.
 *
 * Props:
 *   title {string}
 *   description {string}
 *   onReset {function}
 */
export default function EmptyState({
  title = 'No dishes found',
  description = 'We could not find any menu items matching your search or filters. Try adjusting your criteria.',
  onReset
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-200 bg-white p-12 text-center shadow-soft">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-50 text-3xl">
        🔍
      </div>
      <h3 className="text-xl font-bold text-slate-800">{title}</h3>
      <p className="mt-2 max-w-md text-sm text-slate-500">{description}</p>
      {onReset && (
        <button
          type="button"
          onClick={onReset}
          className="mt-6 rounded-2xl bg-brand-600 px-6 py-3 text-sm font-bold text-white shadow-brand transition hover:bg-brand-700"
        >
          Reset All Filters
        </button>
      )}
    </div>
  );
}
