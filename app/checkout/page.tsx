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

  MapPin,
  Phone,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useApp } from "@/lib/context/AppContext";
import { supabase } from "@/lib/supabase/client";
import { PaystackButton } from 'react-paystack';
import { toast } from 'sonner';

interface OrderData {
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  order_type: 'delivery' | 'pickup';
  delivery_address: string;
  delivery_notes: string;
  pickup_time: string;
  additional_note: string;
  payment_method: string;
}

export default function Checkout() {
  const { cart, clearCart, user } = useApp();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderReference, setOrderReference] = useState("");
  const router = useRouter();

  const [orderData, setOrderData] = useState<OrderData>({
    customer_name: "",
    customer_email: "",
    customer_phone: "",
    order_type: "pickup",
    delivery_address: "",
    pickup_time: "",
    delivery_notes: "",
    additional_note: "",
    payment_method: ""
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

  // Paystack configuration
  const publicKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || '';
  const currency = process.env.NEXT_PUBLIC_PAYSTACK_CURRENCY || 'GHS';
  const paystackConfig = {
    reference: `PAY-${new Date().getTime()}-${crypto.randomUUID().slice(0, 8)}`,
    email: orderData.customer_email,
    amount: Math.round(total * 100), // Amount in kobo/pesewas
    publicKey,
    currency,
    metadata: {
      custom_fields: [
        {
          display_name: 'Customer Name',
          variable_name: 'customer_name',
          value: orderData.customer_name
        },
        {
          display_name: 'Customer Phone',
          variable_name: 'customer_phone',
          value: orderData.customer_phone
        },
        {
          display_name: 'Order Type',
          variable_name: 'order_type',
          value: orderData.order_type
        }
      ]
    }
  };

  const handleNextStep = () => {
    if (step === 1) {
      setStep(2);
    } else if (step === 2) {
      handlePayment();
    }
  };

  const handlePayment = () => {
    // This will be triggered by the PaystackButton
    setIsSubmitting(true);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handlePaystackSuccess = async (reference: any) => {
    try {
      toast.loading('Verifying payment...');
      
      // Verify payment with backend
      const verifyResponse = await fetch(`/api/payments/verify?reference=${reference.reference}`);
      const verifyData = await verifyResponse.json();
      console.log('Payment verification response:', verifyData);

      if (!verifyData.success) {
        toast.dismiss();
        toast.error('Payment verification failed. Please contact support.');
        setIsSubmitting(false);
        return;
      }

      toast.dismiss();
      toast.success('Payment verified successfully!');

      // Payment verified, now save order to database
      const timestamp = new Date().getTime();
      const randomId = crypto.randomUUID().slice(0, 8).toUpperCase();
      const orderRef = `ORD-${timestamp}-${randomId}`;

      console.log('Attempting to save order with data:', {
        user_id: user?.id || null,
        customer_name: orderData.customer_name,
        customer_email: orderData.customer_email,
        customer_phone: orderData.customer_phone,
        order_type: orderData.order_type,
        pickup_time: orderData.order_type === 'pickup' ? orderData.pickup_time : null,
        delivery_address: orderData.order_type === 'delivery' ? orderData.delivery_address : null,
        delivery_notes: orderData.delivery_notes || null,
        additional_note: orderData.additional_note || null,
        total_amount: total,
        status: 'confirmed',
        payment_reference: reference.reference,
        payment_method: orderData.payment_method
      });

      const { data: orderInsert, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user?.id || null,
          customer_name: orderData.customer_name,
          customer_email: orderData.customer_email,
          customer_phone: orderData.customer_phone,
          order_type: orderData.order_type,
          pickup_time: orderData.order_type === 'pickup' ? orderData.pickup_time : null,
          delivery_address: orderData.order_type === 'delivery' ? orderData.delivery_address : null,
          delivery_notes: orderData.delivery_notes || null,
          additional_note: orderData.additional_note || null,
          total_amount: total,
          status: 'confirmed',
          payment_reference: reference.reference,
          payment_method: orderData.payment_method
        })
        .select()
        .single();

      if (orderError) {
        console.error('Order save error:', orderError);
        console.error('Error details:', JSON.stringify(orderError, null, 2));
        toast.error(`Order could not be saved: ${orderError.message || 'Unknown error'}. Please contact support with your payment reference: ${reference.reference}`);
        setIsSubmitting(false);
        return;
      }

      // Insert order items
      const orderItems = cart.map(item => ({
        order_id: orderInsert.id,
        menu_item_id: item.id,
        quantity: item.quantity,
        price: item.price
      }));

      console.log('Attempting to save order items:', orderItems);

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) {
        console.error('Order items error:', itemsError);
        console.error('Order items error details:', JSON.stringify(itemsError, null, 2));
        toast.error(`Order items could not be saved: ${itemsError.message || 'Unknown error'}. Order ID: ${orderInsert.id}`);
        setIsSubmitting(false);
        return;
      }

      console.log('Order and items saved successfully!');

      // Clear cart and show success
      clearCart();
      setOrderReference(orderRef);
      setStep(3);
      setIsSubmitting(false);
    } catch (error) {
      console.error('Payment processing error:', error);
      toast.error('An error occurred while processing your order. Please contact support.');
      setIsSubmitting(false);
    }
  };

  const handlePaystackClose = () => {
    toast.error('Payment cancelled');
    setIsSubmitting(false);
  };

  const canProceedStep1 = cart.length > 0;
  const canProceedStep2 = orderData.customer_name && orderData.customer_email && orderData.customer_phone && 
    (orderData.order_type === "pickup" || orderData.delivery_address);

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
          {orderReference && (
            <p className="text-[#D4AF37] font-mono text-sm mb-2">{orderReference}</p>
          )}
          <p className="text-white/60 mb-8">
            Your order has been placed successfully. Sign in to your dashboard to track it.
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
                    <p className="text-[#D4AF37] font-bold">GHS {(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>

              <div className="lg:col-span-1">
                <div className="bg-[#1A1A1A] rounded-xl p-6 border border-white/5 sticky top-28">
                  <h3 className="text-xl font-bold mb-4">Order Total</h3>
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-white/60">
                      <span>Subtotal</span>
                      <span>GHS {subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-white/60">
                      <span>Tax (8%)</span>
                      <span>GHS {tax.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-xl font-bold pt-3 border-t border-white/10">
                      <span>Total</span>
                      <span className="text-[#D4AF37]">GHS {total.toFixed(2)}</span>
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
                      <Label className="text-white/70">Email Address *</Label>
                      <Input
                        type="email"
                        value={orderData.customer_email}
                        onChange={(e) => setOrderData({...orderData, customer_email: e.target.value})}
                        placeholder="john@example.com"
                        className="bg-white/5 border-white/10 text-white mt-2"
                      />
                    </div>
                    <div className="md:col-span-2">
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
                    <RadioGroup value={orderData.order_type} onValueChange={(value) => setOrderData({...orderData, order_type: value as 'delivery' | 'pickup'})} className="mt-3 space-y-3">
                      <div className="flex items-center gap-4 p-4 rounded-lg border border-white/10 bg-white/5">
                        <RadioGroupItem value="pickup" id="pickup" color="yellow"/>
                        <Label htmlFor="pickup" className="flex flex-col items-start cursor-pointer">
                          <p className="font-semibold">Pickup</p>
                          <p className="text-xs text-white/50 mt-0">Pick up from restaurant</p>
                        </Label>
                      </div>
                      <div className="flex items-center gap-4 p-4 rounded-lg border border-white/10 bg-white/5">
                        <RadioGroupItem value="delivery" id="delivery" />
                        <Label htmlFor="delivery" className="flex flex-col items-start cursor-pointer">
                          <p className="font-semibold">Delivery</p>
                          <p className="text-xs text-white/50 mt-0">Deliver to your address</p>
                        </Label>
                      </div>
                    </RadioGroup>
                    {orderData.order_type === "delivery" && (
                      <div>
                        <div>
                          <Label className="text-white/70 flex items-center gap-2 mt-4">
                            <MapPin className="w-4 h-4" /> Delivery Address *
                          </Label>
                          <Input
                          type="text"
                          value={orderData.delivery_address}
                          onChange={(e) => setOrderData({...orderData, delivery_address: e.target.value})}
                          placeholder="123 Main St, Apt 4B, New York, NY 10001"
                          className="bg-white/5 border-white/10 text-white mt-2"
                        />
                        </div>
                        <div className="mt-4">
                        <Label className="text-white/70">Delivery Notes (Optional)</Label>
                        <Textarea
                          value={orderData.delivery_notes}
                          onChange={(e) => setOrderData({...orderData, delivery_notes: e.target.value})}
                          placeholder="Gate code, special delivery instructions, etc."
                          className="bg-white/5 border-white/10 text-white mt-2"
                        />
                      </div>
                      </div>
                      
                    )}
                    {orderData.order_type === "pickup" && (                      
                      <div>
                        <Label className="text-white/70 flex items-center gap-2 mt-4">
                          <MapPin className="w-4 h-4" /> Pickup time *
                        </Label>
                        <Input
                        type="time"
                        value={orderData.pickup_time}
                        onChange={(e) => setOrderData({...orderData, pickup_time: e.target.value})}
                        placeholder="Select a time"
                        className="bg-white/5 border-white/10 text-white mt-2"
                      />
                      </div>                      
                    )}
                  </div>

                  <div className="mt-4">
                    <Label className="text-white/70">Additional Notes (Optional)</Label>
                    <Textarea
                      value={orderData.additional_note}
                      onChange={(e) => setOrderData({...orderData, additional_note: e.target.value})}
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
                      <RadioGroup  value={orderData.payment_method} onValueChange={(value) => setOrderData({...orderData, payment_method: value})} className="w-full">
                        <div className="flex items-center gap-4 p-4 rounded-lg border border-white/10 bg-white/5">
                          <RadioGroupItem value="momo" id="momo" color="yellow" />
                          <Label htmlFor="momo" className="cursor-pointer">
                            Mobile Money
                          </Label>
                        </div>
                        <div className="flex items-center gap-4 p-4 rounded-lg border border-white/10 bg-white/5">
                          <RadioGroupItem value="card" id="card" color="yellow"/>
                          <Label htmlFor="card" className="flex flex-col items-start cursor-pointer">
                            Debit/Credit Card
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>
                    <p className="text-left text-white/40 text-xs mt-4">
                      Secure payment powered by PayStack
                    </p>
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
                  {publicKey && orderData.customer_email ? (
                    <PaystackButton
                      reference={paystackConfig.reference}
                      email={paystackConfig.email}
                      amount={paystackConfig.amount}
                      publicKey={paystackConfig.publicKey}
                      currency={paystackConfig.currency}
                      metadata={paystackConfig.metadata}
                      text={isSubmitting ? 'Processing...' : `Pay ${currency === 'GHS' ? '₵' : currency === 'NGN' ? '₦' : currency === 'ZAR' ? 'R' : '$'}${total.toFixed(2)}`}
                      onSuccess={handlePaystackSuccess}
                      onClose={handlePaystackClose}
                      disabled={!canProceedStep2 || isSubmitting}
                      className="w-full py-4 gradient-gold text-black font-semibold rounded-xl hover:scale-[1.02] transition-transform disabled:opacity-50 flex items-center justify-center gap-2"
                    />
                  ) : (
                    <button
                      disabled={true}
                      className="w-full py-4 gradient-gold text-black font-semibold rounded-xl opacity-50 cursor-not-allowed"
                    >
                      {!publicKey ? 'Payment not configured' : 'Enter email to proceed'}
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}