import { createClient } from "@supabase/supabase-js";

type SupabaseServerConfig = {
  url: string;
  serviceRoleKey: string;
};

function getSupabaseServerConfig(): SupabaseServerConfig {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error(
      "Supabase server env vars are missing. Set NEXT_PUBLIC_SUPABASE_URL (or SUPABASE_URL) and SUPABASE_SERVICE_ROLE_KEY.",
    );
  }

  return { url, serviceRoleKey };
}

const { url, serviceRoleKey } = getSupabaseServerConfig();

export const supabaseServer = createClient(url, serviceRoleKey, {
  auth: {
    persistSession: false,
  },
});