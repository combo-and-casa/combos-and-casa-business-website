'use client';

import { motion } from "framer-motion";
import { Plus, Leaf, Wheat } from "lucide-react";
import Image from "next/image";

interface MenuItem {
  id: string;
  name: string;
  description?: string;
  price: number;
  category: string;
  image_url?: string;
  dietary_tags?: string[];
}

interface MenuCardProps {
  item: MenuItem;
  onAddToCart: (item: MenuItem) => void;
}

export default function MenuCard({ item, onAddToCart }: MenuCardProps) {
  const dietaryIcons: Record<string, React.ReactElement> = {
    vegan: <Leaf className="w-3 h-3" />,
    vegetarian: <Leaf className="w-3 h-3" />,
    glutenFree: <Wheat className="w-3 h-3" />
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="group bg-[#1A1A1A] rounded-2xl overflow-hidden border border-white/5 hover:border-[#D4AF37]/30 transition-all duration-500"
    >
      {/* Image */}
      {item.image_url && (
        <div className="relative h-48 overflow-hidden">
          <Image
            src={item.image_url}
            alt={item.name}
            width={400}
            height={192}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-linear-to-t from-[#1A1A1A] to-transparent opacity-60" />
        </div>
      )}

      {/* Content */}
      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-2">
          <h3 className="font-semibold text-lg group-hover:text-[#D4AF37] transition-colors">
            {item.name}
          </h3>
          <span className="text-[#D4AF37] font-bold text-lg whitespace-nowrap">
            ${item.price?.toFixed(2)}
          </span>
        </div>

        {item.description && (
          <p className="text-white/50 text-sm mb-4 line-clamp-2">
            {item.description}
          </p>
        )}

        {/* Dietary Tags */}
        {item.dietary_tags && item.dietary_tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {item.dietary_tags.map((tag: string) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 px-2 py-1 bg-[#D4AF37]/10 text-[#D4AF37] text-xs rounded-full"
              >
                {dietaryIcons[tag]}
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Add Button */}
        <button
            onClick={() => onAddToCart(item)}
          className="w-full py-3 bg-white/5 hover:bg-[#D4AF37] text-white hover:text-black font-medium rounded-xl transition-all duration-300 flex items-center justify-center gap-2 group/btn"
        >
          <Plus className="w-4 h-4" />
          Add to Order
        </button>
      </div>
    </motion.div>
  );
}