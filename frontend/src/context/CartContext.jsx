import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const LOCAL_STORAGE_KEY = 'foodhub_cart';
const DEFAULT_MAX_STOCK = 99;

/**
 * Normalizes a product into a standard CartItem structure.
 * Cart Item structure:
 *  - productId
 *  - id (fallback)
 *  - name
 *  - image (and imageUrl for compatibility)
 *  - price (number)
 *  - quantity (number >= 1)
 *  - subtotal (price * quantity)
 *  - stockQuantity (number)
 *  - available (boolean)
 */
function createCartItem(product, quantity = 1) {
  const pId = product.productId || product.id;
  const price = Math.max(0, Number(product.price) || 0);
  const qty = Math.max(1, Number(quantity) || 1);
  const img = product.image || product.imageUrl || '';
  const stock = product.stockQuantity !== undefined && product.stockQuantity !== null
    ? Number(product.stockQuantity)
    : DEFAULT_MAX_STOCK;
  const isAvailable = product.available !== false && stock > 0;

  return {
    productId: pId,
    id: pId,
    name: product.name || 'Dish',
    image: img,
    imageUrl: img,
    price: price,
    quantity: qty,
    subtotal: Number((price * qty).toFixed(2)),
    stockQuantity: stock,
    available: isAvailable,
    category: typeof product.category === 'object' ? product.category?.name : product.category,
    description: product.description || '',
  };
}

