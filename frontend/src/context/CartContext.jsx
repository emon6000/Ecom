import { createContext, useContext, useEffect, useState } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    if (typeof window === 'undefined') return [];

    try {
      const savedCart = localStorage.getItem('cartItems');
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (error) {
      console.error('Failed to load cart from storage', error);
      return [];
    }
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('cartItems', JSON.stringify(cartItems));
    }
  }, [cartItems]);

  const addToCart = (product, qty = 1) => {
    const parsedQty = Number(qty) || 1;

    setCartItems((prevItems) => {
      const existingItem = prevItems.find((x) => x._id === product._id);

      if (existingItem) {
        return prevItems.map((x) =>
          x._id === existingItem._id ? { ...x, qty: x.qty + parsedQty } : x
        );
      }

      return [...prevItems, { ...product, qty: parsedQty, price: Number(product.price) || 0 }];
    });
  };

  const removeFromCart = (id) => {
    setCartItems((prevItems) => prevItems.filter((x) => x._id !== id));
  };

  const updateCartQty = (id, qty) => {
    const parsedQty = Number(qty) || 0;

    setCartItems((prevItems) =>
      prevItems
        .map((item) => (item._id === id ? { ...item, qty: parsedQty } : item))
        .filter((item) => item.qty > 0)
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <CartContext.Provider
      value={{ cartItems, addToCart, removeFromCart, updateCartQty, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
