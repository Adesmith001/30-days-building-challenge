import {
  DuckResponseSchema,
  type DuckRequest,
} from "../schemas/ai";

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
    error?: string;
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
      json.error ||
        (response.status === 404
          ? "The Duck API is not running. Start with pnpm dev:vercel."
          : `The Duck API returned ${response.status}. Try again.`),
    );

    throw error;
  }

  return DuckResponseSchema.parse(
    JSON.parse(body),
  );
}
