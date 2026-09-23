import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

import { publicEnv } from "@/lib/env";

const protectedPrefixes = [
  "/chat",
  "/settings",
];

function isProtectedPath(pathname: string) {
  return protectedPrefixes.some(
    (prefix) =>
      pathname === prefix ||
      pathname.startsWith(`${prefix}/`),
  );
}

export async function updateSession(
  request: NextRequest,
) {
  let response = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    publicEnv.NEXT_PUBLIC_SUPABASE_URL,
    publicEnv.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },

        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => {
            request.cookies.set(name, value);
          });

          response = NextResponse.next({
            request,
          });

          cookiesToSet.forEach(
            ({ name, value, options }) => {
              response.cookies.set(
                name,
                value,
                options,
              );
            },
          );
        },
      },
    },
  );

  const { data } = await supabase.auth.getClaims();
  const authenticated = Boolean(data?.claims?.sub);

  if (
    isProtectedPath(request.nextUrl.pathname) &&
    !authenticated
  ) {
    const url = request.nextUrl.clone();

    url.pathname = "/auth";
    url.searchParams.set(
      "next",
      `${request.nextUrl.pathname}${request.nextUrl.search}`,
    );

    return NextResponse.redirect(url);
  }

  return response;
}