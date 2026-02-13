import { cookies } from "next/headers";
import { createServerClient, type CookieOptions } from "@supabase/ssr";

export const createSupabaseServerClient = async () => {
  const cookieStore = await cookies();

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
    throw new Error("Missing Supabase environment variables");
  }

  return createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  );
};
