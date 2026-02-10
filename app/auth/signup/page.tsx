'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Eye, EyeOff } from 'lucide-react';
// import { motion } from 'framer-motion';
import { signup } from '../actions';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

interface SignUpFormData {
    fullname: string;
    email: string;
    password: string;
    phone?: string;
    role: string;
}

export default function SignUpPage() {
    const [formData, setFormData] = useState<SignUpFormData>({
        fullname: '',
        email: '',
        password: '',
        phone: '',
        role: 'customer',
    });
    const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // Validate passwords match
    if (formData.password !== confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    // Validate password length
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      setIsLoading(false);
      return;
    }

    const submitFormData = new FormData();
    submitFormData.append('full_name', formData.fullname);
    submitFormData.append('email', formData.email);
    submitFormData.append('password', formData.password);
    submitFormData.append('phone', formData.phone || '');
    submitFormData.append('role', formData.role || 'customer');

    const result = await signup(submitFormData);
    
    if (result?.error) {
      setError(result.error);
      setIsLoading(false);
    } else {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden px-4 pt-20">
      {/* Background Image */}
      <div className="absolute inset-0">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1920&q=80')"
          }}
        />
        <div className="absolute inset-0 bg-linear-to-b from-black/70 via-black/50 to-[#0A0A0A]" />
      </div>

      {/* Form Container - Enhanced Glass Effect */}
      <div className="relative z-10 bg-[#1A1A1A]/70 backdrop-blur-xl p-8 rounded-2xl shadow-2xl w-full max-w-md border border-[#D4AF37]/20 shadow-[#D4AF37]/10">
        <h1 className="text-3xl font-bold mb-2 text-center text-white">Create Account</h1>
        <p className="text-gray-400 text-center mb-6">Sign up to get started</p>

        {error && (
          <div className="mb-4 p-3 rounded-lg text-sm" style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', color: '#ef4444' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fullname" className="text-white">Full Name</Label>
            <Input
              id="fullname"
              type="text"
              placeholder="John Doe"
              value={formData.fullname}
              onChange={(e) => setFormData({ ...formData, fullname: e.target.value })}
              required
              disabled={isLoading}
              className="bg-white/5 border-white/10 text-white h-10 focus:border-[#D4AF37] focus:ring-[#D4AF37]"
            />
          </div>
          <div className="space-y-2 flex flex-row gap-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                disabled={isLoading}
                className="bg-white/5 border-white/10 text-white h-10 focus:border-[#D4AF37] focus:ring-[#D4AF37]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-white">Phone</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="(123) 456-7890"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
                disabled={isLoading}
                className="bg-white/5 border-white/10 text-white h-10 focus:border-[#D4AF37] focus:ring-[#D4AF37]"
              />
            </div>

          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-white">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                disabled={isLoading}
                minLength={6}
                className="bg-white/5 border-white/10 text-white h-10 focus:border-[#D4AF37] focus:ring-[#D4AF37] pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-0 p-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-xs text-gray-400">Must be at least 6 characters</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-white">Confirm Password</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={isLoading}
                minLength={6}
                className="bg-white/5 border-white/10 text-white h-10 focus:border-[#D4AF37] focus:ring-[#D4AF37] pr-10"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-0 p-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full gradient-gold text-black font-semibold h-12"
          >
            {isLoading ? 'Creating account...' : 'Sign Up'}
          </Button>
        </form>

        <div className="mt-4 text-center text-gray-400">
          <p>
            Already have an account?{' '}
            <Link href="/auth/signin" className="text-[#D4AF37] hover:underline font-semibold">
              Sign In
            </Link>
          </p>
        </div>

        <div className="mt-4 text-xs text-gray-500 text-center">
          By signing up, you agree to our Terms of Service and Privacy Policy
        </div>
      </div>
    </div>
  );
}
