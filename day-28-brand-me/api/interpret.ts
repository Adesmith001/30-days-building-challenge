/// <reference types="node" />

import { z } from "zod"

const requestSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(5),
  audience: z.string().optional(),
  productType: z.string().optional(),
  industry: z.string().optional(),
  wordsToAvoid: z.string().optional(),
})

const dnaSchema = z.object({
  warmth: z.number().min(0).max(1),
  energy: z.number().min(0).max(1),
  formality: z.number().min(0).max(1),
  playfulness: z.number().min(0).max(1),
  boldness: z.number().min(0).max(1),
  premium: z.number().min(0).max(1),
  technical: z.number().min(0).max(1),
  editorial: z.number().min(0).max(1),
  density: z.number().min(0).max(1),
})

const outputSchema = z.object({
  summary: z.string(),
  keywords: z.array(z.string()).max(8),
  dna: dnaSchema,
})

function promptFor(
  input: z.infer<typeof requestSchema>,
) {
  return `
You interpret brand intent.

You DO NOT design the brand.
You DO NOT return colors.
You DO NOT choose fonts.
You ONLY convert intent into normalized Brand DNA.

Return ONLY valid JSON.

Schema:
{
  "summary": "short factual summary",
  "keywords": ["3-6 descriptors"],
  "dna": {
    "warmth": 0.0,
    "energy": 0.0,
    "formality": 0.0,
    "playfulness": 0.0,
    "boldness": 0.0,
    "premium": 0.0,
    "technical": 0.0,
    "editorial": 0.0,
    "density": 0.0
  }
}

Each DNA value is between 0 and 1.

Brand name:
${input.name}

Description:
${input.description}

Audience:
${input.audience ?? "Not supplied"}

Product type:
${input.productType ?? "Not supplied"}

Industry:
${input.industry ?? "Not supplied"}

Words to avoid:
${input.wordsToAvoid ?? "Not supplied"}
`.trim()
}

function extractJSON(value: string) {
  const first = value.indexOf("{")
  const last = value.lastIndexOf("}")

  if (first === -1 || last === -1) {
    throw new Error("No JSON object returned.")
  }

  return JSON.parse(
    value.slice(first, last + 1),
  )
}

async function gemini(
  prompt: string,
  model: string,
  key: string,
) {
  const url =
    "https://generativelanguage.googleapis.com" +
    `/v1beta/models/${model}:generateContent` +
    `?key=${encodeURIComponent(key)}`

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            {
              text: prompt,
            },
          ],
        },
      ],
      generationConfig: {
        temperature: 0.15,
        responseMimeType:
          "application/json",
      },
    }),
  })

  if (!response.ok) {
    throw new Error(
      `Gemini request failed: ${response.status}`,
    )
  }

  const result = await response.json()

  return result.candidates?.[0]
    ?.content?.parts?.[0]?.text ?? ""
}

async function openai(
  prompt: string,
  model: string,
  key: string,
) {
  const response = await fetch(
    "https://api.openai.com/v1/chat/completions",
    {
      method: "POST",
      headers: {
        "Content-Type":
          "application/json",
        Authorization: `Bearer ${key}`,
      },
      body: JSON.stringify({
        model,
        temperature: 0.15,
        response_format: {
          type: "json_object",
        },
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
      }),
    },
  )

  if (!response.ok) {
    throw new Error(
      `Model request failed: ${response.status}`,
    )
  }

  const result = await response.json()

  return result.choices?.[0]
    ?.message?.content ?? ""
}

export default async function handler(
  request: Request,
): Promise<Response> {
  if (request.method !== "POST") {
    return Response.json(
      {
        error: "Method not allowed.",
      },
      { status: 405 },
    )
  }

  let body: unknown

  try {
    body = await request.json()
  } catch {
    return Response.json(
      { error: "Invalid brief." },
      { status: 400 },
    )
  }

  const parsed =
    requestSchema.safeParse(body)

  if (!parsed.success) {
    return Response.json(
      {
        error: "Invalid brief.",
      },
      { status: 400 },
    )
  }

  const provider =
    process.env.AI_PROVIDER

  const model =
    process.env.AI_MODEL

  const key =
    process.env.AI_API_KEY

  if (!provider || !model || !key) {
    return Response.json(
      {
        error:
          "AI interpreter not configured.",
      },
      { status: 503 },
    )
  }

  try {
    const prompt =
      promptFor(parsed.data)

    const content =
      provider === "openai"
        ? await openai(
            prompt,
            model,
            key,
          )
        : await gemini(
            prompt,
            model,
            key,
          )

    const result =
      outputSchema.parse(
        extractJSON(content),
      )

    return Response.json(result)
  } catch (error) {
    console.error(error)

    return Response.json(
      {
        error:
          "Interpreter unavailable.",
      },
      { status: 502 },
    )
  }
}
