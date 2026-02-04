'use client';

import { useState } from 'react';
import { motion } from "framer-motion";
// import { base44 } from "@/api/base44Client";
// import { useQuery } from "@tanstack/react-query";
import { 
  Clock,
  Heart,
  Coffee,
  ChevronDown,
  HandCoins
} from "lucide-react";
import PlanCard from "@/components/fitness/PlanCard";
import MembershipModal from "@/components/fitness/MembershipModal";
import Image from 'next/image';
import { planProps } from '@/utils/types';
import { features,plans } from '@/utils/constents';

export default function freahAndFit() {
  
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [selectedPlan, setSelectedPlan] = useState<planProps | null>(null);
  // eslint-disable-next-line react-hooks/rules-of-hooks, @typescript-eslint/no-unused-vars
  const [user, setUser] = useState(null);

  // const { data: plans = [], isLoading } = useQuery({
  //   queryKey: ["gymPlans"],
  //   queryFn: () => base44.entities.GymPlan.list()
  // });

  // React.useEffect(() => {
  //   const loadUser = async () => {
  //     try {
  //       const isAuth = await base44.auth.isAuthenticated();
  //       if (isAuth) {
  //         const userData = await base44.auth.me();
  //         setUser(userData);
  //       }
  //     } catch (e) {}
  //   };
  //   loadUser();
  // }, []);

  const scrollToPlans = () => {
    const plansSection = document.getElementById("plans");
    if (plansSection) {
      plansSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  const scrollToOfferings = () => {
    const offeringsSection = document.getElementById("offerings");
    if (offeringsSection) {
      offeringsSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleSelectPlan = (plan: planProps) => {
    // if (!user) {
    //   base44.auth.redirectToLogin(window.location.href);
    //   return;
    // }
    
    setSelectedPlan(plan);
  };

  const handleSuccess = () => {
    setSelectedPlan(null);
    
  };

  
  return (
    <div className="min-h-screen bg-[#0A0A0A] pt-20">
      {/* Hero */}
      <section className="relative py-20 md:py-32 px-6 lg:px-8 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1920&q=80')" }}
        />
        <div className="absolute inset-0 bg-linear-to-b from-[#0A0A0A] via-transparent to-[#0A0A0A]" />
        
        {/* Animated gradient orbs */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute top-1/4 right-1/4 w-96 h-96 bg-[#D4AF37]/10 rounded-full blur-3xl"
        />
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
             initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#D4AF37]/10 text-[#D4AF37] text-sm font-medium tracking-wider mb-6"
          >
            <Heart className="w-4 h-4" />
            TRANSFORM YOUR BODY & MIND
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-5xl md:text-7xl font-bold mb-6"
          >
            Fitness <span className="text-[#D4AF37]">Reimagined</span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
            className="text-white/60 text-lg md:text-xl max-w-2xl mx-auto mb-8"
          >
            Join our premium fitness center and experience world-class training, 
            cutting-edge equipment, and a community that inspires greatness.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="inline-flex items-center gap-2 pb-8 text-white/50"
          >
            <Clock className="w-4 h-4" />
            <span>Open 24/7 • 365 Days a Year</span>
          </motion.div>

          <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="flex flex-col sm:flex-row items-center justify-center gap-4"
              >
                <button
                  onClick={scrollToPlans}
                  className="px-8 py-4 border border-white/20 rounded-full hover:border-[#D4AF37] hover:text-[#D4AF37] transition-all duration-300 flex items-center gap-2"
                >
                  View Membership Plans
                  <ChevronDown className="w-4 h-4 group-hover:translate-y-1 transition-transform" />
                </button>
                <button 
                  onClick={scrollToOfferings}
                  className="group px-8 py-4 gradient-gold text-black font-semibold rounded-full hover:scale-105 transition-all duration-300 flex items-center gap-2"
                >
                  <HandCoins className="w-4 h-4" />
                  Offerings
                </button>
              </motion.div>

        </div>


      </section>

      {/* About Section */}
      <section className="py-20 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                High-end fitness, <span className="text-[#D4AF37]">minutes from home</span>
              </h2>
              <p className="text-white/70 text-lg leading-relaxed mb-6">
                You shouldn&apos;t have to fight traffic to get world-class fitness. FRESH & FIT brings an ultramodern 
                gym experience right to your doorstep, eliminating long commutes and offering a top-tier 
                fitness and wellness hub.
              </p>
              <p className="text-white/70 text-lg leading-relaxed">
                Our facility features cutting-edge equipment, highly qualified trainers, and full tech 
                integration. Whether you&apos;re looking for dynamic group fitness classes or one-on-one 
                personal training, we make it easy to commit to a healthier you.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative h-125 rounded-2xl overflow-hidden transition-transform duration-700 hover:scale-90"
            >
              <Image
                src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1200&q=80"
                alt="Gym interior"
                className="w-full h-full object-cover"
                width={560}
                height={560}
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="offerings" className="py-20 px-6 lg:px-8 bg-linear-to-b from-transparent to-[#111]">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              More Than Just a Gym – <span className="text-[#D4AF37]">A Lifestyle</span>
            </h2>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="relative h-64 rounded-2xl overflow-hidden group cursor-pointer"
              >
                <Image
                  src={feature.image}
                  alt={feature.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  width={400}
                  height={256}
                />
                <div className="absolute inset-0 bg-linear-to-t from-black via-black/50 to-transparent" />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
                  <feature.icon className="w-8 h-8 text-[#D4AF37] mb-3" />
                  <h3 className="text-lg font-bold">{feature.title}</h3>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Rooftop Bar Section */}
      <section className="py-20 px-6 lg:px-8 bg-[#111]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative h-100 rounded-2xl overflow-hidden transition-transform duration-700 hover:scale-110"
            >
              <Image
                src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=1200&q=80"
                alt="Rooftop bar"
                className="w-full h-full object-cover"
                width={1200}
                height={400}
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-3 mb-4">
                <Coffee className="w-8 h-8 text-[#D4AF37]" />
                <h2 className="text-3xl md:text-4xl font-bold">
                  Rooftop <span className="text-[#D4AF37]">Wellness Bar</span>
                </h2>
              </div>
              <p className="text-white/70 text-lg leading-relaxed">
                Fitness doesn&apos;t end at your last rep. Refuel at our rooftop terrace wellness bar, 
                where fresh salads, sandwiches, and smoothies keep you on track with your health 
                and nutrition goals.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              What Our <span className="text-[#D4AF37]">Members Say</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-[#1A1A1A] rounded-2xl p-8 border border-white/5"
            >
              <p className="text-white/70 italic mb-6">
                &quot;Finally, a premium gym close to home! I used to drive all the way into town just to find 
                a gym with top-tier equipment. Now, FRESH & FIT has everything I need—right in my neighborhood!&quot;
              </p>
              <div className="flex items-center gap-3">
                <Image
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80"
                  alt="Member"
                  className="w-12 h-12 object-cover rounded-full border-2 border-[#D4AF37]"
                  width={48}
                  height={48}
                />
                <div>
                  <p className="font-semibold">Kwame A.</p>
                  <p className="text-white/50 text-sm">Member</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-[#1A1A1A] rounded-2xl p-8 border border-white/5"
            >
              <p className="text-white/70 italic mb-6">
                &quot;The trainers actually care about your progress. They take the time to correct your form, 
                push you when needed, and celebrate your wins. I feel stronger and more confident than ever!&quot;
              </p>
              <div className="flex items-center gap-3">
                <Image
                  src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80"
                  alt="Member"
                  className="w-12 h-12 object-cover rounded-full border-2 border-[#D4AF37]"
                  width={48}
                  height={48}
                />
                <div>
                  <p className="font-semibold">Sandra O.</p>
                  <p className="text-white/50 text-sm">Member</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-[#1A1A1A] rounded-2xl p-8 border border-white/5"
            >
              <p className="text-white/70 italic mb-6">
                &quot;State-of-the-art facility, no more excuses! The equipment is modern, the space is clean, 
                and I don&apos;t have to spend half my evening in traffic. I actually look forward to my workouts!&quot;
              </p>
              <div className="flex items-center gap-3">
                <Image
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80"
                  alt="Member"
                  className="w-12 h-12 object-cover rounded-full border-2 border-[#D4AF37]"
                  width={48}
                  height={48}
                />
                <div>
                  <p className="font-semibold">Afua T.</p>
                  <p className="text-white/50 text-sm">Member</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Pricing Plans */}
      <section id="plans" className="py-20 px-6 lg:px-8 bg-[#111]">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-block px-4 py-2 rounded-full bg-[#D4AF37]/10 text-[#D4AF37] text-sm font-medium tracking-wider mb-4">
              MEMBERSHIP PLANS
            </span>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Choose Your <span className="text-[#D4AF37]">Journey</span>
            </h2>
            <p className="text-white/50 text-lg max-w-2xl mx-auto">
              Select the perfect plan for your fitness goals. All plans include full access to our facilities.
            </p>
          </motion.div>

          {/* {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-[#1A1A1A] rounded-3xl h-64 animate-pulse" />
              ))}
            </div>
          ) : ( */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {plans.map((plan: planProps, index: number) => (
                <PlanCard
                  key={plan.name}
                  plan={plan}
                  onSelect={handleSelectPlan}
                  index={index}
                />
              ))}
            </div>
          {/* )} */}

          {/* {plans.length === 0 && !isLoading && ( */}
          {plans.length === 0 && (
            <div className="text-center py-20">
              <p className="text-white/50">No membership plans available at the moment.</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center bg-linear-to-br from-[#D4AF37]/10 to-transparent border border-[#D4AF37]/20 rounded-3xl p-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Elevate Your Fitness?
          </h2>
          <p className="text-white/60 mb-8 max-w-2xl mx-auto">
            Your Journey Starts Now. No more settling for outdated equipment. No more wasted time commuting. 
            Join FRESH & FIT today and experience a gym built for excellence.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => {
                if (plans.length > 0) handleSelectPlan(plans[0]);
              }}
              className="px-8 py-4 gradient-gold text-black font-semibold rounded-full hover:scale-105 transition-transform"
            >
              Get Started
            </button>
            <a
              href={"/contact"}
              className="px-8 py-4 border border-white/20 rounded-full hover:border-[#D4AF37] hover:text-[#D4AF37] transition-all"
            >
              Contact Us
            </a>
          </div>
        </motion.div>
      </section>

      {/* Membership Modal */}
      {selectedPlan && (
        <MembershipModal
          plan={selectedPlan}
          onClose={() => setSelectedPlan(null)}
          onSuccess={handleSuccess}
        />
      )}
    </div>
  );
}
