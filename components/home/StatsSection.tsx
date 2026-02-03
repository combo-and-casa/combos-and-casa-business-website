import React from "react";
import { motion } from "framer-motion";
import { stats } from "@/utils/constents";
export default function StatsSection() {
  

  return (
    <section className="py-20 px-6 lg:px-8 bg-linear-to-b from-[#0A0A0A] to-[#111]">
        <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
                {stats.map((stat, index) => (
                    <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="text-center"
                    >
                        <motion.span
                            initial={{ scale: 0.5 }}
                            whileInView={{ scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.2 + index * 0.1, type: "spring" }}
                            className="block text-4xl md:text-5xl lg:text-6xl font-bold bg-linear-to-r from-[#D4AF37] to-[#F4E4BA] bg-clip-text text-transparent mb-2"
                        >
                            {stat.number}
                        </motion.span>
                        <span className="text-white/50 text-sm md:text-base">{stat.label}</span>
                    </motion.div>
                ))}
            </div>
        </div>
    </section>
  );
}