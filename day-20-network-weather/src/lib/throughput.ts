import { networkApiUrl } from "./networkApi";
import { roundMetric } from "./statistics";

interface TransferResult {
  bytes: number;
  durationMs: number;
}

interface AdaptiveTransferOptions {
  initialBytes: number;
  maxChunkBytes: number;
  targetDurationMs: number;
  maxBytes: number;
}

function calculateMbps(bytes: number, durationMs: number) {
  return roundMetric((bytes * 8) / (durationMs / 1000) / 1_000_000, 1);
}

async function requestDownload(size: number): Promise<TransferResult> {
  const startedAt = performance.now();
  const url = networkApiUrl(
    `/api/download?bytes=${size}&t=${Date.now()}`,
  );
  const response = await fetch(url, { cache: "no-store" });
  if (!response.ok) throw new Error("Download test failed");

  return {
    bytes: (await response.arrayBuffer()).byteLength,
    durationMs: performance.now() - startedAt,
  };
}

export async function measureAdaptiveTransfer(
  request: (size: number) => Promise<TransferResult>,
  options: AdaptiveTransferOptions,
) {
  let nextSize = options.initialBytes;
  let bytes = 0;
  let durationMs = 0;

  while (durationMs < options.targetDurationMs && bytes < options.maxBytes) {
    const size = Math.min(
      nextSize,
      options.maxChunkBytes,
      options.maxBytes - bytes,
    );
    const transfer = await request(size);
    bytes += transfer.bytes;
    durationMs += transfer.durationMs;

    if (transfer.durationMs < 250) nextSize *= 4;
    else if (transfer.durationMs <= 1_000) nextSize *= 2;
  }

  return { mbps: calculateMbps(bytes, durationMs), bytes };
}

export function measureDownload() {
  return measureAdaptiveTransfer(requestDownload, {
    initialBytes: 64 * 1024,
    maxChunkBytes: 2 * 1024 * 1024,
    targetDurationMs: 4_000,
    maxBytes: 32 * 1024 * 1024,
  });
}

function randomBuffer(size: number) {
  const bytes = new Uint8Array(size);
  for (let offset = 0; offset < bytes.length; offset += 65_536) {
    crypto.getRandomValues(
      bytes.subarray(offset, Math.min(offset + 65_536, bytes.length)),
    );
  }
  return bytes.buffer;
}

async function requestUpload(size: number): Promise<TransferResult> {
  const payload = randomBuffer(size);
  const startedAt = performance.now();
  const url = networkApiUrl(`/api/upload?t=${Date.now()}`);
  const response = await fetch(url, {
    method: "POST",
    cache: "no-store",
    headers: { "Content-Type": "application/octet-stream" },
    body: payload,
  });
  if (!response.ok) throw new Error("Upload test failed");

  const result = (await response.json()) as { receivedBytes: number };
  return {
    bytes: result.receivedBytes,
    durationMs: performance.now() - startedAt,
  };
}

export function measureUpload() {
  return measureAdaptiveTransfer(requestUpload, {
    initialBytes: 64 * 1024,
    maxChunkBytes: 2 * 1024 * 1024,
    targetDurationMs: 4_000,
    maxBytes: 8 * 1024 * 1024,
  });
}
