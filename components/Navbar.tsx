"use client"
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import type { NavItemsProps } from '@/utils/types/index';
import Link from 'next/link';
import { ChevronDown, ShoppingBag, User, Menu, X } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { useApp } from '@/lib/context/AppContext';

export default function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [restaurantDropdownOpen, setRestaurantDropdownOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { cartCount, user } = useApp();
    const pathname = usePathname();

    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.scrollY;
            setIsScrolled(scrollTop > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);
    
    const isHomepage = pathname === "/";

    const navItems: NavItemsProps[] = [
        // { pageName: "Home", pathname: "/" },
        // { pageName: "Restaurant", pathname: "/restaurant" },
        { pageName: "Fresh & Fit", pathname: "/fresh&fit" },
        { pageName: "Event Spaces", pathname: "/event-space" },
        { pageName: "Contact", pathname: "/contact" },
    ];
    const restaurantItems: NavItemsProps[] = [
        { pageName: "About", pathname: "/nankwaase-bar-and-restaurant/about" },
        { pageName: "Menu", pathname: "/nankwaase-bar-and-restaurant/menu" },
        { pageName: "Reservations", pathname: "/nankwaase-bar-and-restaurant/reservations" },
    ];

    return (
            <motion.nav
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
                    isScrolled || !isHomepage
                    ? "bg-[#0A0A0A]/95 backdrop-blur-lg border-b border-white/5"
                    : "bg-transparent"
                }`}
            >
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="flex items-center justify-between h-20">
                        {/* Logo */}
                        <Link href="/" className="flex items-center gap-3">
                            <div className="w-12 h-12 gradient-gold rounded-lg flex items-center justify-center">
                                <span className="text-black font-bold text-xl">C&C</span>
                            </div>
                            <span className="text-xl font-semibold tracking-tight">COMBOS & CASA</span>
                        </Link>

                        {/* Desktop Nav */}
                        <div className="hidden md:flex items-center gap-8">
                            {/* Restaurant Dropdown */}
                            <div 
                                className="relative"
                                onMouseEnter={() => setRestaurantDropdownOpen(true)}
                                onMouseLeave={() => setRestaurantDropdownOpen(false)}
                            >
                                <button className="text-sm font-medium text-white/70 hover:text-white transition-colors duration-300 relative group flex items-center gap-1">
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
                                        className="block px-4 py-3 text-sm text-white/70 hover:text-white hover:bg-white/5 transition-colors"
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
                                className="text-sm font-medium text-white/70 hover:text-white transition-colors duration-300 relative group"
                                >
                                {item.pageName}
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gold group-hover:w-full transition-all duration-300" />
                                </Link>
                            ))}
                        </div>

                        {/* Right Actions */}
                        <div className="hidden md:flex items-center gap-4">
                        <Link
                            href="/cart"
                            className="relative p-2 text-white/70 hover:text-white transition-colors"
                        >
                            <ShoppingBag className="w-5 h-5" />
                            {cartCount > 0 && (
                            <span className="absolute -top-1 -right-1 w-5 h-5 bg-gold text-black text-xs font-bold rounded-full flex items-center justify-center">
                                {cartCount}
                            </span>
                            )}
                        </Link>
                        {user ? (
                            <Link
                            href="/dashboard"
                            className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/20 hover:border-gold hover:text-gold transition-all duration-300"
                            >
                            <User className="w-4 h-4" />
                            <span className="text-sm font-medium">Dashboard</span>
                            </Link>
                        ) : (
                            <Link
                            href="/auth/signin"
                            className="px-6 py-2.5 gradient-gold text-black font-semibold rounded-full hover:scale-105 transition-transform duration-300"
                            >
                            Sign In
                            </Link>
                        )}
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                        className="md:hidden p-2"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        >
                        {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                <AnimatePresence>
                    {isMobileMenuOpen && (
                        <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-[#0A0A0A]/98 backdrop-blur-xl border-t border-white/5"
                        >
                        <div className="px-6 py-6 space-y-4">
                            {/* Restaurant submenu */}
                            <div>
                            <p className="text-lg text-white/70 mb-2 font-semibold">Nankwaase Bar & Restaurant</p>
                            {restaurantItems.map((item) => (
                                <Link
                                    key={item.pageName}
                                    href={(item.pathname)}
                                    className="block text-sm font-medium text-white/50 hover:text-white py-2 pl-4"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                {item.pageName}
                                </Link>
                            ))}
                            </div>
                            
                            {navItems.map((item) => (
                            <Link
                                key={item.pageName}
                                href={item.pathname}
                                className="block text-lg font-medium text-white/70 hover:text-white py-2"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                {item.pageName}
                            </Link>
                            ))}
                            <div className="pt-4 border-t border-white/10 flex flex-col gap-3">
                            <Link
                                href="/cart"
                                className="flex items-center gap-3 text-white/70"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                <ShoppingBag className="w-5 h-5" />
                                Cart {cartCount > 0 && `(${cartCount})`}
                            </Link>
                            {user ? (
                                <Link
                                href="/dashboard"
                                className="flex items-center gap-3 text-white/70"
                                onClick={() => setIsMobileMenuOpen(false)}
                                >
                                <User className="w-5 h-5" />
                                Dashboard
                                </Link>
                            ) : (
                                <Link
                                href="/auth/signin"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="w-full py-3 gradient-gold text-black font-semibold rounded-full text-center"
                                >
                                Sign In
                                </Link>
                            )}
                            </div>
                        </div>
                        </motion.div>
                    )}
                </AnimatePresence>  
            </motion.nav>
    );
}