'use client';

import React, { useState, useEffect, useEffectEvent } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send, CheckCircle, Facebook, Instagram } from "lucide-react";

// Custom TikTok Icon Component
const TikTokIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
  </svg>
);
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    section: "",
    subject: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  
  const updateSection = useEffectEvent((value: string) => {
    setFormData(prev => ({ ...prev, section: value }));
  });

  useEffect(() => {
    // Get section from URL parameter
    const urlParams = new URLSearchParams(window.location.search);
    const section = urlParams.get('section');
    if (section) {   
      updateSection(section);
    }
  }, []);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    try {
      const response = await fetch('/api/send-contact-enquiry', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to send message');
      }

      setIsSubmitting(false);
      setSubmitted(true);
      
      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        section: "",
        subject: "",
        message: ""
      });
    } catch (err) {
      setIsSubmitting(false);
      setError(err instanceof Error ? err.message : 'Failed to send message. Please try again.');
      console.error('Contact form error:', err);
    }
  };

  if (submitted) {
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
          <h2 className="text-3xl font-bold mb-4">Message Sent!</h2>
          <p className="text-white/60 mb-8">
            Thank you for reaching out. We&apos;ll get back to you as soon as possible.
          </p>
          <button
            onClick={() => setSubmitted(false)}
            className="py-4 px-8 gradient-gold text-black font-semibold rounded-xl hover:scale-[1.02] transition-transform"
          >
            Send Another Message
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] pt-20">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-2 rounded-full bg-[#D4AF37]/10 text-[#D4AF37] text-sm font-medium tracking-wider mb-4">
            GET IN TOUCH
          </span>
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Contact <span className="text-[#D4AF37]">Us</span>
          </h1>
          <p className="text-white/60 text-lg max-w-2xl mx-auto">
            Have questions? We&apos;re here to help. Send us a message and we&apos;ll respond as soon as possible.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-6"
          >
            <div className="bg-[#1A1A1A] rounded-2xl p-8 border border-white/5">
              <h3 className="text-xl font-bold mb-6">Contact Information</h3>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg gradient-gold flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5 text-black" />
                  </div>
                  <div>
                    <p className="font-semibold mb-1">Address</p>
                    <p className="text-white/60">East Legon Hills<br />Accra, Ghana</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg gradient-gold flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5 text-black" />
                  </div>
                  <div>
                    <p className="font-semibold mb-1">Phone</p>
                    <p className="text-white/60">0509251268, 0509252315 </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg gradient-gold flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5 text-black" />
                  </div>
                  <div>
                    <p className="font-semibold mb-1">Email</p>
                    <p className="text-white/60">info@combosandcasagh.com</p>
                  </div>
                </div>
              </div>
            </div>


            {/* Social Media Section */}
            <div className="bg-[#1A1A1A] rounded-2xl py-6 px-8 border border-white/5">
              <h3 className="text-xl font-bold mb-2">Follow Us</h3>
              
              {/* Nankwaase Bar & Restaurant */}
              <div className="mb-2">
                <h4 className="text-white text-sm font-semibold mb-1">Nankwase Bar & Restaurant</h4>
                <div className="flex gap-3">
                  <a
                    href="https://facebook.com/nankwaase"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded-lg bg-[#D4AF37]/10 hover:bg-[#D4AF37]/20 border border-[#D4AF37]/20 flex items-center justify-center transition-all group"
                  >
                    <Facebook className="w-5 h-5 text-[#D4AF37] group-hover:scale-110 transition-transform" />
                  </a>
                  <a
                    href="https://www.instagram.com/p/DROynUXja3h/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded-lg bg-[#D4AF37]/10 hover:bg-[#D4AF37]/20 border border-[#D4AF37]/20 flex items-center justify-center transition-all group"
                  >
                    <Instagram className="w-5 h-5 text-[#D4AF37] group-hover:scale-110 transition-transform" />
                  </a>
                  <a
                    href="https://tiktok.com/@nankwase"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded-lg bg-[#D4AF37]/10 hover:bg-[#D4AF37]/20 border border-[#D4AF37]/20 flex items-center justify-center transition-all group"
                  >
                    <TikTokIcon className="w-5 h-5 text-[#D4AF37] group-hover:scale-110 transition-transform" />
                  </a>
                </div>
              </div>

              {/* Fresh & Fit Gym */}
              <div className="mb-2">
                <h4 className="text-white text-sm font-semibold mb-1">Fresh & Fit Gym</h4>
                <div className="flex gap-3">
                  <a
                    href="https://facebook.com/freshandfitgh"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded-lg bg-[#D4AF37]/10 hover:bg-[#D4AF37]/20 border border-[#D4AF37]/20 flex items-center justify-center transition-all group"
                  >
                    <Facebook className="w-5 h-5 text-[#D4AF37] group-hover:scale-110 transition-transform" />
                  </a>
                  <a
                    href="https://www.instagram.com/freshandfitgh/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded-lg bg-[#D4AF37]/10 hover:bg-[#D4AF37]/20 border border-[#D4AF37]/20 flex items-center justify-center transition-all group"
                  >
                    <Instagram className="w-5 h-5 text-[#D4AF37] group-hover:scale-110 transition-transform" />
                  </a>
                  <a
                    href="https://tiktok.com/@freshandfitgh"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded-lg bg-[#D4AF37]/10 hover:bg-[#D4AF37]/20 border border-[#D4AF37]/20 flex items-center justify-center transition-all group"
                  >
                    <TikTokIcon className="w-5 h-5 text-[#D4AF37] group-hover:scale-110 transition-transform" />
                  </a>
                </div>
              </div>

              {/* Event Spaces */}
              <div className="mb-2">
                <h4 className="text-white text-sm font-semibold mb-1">Combos & Casa Event Space</h4>
                <div className="flex gap-3">
                  <a
                    href="https://facebook.com/combosandcasa.events"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded-lg bg-[#D4AF37]/10 hover:bg-[#D4AF37]/20 border border-[#D4AF37]/20 flex items-center justify-center transition-all group"
                  >
                    <Facebook className="w-5 h-5 text-[#D4AF37] group-hover:scale-110 transition-transform" />
                  </a>
                  <a
                    href="https://www.instagram.com/combosandcasa.events/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded-lg bg-[#D4AF37]/10 hover:bg-[#D4AF37]/20 border border-[#D4AF37]/20 flex items-center justify-center transition-all group"
                  >
                    <Instagram className="w-5 h-5 text-[#D4AF37] group-hover:scale-110 transition-transform" />
                  </a>
                  <a
                    href="https://tiktok.com/@combosandcasa"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded-lg bg-[#D4AF37]/10 hover:bg-[#D4AF37]/20 border border-[#D4AF37]/20 flex items-center justify-center transition-all group"
                  >
                    <TikTokIcon className="w-5 h-5 text-[#D4AF37] group-hover:scale-110 transition-transform" />
                  </a>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <form onSubmit={handleSubmit} className="bg-[#1A1A1A] rounded-2xl p-8 border border-white/5">
              <h3 className="text-2xl font-bold mb-6">Send us a Message</h3>

              {error && (
                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <Label className="text-white/70 mb-2 block">Full Name *</Label>
                  <Input
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="John Doe"
                    className="bg-white/5 border-white/10 text-white"
                  />
                </div>

                <div>
                  <Label className="text-white/70 mb-2 block">Email *</Label>
                  <Input
                    required
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="john@example.com"
                    className="bg-white/5 border-white/10 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <Label className="text-white/70 mb-2 block">Phone</Label>
                  <Input
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="(+233) 0509251268"
                    className="bg-white/5 border-white/10 text-white"
                  />
                </div>

                <div>
                  <Label className="text-white/70 mb-2 block">Enquiry About *</Label>
                  <Select
                    required
                    value={formData.section}
                    onValueChange={(value) => setFormData({ ...formData, section: value })}
                  >
                    <SelectTrigger className="w-full bg-white/5 border-white/10 text-white">
                      <SelectValue placeholder="Select a section" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="restaurant">Nankwase Restaurant & Bar</SelectItem>
                      <SelectItem value="gym">Fresh & Fit Gym</SelectItem>
                      <SelectItem value="events">Combos & Casa Event Space</SelectItem>
                      <SelectItem value="general">General Enquiry</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="mb-6">
                <Label className="text-white/70 mb-2 block">Subject *</Label>
                <Input
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="How can we help you?"
                  className="bg-white/5 border-white/10 text-white"
                />
              </div>

              <div className="mb-6">
                <Label className="text-white/70 mb-2 block">Message *</Label>
                <Textarea
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Tell us more about your enquiry..."
                  className="bg-white/5 border-white/10 text-white min-h-37.5"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 gradient-gold text-black font-semibold rounded-xl hover:scale-[1.02] transition-transform disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Send Message
                  </>
                )}
              </button>
            </form>
          </motion.div>
        </div>

        {/* Business Hours - Full Width Below Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8"
        >
          <div className="bg-[#1A1A1A] rounded-2xl p-8 border border-white/5">
            <h3 className="text-2xl font-bold mb-6 text-center">Business Hours</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Nankwase Bar & Restaurant */}
              <div className="text-center">
                <h4 className="text-[#D4AF37] text-lg font-semibold mb-3">Nankwase Bar & Restaurant</h4>
                <div className="space-y-2 text-white/60">
                  <div>
                    <p className="text-sm">Everyday (Mon-Sun)</p>
                    <p className="text-white font-semibold">8:00 AM - 2:00 AM</p>
                  </div>
                </div>
              </div>

              {/* Fresh & Fit Gym */}
              <div className="text-center border-x border-white/10">
                <h4 className="text-[#D4AF37] text-lg font-semibold mb-3">Fresh & Fit Gym</h4>
                <div className="space-y-2 text-white/60">
                  <div>
                    <p className="text-sm">Mon - Sat</p>
                    <p className="text-white font-semibold">8:00 AM - 10:00 PM</p>
                  </div>
                </div>
              </div>

              {/* Event Space */}
              <div className="text-center">
                <h4 className="text-[#D4AF37] text-lg font-semibold mb-3">Event Space</h4>
                <div className="space-y-2 text-white/60">
                  <div>
                    <p className="text-sm">Mon - Sat</p>
                    <p className="text-white font-semibold">8:00 AM - 10:00 PM</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}