import { createBrowserClient } from "@supabase/ssr";

// Validate environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_PROJECT_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    "⚠️ Missing Supabase environment variables!\n" +
    "Please create a .env.local file with:\n" +
    "- NEXT_PUBLIC_SUPABASE_PROJECT_URL\n" +
    "- NEXT_PUBLIC_SUPABASE_ANON_KEY\n" +
    "See .env.example for reference."
  );
}

export const supabase = createBrowserClient(
  supabaseUrl || "",
  supabaseAnonKey || ""
);
