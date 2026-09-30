"use client";

import { useEffect, useState } from "react";

interface InstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function useInstallPrompt() {
  const [event, setEvent] = useState<InstallPromptEvent | null>(null);
  useEffect(() => { const onBeforeInstall = (value: Event) => { value.preventDefault(); setEvent(value as InstallPromptEvent); }; window.addEventListener("beforeinstallprompt", onBeforeInstall); return () => window.removeEventListener("beforeinstallprompt", onBeforeInstall); }, []);
  return { canInstall: Boolean(event), install: async () => { if (!event) return; await event.prompt(); await event.userChoice; setEvent(null); } };
}
