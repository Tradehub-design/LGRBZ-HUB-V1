import { supabaseEnabled } from "./client";

export function getAuthStatus() {
  return {
    enabled: supabaseEnabled,
    mode: supabaseEnabled ? "Supabase Connected" : "Demo Mode",
    message: supabaseEnabled
      ? "Supabase environment variables are configured."
      : "Supabase is not configured yet. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.",
  };
}
