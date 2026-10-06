import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ProductCard.css';
import { useCart } from '../context/CartContext';

import { getProductImage, getFallbackImage } from '../utils/imageUtils';

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
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [isAdded, setIsAdded] = useState(false);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const result = addToCart(product, 1);
    if (result?.success) {
      setIsAdded(true);
      setTimeout(() => setIsAdded(false), 1200);
    }
  };

  const handleViewDetails = (e) => {
    e.preventDefault();
    navigate(`/products/${product.id}`);
  };

  const [imgSrc, setImgSrc] = useState(() => getProductImage(product));

  const handleImageError = () => {
    const fallback = getFallbackImage(product);
    if (imgSrc !== fallback) {
      setImgSrc(fallback);
    }
  };

  return (
    <article className="fh-product-card group">
      {/* Image */}
      <div className="fh-product-card__img-wrap">
        <img
          src={imgSrc}
          alt={product.name}
          className="fh-product-card__img"
          loading="lazy"
          onError={handleImageError}
        />

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
              isAdded ? (
                <>
                  <span aria-hidden="true">✓</span> Added!
                </>
              ) : (
                <>
                  <span aria-hidden="true">+</span> Add to Cart
                </>
              )
            ) : (
              'Unavailable'
            )}
          </button>
        </div>
      </div>
    </article>
  );
}
