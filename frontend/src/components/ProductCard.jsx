import { Link } from 'react-router-dom';

function formatPrice(price) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(Number(price));
}

export default function ProductCard({ product }) {
  return (
    <article className="group overflow-hidden rounded-3xl bg-white shadow-soft">
      <div className="aspect-[4/3] overflow-hidden bg-orange-50">
        {product.imageUrl ? (
          <img src={product.imageUrl} alt={product.name} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
        ) : (
          <div className="grid h-full place-items-center text-5xl">🍽️</div>
        )}
      </div>
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-bold text-ink">{product.name}</h3>
          <span className="shrink-0 font-bold text-brand-600">{formatPrice(product.price)}</span>
        </div>
        <p className="mt-2 line-clamp-2 min-h-10 text-sm leading-5 text-slate-500">{product.description || 'A delicious FoodHub favourite.'}</p>
        <Link to={`/products/${product.id}`} className="mt-5 inline-flex text-sm font-bold text-brand-600 hover:text-brand-700">
          View details <span aria-hidden="true" className="ml-1">→</span>
        </Link>
      </div>
    </article>
  );
}
