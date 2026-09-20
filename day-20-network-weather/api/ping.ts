import { corsHeaders } from "./_cors";

export async function GET() {
  return Response.json(
    { ok: true, timestamp: Date.now() },
    {
      headers: {
        ...corsHeaders,
        "Cache-Control": "no-store, no-cache, must-revalidate",
      },
    },
  );
}
