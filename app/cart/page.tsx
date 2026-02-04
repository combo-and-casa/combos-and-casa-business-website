'use client';

import { useState, useEffect, useEffectEvent} from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { 
  ArrowLeft, 
  Plus, 
  Minus, 
  Trash2, 
  Clock, 
  CheckCircle,
  Loader2 
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image_url?: string;
}

export default function Cart() {
    const [cart, setCart] = useState<CartItem[]>([]);
    const [notes, setNotes] = useState("");
    const [pickupTime, setPickupTime] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [orderSuccess, setOrderSuccess] = useState(false);

    
    const updateCartEvent = useEffectEvent((newCart: CartItem[]) => {
        setCart(newCart);
        });

    useEffect(() => {
      const savedCart = JSON.parse(localStorage.getItem("cart") || "[]");
      // setCart(savedCart);
      updateCartEvent(savedCart)
      
    }, []);

    const updateCart = (newCart: CartItem[]) => {
        setCart(newCart);
        localStorage.setItem("cart", JSON.stringify(newCart));
        window.dispatchEvent(new Event("storage"));
    };

  const updateQuantity = (id: string, delta: number) => {
    const newCart = cart
      .map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + delta } : item
      )
      .filter((item) => item.quantity > 0);
    updateCart(newCart);
  };

  const removeItem = (id: string) => {
    updateCart(cart.filter((item) => item.id !== id));
  };

  const cartTotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const handleSubmitOrder = async () => {
    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));

    const orderData = {
      items: cart.map((item) => ({
        menu_item_id: item.id,
        name: item.name,
        quantity: item.quantity,
        price: item.price
      })),
      total: cartTotal,
      notes,
      pickup_time: pickupTime,
      status: "pending"
    };

    console.log("Order submitted:", orderData);

    updateCart([]);
    setOrderSuccess(true);
    setIsSubmitting(false);
  };

  if (orderSuccess) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] pt-20 flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.2 }}
            className="w-20 h-20 mx-auto mb-6 rounded-full gradient-gold flex items-center justify-center"
          >
            <CheckCircle className="w-10 h-10 text-black" />
          </motion.div>
          <h2 className="text-3xl font-bold mb-4">Order Confirmed!</h2>
          <p className="text-white/60 mb-8">
            Your order has been placed successfully. You can track its status in your dashboard.
          </p>
          <div className="flex flex-col gap-3">
            <Link
              href="/dashboard"
              className="py-4 gradient-gold text-black font-semibold rounded-xl hover:scale-[1.02] transition-transform text-center"
            >
              View My Orders
            </Link>
            <Link
              href="/nankwaase-bar-and-restaurant/menu"
              className="py-4 border border-white/20 rounded-xl hover:border-[#D4AF37] hover:text-[#D4AF37] transition-all text-center"
            >
              Order More
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] pt-20">
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link
            href="/nankwaase-bar-and-restaurant/menu"
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-3xl font-bold">Your Order</h1>
        </div>

        {cart.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <p className="text-white/50 text-lg mb-6">Your cart is empty</p>
            <Link
              href="/nankwaase-bar-and-restaurant/menu"
              className="inline-block px-6 py-3 gradient-gold text-black font-semibold rounded-full"
            >
              Browse Menu
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cart.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-[#1A1A1A] rounded-2xl p-4 border border-white/5"
                >
                  <div className="flex items-center gap-4">
                    {item.image_url && (
                      <Image
                        src={item.image_url}
                        alt={item.name}
                        width={80}
                        height={80}
                        className="w-20 h-20 rounded-xl object-cover"
                      />
                    )}
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{item.name}</h3>
                      <p className="text-[#D4AF37] font-medium">${item.price?.toFixed(2)}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2 bg-white/5 rounded-full p-1">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          className="p-2 hover:bg-white/10 rounded-full transition-colors"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-8 text-center font-medium">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          className="p-2 hover:bg-white/10 rounded-full transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="p-2 text-red-400 hover:bg-red-400/10 rounded-full transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-[#1A1A1A] rounded-2xl p-6 border border-white/5 sticky top-28"
              >
                <h3 className="text-xl font-bold mb-6">Order Summary</h3>

                {/* Pickup Time */}
                <div className="mb-4">
                  <label className="block text-sm text-white/60 mb-2">
                    <Clock className="w-4 h-4 inline mr-2" />
                    Pickup Time (optional)
                  </label>
                  <Input
                    type="time"
                    value={pickupTime}
                    onChange={(e) => setPickupTime(e.target.value)}
                    className="bg-white/5 border-white/10 text-white"
                  />
                </div>

                {/* Notes */}
                <div className="mb-6">
                  <label className="block text-sm text-white/60 mb-2">Special Instructions</label>
                  <Textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Any allergies or special requests..."
                    className="bg-white/5 border-white/10 text-white min-h-20"
                  />
                </div>

                {/* Summary */}
                <div className="space-y-3 border-t border-white/10 pt-4 mb-6">
                  <div className="flex justify-between text-white/60">
                    <span>Subtotal</span>
                    <span>${cartTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-white/60">
                    <span>Tax</span>
                    <span>${(cartTotal * 0.08).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-xl font-bold">
                    <span>Total</span>
                    <span className="text-[#D4AF37]">${(cartTotal * 1.08).toFixed(2)}</span>
                  </div>
                </div>

                <button
                  onClick={handleSubmitOrder}
                  disabled={isSubmitting}
                  className="w-full py-4 gradient-gold text-black font-semibold rounded-xl hover:scale-[1.02] transition-transform disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    "Place Order"
                  )}
                </button>
              </motion.div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}