'use client';

import { Suspense, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff } from 'lucide-react';
// import { motion } from 'framer-motion';
import { login } from '../actions';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

function SignInForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const searchParams = useSearchParams();
  const message = searchParams.get('message');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('email', email);
    formData.append('password', password);

    const result = await login(formData);
    
    if (result?.error) {
      setError(result.error);
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
        <h1 className="text-3xl font-bold mb-2 text-center text-white">Welcome Back</h1>
        <p className="text-gray-400 text-center mb-6">Sign in to your account</p>

        {message && (
          <div className="mb-4 p-3 rounded-lg text-sm" style={{ backgroundColor: 'rgba(34, 197, 94, 0.1)', border: '1px solid rgba(34, 197, 94, 0.2)', color: '#22c55e' }}>
            {message}
          </div>
        )}

        {error && (
          <div className="mb-4 p-3 rounded-lg text-sm" style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', color: '#ef4444' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-white">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
              className="bg-white/5 border-white/10 text-white h-12 focus:border-[#D4AF37] focus:ring-[#D4AF37]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-white">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
                minLength={6}
                className="bg-white/5 border-white/10 text-white h-12 focus:border-[#D4AF37] focus:ring-[#D4AF37] pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-0 p-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full gradient-gold text-black font-semibold h-12"
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>

        <div className="mt-4 text-center text-gray-400">
          <p>
            Don&apos;t have an account?{' '}
            <Link href="/auth/signup" className="text-[#D4AF37] hover:underline font-semibold">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden px-4 pt-20">
        <div className="absolute inset-0">
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: "url('https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1920&q=80')"
            }}
          />
          <div className="absolute inset-0 bg-linear-to-b from-black/70 via-black/50 to-[#0A0A0A]" />
        </div>
        <div className="relative z-10 bg-[#1A1A1A]/70 backdrop-blur-xl p-8 rounded-2xl shadow-2xl w-full max-w-md border border-[#D4AF37]/20">
          <div className="text-center">
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-white/10 rounded w-3/4 mx-auto"></div>
              <div className="h-4 bg-white/10 rounded w-1/2 mx-auto"></div>
            </div>
          </div>
        </div>
      </div>
    }>
      <SignInForm />
    </Suspense>
  );
}