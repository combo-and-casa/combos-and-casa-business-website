'use client';

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, X, Plus, Minus } from "lucide-react";
import Link from "next/link";
import MenuCard from "@/components/restaurant/MenuCard";
import CategoryTabs from "@/components/restaurant/CategoryCard";
import Image from "next/image";

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image_url?: string;
  dietary_tags?: string[];
}

interface CartItem extends MenuItem {
  quantity: number;
}

export default function Restaurant() {
  const [activeCategory, setActiveCategory] = useState("starters");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCartPreview, setShowCartPreview] = useState(false);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch menu items on mount
  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        // Simulate API call with mock data
        await new Promise(resolve => setTimeout(resolve, 500));
        const mockItems: MenuItem[] = [
          {
            id: "1",
            name: "Caesar Salad",
            description: "Fresh romaine lettuce with parmesan and croutons",
            price: 12.99,
            category: "starters",
            image_url: "https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400",
            dietary_tags: ["vegetarian"]
          },
          {
            id: "2",
            name: "Grilled Salmon",
            description: "Atlantic salmon with seasonal vegetables",
            price: 28.99,
            category: "mains",
            image_url: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400",
            dietary_tags: ["gluten-free"]
          },
          {
            id: "3",
            name: "Chocolate Lava Cake",
            description: "Warm chocolate cake with vanilla ice cream",
            price: 9.99,
            category: "desserts",
            image_url: "https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=400",
            dietary_tags: ["vegetarian"]
          },
          {
            id: "4",
            name: "Mojito",
            description: "Classic Cuban cocktail with mint and lime",
            price: 11.99,
            category: "cocktails",
            image_url: "https://images.unsplash.com/photo-1551538827-9c037cb4f32a?w=400"
          },
          {
            id: "5",
            name: "Cabernet Sauvignon",
            description: "Full-bodied red wine from Napa Valley",
            price: 45.99,
            category: "wines",
            image_url: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400"
          },
          {
            id: "6",
            name: "Sparkling Lemonade",
            description: "Freshly squeezed lemon with sparkling water",
            price: 4.99,
            category: "non-alcoholic",
            image_url: "https://images.unsplash.com/photo-1523677011781-c91d1bbe2f9d?w=400"
          },

          {
            id: "7",
            name: "Bruschetta",
            description: "Grilled bread topped with fresh tomatoes and basil",
            price: 10.99,
            category: "starters",
            image_url: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400",
            dietary_tags: ["vegetarian"]
          },
          {
            id: "8",
            name: "Ribeye Steak",
            description: "Juicy ribeye steak cooked to perfection",
            price: 34.99,
            category: "mains",
            image_url: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=400",
            dietary_tags: []
          },
          {
            id: "9",
            name: "Tiramisu",
            description: "Classic Italian dessert with coffee and mascarpone",
            price: 8.99,
            category: "desserts",
            image_url: "https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=400",
            dietary_tags: ["vegetarian"]
          },
          {
            id: "10",
            name: "Old Fashioned",
            description: "Whiskey cocktail with bitters and a twist of orange",
            price: 12.99,
            category: "cocktails",
            image_url: "https://images.unsplash.com/photo-1551538827-9c037cb4f32a?w=400" ,
            dietary_tags: []
          },
          {
            id: "11",
            name: "Chardonnay",
            description: "Crisp white wine with notes of apple and oak",
            price: 39.99,
            category: "wines",
            image_url: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400",
            dietary_tags: []
          },
          {
            id: "12",
            name: "Virgin Pina Colada",
            description: "Tropical blend of pineapple and coconut",
            price: 5.99,
            category: "non-alcoholic",
            image_url: "https://images.unsplash.com/photo-1523677011781-c91d1bbe2f9d?w=400",
            dietary_tags: []
          },
          {
            id: "13",
            name: "Caprese Salad",
            description: "Fresh mozzarella, tomatoes, and basil drizzled with balsamic glaze",
            price: 11.99,
            category: "starters",
            image_url: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400",
            dietary_tags: ["vegetarian", "gluten-free"]
          },
          {
            id: "14",
            name: "Lobster Ravioli",
            description: "Homemade ravioli stuffed with lobster and ricotta",
            price: 29.99,
            category: "mains",
            image_url: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=400",
            dietary_tags: []
          },
        ];
        setMenuItems(mockItems);
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to fetch menu items:", error);
        setIsLoading(false);
      }
    };

    fetchMenuItems();
  }, []);

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart") || "[]");
    
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCart(savedCart);
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("storage"));
  }, [cart]);

  const categories = ["starters", "mains", "desserts", "cocktails", "wines", "non-alcoholic"];
  const filteredItems = menuItems.filter((item) => item.category === activeCategory);

  const addToCart = (item: MenuItem) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
    setShowCartPreview(true);
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.id === id ? { ...item, quantity: item.quantity + delta } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const cartTotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="min-h-screen bg-[#0A0A0A] pt-20">
      {/* Hero */}
      <section className="relative py-20 md:py-28 px-6 lg:px-8">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1920&q=80')" }}
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
              categories={categories}
              activeCategory={activeCategory}
              setActiveCategory={setActiveCategory}
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
                {filteredItems.map((item) => (
                  <MenuCard key={item.id} item={item} onAddToCart={() => addToCart(item)} />
                ))}
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
            href="/nankwaase-bar-and-restaurant/checkout"
            className="flex items-center gap-4 px-6 py-4 gradient-gold text-black rounded-full shadow-2xl hover:scale-105 transition-transform"
          >
            <ShoppingBag className="w-5 h-5" />
            <span className="font-semibold">Checkout ({cartCount})</span>
            <span className="font-bold">${cartTotal.toFixed(2)}</span>
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
                      <p className="text-[#D4AF37]">${item.price?.toFixed(2)}</p>
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
                  <span className="text-[#D4AF37]">${cartTotal.toFixed(2)}</span>
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
