"use client";

import {
  useEffect,
} from "react";

import {
  useRouter,
} from "next/navigation";

interface Input {
  focusComposer?:
    () => void;
}

export function useChatShortcuts({
  focusComposer,
}: Input = {}) {
  const router =
    useRouter();

  useEffect(() => {
    function handler(
      event: KeyboardEvent,
    ) {
      const command =
        event.metaKey ||
        event.ctrlKey;

      if (
        command &&
        event.shiftKey &&
        event.key.toLowerCase() ===
          "o"
      ) {
        event.preventDefault();

        router.push(
          "/chat?new=1",
        );

        return;
      }

      if (
        event.key ===
          "/" &&
        !command &&
        document.activeElement
          ?.tagName !==
          "INPUT" &&
        document.activeElement
          ?.tagName !==
          "TEXTAREA"
      ) {
        event.preventDefault();

        focusComposer?.();
      }
    }

    window.addEventListener(
      "keydown",
      handler,
    );

    return () =>
      window.removeEventListener(
        "keydown",
        handler,
      );
  }, [
    focusComposer,
    router,
  ]);
}
