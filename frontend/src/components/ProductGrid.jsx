import ProductCard from './ProductCard';

/**
 * ProductGrid – displays a responsive grid of ProductCard items.
 *
 * Props:
 *   products {Array} - list of product objects from backend
 */
export default function ProductGrid({ products = [] }) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
