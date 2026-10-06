import { useCallback, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getProductById } from '../services/productService';
import useAsync from '../hooks/useAsync';
import LoadingState from '../components/LoadingState';
import ErrorState from '../components/ErrorState';
import { useCart } from '../context/CartContext';

import { getProductImage, getFallbackImage } from '../utils/imageUtils';

export default function ProductDetailsPage() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const [imgSrc, setImgSrc] = useState(null);

  const loadProduct = useCallback(() => getProductById(id), [id]);
  const { data: product, isLoading, error, retry } = useAsync(loadProduct);

  const currentImg = imgSrc || (product ? getProductImage(product) : '');

  const handleImageError = () => {
    if (product) {
      const fallback = getFallbackImage(product);
      if (imgSrc !== fallback) {
        setImgSrc(fallback);
      }
    }
  };

  if (isLoading) return <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8"><LoadingState /></section>;
  if (error) return <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8"><ErrorState message="We could not find that dish." onRetry={retry} /></section>;

  const maxStock = product.stockQuantity !== undefined && product.stockQuantity !== null
    ? Number(product.stockQuantity)
    : 99;
  const isAvailable = product.available !== false && maxStock > 0;

  const handleDecrement = () => setQuantity((q) => Math.max(1, q - 1));
  const handleIncrement = () => setQuantity((q) => Math.min(maxStock, q + 1));

const IconCart = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="9" cy="21" r="1" />
    <circle cx="20" cy="21" r="1" />
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
  </svg>
);

  const handleAddToCart = () => {
    const res = addToCart(product, quantity);
    if (res?.success) {
      setIsAdded(true);
      setTimeout(() => setIsAdded(false), 1500);
    }
  };

  return (
    <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <Link to="/products" className="text-sm font-bold text-brand-600 hover:text-brand-700">← Back to menu</Link>
      <div className="mt-8 grid overflow-hidden rounded-[2rem] bg-white shadow-soft md:grid-cols-2">
        <div className="aspect-square bg-orange-50">
          <img
            src={currentImg}
            alt={product.name}
            className="h-full w-full object-cover"
            onError={handleImageError}
          />
        </div>
        <div className="flex flex-col justify-center p-7 sm:p-10">
          <p className="font-bold uppercase tracking-[0.2em] text-brand-600">{product.category?.name || (typeof product.category === 'string' ? product.category : 'FoodHub favourite')}</p>
          <h1 className="mt-3 text-4xl font-extrabold text-ink">{product.name}</h1>
          <p className="mt-5 leading-7 text-slate-600">{product.description || 'Prepared fresh by the FoodHub kitchen.'}</p>
          <p className="mt-8 text-3xl font-extrabold text-brand-600">${Number(product.price).toFixed(2)}</p>
          <p className="mt-2 text-sm text-slate-500">
            {isAvailable ? (
              <span className="inline-flex items-center gap-1.5 font-medium text-emerald-600">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                Available today {product.stockQuantity !== undefined ? `(${product.stockQuantity} in stock)` : ''}
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 font-medium text-rose-500">
                <span className="h-2 w-2 rounded-full bg-rose-500" />
                Currently unavailable
              </span>
            )}
          </p>

          {/* Quantity Controls & Add to Cart */}
          {isAvailable && (
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <div className="flex items-center rounded-2xl border border-slate-200 bg-slate-50 p-1">
                <button
                  type="button"
                  onClick={handleDecrement}
                  disabled={quantity <= 1}
                  className="flex h-10 w-10 items-center justify-center rounded-xl font-bold text-slate-700 hover:bg-white disabled:opacity-30 disabled:hover:bg-transparent"
                  aria-label="Decrease quantity"
                >
                  −
                </button>
                <span className="w-12 text-center text-base font-bold text-slate-900">{quantity}</span>
                <button
                  type="button"
                  onClick={handleIncrement}
                  disabled={quantity >= maxStock}
                  className="flex h-10 w-10 items-center justify-center rounded-xl font-bold text-slate-700 hover:bg-white disabled:opacity-30 disabled:hover:bg-transparent"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>

              <button
                type="button"
                onClick={handleAddToCart}
                className="flex-1 flex items-center justify-center gap-2 rounded-2xl bg-brand-600 px-6 py-3.5 font-bold text-white shadow-lg shadow-brand-500/25 transition-all hover:bg-brand-700 active:scale-95"
              >
                {isAdded ? (
                  '✓ Added to Cart!'
                ) : (
                  <>
                    <IconCart /> Add {quantity} to Cart • ${(Number(product.price) * quantity).toFixed(2)}
                  </>
                )}
              </button>
            </div>
          )}

          {!isAvailable && (
            <button disabled className="mt-8 cursor-not-allowed rounded-2xl bg-slate-100 px-5 py-3.5 font-bold text-slate-400">
              Dish Currently Unavailable
            </button>
          )}
        </div>
      </div>
    </section>
  );
}

