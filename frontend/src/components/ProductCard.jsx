import { useNavigate } from 'react-router-dom';
import './ProductCard.css';
import { useCart } from '../context/CartContext';

function formatPrice(price) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(Number(price));
}

/**
 * ProductCard – reusable card for displaying a single food product.
 *
 * Props:
 *   product {object} – product data object with shape:
 *     { id, name, description, price, available, imageUrl, category }
 *
 * Used on: HomePage (featured section), ProductsPage (grid)
 */
export default function ProductCard({ product }) {
  const { setCartItems } = useCart();
  const navigate = useNavigate();

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setCartItems((prev) => {
      const existing = prev.find((i) => i.id === product.id);
      if (existing) {
        return prev.map((i) =>
          i.id === product.id ? { ...i, quantity: (i.quantity ?? 1) + 1 } : i
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const handleViewDetails = (e) => {
    e.preventDefault();
    navigate(`/products/${product.id}`);
  };

  return (
    <article className="fh-product-card group">
      {/* Image */}
      <div className="fh-product-card__img-wrap">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="fh-product-card__img"
            loading="lazy"
          />
        ) : (
          <div className="fh-product-card__img-placeholder" aria-hidden="true">🍽️</div>
        )}

        {/* Availability badge */}
        <span
          className={`fh-product-card__badge ${product.available ? 'fh-product-card__badge--available' : 'fh-product-card__badge--unavailable'}`}
          aria-label={product.available ? 'In stock' : 'Out of stock'}
        >
          {product.available ? '● Available' : '○ Unavailable'}
        </span>
      </div>

      {/* Body */}
      <div className="fh-product-card__body">
        <div className="fh-product-card__meta">
          <h3 className="fh-product-card__name">{product.name}</h3>
          <span className="fh-product-card__price">{formatPrice(product.price)}</span>
        </div>

        <p className="fh-product-card__desc">
          {product.description || 'A FoodHub favourite, freshly prepared for you.'}
        </p>

        {/* Actions */}
        <div className="fh-product-card__actions">
          <button
            type="button"
            className="fh-product-card__btn fh-product-card__btn--details"
            onClick={handleViewDetails}
            aria-label={`View details for ${product.name}`}
          >
            View Details
          </button>

          <button
            type="button"
            className="fh-product-card__btn fh-product-card__btn--cart"
            onClick={handleAddToCart}
            disabled={!product.available}
            aria-label={`Add ${product.name} to cart`}
          >
            {product.available ? (
              <>
                <span aria-hidden="true">+</span> Add to Cart
              </>
            ) : (
              'Unavailable'
            )}
          </button>
        </div>
      </div>
    </article>
  );
}
