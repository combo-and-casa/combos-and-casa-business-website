'use client';
import {useState} from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { navItems, restaurantItems } from "../utils/constents/index";
import Link from "next/link";


export default function Footer() {
    const [restaurantDropdownOpen, setRestaurantDropdownOpen] = useState(false);

    return (
        <footer className="bg-[#0A0A0A] border-t border-white/5 py-16">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
                <div className="md:col-span-2">
                    <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 gradient-gold rounded-lg flex items-center justify-center">
                        <span className="text-black font-bold text-xl">C&C</span>
                    </div>
                    <span className="text-xl font-semibold">COMBOS & CASA</span>
                    </div>
                    <p className="text-white/50 max-w-md">
                    A premium lifestyle destination combining world-class dining, 
                    state-of-the-art fitness, and unforgettable events.
                    </p>
                </div>
                <div>
                    <h4 className="font-semibold mb-4 text-gold">Quick Links</h4>
                    <div className="space-y-2">
                        <div 
                            className="relative"
                            onMouseEnter={() => setRestaurantDropdownOpen(true)}
                            onMouseLeave={() => setRestaurantDropdownOpen(false)}
                        >
                            <button className="font-medium text-white/50 hover:text-white transition-colors duration-300 relative group flex items-center gap-1">
                                Nankwaase Bar & Restaurant
                                <ChevronDown className="w-4 h-4" />
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gold group-hover:w-full transition-all duration-300" />
                            </button>
                            
                            <AnimatePresence>
                            {restaurantDropdownOpen && (
                                <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                                className="absolute top-full mt-2 bg-[#1A1A1A] border border-white/10 rounded-xl overflow-hidden min-w-40 shadow-2xl"
                                >
                                {restaurantItems.map((item) => (
                                    <Link
                                    key={item.pageName}
                                    href={item.pathname}
                                    className="block px-4 py-3 text-sm text-white/50 hover:text-white hover:bg-white/5 transition-colors"
                                    >
                                    {item.pageName}
                                    </Link>
                                ))}
                                </motion.div>
                            )}
                            </AnimatePresence>
                        </div>

                        {navItems.map((item) => (
                            <Link
                            key={item.pageName}
                            href={item.pathname}
                            className="block text-white/50 hover:text-white transition-colors"
                            >
                            {item.pageName}
                            </Link>
                        ))}
                    </div>
                </div>
                <div>
                    <h4 className="font-semibold mb-4 text-gold">Contact</h4>
                    <div className="space-y-3 text-white/50">
                        <a href="https://goo.gl/maps/YourLocation" target="_blank" rel="noopener noreferrer" className="block text-white/50 hover:underline">
                            <p>East Legon Hills</p>
                            <p>Accra, Ghana</p>
                        </a>
                        <a href="mailto:info@combosandcasagh.com" className="block text-gold hover:underline">
                            info@combosandcasagh.com
                        </a>
                        <a href="tel:+233509251984" className="block text-gold hover:underline">
                            +233 50 925 1984
                        </a>
                    </div>
                </div>
                </div>
                <div className="mt-12 pt-8 border-t border-white/5 text-center text-white/30 text-sm">
                © 2026 COMBOS & CASA. All rights reserved.
                </div>
            </div>
        </footer>
    );
}