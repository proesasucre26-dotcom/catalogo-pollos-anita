import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, CartItemOptionSelection, MenuItem } from '../types';

interface CartContextType {
  items: CartItem[];
  addToCart: (
    item: MenuItem,
    selectedOptions?: CartItemOptionSelection[],
    quantity?: number,
    notes?: string
  ) => void;
  updateQuantity: (cartItemId: string, delta: number) => void;
  removeFromCart: (cartItemId: string) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  selectedDetailItem: MenuItem | null;
  openDetail: (item: MenuItem) => void;
  closeDetail: () => void;
  isSuccessModalOpen: boolean;
  openSuccessModal: (comanda: string, whatsappUrl: string) => void;
  closeSuccessModal: () => void;
  lastOrderComanda: string;
  lastWhatsappUrl: string;
  isStoreInfoOpen: boolean;
  openStoreInfo: () => void;
  closeStoreInfo: () => void;
  activeCategoryId: string;
  setActiveCategoryId: (id: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'pollos_anita_cart_v1';

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedDetailItem, setSelectedDetailItem] = useState<MenuItem | null>(null);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [lastOrderComanda, setLastOrderComanda] = useState('');
  const [lastWhatsappUrl, setLastWhatsappUrl] = useState('');
  const [isStoreInfoOpen, setIsStoreInfoOpen] = useState(false);
  const [activeCategoryId, setActiveCategoryId] = useState<string>('brasa');
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch {
      // Storage unavailable or full
    }
  }, [items]);

  const addToCart = (
    item: MenuItem,
    selectedOptions: CartItemOptionSelection[] = [],
    quantity: number = 1,
    notes: string = ''
  ) => {
    // Generate unique options signature
    const optionsKey = selectedOptions
      .map((o) => `${o.optionName}:${o.choice}`)
      .sort()
      .join('|');

    const extraTotal = selectedOptions.reduce((acc, curr) => acc + (curr.extraPrice || 0), 0);
    const unitPrice = item.price + extraTotal;

    setItems((prevItems) => {
      const existingIndex = prevItems.findIndex(
        (i) => i.productId === item.id && (i.notes || '') === (notes || '') &&
          i.selectedOptions.map((o) => `${o.optionName}:${o.choice}`).sort().join('|') === optionsKey
      );

      if (existingIndex > -1) {
        const next = [...prevItems];
        const existing = next[existingIndex];
        const newQty = existing.quantity + quantity;
        next[existingIndex] = {
          ...existing,
          quantity: newQty,
          totalPrice: newQty * (existing.price + extraTotal),
        };
        return next;
      }

      const newItem: CartItem = {
        id: `${item.id}-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        productId: item.id,
        name: item.name,
        price: item.price,
        quantity,
        image: item.image,
        selectedOptions,
        notes,
        totalPrice: unitPrice * quantity,
      };

      return [...prevItems, newItem];
    });
  };

  const updateQuantity = (cartItemId: string, delta: number) => {
    setItems((prev) => {
      return prev
        .map((item) => {
          if (item.id === cartItemId) {
            const newQty = item.quantity + delta;
            if (newQty <= 0) return null;
            const extraTotal = item.selectedOptions.reduce((acc, curr) => acc + (curr.extraPrice || 0), 0);
            return {
              ...item,
              quantity: newQty,
              totalPrice: newQty * (item.price + extraTotal),
            };
          }
          return item;
        })
        .filter(Boolean) as CartItem[];
    });
  };

  const removeFromCart = (cartItemId: string) => {
    setItems((prev) => prev.filter((i) => i.id !== cartItemId));
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalItems = items.reduce((acc, i) => acc + i.quantity, 0);
  const subtotal = items.reduce((acc, i) => acc + i.totalPrice, 0);

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  const openDetail = (item: MenuItem) => setSelectedDetailItem(item);
  const closeDetail = () => setSelectedDetailItem(null);

  const openSuccessModal = (comanda: string, whatsappUrl: string) => {
    setLastOrderComanda(comanda);
    setLastWhatsappUrl(whatsappUrl);
    setIsSuccessModalOpen(true);
  };
  const closeSuccessModal = () => setIsSuccessModalOpen(false);

  const openStoreInfo = () => setIsStoreInfoOpen(true);
  const closeStoreInfo = () => setIsStoreInfoOpen(false);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        totalItems,
        subtotal,
        isCartOpen,
        openCart,
        closeCart,
        selectedDetailItem,
        openDetail,
        closeDetail,
        isSuccessModalOpen,
        openSuccessModal,
        closeSuccessModal,
        lastOrderComanda,
        lastWhatsappUrl,
        isStoreInfoOpen,
        openStoreInfo,
        closeStoreInfo,
        activeCategoryId,
        setActiveCategoryId,
        searchQuery,
        setSearchQuery,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
