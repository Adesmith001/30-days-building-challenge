"use client";

import { useEffect } from "react";

export function useWakeLock(enabled: boolean) {
  useEffect(() => {
    if (!enabled) return;
    if (!("wakeLock" in navigator)) return;

    let lock:
      | Awaited<
          ReturnType<
            Navigator["wakeLock"]["request"]
          >
        >
      | undefined;

    async function acquire() {
      try {
        lock =
          await navigator.wakeLock.request(
            "screen",
          );
      } catch {
        // Feature can fail silently.
      }
    }

    void acquire();

    async function onVisibility() {
      if (
        document.visibilityState ===
        "visible"
      ) {
        await acquire();
      }
    }

    document.addEventListener(
      "visibilitychange",
      onVisibility,
    );

    return () => {
      document.removeEventListener(
        "visibilitychange",
        onVisibility,
      );

      void lock?.release();
    };
  }, [enabled]);
}