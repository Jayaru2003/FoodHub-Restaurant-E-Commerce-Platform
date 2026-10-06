import { useCallback, useState } from 'react';
import { getProducts } from '../services/productService';
import useAsync from '../hooks/useAsync';
import ProductCard from '../components/ProductCard';
import LoadingState from '../components/LoadingState';
import ErrorState from '../components/ErrorState';

export default function ProductsPage() {
  const [search, setSearch] = useState('');
  const loadProducts = useCallback(() => getProducts(search ? { search } : {}), [search]);
  const { data, isLoading, error, retry } = useAsync(loadProducts, { content: [] });

  function handleSearch(event) {
    event.preventDefault();
    retry();
  }

  const products = data?.content || [];

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <div>
          <p className="font-bold uppercase tracking-[0.2em] text-brand-600">Our menu</p>
          <h1 className="mt-3 text-4xl font-extrabold text-ink">Find your next favourite</h1>
          <p className="mt-3 max-w-xl text-slate-500">Browse the dishes currently available from the FoodHub kitchen.</p>
        </div>
        <form onSubmit={handleSearch} className="flex w-full max-w-md gap-2">
          <label htmlFor="product-search" className="sr-only">Search menu</label>
          <input id="product-search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search the menu..." className="min-w-0 flex-1 rounded-2xl border border-orange-100 bg-white px-4 py-3 text-sm outline-none ring-brand-200 focus:ring-2" />
          <button className="rounded-2xl bg-brand-600 px-5 py-3 text-sm font-bold text-white hover:bg-brand-700">Search</button>
        </form>
      </div>
      <div className="mt-10">
        {isLoading && <LoadingState />}
        {error && <ErrorState message="We could not load the menu. Check that the Spring Boot API is running." onRetry={retry} />}
        {!isLoading && !error && products.length === 0 && <div className="rounded-3xl bg-white p-12 text-center text-slate-500 shadow-soft">No dishes found.</div>}
        {!isLoading && !error && products.length > 0 && <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">{products.map((product) => <ProductCard key={product.id} product={product} />)}</div>}
      </div>
    </section>
  );
}
