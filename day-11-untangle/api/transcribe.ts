import type { VercelRequest, VercelResponse } from "@vercel/node";

export const config = { api: { bodyParser: false } };

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed." });
  }
  const mimeType = (req.headers["content-type"] || "").split(";")[0].trim();
  const extensions: Record<string, string> = {
    "audio/webm": "webm", "audio/mp4": "mp4", "audio/ogg": "ogg",
    "audio/wav": "wav", "audio/mpeg": "mp3",
  };
  if (!Object.hasOwn(extensions, mimeType)) {
    return res.status(415).json({ error: "Unsupported audio format. Please try another browser." });
  }
  if (!process.env.GROQ_API_KEY) {
    return res.status(503).json({ error: "Voice transcription is not configured. Set GROQ_API_KEY on the server." });
  }
  try {
    const chunks: Buffer[] = [];
    let size = 0;
    for await (const chunk of req) {
      const buffer = Buffer.from(chunk);
      size += buffer.length;
      if (size > 4_000_000) {
        return res.status(413).json({ error: "Recording is too large. Please record a shorter thought." });
      }
      chunks.push(buffer);
    }
    if (!size) return res.status(400).json({ error: "No audio was recorded. Please try again." });
    const form = new FormData();
    form.append("file", new Blob([Buffer.concat(chunks)], { type: mimeType }), `recording.${extensions[mimeType]}`);
    form.append("model", "whisper-large-v3-turbo");
    form.append("response_format", "json");
    const response = await fetch("https://api.groq.com/openai/v1/audio/transcriptions", {
      method: "POST",
      headers: { Authorization: `Bearer ${process.env.GROQ_API_KEY}` },
      body: form,
      signal: AbortSignal.timeout(30000),
    });
    if (!response.ok) {
      return res.status(response.status === 429 ? 429 : 502).json({
        error: response.status === 429 ? "Transcription is busy. Try again shortly." : "Transcription service is unavailable. Please try again shortly.",
      });
    }
    const data = await response.json() as { text?: unknown };
    if (typeof data.text !== "string") throw new Error("Invalid transcription response");
    return res.status(200).json({ text: data.text.trim().slice(0, 2000) });
  } catch {
    return res.status(502).json({ error: "Couldn't reach the transcription service. Check your connection and try again." });
  }
}
