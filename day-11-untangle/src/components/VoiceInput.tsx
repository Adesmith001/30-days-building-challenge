import { Mic, Square } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface VoiceInputProps {
  text: string;
  onTextChange: (text: string) => void;
}

export function VoiceInput({ text, onTextChange }: VoiceInputProps) {
  const recorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const contextRef = useRef<AudioContext | null>(null);
  const frameRef = useRef<number | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const requestRef = useRef<AbortController | null>(null);
  const activeRef = useRef(false);
  const [phase, setPhase] = useState<"idle" | "starting" | "recording" | "transcribing">("idle");
  const [voiceError, setVoiceError] = useState("");
  const [levels, setLevels] = useState(() => Array.from({ length: 18 }, () => 0.12));
  const isListening = phase === "recording";
  const latestProps = useRef({ text, onTextChange });
  useEffect(() => { latestProps.current = { text, onTextChange }; }, [text, onTextChange]);

  function releaseMicrophone() {
    if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    if (timerRef.current !== null) clearTimeout(timerRef.current);
    frameRef.current = null;
    timerRef.current = null;
    streamRef.current?.getTracks().forEach(track => track.stop());
    streamRef.current = null;
    void contextRef.current?.close().catch(() => {});
    contextRef.current = null;
  }

  function startWaveform(stream: MediaStream) {
    if (!("AudioContext" in window)) return;
    const context = new AudioContext();
    contextRef.current = context;
    const analyser = context.createAnalyser();
    analyser.fftSize = 64;
    analyser.smoothingTimeConstant = 0.78;
    context.createMediaStreamSource(stream).connect(analyser);
    void context.resume().catch(() => {});
    const samples = new Uint8Array(analyser.frequencyBinCount);
    const draw = () => {
      analyser.getByteFrequencyData(samples);
      setLevels(current => current.map((_, index) => Math.max(0.12, samples[Math.floor(index / current.length * samples.length)] / 255)));
      frameRef.current = requestAnimationFrame(draw);
    };
    draw();
  }

  useEffect(() => () => {
    activeRef.current = false;
    requestRef.current?.abort();
    const recorder = recorderRef.current;
    if (recorder) {
      recorder.onstop = null;
      recorder.ondataavailable = null;
      recorder.onerror = null;
      if (recorder.state !== "inactive") recorder.stop();
    }
    releaseMicrophone();
  }, []);

  async function transcribe(audio: Blob) {
    releaseMicrophone();
    if (!activeRef.current) return;
    setPhase("transcribing");
    const controller = new AbortController();
    requestRef.current = controller;
    const timeout = setTimeout(() => controller.abort(), 45000);
    try {
      if (!audio.size) throw new Error("No audio was recorded. Please speak and try again.");
      if (audio.size > 4_000_000) throw new Error("That recording is too large. Please record a shorter thought.");
      const response = await fetch("/api/transcribe", {
        method: "POST",
        headers: { "Content-Type": audio.type },
        body: audio,
        signal: controller.signal,
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Couldn't transcribe right now. Please try again.");
      if (typeof data.text !== "string" || !data.text.trim()) throw new Error("No speech was heard. Please speak closer to your microphone and try again.");
      if (activeRef.current) {
        const latest = latestProps.current;
        latest.onTextChange([latest.text.trim(), data.text.trim()].filter(Boolean).join(" ").slice(0, 2000));
      }
    } catch (error) {
      if (activeRef.current) setVoiceError(controller.signal.aborted
        ? "Transcription timed out. Check your connection and try again."
        : error instanceof Error ? error.message : "Couldn't transcribe right now. Please try again.");
    } finally {
      clearTimeout(timeout);
      requestRef.current = null;
      if (activeRef.current) setPhase("idle");
      activeRef.current = false;
    }
  }

  async function toggleListening() {
    if (isListening) {
      recorderRef.current?.stop();
      return;
    }
    if (activeRef.current) return;
    if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === "undefined") {
      setVoiceError("Voice recording needs a supported browser on HTTPS or localhost.");
      return;
    }
    activeRef.current = true;
    setPhase("starting");
    setVoiceError("");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      if (!activeRef.current) {
        stream.getTracks().forEach(track => track.stop());
        return;
      }
      streamRef.current = stream;
      const mimeType = ["audio/webm;codecs=opus", "audio/mp4", "audio/ogg;codecs=opus"].find(type => MediaRecorder.isTypeSupported(type));
      const recorder = new MediaRecorder(stream, { ...(mimeType ? { mimeType } : {}), audioBitsPerSecond: 64000 });
      recorderRef.current = recorder;
      const chunks: Blob[] = [];
      recorder.ondataavailable = event => { if (event.data.size) chunks.push(event.data); };
      recorder.onstop = () => { void transcribe(new Blob(chunks, { type: recorder.mimeType })); };
      recorder.onerror = () => {
        recorder.onstop = null;
        if (recorder.state !== "inactive") recorder.stop();
        activeRef.current = false;
        releaseMicrophone();
        setPhase("idle");
        setVoiceError("Recording was interrupted. Check that your microphone is connected and try again.");
      };
      recorder.start();
      setPhase("recording");
      timerRef.current = setTimeout(() => { if (recorder.state === "recording") recorder.stop(); }, 120000);
      try { startWaveform(stream); } catch { /* Recording can continue without the meter. */ }
    } catch (error) {
      if (!activeRef.current) return;
      activeRef.current = false;
      releaseMicrophone();
      setPhase("idle");
      const name = error && typeof error === "object" && "name" in error ? error.name : "";
      setVoiceError(name === "NotAllowedError"
        ? "Allow microphone access for this site in your browser, then try again."
        : name === "NotFoundError" ? "No microphone was found. Connect a microphone and try again."
        : "Couldn't start recording. Check that your microphone is connected and isn't in use by another app.");
    }
  }

  return <>
    <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
      <button type="button" onClick={toggleListening} disabled={phase === "starting" || phase === "transcribing"}
        className={`inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition disabled:opacity-50 ${isListening ? "border-black bg-black text-white" : "border-line-dark bg-white text-ink hover:bg-soft"}`}
        aria-pressed={isListening}>
        {isListening ? <Square size={14} fill="currentColor" /> : <Mic size={15} />}
        {isListening ? "Stop listening" : phase === "starting" ? "Connecting microphone…" : phase === "transcribing" ? "Transcribing…" : "Speak instead"}
      </button>
      <span className="text-xs text-muted" role="status">
        {isListening ? "Listening… stop to insert your words (up to 2 minutes)." : phase === "transcribing" ? "Turning your recording into text…" : "Audio is sent to Groq to turn it into text."}
      </span>
    </div>
    {isListening && <div role="img" aria-label="Live microphone level" className="mt-4 flex h-12 items-center justify-center gap-1 overflow-hidden rounded-lg border border-line bg-soft px-4">
      {levels.map((level, index) => <span key={index} className="w-1 rounded-full bg-black transition-[height] duration-75" style={{ height: `${Math.round(6 + level * 30)}px` }} />)}
    </div>}
    {voiceError && <p className="mt-3 text-xs leading-5 text-muted" role="alert">{voiceError}</p>}
  </>;
}
