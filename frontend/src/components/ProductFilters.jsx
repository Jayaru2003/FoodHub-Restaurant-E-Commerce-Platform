import { useEffect, useState } from 'react';
import { getCategories } from '../services/productService';

/**
 * ProductFilters – controls for searching, filtering by category, availability, sorting, and resetting.
 *
 * Props:
 *   search {string}
 *   onSearchChange {function(val)}
 *   categoryId {string|number}
 *   onCategoryChange {function(val)}
 *   available {boolean|string}
 *   onAvailableChange {function(val)}
 *   sortBy {string}
 *   direction {string}
 *   onSortChange {function({ sortBy, direction })}
 *   onReset {function()}
 */
export default function ProductFilters({
  search,
  onSearchChange,
  categoryId,
  onCategoryChange,
  available,
  onAvailableChange,
  sortBy,
  direction,
  onSortChange,
  onReset
}) {
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    setCategoriesLoading(true);
    getCategories()
      .then((data) => {
        if (isMounted) setCategories(data || []);
      })
      .catch(() => {
        // Silent fallback for categories list error
      })
      .finally(() => {
        if (isMounted) setCategoriesLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Determine current sort option key
  const sortKey = `${sortBy}_${direction}`;

  const handleSortSelect = (e) => {
    const val = e.target.value;
    if (val === 'price_asc') onSortChange({ sortBy: 'price', direction: 'asc' });
    else if (val === 'price_desc') onSortChange({ sortBy: 'price', direction: 'desc' });
    else if (val === 'name_desc') onSortChange({ sortBy: 'name', direction: 'desc' });
    else onSortChange({ sortBy: 'name', direction: 'asc' });
  };

  const hasActiveFilters =
    search ||
    categoryId ||
    (available !== undefined && available !== null && available !== '') ||
    sortBy !== 'name' ||
    direction !== 'asc';

  return (
    <div className="rounded-3xl border border-slate-100 bg-white p-5 shadow-soft md:p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        {/* Search Bar */}
        <div className="relative min-w-0 flex-1">
          <label htmlFor="product-search-input" className="sr-only">
            Search food
          </label>
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            id="product-search-input"
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search burgers, pizza, pasta..."
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-brand-500 focus:bg-white focus:ring-2 focus:ring-brand-200"
          />
          {search && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600"
              aria-label="Clear search"
            >
              ✕
            </button>
          )}
        </div>

        {/* Filters Group */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Category Dropdown */}
          <div className="min-w-[140px] flex-1 sm:flex-none">
            <label htmlFor="category-select" className="sr-only">
              Filter by Category
            </label>
            <select
              id="category-select"
              value={categoryId || ''}
              onChange={(e) => onCategoryChange(e.target.value)}
              disabled={categoriesLoading}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 outline-none transition hover:bg-slate-100 focus:border-brand-500 focus:ring-2 focus:ring-brand-200"
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Availability Toggle */}
          <div className="flex items-center rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
            <label htmlFor="available-checkbox" className="flex cursor-pointer items-center gap-2 text-sm font-medium text-slate-700 select-none">
              <input
                id="available-checkbox"
                type="checkbox"
                checked={available === true || available === 'true'}
                onChange={(e) => onAvailableChange(e.target.checked ? 'true' : '')}
                className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
              />
              Available Only
            </label>
          </div>

          {/* Sort Selector */}
          <div className="min-w-[150px] flex-1 sm:flex-none">
            <label htmlFor="sort-select" className="sr-only">
              Sort By
            </label>
            <select
              id="sort-select"
              value={sortKey}
              onChange={handleSortSelect}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 outline-none transition hover:bg-slate-100 focus:border-brand-500 focus:ring-2 focus:ring-brand-200"
            >
              <option value="name_asc">Name: A to Z</option>
              <option value="name_desc">Name: Z to A</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
            </select>
          </div>

          {/* Reset Button */}
          {hasActiveFilters && (
            <button
              type="button"
              onClick={onReset}
              className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-100 hover:text-red-700"
            >
              Reset
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
