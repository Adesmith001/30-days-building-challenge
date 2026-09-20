const MIN_BYTES = 64 * 1024;
const MAX_BYTES = 2 * 1024 * 1024;
export async function GET(request: Request) {
  const requested = Number(
    new URL(request.url).searchParams.get("bytes") ?? 256 * 1024,
  );
  const size = Math.max(
    MIN_BYTES,
    Math.min(MAX_BYTES, Number.isFinite(requested) ? requested : 256 * 1024),
  );
  const bytes = new Uint8Array(size);
  for (let offset = 0; offset < size; offset += 65_536) {
    crypto.getRandomValues(
      bytes.subarray(offset, Math.min(offset + 65_536, size)),
    );
  }

  return new Response(bytes, {
    headers: {
      "Content-Type": "application/octet-stream",
      "Content-Length": String(size),
      "Cache-Control": "no-store, no-cache, must-revalidate",
    },
  });
}
