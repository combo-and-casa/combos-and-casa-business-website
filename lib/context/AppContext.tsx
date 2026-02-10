'use client';

import { createContext, useContext, useState, useEffect, ReactNode, useRef, useEffectEvent } from 'react';
import { supabase } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image_url?: string;
}

interface AppContextType {
  cart: CartItem[];
  cartCount: number;
  user: User | null;
  setCart: (cart: CartItem[]) => void;
  addToCart: (item: CartItem) => void;
  removeFromCart: (itemId: string) => void;
  updateCartItemQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  setUser: (user: User | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [cart, setCartState] = useState<CartItem[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const hasLoadedCart = useRef(false);

  const setcart = useEffectEvent((newCart: CartItem[]) => {
    setCartState(newCart);
  });
  // Load cart from localStorage after hydration and listen for changes
  useEffect(() => {
    // Only load once
    if (!hasLoadedCart.current) {
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        try {
          const parsedCart = JSON.parse(savedCart);
          if (parsedCart.length > 0) {
            // setCartState(parsedCart);
            setcart(parsedCart);
          }
        } catch (error) {
          console.error('Error parsing cart from localStorage:', error);
        }
      }
      hasLoadedCart.current = true;
    }

    // Listen for cart updates from other tabs/windows
    const handleStorageChange = () => {
      const updatedCart = localStorage.getItem('cart');
      if (updatedCart) {
        try {
          const parsedCart = JSON.parse(updatedCart);
          setCartState(parsedCart);
        } catch (error) {
          console.error('Error parsing cart from localStorage:', error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Check for authenticated user on mount
  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Calculate cart count
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  // Set cart and save to localStorage
  const setCart = (newCart: CartItem[]) => {
    setCartState(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
    // Dispatch storage event for cross-tab updates
    window.dispatchEvent(new Event('storage'));
  };

  // Add item to cart
  const addToCart = (newItem: CartItem) => {
    const existingItemIndex = cart.findIndex(item => item.id === newItem.id);
    
    if (existingItemIndex > -1) {
      // Item exists, update quantity
      const updatedCart = [...cart];
      updatedCart[existingItemIndex].quantity += newItem.quantity;
      setCart(updatedCart);
    } else {
      // New item, add to cart
      setCart([...cart, newItem]);
    }
  };

  // Remove item from cart
  const removeFromCart = (itemId: string) => {
    const updatedCart = cart.filter(item => item.id !== itemId);
    setCart(updatedCart);
  };

  // Update item quantity
  const updateCartItemQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }

    const updatedCart = cart.map(item =>
      item.id === itemId ? { ...item, quantity } : item
    );
    setCart(updatedCart);
  };

  // Clear cart
  const clearCart = () => {
    setCart([]);
  };

  const value: AppContextType = {
    cart,
    cartCount,
    user,
    setCart,
    addToCart,
    removeFromCart,
    updateCartItemQuantity,
    clearCart,
    setUser,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
