'use client';
import CTASection from '@/components/home/CTASection';
import HeroSection from '@/components/home/Herosection';
import ServicesSection from '@/components/home/ServiceSection';
import StatsSection from '@/components/home/StatsSection';
import TestimonialsSection from '@/components/home/TestimonialsSection';

export default function Home() {
  return (
    <div className="bg-[#0A0A0A]">
      <HeroSection />
      <ServicesSection />
      <StatsSection />
      <TestimonialsSection />
      <CTASection />
    </div>
  )
}
