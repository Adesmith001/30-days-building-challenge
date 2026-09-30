"use client";

import { useEffect, useRef } from "react";

import {
  recordVisibilityHidden,
  recordVisibilityVisible,
} from "@/lib/session/operations";

import { useSettingsStore } from "@/stores/settings-store";
import { useUIStore } from "@/stores/ui-store";

export function useVisibilityTracking(
  sessionId: string,
  active: boolean,
) {
  const hiddenAtRef =
    useRef<string | null>(null);

  const threshold =
    useSettingsStore(
      (state) => state.reentryThreshold,
    );

  const setReentry =
    useUIStore((state) => state.setReentry);

  useEffect(() => {
    if (!active) return;

    async function onVisibility() {
      if (document.hidden) {
        const hiddenAt =
          new Date().toISOString();

        hiddenAtRef.current = hiddenAt;

        await recordVisibilityHidden(
          sessionId,
        );

        return;
      }

      const hiddenAt = hiddenAtRef.current;

      if (!hiddenAt) return;

      const returnedAt =
        new Date().toISOString();

      const durationMs =
        new Date(returnedAt).getTime() -
        new Date(hiddenAt).getTime();

      await recordVisibilityVisible(
        sessionId,
        hiddenAt,
        durationMs,
      );

      hiddenAtRef.current = null;

      if (
        durationMs >= threshold * 1000
      ) {
        setReentry({
          hiddenAt,
          returnedAt,
          durationMs,
        });
      }
    }

    document.addEventListener(
      "visibilitychange",
      onVisibility,
    );

    return () =>
      document.removeEventListener(
        "visibilitychange",
        onVisibility,
      );
  }, [
    active,
    sessionId,
    setReentry,
    threshold,
  ]);
}