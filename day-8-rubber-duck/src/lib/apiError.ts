type ApiErrorBody = {
  error?: unknown;
  details?: {
    fieldErrors?: Record<string, unknown>;
  };
};

export function formatApiError(
  body: ApiErrorBody,
  status: number,
) {
  const problemError = body.details?.fieldErrors?.problem;

  if (Array.isArray(problemError) && typeof problemError[0] === "string") {
    const message = problemError[0];

    return `Problem: ${
      message.includes("<=12000")
        ? "Keep it under 12,000 characters."
        : message
    }`;
  }

  if (typeof body.error === "string") {
    return body.error;
  }

  return status === 404
    ? "The Duck API is not running. Start with pnpm dev:vercel."
    : `The Duck API returned ${status}. Try again.`;
}
