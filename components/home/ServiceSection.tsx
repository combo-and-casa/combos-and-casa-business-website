'use client';
import React from "react";
import { motion } from "framer-motion";
import ServiceCard from "./ServiceCard";
import { services } from "../../utils/constents/index";

export default function ServicesSection() {

  return (
    <section id="services" className="py-24 md:py-32 px-6 lg:px-8 bg-[#0A0A0A]">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 md:mb-20"
        >
          <span className="inline-block px-4 py-2 rounded-full bg-[#D4AF37]/10 text-[#D4AF37] text-sm font-medium tracking-wider mb-4">
            OUR SERVICES
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Three Worlds,{" "}
            <span className="bg-linear-to-r from-[#D4AF37] via-[#F4E4BA] to-[#D4AF37] bg-clip-text text-transparent">
              One Destination
            </span>
          </h2>
          <p className="text-white/50 text-lg max-w-2xl mx-auto">
            Discover a seamless blend of exceptional dining, fitness excellence, 
            and unforgettable events under one roof.
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {services.map((service, index) => (
            <ServiceCard key={service.title} {...service} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}