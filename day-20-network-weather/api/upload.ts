const MAX_BYTES = 2 * 1024 * 1024;
export async function POST(request: Request) {
  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (contentLength > MAX_BYTES)
    return Response.json({ error: "Payload too large" }, { status: 413 });
  const body = await request.arrayBuffer();
  if (body.byteLength > MAX_BYTES)
    return Response.json({ error: "Payload too large" }, { status: 413 });
  return Response.json(
    { receivedBytes: body.byteLength },
    { headers: { "Cache-Control": "no-store" } },
  );
}
