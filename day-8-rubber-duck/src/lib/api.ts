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

  const json =
    await response.json();

  if (!response.ok) {
    throw new Error(
      json.error ||
        "The duck lost its train of thought.",
    );
  }

  return DuckResponseSchema.parse(
    json,
  );
}