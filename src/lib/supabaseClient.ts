import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Clerk third-party auth: every request carries the user's Clerk session
// token (or none when signed out, falling back to the anon key).
// The provider is registered by <SessionProvider> once Clerk has loaded.
let accessTokenProvider: (() => Promise<string | null>) | null = null;

export function setSupabaseAccessToken(
  provider: (() => Promise<string | null>) | null,
): void {
  accessTokenProvider = provider;
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  accessToken: async () => accessTokenProvider?.() ?? null,
});
