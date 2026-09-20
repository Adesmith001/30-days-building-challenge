import { roundMetric } from './statistics'

interface TransferResult { mbps: number; bytes: number; durationMs: number }

function calculateMbps(bytes: number, durationMs: number) {
  return roundMetric(bytes * 8 / (durationMs / 1000) / 1_000_000, 1)
}

async function requestDownload(size: number): Promise<TransferResult> {
  const startedAt = performance.now()
  const response = await fetch(`/api/download?bytes=${size}&t=${Date.now()}`, { cache: 'no-store' })
  if (!response.ok) throw new Error('Download test failed')
  const bytes = (await response.arrayBuffer()).byteLength
  const durationMs = performance.now() - startedAt
  return { bytes, durationMs, mbps: calculateMbps(bytes, durationMs) }
}

export async function measureDownload() {
  const tests = [await requestDownload(256 * 1024)]
  if (tests[0].durationMs < 800) tests.push(await requestDownload(1024 * 1024))
  if (tests.at(-1)!.durationMs < 900) tests.push(await requestDownload(2 * 1024 * 1024))
  const finalTest = tests.at(-1)!
  return { mbps: finalTest.mbps, bytes: tests.reduce((total, test) => total + test.bytes, 0) }
}

function randomBuffer(size: number) {
  const bytes = new Uint8Array(size)
  for (let offset = 0; offset < bytes.length; offset += 65_536) {
    crypto.getRandomValues(bytes.subarray(offset, Math.min(offset + 65_536, bytes.length)))
  }
  return bytes.buffer
}

export async function measureUpload() {
  const payload = randomBuffer(768 * 1024)
  const startedAt = performance.now()
  const response = await fetch(`/api/upload?t=${Date.now()}`, { method: 'POST', cache: 'no-store', headers: { 'Content-Type': 'application/octet-stream' }, body: payload })
  if (!response.ok) throw new Error('Upload test failed')
  const result = await response.json() as { receivedBytes: number }
  const bytes = result.receivedBytes
  return { mbps: calculateMbps(bytes, performance.now() - startedAt), bytes }
}
