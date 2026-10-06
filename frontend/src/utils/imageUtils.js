/**
 * imageUtils.js - Utility for resolving product image URLs and fallback food images.
 */

export const DEFAULT_FALLBACK_IMAGE = '/images/product_burger_deluxe.jpg';

export const CATEGORY_IMAGE_MAP = {
  pizza: '/images/product_pizza_margherita.jpg',
  burgers: '/images/product_burger_deluxe.jpg',
  burger: '/images/product_burger_deluxe.jpg',
  pasta: '/images/product_pasta_carbonara.jpg',
  sushi: '/images/product_sushi_platter.jpg',
  salads: '/images/product_caesar_salad.jpg',
  salad: '/images/product_caesar_salad.jpg',
  desserts: '/images/product_chocolate_lava_cake.jpg',
  dessert: '/images/product_chocolate_lava_cake.jpg',
};

/**
 * Returns a fallback image based on product category or product name keywords.
 */
export function getFallbackImage(product) {
  if (!product) return DEFAULT_FALLBACK_IMAGE;

  const categoryName = typeof product.category === 'string'
    ? product.category.toLowerCase()
    : (product.category?.name || product.category?.id || '').toLowerCase();

  const name = (product.name || '').toLowerCase();

  // Match category
  for (const [key, img] of Object.entries(CATEGORY_IMAGE_MAP)) {
    if (categoryName.includes(key) || name.includes(key)) {
      return img;
    }
  }

  return DEFAULT_FALLBACK_IMAGE;
}

/**
 * Returns the primary image URL for a product, falling back to smart defaults if empty.
 */
export function getProductImage(product) {
  if (!product) return DEFAULT_FALLBACK_IMAGE;
  const rawUrl = product.imageUrl || product.image;
  if (rawUrl && typeof rawUrl === 'string' && rawUrl.trim() !== '') {
    return rawUrl.trim();
  }
  return getFallbackImage(product);
}
