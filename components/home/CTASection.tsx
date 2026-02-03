import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export default function CTASection() {
  return (
    <section className="py-24 md:py-32 px-6 lg:px-8 relative overflow-hidden">
      {/* Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1540541338287-41700207dee6?w=1920&q=80')"
        }}
      />
      <div className="absolute inset-0 bg-black/80" />
      
      {/* Animated Border */}
      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
        className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-[#D4AF37] to-transparent"
      />

      <div className="max-w-4xl mx-auto relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Ready to{" "}
            <span className="bg-linear-to-r from-[#D4AF37] via-[#F4E4BA] to-[#D4AF37] bg-clip-text text-transparent">
              Elevate
            </span>{" "}
            Your Lifestyle?
          </h2>
          <p className="text-white/60 text-lg md:text-xl max-w-2xl mx-auto mb-10">
            Join thousands of members who have discovered the ultimate destination 
            for dining, fitness, and celebration.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/fresh&fit"
              className="group px-8 py-4 gradient-gold text-black font-semibold rounded-full hover:scale-105 transition-all duration-300 flex items-center gap-2"
            >
              Become a Member
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/nankwaase-bar-and-restaurant/menu"
              className="px-8 py-4 border border-white/20 rounded-full hover:border-[#D4AF37] hover:text-[#D4AF37] transition-all duration-300"
            >
              View Menu
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}