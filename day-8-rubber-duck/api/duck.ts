import {
  readFileSync,
} from "node:fs";
import {
  resolve,
} from "node:path";

import {
  buildPrompt,
} from "../src/prompts/buildPrompt.js";
import {
  coerceDuckResponse,
} from "../src/lib/aiResponse.js";
import {
  SYSTEM_PROMPT,
} from "../src/prompts/system.js";
import {
  DuckRequestSchema,
} from "../src/schemas/ai.js";

type VercelRequest = {
  method?: string;
  headers?: Record<string, string | string[] | undefined>;
  url?: string;
  body?: unknown;
};

type VercelResponse = {
  statusCode?: number;
  setHeader(name: string, value: string): void;
  end(body?: string): void;
};

export default async function handler(
  request: VercelRequest,
  response: VercelResponse,
) {
  const body =
    typeof request.body === "string"
      ? request.body
      : JSON.stringify(request.body ?? {});

  const webRequest = new Request(
    `https://${request.headers?.host ?? "localhost"}${request.url ?? "/api/duck"}`,
    {
      method: request.method ?? "POST",
      headers: request.headers as HeadersInit,
      body,
    },
  );

  const webResponse = await POST(webRequest);

  response.statusCode = webResponse.status;
  webResponse.headers.forEach((value, key) => {
    response.setHeader(key, value);
  });
  response.end(await webResponse.text());
}

export async function POST(
  request: Request,
) {
  try {
    const parsed =
      DuckRequestSchema.safeParse(
        await request.json(),
      );

    if (!parsed.success) {
      return Response.json(
        {
          error: "Invalid request",
          details: parsed.error.flatten(),
        },
        { status: 400 },
      );
    }

    const apiKey =
      process.env.GROQ_API_KEY ||
      readLocalApiKey();

    if (!apiKey) {
      return Response.json(
        {
          error:
            "GROQ_API_KEY is not configured. Add it to .env.local.",
        },
        { status: 500 },
      );
    }

    const upstream = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model:
            process.env.GROQ_MODEL ||
            "openai/gpt-oss-20b",
          messages: [
            {
              role: "system",
              content: SYSTEM_PROMPT,
            },
            {
              role: "user",
              content: buildPrompt(parsed.data),
            },
          ],
          temperature: 0.2,
          response_format: {
            type: "json_object",
          },
        }),
      },
    );

    const body = await upstream.text();
    const json = parseJson(body);

    if (!upstream.ok) {
      const error = new Error(
        getErrorMessage(json) ||
          `Groq returned ${upstream.status}.`,
      );
      Object.assign(error, {
        statusCode: upstream.status,
        retryAfter: upstream.headers.get(
          "retry-after",
        ),
      });
      throw error;
    }

    const text = getChoiceText(json);

    if (!text) {
      throw new Error(
        "Groq returned an empty response.",
      );
    }

    return Response.json(
      coerceDuckResponse(
        JSON.parse(text),
        {
          ...parsed.data,
          currentQuestion:
            parsed.data.currentQuestion,
        },
      ),
      {
        headers: {
          "Cache-Control": "no-store",
        },
      },
    );
  } catch (error) {
    console.error(
      "Rubber Duck API error:",
      error,
    );

    const statusCode =
      getNumber(error, "statusCode") ||
      500;

    if (statusCode === 429) {
      const retryAfter =
        getNumber(error, "retryAfter") ||
        extractRetryAfter(error);

      return Response.json(
        {
          error: retryAfter
            ? `The Duck is at capacity. Try again in ${retryAfter} seconds.`
            : "The Duck is at capacity. Try again shortly.",
          retryAfter,
        },
        { status: 429 },
      );
    }

    return Response.json(
      {
        error:
          "The Duck could not answer right now. Your response is still here—try again.",
      },
      { status: 500 },
    );
  }
}

function readLocalApiKey() {
  try {
    const env = readFileSync(
      resolve(process.cwd(), ".env.local"),
      "utf8",
    );
    return env.match(
      /^\s*GROQ_API_KEY\s*=\s*["']?([^"'\r\n]+)["']?\s*$/m,
    )?.[1];
  } catch {
    return undefined;
  }
}

function parseJson(body: string) {
  try {
    return body
      ? (JSON.parse(body) as Record<string, unknown>)
      : {};
  } catch {
    return {};
  }
}

function getNumber(
  value: unknown,
  key: string,
) {
  if (
    typeof value !== "object" ||
    value === null
  ) {
    return undefined;
  }

  const candidate =
    (value as Record<string, unknown>)[key];

  return typeof candidate === "number"
    ? candidate
    : undefined;
}

function getErrorMessage(
  value: Record<string, unknown>,
) {
  const error = value.error;

  if (
    typeof error === "object" &&
    error !== null
  ) {
    const message =
      (error as Record<string, unknown>)
        .message;

    return typeof message === "string"
      ? message
      : undefined;
  }

  return undefined;
}

function getChoiceText(
  value: Record<string, unknown>,
) {
  const choices = value.choices;

  if (!Array.isArray(choices)) {
    return undefined;
  }

  const first = choices[0];

  if (
    typeof first !== "object" ||
    first === null
  ) {
    return undefined;
  }

  const message =
    (first as Record<string, unknown>)
      .message;

  if (
    typeof message !== "object" ||
    message === null
  ) {
    return undefined;
  }

  const content =
    (message as Record<string, unknown>)
      .content;

  return typeof content === "string"
    ? content
    : undefined;
}

function extractRetryAfter(error: unknown) {
  const message =
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof error.message === "string"
      ? error.message
      : "";
  const match = message.match(
    /retry in ([\d.]+)s/i,
  );
  return match
    ? Math.ceil(Number(match[1]))
    : undefined;
}
