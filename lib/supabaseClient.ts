import { createClient } from "@supabase/supabase-js";

type SupabaseConfig = {
  url: string;
  anonKey: string;
};

function getSupabaseConfig(): SupabaseConfig {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error("Supabase env vars are missing.");
  }

  return { url, anonKey };
}

const { url, anonKey } = getSupabaseConfig();

export const supabase = createClient(url, anonKey, {
  auth: {
    persistSession: false,
  },
});
