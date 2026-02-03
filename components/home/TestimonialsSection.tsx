'use client';

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { testimonials } from "@/utils/constents";
import Image from "next/image";

export default function TestimonialsSection() {
    const [activeIndex, setActiveIndex] = useState(0);

    const nextTestimonial = () => {
        setActiveIndex((prev) => (prev + 1) % testimonials.length);
    };

    const prevTestimonial = () => {
        setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    };

    return (
        <section className="py-24 md:py-32 px-6 lg:px-8 bg-[#111] relative overflow-hidden">
            {/* Background Accent */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-200 h-200 bg-[#D4AF37]/5 rounded-full blur-3xl" />
            
            <div className="max-w-5xl mx-auto relative z-10">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <span className="inline-block px-4 py-2 rounded-full bg-[#D4AF37]/10 text-[#D4AF37] text-sm font-medium tracking-wider mb-4">
                        TESTIMONIALS
                    </span>
                    <h2 className="text-4xl md:text-5xl font-bold">
                        What Our <span className="text-[#D4AF37]">Members</span> Say
                    </h2>
                </motion.div>

                {/* Testimonial Carousel */}
                <div className="relative">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeIndex}
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -50 }}
                            transition={{ duration: 0.5 }}
                            className="bg-[#1A1A1A] rounded-3xl p-8 md:p-12 border border-white/5"
                        >
                            <Quote className="w-12 h-12 text-[#D4AF37]/30 mb-6" />
                        
                            <p className="text-xl md:text-2xl text-white/80 leading-relaxed mb-8">
                                &quot;{testimonials[activeIndex].text}&quot;
                            </p>
                            
                            <div className="flex items-center gap-4">
                                <Image
                                    src={testimonials[activeIndex].image}
                                    alt={testimonials[activeIndex].name}
                                    width={56}
                                    height={56}
                                    className="w-14 h-14 rounded-full object-cover border-2 border-[#D4AF37]"
                                />
                                <div>
                                    <h4 className="font-semibold text-lg">{testimonials[activeIndex].name}</h4>
                                    <p className="text-white/50">{testimonials[activeIndex].role}</p>
                                </div>
                            </div>
                        </motion.div>
                    </AnimatePresence>

                    {/* Navigation */}
                    <div className="flex items-center justify-center gap-4 mt-8">
                        <button
                            onClick={prevTestimonial}
                            className="p-3 rounded-full border border-white/20 hover:border-[#D4AF37] hover:text-[#D4AF37] transition-all"
                        >
                        <ChevronLeft className="w-5 h-5" />
                        </button>
                        
                        <div className="flex items-center gap-2">
                            {testimonials.map((_, index) => (
                                <button
                                key={index}
                                onClick={() => setActiveIndex(index)}
                                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                                    index === activeIndex ? "w-8 bg-[#D4AF37]" : "bg-white/30"
                                }`}
                                />
                            ))}
                        </div>
                        
                        <button
                            onClick={nextTestimonial}
                            className="p-3 rounded-full border border-white/20 hover:border-[#D4AF37] hover:text-[#D4AF37] transition-all"
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}
