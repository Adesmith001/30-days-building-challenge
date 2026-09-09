import {
  DuckResponseSchema,
  type DuckRequest,
} from "../schemas/ai";

import {
  formatApiError,
} from "./apiError";

export async function askDuck(
  payload: DuckRequest,
) {
  const response =
    await fetch(
      "/api/duck",

      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json",
        },

        body:
          JSON.stringify(payload),
      },
    );

  const body =
    await response.text();

  const json: {
    error?: unknown;
    details?: {
      fieldErrors?: Record<string, unknown>;
    };
  } = (() => {
    try {
      return body
        ? JSON.parse(body)
        : {};
    } catch {
      return {};
    }
  })();

  if (!response.ok) {
    const error = new Error(
      formatApiError(
        json,
        response.status,
      ),
    );

    throw error;
  }

  return DuckResponseSchema.parse(
    JSON.parse(body),
  );
}
