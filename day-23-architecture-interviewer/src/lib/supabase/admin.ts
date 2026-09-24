import "server-only";

import { createClient } from "@supabase/supabase-js";

import {
  getServerEnv,
  publicEnv,
} from "@/lib/env";

export function createAdminClient() {
  const env = getServerEnv();

  return createClient(
    publicEnv.NEXT_PUBLIC_SUPABASE_URL,
    env.SUPABASE_SERVICE_ROLE_KEY,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    },
  );
}
