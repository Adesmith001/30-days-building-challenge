export async function GET() {
  return Response.json(
    { ok: true, timestamp: Date.now() },
    { headers: { "Cache-Control": "no-store, no-cache, must-revalidate" } },
  );
}
