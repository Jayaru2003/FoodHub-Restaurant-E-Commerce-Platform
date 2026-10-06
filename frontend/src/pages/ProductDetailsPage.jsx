import { useCallback } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getProductById } from '../services/productService';
import useAsync from '../hooks/useAsync';
import LoadingState from '../components/LoadingState';
import ErrorState from '../components/ErrorState';

export default function ProductDetailsPage() {
  const { id } = useParams();
  const loadProduct = useCallback(() => getProductById(id), [id]);
  const { data: product, isLoading, error, retry } = useAsync(loadProduct);

  if (isLoading) return <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8"><LoadingState /></section>;
  if (error) return <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8"><ErrorState message="We could not find that dish." onRetry={retry} /></section>;

  return (
    <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <Link to="/products" className="text-sm font-bold text-brand-600 hover:text-brand-700">← Back to menu</Link>
      <div className="mt-8 grid overflow-hidden rounded-[2rem] bg-white shadow-soft md:grid-cols-2">
        <div className="aspect-square bg-orange-50">
          {product.imageUrl ? <img src={product.imageUrl} alt={product.name} className="h-full w-full object-cover" /> : <div className="grid h-full place-items-center text-8xl">🍽️</div>}
        </div>
        <div className="flex flex-col justify-center p-7 sm:p-10">
          <p className="font-bold uppercase tracking-[0.2em] text-brand-600">{product.category?.name || 'FoodHub favourite'}</p>
          <h1 className="mt-3 text-4xl font-extrabold text-ink">{product.name}</h1>
          <p className="mt-5 leading-7 text-slate-600">{product.description || 'Prepared fresh by the FoodHub kitchen.'}</p>
          <p className="mt-8 text-3xl font-extrabold text-brand-600">${Number(product.price).toFixed(2)}</p>
          <p className="mt-2 text-sm text-slate-500">{product.available ? 'Available today' : 'Currently unavailable'}</p>
          <button disabled className="mt-8 cursor-not-allowed rounded-2xl bg-slate-100 px-5 py-3.5 font-bold text-slate-400">Add to cart (coming soon)</button>
        </div>
      </div>
    </section>
  );
}