/** Safely load cart from localStorage with corruption handling. */
function loadInitialCart() {
  try {
    const rawData = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!rawData) return [];
    const parsed = JSON.parse(rawData);
    if (!Array.isArray(parsed)) {
      console.warn('[FoodHub Cart] LocalStorage data is not an array. Resetting cart.');
      localStorage.removeItem(LOCAL_STORAGE_KEY);
      return [];
    }

    return parsed
      .filter((item) => item && (item.productId || item.id) && !isNaN(item.price))
      .map((item) => {
        const pId = item.productId || item.id;
        const price = Math.max(0, Number(item.price) || 0);
        const qty = Math.max(1, Number(item.quantity) || 1);
        const img = item.image || item.imageUrl || '';
        const stock = item.stockQuantity !== undefined && item.stockQuantity !== null
          ? Number(item.stockQuantity)
          : DEFAULT_MAX_STOCK;
        const isAvailable = item.available !== false && stock > 0;

        return {
          ...item,
          productId: pId,
          id: pId,
          name: item.name || 'Dish',
          image: img,
          imageUrl: img,
          price: price,
          quantity: qty,
          subtotal: Number((price * qty).toFixed(2)),
          stockQuantity: stock,
          available: isAvailable,
        };
      });
  } catch (error) {
    console.error('[FoodHub Cart] Failed to parse localStorage cart data:', error);
    try {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    } catch (_) {}
    return [];
  }
}

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(loadInitialCart);
  const [toast, setToast] = useState(null);

  // Sync to localStorage on every cart change
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(cartItems));
    } catch (error) {
      console.error('[FoodHub Cart] Could not persist cart to localStorage:', error);
    }
  }, [cartItems]);

  // Toast trigger helper
  const showToast = useCallback((message, type = 'info') => {
    setToast({ id: Date.now(), message, type });
  }, []);

  const hideToast = useCallback(() => {
    setToast(null);
  }, []);

  /**
   * Add product to cart.
   * If item exists, increments quantity.
   * Prevents adding if unavailable or exceeding stock.
   */
  const addToCart = useCallback((product, quantityToAdd = 1) => {
    if (!product) return { success: false, reason: 'Invalid product' };

    const pId = product.productId || product.id;
    const isAvailable = product.available !== false && (product.stockQuantity === undefined || product.stockQuantity > 0);

    if (!isAvailable) {
      showToast(`" ${product.name || 'This item'} " is currently unavailable.`, 'warning');
      return { success: false, reason: 'Unavailable product' };
    }

    let result = { success: true, message: '' };

    setCartItems((prevItems) => {
      const existingIndex = prevItems.findIndex((item) => item.productId === pId || item.id === pId);
      const maxStock = product.stockQuantity !== undefined && product.stockQuantity !== null
        ? Number(product.stockQuantity)
        : DEFAULT_MAX_STOCK;

      if (existingIndex > -1) {
        const existing = prevItems[existingIndex];
        const requestedTotal = existing.quantity + Math.max(1, quantityToAdd);
        const finalQty = Math.min(requestedTotal, maxStock);

        if (existing.quantity >= maxStock) {
          result = { success: false, reason: 'Stock limit reached' };
          showToast(`Maximum stock limit (${maxStock}) reached for ${existing.name}.`, 'warning');
          return prevItems;
        }

        const addedCount = finalQty - existing.quantity;
        const updated = [...prevItems];
        updated[existingIndex] = {
          ...existing,
          quantity: finalQty,
          subtotal: Number((existing.price * finalQty).toFixed(2)),
          stockQuantity: maxStock,
        };

        if (finalQty < requestedTotal) {
          showToast(`Added ${addedCount}x ${existing.name} (reached stock limit of ${maxStock}).`, 'info');
        } else {
          showToast(`Updated ${existing.name} quantity to ${finalQty}.`, 'success');
        }

        return updated;
      } else {
        const newItemQty = Math.min(Math.max(1, quantityToAdd), maxStock);
        const newItem = createCartItem(product, newItemQty);
        result = { success: true, message: 'Added to cart' };
        showToast(`Added "${newItem.name}" to your cart! 🛒`, 'success');
        return [...prevItems, newItem];
      }
    });

    return result;
  }, [showToast]);

  /** Remove product completely from cart */
  const removeFromCart = useCallback((productId) => {
    setCartItems((prevItems) => {
      const target = prevItems.find((i) => i.productId === productId || i.id === productId);
      if (target) {
        showToast(`Removed "${target.name}" from cart.`, 'info');
      }
      return prevItems.filter((item) => item.productId !== productId && item.id !== productId);
    });
  }, [showToast]);

  /** Increase item quantity by step (up to max stock) */
  const increaseQuantity = useCallback((productId, step = 1) => {
    setCartItems((prevItems) =>
      prevItems.map((item) => {
        if (item.productId === productId || item.id === productId) {
          const maxStock = item.stockQuantity || DEFAULT_MAX_STOCK;
          if (item.quantity >= maxStock) {
            showToast(`Cannot exceed max stock of ${maxStock} for ${item.name}.`, 'warning');
            return item;
          }
          const nextQty = Math.min(item.quantity + Math.max(1, step), maxStock);
          return {
            ...item,
            quantity: nextQty,
            subtotal: Number((item.price * nextQty).toFixed(2)),
          };
        }
        return item;
      })
    );
  }, [showToast]);

  /** Decrease item quantity by step (floor at 1) */
  const decreaseQuantity = useCallback((productId, step = 1) => {
    setCartItems((prevItems) =>
      prevItems.map((item) => {
        if (item.productId === productId || item.id === productId) {
          if (item.quantity <= 1) {
            showToast(`Quantity cannot be less than 1. Use remove button to delete.`, 'info');
            return item;
          }
          const nextQty = Math.max(1, item.quantity - Math.max(1, step));
          return {
            ...item,
            quantity: nextQty,
            subtotal: Number((item.price * nextQty).toFixed(2)),
          };
        }
        return item;
      })
    );
  }, [showToast]);

  /** Set exact quantity for a product (clamped [1, maxStock]) */
  const setQuantity = useCallback((productId, newQuantity) => {
    const qtyNum = parseInt(newQuantity, 10);
    if (isNaN(qtyNum)) return;

    setCartItems((prevItems) =>
      prevItems.map((item) => {
        if (item.productId === productId || item.id === productId) {
          const maxStock = item.stockQuantity || DEFAULT_MAX_STOCK;
          const clampedQty = Math.min(Math.max(1, qtyNum), maxStock);
          if (clampedQty !== qtyNum) {
            showToast(`Quantity set to valid range [1 - ${maxStock}].`, 'info');
          }
          return {
            ...item,
            quantity: clampedQty,
            subtotal: Number((item.price * clampedQty).toFixed(2)),
          };
        }
        return item;
      })
    );
  }, [showToast]);

  /** Clear all items from cart */
  const clearCart = useCallback(() => {
    setCartItems([]);
    showToast('Cart cleared.', 'info');
  }, [showToast]);

  // Calculated properties
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const cartSubtotal = Number(
    cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2)
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        setCartItems,
        cartCount,
        cartSubtotal,
        addToCart,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity,
        setQuantity,
        clearCart,
        toast,
        hideToast,
        showToast,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

/** Hook to consume cart context safely */
export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside <CartProvider>');
  return ctx;
}

