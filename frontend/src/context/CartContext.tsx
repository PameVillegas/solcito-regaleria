import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface CartItem {
  productId: string;
  productName: string;
  color: string | null;
  quantity: number;
  unitPrice: number;
  imageUrl: string | null;
  stock: number;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void;
  removeItem: (productId: string, color: string | null) => void;
  updateQuantity: (productId: string, color: string | null, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | null>(null);

const CART_KEY = 'solcito_cart';

function loadCart(): CartItem[] {
  try {
    const data = localStorage.getItem(CART_KEY);
    if (!data) return [];
    const parsed = JSON.parse(data);
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    localStorage.removeItem(CART_KEY);
    return [];
  }
}

function saveCart(items: CartItem[]) {
  localStorage.setItem(CART_KEY, JSON.stringify(items));
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(loadCart);

  useEffect(() => {
    saveCart(items);
  }, [items]);

  const addItem = (newItem: Omit<CartItem, 'quantity'> & { quantity?: number }) => {
    const quantity = newItem.quantity || 1;
    setItems(prev => {
      const existing = prev.find(
        i => i.productId === newItem.productId && i.color === newItem.color
      );
      if (existing) {
        const newQty = Math.min(existing.quantity + quantity, newItem.stock);
        return prev.map(i =>
          i.productId === newItem.productId && i.color === newItem.color
            ? { ...i, quantity: newQty }
            : i
        );
      }
      const clampedQty = Math.min(quantity, newItem.stock);
      return [...prev, { ...newItem, quantity: clampedQty }];
    });
  };

  const removeItem = (productId: string, color: string | null) => {
    setItems(prev => prev.filter(i => !(i.productId === productId && i.color === color)));
  };

  const updateQuantity = (productId: string, color: string | null, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId, color);
      return;
    }
    setItems(prev =>
      prev.map(i =>
        i.productId === productId && i.color === color
          ? { ...i, quantity: Math.min(quantity, i.stock) }
          : i
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = items.reduce((sum, i) => sum + i.quantity * i.unitPrice, 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart, totalItems, totalPrice }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
