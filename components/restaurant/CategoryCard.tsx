'use client';

import { motion } from "framer-motion";
import { 
    UtensilsCrossed, 
    Salad, 
    Cake, 
    Wine, 
    GlassWater, 
    Martini
} from "lucide-react";

interface CategoryTabsProps {
  categories: string[];
  activeCategory: string;
  setActiveCategory: (category: string) => void;
}

export default function CategoryTabs({ categories, activeCategory, setActiveCategory }: CategoryTabsProps) {
  const categoryIcons: Record<string, React.ReactElement> = {
    starters: <Salad className="w-4 h-4" />,
    mains: <UtensilsCrossed className="w-4 h-4" />,
    desserts: <Cake className="w-4 h-4" />,
    cocktails: <Martini className="w-4 h-4" />,
    wines: <Wine className="w-4 h-4" />,
    "non-alcoholic": <GlassWater className="w-4 h-4" />
  };

  return (
    <div className="flex flex-wrap gap-3 justify-center">
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => setActiveCategory(category)}
          className={`relative px-5 py-3 rounded-full font-medium text-sm transition-all duration-300 flex items-center gap-2 ${
            activeCategory === category
              ? "text-black"
              : "text-white/70 hover:text-white bg-white/5 hover:bg-white/10"
          }`}
        >
          {activeCategory === category && (
            <motion.div
              layoutId="activeCategory"
              className="absolute inset-0 gradient-gold rounded-full"
              transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
            />
          )}
          <span className="relative z-10 flex items-center gap-2">
            {categoryIcons[category]}
            {category.charAt(0).toUpperCase() + category.slice(1).replace("-", " ")}
          </span>
        </button>
      ))}
    </div>
  );
}