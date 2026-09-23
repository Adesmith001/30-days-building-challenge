import {
  NextResponse,
} from "next/server";

import {
  createClient,
} from "@/lib/supabase/server";

import {
  publicEnv,
} from "@/lib/env";

export async function GET(
  request: Request,
) {
  const url =
    new URL(request.url);

  const code =
    url.searchParams.get("code");

  const next =
    url.searchParams.get("next") ||
    "/chat";

  if (code) {
    const supabase =
      await createClient();

    const { error } =
      await supabase.auth.exchangeCodeForSession(
        code,
      );

    if (!error) {
      return NextResponse.redirect(
        new URL(
          next,
          publicEnv.NEXT_PUBLIC_APP_URL,
        ),
      );
    }
  }

  const errorUrl =
    new URL(
      "/auth",
      publicEnv.NEXT_PUBLIC_APP_URL,
    );

  errorUrl.searchParams.set(
    "error",
    "Authentication failed",
  );

  return NextResponse.redirect(
    errorUrl,
  );
}
