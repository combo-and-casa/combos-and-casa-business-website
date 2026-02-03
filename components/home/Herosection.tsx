'use client';

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronDown, Play } from "lucide-react";

export default function HeroSection() {
    const [mounted, setMounted] = useState(false);
    const [particles, setParticles] = useState<Array<{ x: number; y: number; duration: number }>>([]);

    useEffect(() => {
        // Generate particles once on mount
        const newParticles = Array.from({ length: 20 }, () => ({
            x: Math.random() * window.innerWidth,
            y: window.innerHeight + 10,
            duration: Math.random() * 10 + 10
        }));
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setParticles(newParticles);
        setMounted(true);
    }, []);

  const scrollToServices = () => {
    document.getElementById("services")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background Video/Image */}
      <div className="absolute inset-0">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1920&q=80')"
          }}
        />
        <div className="absolute inset-0 bg-linear-to-b from-black/70 via-black/50 to-[#0A0A0A]" />
      </div>

      {/* Animated Particles */}
      <div className="absolute inset-0 overflow-hidden">
        {mounted && particles.map((particle, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-[#D4AF37]/30 rounded-full"
            initial={{ 
              x: particle.x, 
              y: particle.y
            }}
            animate={{ 
              y: -10,
              x: particle.x
            }}
            transition={{ 
              duration: particle.duration,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <span className="inline-block px-4 py-2 rounded-full border border-[#D4AF37]/30 text-[#D4AF37] text-sm font-medium tracking-wider mb-6">
            PREMIUM LIFESTYLE DESTINATION
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6"
        >
          <span className="block">Dine. Train.</span>
          <span className="block bg-linear-to-r from-[#D4AF37] via-[#F4E4BA] to-[#D4AF37] bg-clip-text text-transparent">
            Celebrate.
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto mb-10"
        >
          Experience the pinnacle of luxury lifestyle with our world-class restaurant, 
          state-of-the-art fitness center, and exclusive event spaces.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <button
            onClick={scrollToServices}
            className="group px-8 py-4 gradient-gold text-black font-semibold rounded-full hover:scale-105 transition-all duration-300 flex items-center gap-2"
          >
            Explore Our World
            <ChevronDown className="w-4 h-4 group-hover:translate-y-1 transition-transform" />
          </button>
          <button className="px-8 py-4 border border-white/20 rounded-full hover:border-[#D4AF37] hover:text-[#D4AF37] transition-all duration-300 flex items-center gap-2">
            <Play className="w-4 h-4" />
            Watch Video
          </button>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2"
        >
          <motion.div
            animate={{ opacity: [1, 0, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-1 h-2 bg-[#D4AF37] rounded-full"
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
