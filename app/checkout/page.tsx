'use client';

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { 
  ArrowLeft, 
  Check,
  ShoppingBag,
  User as UserIcon,
  CreditCard,
  CheckCircle,
  Loader2,
  MapPin,
  Phone
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image_url?: string;
}

interface OrderData {
  customer_name: string;
  customer_phone: string;
  customer_address: string;
  delivery_option: string;
  notes: string;
  payment_method: string;
}

export default function Checkout() {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  // Initialize cart from localStorage during state initialization
  const [cart] = useState<CartItem[]>(() => {
    if (typeof window !== 'undefined') {
      const savedCart = JSON.parse(localStorage.getItem("cart") || "[]");
      return savedCart;
    }
    return [];
  });

  const [orderData, setOrderData] = useState<OrderData>({
    customer_name: "",
    customer_phone: "",
    customer_address: "",
    delivery_option: "pickup",
    notes: "",
    payment_method: "paystack"
  });

  useEffect(() => {
    // Redirect to menu if cart is empty
    if (cart.length === 0) {
      router.push("/nankwaase-bar-and-restaurant/menu");
    }
  }, [cart.length, router]);

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const tax = subtotal * 0.08;
  const total = subtotal + tax;

  const handleNextStep = () => {
    if (step === 1) {
      setStep(2);
    } else if (step === 2) {
      handlePayment();
    }
  };

  const handlePayment = async () => {
    setIsSubmitting(true);

    try {
      // Generate order reference inside try block to avoid React 19 compiler warnings
      const timestamp = new Date().getTime();
      const randomId = crypto.randomUUID().slice(0, 8).toUpperCase();
      const orderRef = `ORD-${timestamp}-${randomId}`;
      const paymentRef = `PAY-${new Date().getTime()}`;

      // Simulate API call to create order
      await new Promise(resolve => setTimeout(resolve, 2000));

      const order = {
        items: cart.map(item => ({
          menu_item_id: item.id,
          name: item.name,
          quantity: item.quantity,
          price: item.price
        })),
        subtotal,
        tax,
        total,
        status: "pending",
        payment_status: "completed",
        order_reference: orderRef,
        payment_reference: paymentRef,
        ...orderData
      };

      console.log("Order created:", order);

      // Clear cart
      localStorage.setItem("cart", JSON.stringify([]));
      window.dispatchEvent(new Event("storage"));

      setStep(3);
      setIsSubmitting(false);
    } catch (error) {
      console.error("Payment error:", error);
      setIsSubmitting(false);
      alert("Payment failed. Please try again.");
    }
  };

  const canProceedStep1 = cart.length > 0;
  const canProceedStep2 = orderData.customer_name && orderData.customer_phone && 
    (orderData.delivery_option === "pickup" || orderData.customer_address);

  // Step 3: Success
  if (step === 3) {
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
          <h2 className="text-3xl font-bold mb-2">Order Confirmed!</h2>
          <p className="text-white/60 mb-8">
            Your order has been placed successfully. You can track it in your dashboard.
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
      <div className="max-w-5xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link
            href="/nankwaase-bar-and-restaurant/menu"
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-3xl font-bold">Checkout</h1>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-12">
          {[1, 2, 3].map((s, idx) => (
            <div key={s} className="flex items-center">
              <div className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                  step >= s 
                    ? "border-[#D4AF37] bg-[#D4AF37] text-black" 
                    : "border-white/20 text-white/40"
                }`}>
                  {step > s ? <Check className="w-5 h-5" /> : s}
                </div>
              </div>
              {idx < 2 && (
                <div className={`w-16 h-0.5 ${step > s ? "bg-[#D4AF37]" : "bg-white/20"}`} />
              )}
            </div>
          ))}
        </div>

        <div className="flex items-center justify-center gap-8 mb-12 text-sm">
          <span className={step >= 1 ? "text-[#D4AF37]" : "text-white/40"}>Order Summary</span>
          <span className={step >= 2 ? "text-[#D4AF37]" : "text-white/40"}>Details & Payment</span>
          <span className={step >= 3 ? "text-[#D4AF37]" : "text-white/40"}>Confirmation</span>
        </div>

        <AnimatePresence mode="wait">
          {/* Step 1: Order Summary */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-8"
            >
              <div className="lg:col-span-2 space-y-4">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-[#D4AF37]" />
                  Review Your Order
                </h2>
                {cart.map((item) => (
                  <div key={item.id} className="bg-[#1A1A1A] rounded-xl p-4 border border-white/5 flex items-center gap-4">
                    {item.image_url && (
                      <Image src={item.image_url} alt={item.name} width={80} height={80} className="w-20 h-20 rounded-lg object-cover" />
                    )}
                    <div className="flex-1">
                      <h3 className="font-semibold">{item.name}</h3>
                      <p className="text-white/50 text-sm">Quantity: {item.quantity}</p>
                    </div>
                    <p className="text-[#D4AF37] font-bold">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>

              <div className="lg:col-span-1">
                <div className="bg-[#1A1A1A] rounded-xl p-6 border border-white/5 sticky top-28">
                  <h3 className="text-xl font-bold mb-4">Order Total</h3>
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-white/60">
                      <span>Subtotal</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-white/60">
                      <span>Tax (8%)</span>
                      <span>${tax.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-xl font-bold pt-3 border-t border-white/10">
                      <span>Total</span>
                      <span className="text-[#D4AF37]">${total.toFixed(2)}</span>
                    </div>
                  </div>
                  <button
                    onClick={handleNextStep}
                    disabled={!canProceedStep1}
                    className="w-full py-4 gradient-gold text-black font-semibold rounded-xl hover:scale-[1.02] transition-transform disabled:opacity-50"
                  >
                    Proceed to Checkout
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 2: Customer Details & Payment */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-8"
            >
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-[#1A1A1A] rounded-xl p-6 border border-white/5">
                  <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <UserIcon className="w-5 h-5 text-[#D4AF37]" />
                    Customer Information
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-white/70">Full Name *</Label>
                      <Input
                        value={orderData.customer_name}
                        onChange={(e) => setOrderData({...orderData, customer_name: e.target.value})}
                        placeholder="John Doe"
                        className="bg-white/5 border-white/10 text-white mt-2"
                      />
                    </div>
                    <div>
                      <Label className="text-white/70 flex items-center gap-2">
                        <Phone className="w-4 h-4" /> Phone Number *
                      </Label>
                      <Input
                        value={orderData.customer_phone}
                        onChange={(e) => setOrderData({...orderData, customer_phone: e.target.value})}
                        placeholder="+1 (555) 123-4567"
                        className="bg-white/5 border-white/10 text-white mt-2"
                      />
                    </div>
                  </div>

                  <div className="mt-6">
                    <Label className="text-white/70">Delivery Option *</Label>
                    <RadioGroup value={orderData.delivery_option} onValueChange={(value) => setOrderData({...orderData, delivery_option: value})} className="mt-3 space-y-3">
                      <div className="flex items-center space-x-2 p-4 rounded-lg border border-white/10 bg-white/5">
                        <RadioGroupItem value="pickup" id="pickup" />
                        <Label htmlFor="pickup" className="flex-1 cursor-pointer">
                          <span className="font-semibold">Pickup</span>
                          <p className="text-sm text-white/50">Pick up from restaurant</p>
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 p-4 rounded-lg border border-white/10 bg-white/5">
                        <RadioGroupItem value="delivery" id="delivery" />
                        <Label htmlFor="delivery" className="flex-1 cursor-pointer">
                          <span className="font-semibold">Delivery</span>
                          <p className="text-sm text-white/50">Deliver to your address</p>
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {orderData.delivery_option === "delivery" && (
                    <div className="mt-4">
                      <Label className="text-white/70 flex items-center gap-2">
                        <MapPin className="w-4 h-4" /> Delivery Address *
                      </Label>
                      <Textarea
                        value={orderData.customer_address}
                        onChange={(e) => setOrderData({...orderData, customer_address: e.target.value})}
                        placeholder="123 Main St, Apt 4B, New York, NY 10001"
                        className="bg-white/5 border-white/10 text-white mt-2"
                      />
                    </div>
                  )}

                  <div className="mt-4">
                    <Label className="text-white/70">Special Instructions (Optional)</Label>
                    <Textarea
                      value={orderData.notes}
                      onChange={(e) => setOrderData({...orderData, notes: e.target.value})}
                      placeholder="Allergies, preferences, etc."
                      className="bg-white/5 border-white/10 text-white mt-2"
                    />
                  </div>
                </div>

                <div className="bg-[#1A1A1A] rounded-xl p-6 border border-white/5">
                  <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-[#D4AF37]" />
                    Payment Method
                  </h2>
                  <div className="p-4 rounded-lg border border-[#D4AF37]/30 bg-[#D4AF37]/5">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg bg-[#D4AF37] flex items-center justify-center">
                        <CreditCard className="w-6 h-6 text-black" />
                      </div>
                      <div>
                        <p className="font-semibold">Pay with Paystack</p>
                        <p className="text-sm text-white/50">Secure payment via Paystack</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-1">
                <div className="bg-[#1A1A1A] rounded-xl p-6 border border-white/5 sticky top-28">
                  <h3 className="text-xl font-bold mb-4">Order Summary</h3>
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-white/60">
                      <span>Subtotal</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-white/60">
                      <span>Tax</span>
                      <span>${tax.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-xl font-bold pt-3 border-t border-white/10">
                      <span>Total</span>
                      <span className="text-[#D4AF37]">${total.toFixed(2)}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setStep(1)}
                    className="w-full py-3 mb-3 border border-white/20 rounded-xl hover:border-[#D4AF37] transition-all"
                  >
                    Back to Cart
                  </button>
                  <button
                    onClick={handleNextStep}
                    disabled={!canProceedStep2 || isSubmitting}
                    className="w-full py-4 gradient-gold text-black font-semibold rounded-xl hover:scale-[1.02] transition-transform disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Processing Payment...
                      </>
                    ) : (
                      <>Pay ${total.toFixed(2)}</>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}