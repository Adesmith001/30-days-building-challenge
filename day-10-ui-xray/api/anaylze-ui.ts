import type { VercelRequest, VercelResponse } from "@vercel/node";
import Groq from "groq-sdk";

import { UI_ANALYSIS_PROMPT } from "../src/prompts/uiAnalysis";
import { rawAnalysisSchema } from "../src/schemas/analysis";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

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

    const model =
      process.env.GROQ_VISION_MODEL ??
      "qwen/qwen3.6-27b";

    const completion = await groq.chat.completions.create({
      model,
      temperature: 0.1,
      max_completion_tokens: 5500,
      response_format: {
        type: "json_object",
      },
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

    const parsed = JSON.parse(text);
    const analysis = rawAnalysisSchema.parse(parsed);

    return res.status(200).json(analysis);
  } catch (error) {
    console.error(error);

    return res.status(502).json({
      error: "The screenshot could not be analyzed.",
    });
  }
}