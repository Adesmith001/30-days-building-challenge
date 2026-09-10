import type { VercelRequest, VercelResponse } from "@vercel/node";
import Groq from "groq-sdk";

import { UI_ANALYSIS_PROMPT } from "../src/prompts/uiAnalysis.js";
import { rawAnalysisSchema } from "../src/schemas/analysis.js";

export const MODEL_OUTPUT_OPTIONS = {
  max_completion_tokens: 3_000,
  response_format: { type: "json_object" },
} as const;

function parseModelJson(text: string) {
  const cleaned = text
    .replace(/^```json\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();

  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");

  if (start < 0 || end <= start) {
    throw new Error("Groq returned no JSON analysis.");
  }

  return JSON.parse(
    cleaned.slice(start, end + 1),
  );
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed.",
    });
  }

  if (!process.env.GROQ_API_KEY) {
    return res.status(500).json({
      error: "GROQ_API_KEY is not configured.",
    });
  }

  try {
    const body =
      typeof req.body === "string"
        ? JSON.parse(req.body)
        : req.body;

    const image = body?.image;

    if (
      typeof image !== "string" ||
      !image.startsWith("data:image/")
    ) {
      return res.status(400).json({
        error: "A valid image is required.",
      });
    }

    const groq = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    });

    const model =
      process.env.GROQ_VISION_MODEL ??
      "qwen/qwen3.6-27b";

    const completion = await groq.chat.completions.create({
      model,
      temperature: 0.1,
      reasoning_effort: "none",
      ...MODEL_OUTPUT_OPTIONS,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: UI_ANALYSIS_PROMPT,
            },
            {
              type: "image_url",
              image_url: {
                url: image,
              },
            },
          ],
        },
      ],
    });

    const text = completion.choices[0]?.message?.content;

    if (!text) {
      throw new Error("Groq returned an empty response.");
    }

    const parsed = parseModelJson(text);
    const analysis = rawAnalysisSchema.parse(parsed);

    return res.status(200).json(analysis);
  } catch (error) {
    console.error(error);

    return res.status(502).json({
      error: "The screenshot could not be analyzed.",
    });
  }
}
