'use client';

import { useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
// import { Loader2 } from "lucide-react";

// Force dynamic rendering - don't prerender this page during build
export const dynamic = 'force-dynamic';

export default function SignInPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    // const [isLoading, setIsLoading] = useState(false);
    // const [error, setError] = useState<string | null>(null);

    // const handleSignIn = async (e: React.SubmitEvent) => {
    //     e.preventDefault();
    //     setIsLoading(true);
    //     setError(null);

    const handleSignIn = async () => {
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            // setError(error.message);
            alert("Error signing in: " + error.message);
            console.error("Error signing in:", error.message);
        }
        // } else {
        //     // Redirect to homepage or dashboard
        //     window.location.href = "/";
        // }
    }
    const handleSignUp = async () => {
        const { error } = await supabase.auth.signUp({
            email,
            password,
        });

        if (error) {
            // setError(error.message);
            alert("Error signing up: " + error.message);
            console.error("Error signing up:", error.message);
        }
        // } else {
        //     // Redirect to homepage or dashboard
        //     window.location.href = "/";
        // }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0A0A0A]">
            <div className="bg-[#1A1A1A] p-8 rounded-xl shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center">Sign In / Sign Up</h2>
                <form onSubmit={(e) => { e.preventDefault(); handleSignIn(); }} className="space-y-4">
                    <Input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="bg-white/5 border-white/10 text-white h-12"
                    />
                    <Input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="bg-white/5 border-white/10 text-white h-12"
                    />
                    <div className="flex items-center justify-between">
                        <Button type="submit" className="bg-[#D4AF37] text-black w-full">
                            Sign In
                        </Button>
                        <Button
                            type="button"
                            onClick={handleSignUp}
                            className="bg-[#D4AF37]/80 text-black w-full ml-4"
                        >
                            Sign Up
                        </Button>
                    </div>
                    {/* {error && <p className="text-red-500 text-sm mt-2">{error}</p>} */}
                </form>
            </div>
        </div>
    );
}
