interface StructuredRequest {
  name: string;
  schema: object;
  system: string;
  user: string;
}

interface GroqResponse {
  choices?: Array<{
    message?: {
      content?: string | null;
    };
  }>;
  error?: {
    message?: string;
  };
}

export async function structuredGroq<T>({
  name,
  schema,
  system,
  user,
}: StructuredRequest): Promise<T> {
  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey) {
    throw new Error(
      "GROQ_API_KEY is not configured.",
    );
  }

  const model =
    process.env.GROQ_MODEL ??
    "openai/gpt-oss-20b";

  const response = await fetch(
    "https://api.groq.com/openai/v1/chat/completions",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        messages: [
          {
            role: "system",
            content: system,
          },
          {
            role: "user",
            content: user,
          },
        ],
        response_format: {
          type: "json_schema",
          json_schema: {
            name,
            strict: true,
            schema,
          },
        },
      }),
    },
  );

  const data =
    (await response.json()) as GroqResponse;

  if (!response.ok) {
    throw new Error(
      data.error?.message ??
        "Groq request failed.",
    );
  }

  const content =
    data.choices?.[0]?.message?.content;

  if (!content) {
    throw new Error(
      "Groq returned an empty response.",
    );
  }

  return JSON.parse(content) as T;
}