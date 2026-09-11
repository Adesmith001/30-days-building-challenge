import type {
  VercelRequest,
  VercelResponse,
} from "@vercel/node";
import {
  importantPrompt,
  planPrompt,
  simplifyPrompt,
  untanglePrompt,
} from "./_lib/prompts";
import { structuredGroq } from "./_lib/groq";
import {
  nextActionJsonSchema,
  nextActionSchema,
  planJsonSchema,
  planResultSchema,
  requestSchema,
  untangleJsonSchema,
  untangleResultSchema,
} from "./_lib/schemas";

export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
) {
  res.setHeader(
    "Cache-Control",
    "no-store, max-age=0",
  );

  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");

    return res.status(405).json({
      error: "Method not allowed.",
    });
  }

  const request = requestSchema.safeParse(
    req.body,
  );

  if (!request.success) {
    return res.status(400).json({
      error: "Invalid request.",
    });
  }

  const {
    mode,
    text,
    items = [],
  } = request.data;

  try {
    if (mode === "untangle") {
      const prompt = untanglePrompt(text);

      const raw = await structuredGroq({
        name: "untangle_result",
        schema: untangleJsonSchema,
        ...prompt,
      });

      const result =
        untangleResultSchema.parse(raw);

      return res.status(200).json(result);
    }

    if (mode === "simplify") {
      if (!items.length) {
        return res.status(400).json({
          error: "There is nothing to simplify.",
        });
      }

      const prompt = simplifyPrompt(
        text,
        items,
      );

      const raw = await structuredGroq({
        name: "simplified_untangle",
        schema: untangleJsonSchema,
        ...prompt,
      });

      const result =
        untangleResultSchema.parse(raw);

      return res.status(200).json(result);
    }

    if (mode === "plan") {
      if (!items.length) {
        return res.status(400).json({
          error: "There is nothing to plan.",
        });
      }

      const prompt = planPrompt(
        text,
        items,
      );

      const raw = await structuredGroq({
        name: "untangle_plan",
        schema: planJsonSchema,
        ...prompt,
      });

      const result =
        planResultSchema.parse(raw);

      return res.status(200).json(result);
    }

    if (mode === "important") {
      if (!items.length) {
        return res.status(400).json({
          error: "There are no active items.",
        });
      }

      const prompt = importantPrompt(
        text,
        items,
      );

      const raw = await structuredGroq({
        name: "most_important",
        schema: nextActionJsonSchema,
        ...prompt,
      });

      const result =
        nextActionSchema.parse(raw);

      return res.status(200).json(result);
    }

    return res.status(400).json({
      error: "Unknown mode.",
    });
  } catch (error) {
    console.error("Untangle API error:", error);

    return res.status(500).json({
      error:
        "Couldn't untangle that right now. Try again.",
    });
  }
}