import { useState } from 'react';

export function useCart() {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const resetCart = () => setCartItems([]);

  return {
    cartItems,
    setCartItems,
    isCartOpen,
    setIsCartOpen,
    resetCart
  };
}