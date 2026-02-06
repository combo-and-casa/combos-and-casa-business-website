'use client';

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  PartyPopper, 
  Users, 
  Sparkles, 
  Calendar,
  CheckCircle,
  Building2,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import EventGallery from "@/components/events/EventGallery";
import BookingModal from "@/components/events/BookingModal";
import Image from "next/image";

const AboutCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const images = [
    "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=1200&q=80",
    "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=1200&q=80",
    "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=1200&q=80",
    "https://images.unsplash.com/photo-1505236858219-8359eb29e329?w=1200&q=80"
  ];

  const next = () => setCurrentIndex((prev) => (prev + 1) % images.length);
  const prev = () => setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);

  useEffect(() => {
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  });

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      className="relative h-125 rounded-2xl overflow-hidden group"
    >
      <AnimatePresence mode="wait">
        <motion.img
          key={currentIndex}
          src={images[currentIndex]}
          alt={`Event space ${currentIndex + 1}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full h-full object-cover"
        />
      </AnimatePresence>

      {/* Navigation Buttons */}
      <button
        onClick={prev}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button
        onClick={next}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {images.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`w-2 h-2 rounded-full transition-all ${
              idx === currentIndex ? "bg-[#D4AF37] w-6" : "bg-white/50"
            }`}
          />
        ))}
      </div>
    </motion.div>
  );
};

export default function Events() {
  const [showBookingModal, setShowBookingModal] = useState(false);

  const handleBooking = () => {
    setShowBookingModal(true);
  };

  const handleSuccess = () => {
    setShowBookingModal(false);
    // Redirect to home or show success message
  };

  const spaces = [
    {
      name: "Grand Ballroom",
      capacity: "200-300 guests",
      features: ["Premium sound system", "LED lighting", "Stage setup", "Full bar"],
      image: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800&q=80"
    },
    {
      name: "Rooftop Terrace",
      capacity: "100-150 guests",
      features: ["City views", "Outdoor bar", "Lounge seating", "Fire pits"],
      image: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&q=80"
    },
    {
      name: "Private Dining",
      capacity: "20-40 guests",
      features: ["Chef's table", "Wine cellar", "Intimate setting", "Custom menu"],
      image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80"
    }
  ];

  const services = [
    { icon: Users, text: "Professional event planning" },
    { icon: Sparkles, text: "Custom decoration & setup" },
    { icon: Calendar, text: "Flexible scheduling" },
    { icon: CheckCircle, text: "Full catering services" },
    { icon: Building2, text: "Premium AV equipment" },
    { icon: PartyPopper, text: "Dedicated event coordinator" }
  ];

  return (
    <div className="min-h-screen bg-[#0A0A0A] pt-20">
      {/* Hero */}
      <section className="relative py-20 md:py-32 px-6 lg:px-8 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=1920&q=80')" }}
        />
        <div className="absolute inset-0 bg-linear-to-b from-[#0A0A0A] via-transparent to-[#0A0A0A]" />
        
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute top-1/3 left-1/3 w-150 h-150 bg-[#D4AF37]/10 rounded-full blur-3xl"
        />
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#D4AF37]/10 text-[#D4AF37] text-sm font-medium tracking-wider mb-6"
          >
            <PartyPopper className="w-4 h-4" />
            EXCLUSIVE EVENT SPACES
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold mb-6"
          >
            Celebrate in <span className="text-[#D4AF37]">Style</span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-white/60 text-lg md:text-xl max-w-2xl mx-auto mb-8"
          >
            Host unforgettable events in our stunning venues. From intimate gatherings 
            to grand celebrations, we make every moment extraordinary.
          </motion.p>

          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            onClick={handleBooking}
            className="px-8 py-4 gradient-gold text-black font-semibold rounded-full hover:scale-105 transition-transform flex items-center gap-2 mx-auto"
          >
            <Calendar className="w-5 h-5" />
            Book Your Event
          </motion.button>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="inline-block px-4 py-2 rounded-full bg-[#D4AF37]/10 text-[#D4AF37] text-sm font-medium tracking-wider mb-4">
              ABOUT OUR SPACE
            </span>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Image Carousel */}
            <AboutCarousel />

            {/* Text Content */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                The Ultimate Setting for <span className="text-[#D4AF37]">Extraordinary Celebrations</span>
              </h2>
              <p className="text-white/70 text-lg leading-relaxed mb-6">
                COMBOS & CASA EVENT SPACE isn&apos;t just another event space; it is a place where lifelong memories are created. 
                Our facilities seamlessly blend nature with sophistication, offering versatile spaces equipped 
                with cutting-edge amenities.
              </p>
              <p className="text-white/70 text-lg leading-relaxed">
                We were built to rival world-class venues and go beyond expectations. Our thoughtfully 
                designed spaces are enriched with advanced technology and attentive service, ensuring 
                every event feels personalized.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section className="py-20 px-6 lg:px-8 bg-[#111]">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-block px-4 py-2 rounded-full bg-[#D4AF37]/10 text-[#D4AF37] text-sm font-medium tracking-wider mb-4">
              EXPERIENCES
            </span>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              What Sets Us <span className="text-[#D4AF37]">Apart</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
             <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="relative rounded-2xl overflow-hidden border border-white/5 group"
            >
              <div className="relative h-80">
                <Image
                  src="https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800&q=80"
                  alt="Versatile spaces"
                  width={400}
                  height={400}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black via-black/60 to-transparent" />
                <div className="absolute inset-0 p-8 flex flex-col justify-end">
                  <div className="w-12 h-12 rounded-xl gradient-gold flex items-center justify-center mb-4 text-black font-bold text-2xl">
                    01
                  </div>
                  <h3 className="text-xl font-bold mb-3">Versatile Indoor & Outdoor Spaces</h3>
                  <p className="text-white/80 leading-relaxed">
                    Our picturesque spaces offer flexible layouts for intimate gatherings or grand celebrations.
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="relative rounded-2xl overflow-hidden border border-white/5 group"
            >
              <div className="relative h-80">
                <Image
                  src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&q=80"
                  alt="White-glove service"
                  width={400}
                  height={400}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black via-black/60 to-transparent" />
                <div className="absolute inset-0 p-8 flex flex-col justify-end">
                  <div className="w-12 h-12 rounded-xl gradient-gold flex items-center justify-center mb-4 text-black font-bold text-2xl">
                    02
                  </div>
                  <h3 className="text-xl font-bold mb-3">White-Glove Service</h3>
                  <p className="text-white/80 leading-relaxed">
                    Our trained staff anticipate every need and handle the smallest details.
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="relative rounded-2xl overflow-hidden border border-white/5 group"
            >
              <div className="relative h-80">
                <Image
                  src="https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&q=80"
                  alt="Private suites"
                  width={400}
                  height={400}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black via-black/60 to-transparent" />
                <div className="absolute inset-0 p-8 flex flex-col justify-end">
                  <div className="w-12 h-12 rounded-xl gradient-gold flex items-center justify-center mb-4 text-black font-bold text-2xl">
                    03
                  </div>
                  <h3 className="text-xl font-bold mb-3">Private Hospitality Suites</h3>
                  <p className="text-white/80 leading-relaxed">
                    Exclusive lounges with en suite bathrooms and dressing spaces.
                  </p>
                </div>
              </div>
            </motion.div>

             <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="relative rounded-2xl overflow-hidden border border-white/5 group"
            >
              <div className="relative h-80">
                <Image
                  src="https://images.unsplash.com/photo-1505236858219-8359eb29e329?w=800&q=80"
                  alt="Luxury interiors"
                  width={400}
                  height={400}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black via-black/60 to-transparent" />
                <div className="absolute inset-0 p-8 flex flex-col justify-end">
                  <div className="w-12 h-12 rounded-xl gradient-gold flex items-center justify-center mb-4 text-black font-bold text-2xl">
                    04
                  </div>
                  <h3 className="text-xl font-bold mb-3">Luxury Interiors & Outdoor Elegance</h3>
                  <p className="text-white/80 leading-relaxed">
                    Crystal chandeliers and landscaped gardens create a fairytale setting.
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="relative rounded-2xl overflow-hidden border border-white/5 group"
            >
              <div className="relative h-80">
                <Image
                  src="https://images.unsplash.com/photo-1478147427282-58a87a120781?w=800&q=80"
                  alt="Infrastructure"
                  width={400}
                  height={400}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black via-black/60 to-transparent" />
                <div className="absolute inset-0 p-8 flex flex-col justify-end">
                  <div className="w-12 h-12 rounded-xl gradient-gold flex items-center justify-center mb-4 text-black font-bold text-2xl">
                    05
                  </div>
                  <h3 className="text-xl font-bold mb-3">Unrivaled Infrastructure</h3>
                  <p className="text-white/80 leading-relaxed">
                    Backup power, high-speed Wi-Fi, and modern amenities ensure comfort.
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              className="bg-[#1A1A1A] rounded-2xl p-8 border border-white/5 flex items-center justify-center"
            >
              <button
                onClick={handleBooking}
                className="px-6 py-3 gradient-gold text-black font-semibold rounded-full hover:scale-105 transition-transform"
              >
                Request a Private Tour
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Event Spaces */}
      <section className="py-20 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-block px-4 py-2 rounded-full bg-[#D4AF37]/10 text-[#D4AF37] text-sm font-medium tracking-wider mb-4">
              OUR SIGNATURE SPACES
            </span>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Versatile <span className="text-[#D4AF37]">Venues</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
            {spaces.map((space, index) => (
              <motion.div
                key={space.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group bg-[#1A1A1A] rounded-2xl overflow-hidden border border-white/5 hover:border-[#D4AF37]/30 transition-all duration-500"
              >
                <div className="relative h-64 overflow-hidden">
                  <Image
                    src={space.image}
                    alt={space.name}
                    width={400}
                    height={400}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-[#1A1A1A] via-transparent to-transparent" />
                </div>
                <div className="p-8">
                  <h3 className="text-2xl font-bold mb-2">{space.name}</h3>
                  <p className="text-[#D4AF37] mb-6">{space.capacity}</p>
                  <ul className="space-y-3">
                    {space.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-3 text-white/70">
                        <CheckCircle className="w-4 h-4 text-[#D4AF37] shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="py-20 px-6 lg:px-8 bg-linear-to-b from-transparent to-[#111]">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              See Our <span className="text-[#D4AF37]">Spaces</span>
            </h2>
            <p className="text-white/50">A glimpse of our stunning event venues</p>
          </motion.div>

          <EventGallery />
        </div>
      </section>

      {/* Services */}
      <section className="py-20 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Full-Service <span className="text-[#D4AF37]">Event Planning</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center gap-4 p-6 bg-[#1A1A1A] rounded-xl border border-white/5"
              >
                <div className="w-10 h-10 rounded-lg gradient-gold flex items-center justify-center shrink-0">
                  <service.icon className="w-5 h-5 text-black" />
                </div>
                <span className="text-white/80">{service.text}</span>
              </motion.div>
            ))}
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
            Ready to Create Magic?
          </h2>
          <p className="text-white/60 mb-8 max-w-2xl mx-auto">
            Let us help you create an unforgettable experience. Our team is ready to bring your vision to life.
          </p>
          <button
            onClick={handleBooking}
            className="px-8 py-4 gradient-gold text-black font-semibold rounded-full hover:scale-105 transition-transform"
          >
            Book Your Event Now
          </button>
        </motion.div>
      </section>

      {/* Booking Modal */}
      {showBookingModal && (
        <BookingModal onClose={() => setShowBookingModal(false)} onSuccess={handleSuccess} />
      )}
    </div>
  );
}