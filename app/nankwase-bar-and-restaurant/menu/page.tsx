'use client';

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, X, Plus, Minus } from "lucide-react";
import Link from "next/link";
import MenuCard from "@/components/restaurant/MenuCard";
import CategoryTabs from "@/components/restaurant/CategoryCard";
import Image from "next/image";
import { useApp } from "@/lib/context/AppContext";

interface MenuItem {
  id: string;
  name: string;
  description: string | null;
  price: number;
  category_id: string;
  category?: string; // For display purposes
  image_url?: string | null;
  dietary_tags?: string[];
}

interface MenuCategory {
  id: string;
  name: string;
}

export default function Restaurant() {
  const { cart, addToCart: addToCartContext, updateCartItemQuantity, cartCount } = useApp();
  const [activeCategory, setActiveCategory] = useState<string>("");
  const [showCartPreview, setShowCartPreview] = useState(false);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch menu items and categories on mount
  useEffect(() => {
    const fetchMenuData = async () => {
      try {
        const response = await fetch('/api/restuarant/menu');
        
        if (!response.ok) {
          throw new Error('Failed to fetch menu data');
        }

        const data = await response.json();
        const fetchedCategories = data.categories || [];
        const fetchedItems = data.items || [];

        // Map items to include category name for display
        const itemsWithCategoryNames = fetchedItems.map((item: {
          id: string;
          name: string;
          description: string | null;
          price: number;
          category_id: string;
          image_url?: string | null;
        }) => ({
          ...item,
          category: fetchedCategories.find((cat: MenuCategory) => cat.id === item.category_id)?.name || 'Other',
        }));

        setCategories(fetchedCategories);
        setMenuItems(itemsWithCategoryNames);
        
        // Set first category as active by default
        if (fetchedCategories.length > 0) {
          setActiveCategory(fetchedCategories[0].id);
        }

        setIsLoading(false);
      } catch (error) {
        console.error("Failed to fetch menu data:", error);
        setIsLoading(false);
      }
    };

    fetchMenuData();
  }, []);

  const categoryNames = categories.map(cat => cat.name.toLowerCase());
  const filteredItems = menuItems.filter((item) => item.category_id === activeCategory);

  const addToCart = (item: MenuItem) => {
    addToCartContext({ 
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: 1,
      image_url: item.image_url ?? undefined,
    });
    setShowCartPreview(true);
  };

  const updateQuantity = (id: string, delta: number) => {
    const item = cart.find(item => item.id === id);
    if (item) {
      updateCartItemQuantity(id, item.quantity + delta);
    }
  };

  const cartTotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <div className="min-h-screen bg-[#0A0A0A] pt-20">
      {/* Hero */}
      <section className="relative py-20 md:py-28 px-6 lg:px-8">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{ backgroundImage: "url('/pasta-2.jpg')" }}
        />
        <div className="absolute inset-0 bg-linear-to-b from-[#0A0A0A] via-transparent to-[#0A0A0A]" />
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block px-4 py-2 rounded-full bg-[#D4AF37]/10 text-[#D4AF37] text-sm font-medium tracking-wider mb-4"
          >
            CULINARY EXCELLENCE
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-bold mb-6"
          >
            Restaurant & <span className="text-[#D4AF37]">Bar</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-white/60 text-lg max-w-2xl mx-auto"
          >
            Experience culinary artistry with our chef-crafted menu featuring locally sourced ingredients and world-class wines.
          </motion.p>
        </div>
      </section>

      {/* Menu Section */}
      <section className="py-12 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Category Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <CategoryTabs
              categories={categoryNames}
              activeCategory={categories.find(cat => cat.id === activeCategory)?.name.toLowerCase() || ''}
              setActiveCategory={(catName) => {
                const category = categories.find(cat => cat.name.toLowerCase() === catName);
                if (category) setActiveCategory(category.id);
              }}
            />
          </motion.div>

          {/* Menu Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-[#1A1A1A] rounded-2xl h-80 animate-pulse" />
              ))}
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-white/50 text-lg">No items in this category yet.</p>
            </div>
          ) : (
            <motion.div
              layout
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              <AnimatePresence mode="popLayout">
                {filteredItems.map((item) => {
                  // Transform item to match MenuCard's expected type
                  const menuCardItem = {
                    id: item.id,
                    name: item.name,
                    description: item.description ?? undefined,
                    price: item.price,
                    category: item.category || '',
                    image_url: item.image_url ?? undefined,
                    dietary_tags: item.dietary_tags,
                  };
                  return (
                    <MenuCard key={item.id} item={menuCardItem} onAddToCart={() => addToCart(item)} />
                  );
                })}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </section>

      {/* Floating Cart Button */}
      {cartCount > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50"
        >
          <Link
            href="/checkout"
            className="flex items-center gap-4 px-6 py-4 gradient-gold text-black rounded-full shadow-2xl hover:scale-105 transition-transform"
          >
            <ShoppingBag className="w-5 h-5" />
            <span className="font-semibold">Checkout ({cartCount})</span>
            <span className="font-bold">GHS {cartTotal.toFixed(2)}</span>
          </Link>
        </motion.div>
      )}

      {/* Cart Preview Sidebar */}
      <AnimatePresence>
        {showCartPreview && cart.length > 0 && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCartPreview(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-[#1A1A1A] z-50 p-6 overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold">Your Order</h3>
                <button
                  onClick={() => setShowCartPreview(false)}
                  className="p-2 hover:bg-white/10 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4 mb-6">
                {cart.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 p-4 bg-white/5 rounded-xl">
                    {item.image_url && (
                      <Image
                        src={item.image_url}
                        alt={item.name}
                        width={64}
                        height={64}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                    )}
                    <div className="flex-1">
                      <h4 className="font-medium">{item.name}</h4>
                      <p className="text-[#D4AF37]">GHS {(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.id, -1)}
                        className="p-1 hover:bg-white/10 rounded-full"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, 1)}
                        className="p-1 hover:bg-white/10 rounded-full"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-white/10 pt-4 mb-6">
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span className="text-[#D4AF37]">GHS {cartTotal.toFixed(2)}</span>
                </div>
              </div>

              <Link
                href="/cart"
                className="block w-full py-4 gradient-gold text-black font-semibold rounded-xl text-center hover:scale-[1.02] transition-transform"
              >
                Proceed to Checkout
              </Link>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
