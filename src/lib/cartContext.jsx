// 20/06/2026
import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      const saved = localStorage.getItem('mythic_cart');
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('mythic_cart', JSON.stringify(items));
  }, [items]);

  const addItem = (product, color, size, quantity = 1) => {
    setItems(prev => {
      const key = `${product.id}-${color}-${size}`;
      const existing = prev.find(i => i.key === key);
      if (existing) {
        return prev.map(i => i.key === key ? { ...i, quantity: i.quantity + quantity } : i);
      }
      const variant = product.variants?.find(v => v.color === color);
      return [...prev, {
        key,
        product_id: product.id,
        product_name: product.name,
        color,
        size,
        price: product.price,
        image_url: variant?.image_url || '',
        quantity,
        max_stock: variant?.sizes?.[size] || 0
      }];
    });
  };

  const updateQuantity = (key, quantity) => {
    if (quantity <= 0) {
      setItems(prev => prev.filter(i => i.key !== key));
    } else {
      setItems(prev => prev.map(i => i.key === key ? { ...i, quantity } : i));
    }
  };

  const removeItem = (key) => {
    setItems(prev => prev.filter(i => i.key !== key));
  };

  const clearCart = () => setItems([]);

  const getItemQuantity = (productId, color, size) => {
    const key = `${productId}-${color}-${size}`;
    const item = items.find(i => i.key === key);
    return item ? item.quantity : 0;
  };

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = items.reduce((sum, i) => sum + (i.price * i.quantity), 0);

  return (
    <CartContext.Provider value={{
      items, isOpen, setIsOpen, addItem, updateQuantity,
      removeItem, clearCart, getItemQuantity, totalItems, totalPrice
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}