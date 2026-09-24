import "server-only";

import {
  createAdminClient,
} from "@/lib/supabase/admin";

interface RateLimitInput {
  userId: string;
  bucket: string;
  limit: number;
  windowSeconds: number;
}

export async function checkRateLimit({
  userId,
  bucket,
  limit,
  windowSeconds,
}: RateLimitInput) {
  const admin =
    createAdminClient();

  const {
    data,
    error,
  } =
    await admin.rpc(
      "consume_rate_limit",
      {
        p_user_id:
          userId,

        p_bucket:
          bucket,

        p_limit:
          limit,

        p_window_seconds:
          windowSeconds,
      },
    );

  if (error) {
    throw error;
  }

  return Boolean(data);
}
