import { createBrowserClient as createSupabaseBrowserClient } from "@supabase/ssr";

export const createBrowserClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn("Missing environment variables for Supabase.");
    }
    return null;
  }

  return createSupabaseBrowserClient(supabaseUrl, supabaseAnonKey);
};
