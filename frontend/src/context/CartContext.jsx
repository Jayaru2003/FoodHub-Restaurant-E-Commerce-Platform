import { createContext, useContext, useState } from 'react';

/**
 * CartContext — stub ready to be wired up with real cart logic.
 * Replace `cartItems` with your actual cart state (e.g. from an API / localStorage).
 */
const CartContext = createContext(null);

export function CartProvider({ children }) {
  // TODO: Replace with real cart items state (fetched from backend or localStorage)
  const [cartItems, setCartItems] = useState([]);

  const cartCount = cartItems.reduce((sum, item) => sum + (item.quantity ?? 1), 0);

  return (
    <CartContext.Provider value={{ cartItems, setCartItems, cartCount }}>
      {children}
    </CartContext.Provider>
  );
}

/** Hook to consume cart context safely. */
export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside <CartProvider>');
  return ctx;
}
