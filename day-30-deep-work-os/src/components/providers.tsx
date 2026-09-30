"use client";

import { useEffect } from "react";

import { useSettingsStore } from "@/stores/settings-store";

function ThemeRuntime() {
  const theme =
    useSettingsStore((state) => state.theme);

  useEffect(() => {
    const root =
      document.documentElement;

    const media = window.matchMedia(
      "(prefers-color-scheme: dark)",
    );

    const apply = () => {
      const shouldDark =
        theme === "dark" ||
        (theme === "system" && media.matches);

      root.classList.toggle(
        "dark",
        shouldDark,
      );
    };

    apply();

    media.addEventListener("change", apply);

    return () =>
      media.removeEventListener(
        "change",
        apply,
      );
  }, [theme]);

  return null;
}

function ServiceWorkerRuntime() {
  useEffect(() => {
    if (
      "serviceWorker" in navigator &&
      process.env.NODE_ENV === "production"
    ) {
      void navigator.serviceWorker.register(
        "/sw.js",
      );
    }
  }, []);

  return null;
}

export function Providers({
  children,
}: {
  children: React.ReactNode;
}) {
  return <><ThemeRuntime /><ServiceWorkerRuntime />{children}</>;
}
