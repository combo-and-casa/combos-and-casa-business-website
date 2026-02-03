import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import type { ServiceCardProps } from "../../utils/types";

export default function ServiceCard({ 
  title, 
  subtitle, 
  description, 
  image, 
  ctaText, 
  ctaLink, 
  icon: Icon,
  index 
}: ServiceCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: index * 0.2 }}
            className="group relative"
        >
            <div className="relative h-125 md:h-150 rounded-3xl overflow-hidden">
                {/* Background Image */}
                <div 
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                    style={{ backgroundImage: `url('${image}')` }}
                />
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-linear-to-t from-black via-black/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500" />
                
                {/* Content */}
                    <div className="absolute inset-0 p-8 md:p-10 flex flex-col justify-end">
                        {/* Icon */}
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            whileInView={{ scale: 1, opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.3 + index * 0.2 }}
                            className="w-14 h-14 rounded-2xl gradient-gold flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300"
                        >
                            <Icon className="w-7 h-7 text-black" />
                        </motion.div>
                    
                        {/* Subtitle */}
                        <span className="text-[#D4AF37] bg-black/5 text-sm font-medium tracking-wider uppercase mb-2">
                            {subtitle}
                        </span>
                        
                        {/* Title */}
                        <h3 className="text-3xl md:text-4xl font-bold mb-4 group-hover:text-[#D4AF37] transition-colors duration-300">
                            {title}
                        </h3>
                    
                        {/* Description */}
                        <p className="text-white/60 mb-6 max-w-md line-clamp-3">
                            {description}
                        </p>
                        
                        {/* CTA Button */}
                        <Link
                            href={ctaLink}
                            className="inline-flex items-center gap-3 px-6 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full w-fit group/btn hover:bg-[#D4AF37] hover:border-[#D4AF37] hover:text-black transition-all duration-300"
                        >
                            <span className="font-semibold">{ctaText}</span>
                            <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                
                {/* Corner Accent */}
                <div className="absolute top-6 right-6 w-20 h-20 border border-[#D4AF37]/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>
        </motion.div>
    );
}