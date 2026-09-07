import {
  GoogleGenAI,
} from "@google/genai";

import {
  buildPrompt,
} from "../src/prompts/buildPrompt";

import {
  SYSTEM_PROMPT,
} from "../src/prompts/system";

import {
  DuckRequestSchema,
  DuckResponseSchema,
  duckResponseJsonSchema,
} from "../src/schemas/ai";

export async function POST(
  request: Request,
) {
  try {
    const raw =
      await request.json();

    const parsed =
      DuckRequestSchema.safeParse(
        raw,
      );

    if (!parsed.success) {
      return Response.json(
        {
          error:
            "Invalid request",

          details:
            parsed.error.flatten(),
        },

        {
          status: 400,
        },
      );
    }

    const apiKey =
      process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return Response.json(
        {
          error:
            "GEMINI_API_KEY is not configured.",
        },

        {
          status: 500,
        },
      );
    }

    const ai =
      new GoogleGenAI({
        apiKey,
      });

    const interaction =
      await ai.interactions.create({
        model:
          process.env.GEMINI_MODEL ||
          "gemini-3.8-flash",

        input:
          buildPrompt(
            parsed.data,
          ),

        system_instruction:
          SYSTEM_PROMPT,

        response_format: {
          type: "text",

          mime_type:
            "application/json",

          schema:
            duckResponseJsonSchema,
        },

        generation_config: {
          thinking_level: "low",
        },
      });

    const text =
      interaction.output_text;

    if (!text) {
      throw new Error(
        "Gemini returned an empty response.",
      );
    }

    const data =
      DuckResponseSchema.parse(
        JSON.parse(text),
      );

    return Response.json(
      data,

      {
        headers: {
          "Cache-Control":
            "no-store",
        },
      },
    );
  } catch (error) {
    console.error(
      "Rubber Duck API error:",
      error,
    );

    return Response.json(
      {
        error:
          "Lost my train of thought. Try that again.",
      },

      {
        status: 500,
      },
    );
  }
}