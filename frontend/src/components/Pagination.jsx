/**
 * Pagination component for table / grid navigation.
 *
 * Props:
 *   page {number} - 0-indexed page index
 *   totalPages {number} - total number of pages
 *   totalElements {number} - total number of items
 *   size {number} - current page size
 *   onPageChange {function(pageNumber)}
 *   onSizeChange {function(pageSize)}
 */
export default function Pagination({
  page = 0,
  totalPages = 1,
  totalElements = 0,
  size = 12,
  onPageChange,
  onSizeChange
}) {
  if (totalPages <= 1 && totalElements <= size) {
    return null;
  }

  const currentPage = page; // 0-indexed
  const startItem = totalElements === 0 ? 0 : currentPage * size + 1;
  const endItem = Math.min((currentPage + 1) * size, totalElements);

  // Generate list of visible page numbers
  const pages = [];
  const maxButtons = 5;
  let startPage = Math.max(0, currentPage - Math.floor(maxButtons / 2));
  let endPage = Math.min(totalPages - 1, startPage + maxButtons - 1);

  if (endPage - startPage + 1 < maxButtons) {
    startPage = Math.max(0, endPage - maxButtons + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  return (
    <div className="mt-10 flex flex-col gap-4 rounded-3xl border border-slate-100 bg-white p-4 shadow-soft sm:flex-row sm:items-center sm:justify-between sm:px-6">
      {/* Item info & page size select */}
      <div className="flex flex-wrap items-center justify-between gap-4 text-xs font-medium text-slate-500 sm:text-sm">
        <span>
          Showing <strong className="text-slate-800">{startItem}</strong> -{' '}
          <strong className="text-slate-800">{endItem}</strong> of{' '}
          <strong className="text-slate-800">{totalElements}</strong> items
        </span>

        {onSizeChange && (
          <div className="flex items-center gap-2">
            <label htmlFor="page-size-select">Per page:</label>
            <select
              id="page-size-select"
              value={size}
              onChange={(e) => onSizeChange(Number(e.target.value))}
              className="rounded-xl border border-slate-200 bg-slate-50 px-2 py-1 text-xs text-slate-700 outline-none focus:border-brand-500"
            >
              <option value={6}>6</option>
              <option value={12}>12</option>
              <option value={24}>24</option>
              <option value={48}>48</option>
            </select>
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-center gap-1">
        {/* Previous Button */}
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 0}
          className="flex h-9 min-w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
          aria-label="Previous page"
        >
          ‹
        </button>

        {/* First Page Link if skipped */}
        {startPage > 0 && (
          <>
            <button
              type="button"
              onClick={() => onPageChange(0)}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50"
            >
              1
            </button>
            {startPage > 1 && <span className="px-1 text-slate-400">...</span>}
          </>
        )}

        {/* Visible Page Buttons */}
        {pages.map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => onPageChange(p)}
            className={`flex h-9 w-9 items-center justify-center rounded-xl text-xs font-bold transition ${
              p === currentPage
                ? 'bg-brand-600 text-white shadow-sm'
                : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
            }`}
          >
            {p + 1}
          </button>
        ))}

        {/* Last Page Link if skipped */}
        {endPage < totalPages - 1 && (
          <>
            {endPage < totalPages - 2 && <span className="px-1 text-slate-400">...</span>}
            <button
              type="button"
              onClick={() => onPageChange(totalPages - 1)}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50"
            >
              {totalPages}
            </button>
          </>
        )}

        {/* Next Button */}
        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages - 1}
          className="flex h-9 min-w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
          aria-label="Next page"
        >
          ›
        </button>
      </div>
    </div>
  );
}
