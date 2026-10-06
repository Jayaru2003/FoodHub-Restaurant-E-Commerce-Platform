import { useEffect, useState, useRef, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getProducts } from '../services/productService';
import ProductGrid from '../components/ProductGrid';
import ProductFilters from '../components/ProductFilters';
import Pagination from '../components/Pagination';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import EmptyState from '../components/EmptyState';

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Extract query parameters from URL with defaults
  const page = parseInt(searchParams.get('page') || '0', 10);
  const size = parseInt(searchParams.get('size') || '12', 10);
  const searchParam = searchParams.get('search') || '';
  const categoryIdParam = searchParams.get('categoryId') || '';
  const availableParam = searchParams.get('available') || '';
  const sortByParam = searchParams.get('sortBy') || 'name';
  const directionParam = searchParams.get('direction') || 'asc';

  // Local state for immediate typing response in search box
  const [searchInput, setSearchInput] = useState(searchParam);

  // Sync searchInput when URL search parameter changes externally
  useEffect(() => {
    setSearchInput(searchParam);
  }, [searchParam]);

  // Data fetching state
  const [pageData, setPageData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to update URL search parameters helper
  const updateParams = useCallback((newParams) => {
    setSearchParams((prev) => {
      const updated = new URLSearchParams(prev);
      Object.keys(newParams).forEach((key) => {
        const val = newParams[key];
        if (val === undefined || val === null || val === '') {
          updated.delete(key);
        } else {
          updated.set(key, String(val));
        }
      });
      return updated;
    }, { replace: true });
  }, [setSearchParams]);

  // Debounced search effect
  const isFirstRender = useRef(true);
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const timer = setTimeout(() => {
      if (searchInput !== searchParam) {
        updateParams({ search: searchInput, page: 0 });
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchInput, searchParam, updateParams]);

  // Fetch products from backend when query params change
  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const params = {
        page,
        size,
        search: searchParam,
        categoryId: categoryIdParam,
        available: availableParam,
        sortBy: sortByParam,
        direction: directionParam
      };

      const data = await getProducts(params);
      setPageData(data);
    } catch (err) {
      // Do not expose stack traces or backend internals
      setError('We were unable to load the menu right now. Please verify your connection or try again later.');
    } finally {
      setIsLoading(false);
    }
  }, [page, size, searchParam, categoryIdParam, availableParam, sortByParam, directionParam]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Handler functions for filter changes
  const handleCategoryChange = (catId) => {
    updateParams({ categoryId: catId, page: 0 });
  };

  const handleAvailableChange = (availVal) => {
    updateParams({ available: availVal, page: 0 });
  };

  const handleSortChange = ({ sortBy, direction }) => {
    updateParams({ sortBy, direction, page: 0 });
  };

  const handlePageChange = (newPage) => {
    updateParams({ page: newPage });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePageSizeChange = (newSize) => {
    updateParams({ size: newSize, page: 0 });
  };

  const handleResetFilters = () => {
    setSearchInput('');
    setSearchParams(new URLSearchParams(), { replace: true });
  };

  const products = pageData?.content || [];
  const totalPages = pageData?.totalPages || 0;
  const totalElements = pageData?.totalElements || 0;

  return (
    <div className="bg-slate-50/50 min-h-screen py-10">
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header section */}
        <div className="mb-8">
          <p className="font-bold uppercase tracking-[0.2em] text-brand-600">Explore Our Menu</p>
          <h1 className="mt-2 text-3xl font-extrabold text-slate-900 sm:text-4xl lg:text-5xl">
            Delicious Food Delivered To You
          </h1>
          <p className="mt-3 max-w-2xl text-base text-slate-600">
            Browse our wide selection of freshly prepared dishes. Filter by category, availability, or price to find your perfect meal.
          </p>
        </div>

        {/* Filter Controls */}
        <div className="mb-8">
          <ProductFilters
            search={searchInput}
            onSearchChange={setSearchInput}
            categoryId={categoryIdParam}
            onCategoryChange={handleCategoryChange}
            available={availableParam}
            onAvailableChange={handleAvailableChange}
            sortBy={sortByParam}
            direction={directionParam}
            onSortChange={handleSortChange}
            onReset={handleResetFilters}
          />
        </div>

        {/* Dynamic Content States */}
        {isLoading ? (
          <LoadingSpinner label="Fetching fresh products from FoodHub..." />
        ) : error ? (
          <ErrorMessage message={error} onRetry={fetchProducts} />
        ) : products.length === 0 ? (
          <EmptyState onReset={handleResetFilters} />
        ) : (
          <>
            <ProductGrid products={products} />
            <Pagination
              page={page}
              totalPages={totalPages}
              totalElements={totalElements}
              size={size}
              onPageChange={handlePageChange}
              onSizeChange={handlePageSizeChange}
            />
          </>
        )}
      </section>
    </div>
  );
}
