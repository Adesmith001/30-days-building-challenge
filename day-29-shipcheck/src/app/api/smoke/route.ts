import { NextResponse } from "next/server";
import { z } from "zod";
import { assertSafeHttpUrl } from "@/lib/security/safe-url";

const schema = z.object({
  baseUrl: z.string().url(),
  checks: z
    .array(
      z.object({
        id: z.string(),
        path: z.string().startsWith("/"),
        expectedStatus: z.number().int().min(100).max(599),
      }),
    )
    .min(1)
    .max(8),
});

export async function POST(request: Request) {
  try {
    const input = schema.parse(await request.json());

    const base = await assertSafeHttpUrl(input.baseUrl);

    const results = [];

    for (const check of input.checks) {
      const target = new URL(check.path, base);

      if (target.origin !== base.origin) {
        throw new Error("Smoke checks must remain on the same origin.");
      }

      const result = await requestUrl(
        target,
        check.expectedStatus,
      );

      results.push({
        ...check,
        ...result,
      });
    }

    return NextResponse.json({ checks: results });
  } catch (cause) {
    const message =
      cause instanceof Error
        ? cause.message
        : "Smoke check failed.";

    return NextResponse.json(
      { error: message },
      { status: 400 },
    );
  }
}

async function requestUrl(
  initial: URL,
  expectedStatus: number,
) {
  let target = initial;
  const startedAt = Date.now();

  for (let redirect = 0; redirect <= 3; redirect += 1) {
    await assertSafeHttpUrl(target.toString());

    const response = await fetch(target, {
      method: "GET",
      redirect: "manual",
      cache: "no-store",
      signal: AbortSignal.timeout(5000),
      headers: {
        "User-Agent": "ShipCheck/1.0",
        Range: "bytes=0-32768",
      },
    });

    if (
      response.status >= 300 &&
      response.status < 400
    ) {
      const location = response.headers.get("location");

      await response.body?.cancel();

      if (!location) break;

      const next = new URL(location, target);

      if (next.origin !== initial.origin) {
        throw new Error(
          "Cross-origin redirects are not allowed.",
        );
      }

      target = next;
      continue;
    }

    await response.body?.cancel();

    return {
      actualStatus: response.status,
      durationMs: Date.now() - startedAt,
      status:
        response.status === expectedStatus
          ? ("pass" as const)
          : ("fail" as const),
    };
  }

  throw new Error("Too many redirects.");
}