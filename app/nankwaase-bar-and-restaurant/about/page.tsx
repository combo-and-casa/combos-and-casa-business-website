'use client';

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { 
  Clock, 
  MapPin, 
  Phone, 
  Mail,
  ArrowRight
} from "lucide-react";
import { restaurantServices, upcomingEvents } from "@/utils/constents";


export default function RestaurantAbout() {
  const galleryImages = [
    "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80",
    "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80",
    "https://images.unsplash.com/photo-1424847651672-bf20a4b0982b?w=800&q=80",
    "https://images.unsplash.com/photo-1551218808-94e220e084d2?w=800&q=80",
    "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&q=80",
    "https://images.unsplash.com/photo-1544148103-0773bf10d330?w=800&q=80"
  ];

  return (
    <div className="min-h-screen bg-[#0A0A0A] pt-20">
      {/* Hero */}
      <section className="relative py-20 md:py-32 px-6 lg:px-8 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-40"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1920&q=80')" }}
        />
        <div className="absolute inset-0 bg-linear-to-b from-[#0A0A0A] via-transparent to-[#0A0A0A]" />
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block px-4 py-2 rounded-full bg-[#D4AF37]/10 text-[#D4AF37] text-sm font-medium tracking-wider mb-4"
          >
            CULINARY EXCELLENCE
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold mb-6"
          >
            Welcome to <span className="text-[#D4AF37]">Nankwase</span> Bar & Restaurant
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-white/60 text-lg md:text-xl max-w-2xl mx-auto mb-8"
          >
            Where exceptional cuisine meets elegant ambiance. Experience farm-to-table dining 
            with locally sourced ingredients and world-class service.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Link
              href="/nankwaase-bar-and-restaurant/menu"
              className="inline-flex items-center gap-2 px-8 py-4 gradient-gold linear-gold text-black font-semibold rounded-full hover:scale-105 transition-transform"
            >
              View Menu <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Services */}
      <section className="py-20 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">
              Our <span className="text-[#D4AF37]">Services</span>
            </h2>
            <p className="text-white/50 max-w-2xl mx-auto">
              From intimate dinners to grand celebrations, we offer exceptional experiences for every occasion
            </p>
          </motion.div>

          <div className="space-y-24">
            {restaurantServices.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${
                  index % 2 === 1 ? 'lg:flex-row-reverse' : ''
                }`}
              >
                <div className={`${index % 2 === 1 ? 'lg:order-2' : ''}`}>
                  <div className="relative h-100 rounded-2xl overflow-hidden group">
                    <Image
                      src={service.image}
                      alt={service.title}
                      width={600}
                      height={400}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
                  </div>
                </div>
                <div className={`${index % 2 === 1 ? 'lg:order-1' : ''}`}>
                  <div className="w-16 h-16 rounded-xl gradient-gold flex items-center justify-center mb-6">
                    <service.icon className="w-8 h-8 text-black" />
                  </div>
                  <h3 className="text-3xl font-bold mb-4">{service.title}</h3>
                  <p className="text-white/70 text-lg leading-relaxed">{service.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="py-20 px-6 lg:px-8 bg-[#111]">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Upcoming <span className="text-[#D4AF37]">Events</span>
            </h2>
            <p className="text-white/50">Join us for exclusive culinary experiences</p>
          </motion.div>

          <div className="max-w-3xl mx-auto space-y-6">
            {upcomingEvents.map((event, index) => (
              <motion.div
                key={event.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-[#1A1A1A] rounded-2xl p-6 border border-white/5 hover:border-[#D4AF37]/30 transition-all"
              >
                <div className="flex items-center gap-6">
                  <div className="w-24 h-24 rounded-xl gradient-gold flex items-center justify-center flex-col shrink-0">
                    <span className="text-black font-bold text-2xl">{event.date.split(' ')[1]}</span>
                    <span className="text-black text-sm font-semibold">{event.date.split(' ')[0]}</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-2">{event.title}</h3>
                    <p className="text-white/60">{event.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="py-20 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Our <span className="text-[#D4AF37]">Ambiance</span>
            </h2>
            <p className="text-white/50">Step inside our elegant dining space</p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {galleryImages.map((image, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="relative h-64 rounded-2xl overflow-hidden group cursor-pointer"
              >
                <Image
                  src={image}
                  alt={`Gallery ${index + 1}`}
                  width={400}
                  height={256}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Hours & Contact */}
      <section className="py-20 px-6 lg:px-8 bg-[#111]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Opening Hours */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-[#1A1A1A] rounded-2xl p-8 border border-white/5"
            >
              <div className="flex items-center gap-3 mb-6">
                <Clock className="w-6 h-6 text-[#D4AF37]" />
                <h3 className="text-2xl font-bold">Opening Hours</h3>
              </div>
              <div className="space-y-3 text-white/70">
                <div className="flex justify-between">
                  <span>Monday - Thursday</span>
                  <span className="text-white font-medium">11:00 AM - 10:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Friday - Saturday</span>
                  <span className="text-white font-medium">11:00 AM - 12:00 AM</span>
                </div>
                <div className="flex justify-between">
                  <span>Sunday</span>
                  <span className="text-white font-medium">10:00 AM - 9:00 PM</span>
                </div>
                <div className="pt-4 border-t border-white/10">
                  <p className="text-sm text-[#D4AF37]">* Happy Hour: Mon-Fri 4:00 PM - 6:00 PM</p>
                </div>
              </div>
            </motion.div>

            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-[#1A1A1A] rounded-2xl p-8 border border-white/5"
            >
              <h3 className="text-2xl font-bold mb-6">Contact Us</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-[#D4AF37] mt-1" />
                  <div>
                    <p className="font-medium">Address</p>
                    <p className="text-white/60">123 Lifestyle Avenue<br />New York, NY 10001</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-[#D4AF37] mt-1" />
                  <div>
                    <p className="font-medium">Phone</p>
                    <p className="text-white/60">+1 (555) 123-4567</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-[#D4AF37] mt-1" />
                  <div>
                    <p className="font-medium">Email</p>
                    <p className="text-white/60">info@combosandcasagh.com</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center bg-linear-to-br from-[#D4AF37]/10 to-transparent border border-[#D4AF37]/20 rounded-3xl p-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Dine with Us?
          </h2>
          <p className="text-white/60 mb-8">
            Browse our menu and place your order for pickup or delivery
          </p>
          <Link
            href="/nankwaase-bar-and-restaurant/menu"
            className="inline-flex items-center gap-2 px-8 py-4 linear-gold text-black font-semibold rounded-full hover:scale-105 transition-transform"
          >
            View Full Menu <ArrowRight className="w-5 h-5" />
          </Link>
        </motion.div>
      </section>
    </div>
  );
}