"use client";

import {
  useEffect,
  useId,
  useState,
} from "react";

import {
  Copy,
} from "lucide-react";

import {
  normalizeMermaidCode,
} from "@/lib/mermaid";

export function DiagramBlock({
  code,
}: {
  code: string;
}) {
  const reactId =
    useId();

  const [svg, setSvg] =
    useState("");

  const [error, setError] =
    useState(false);

  const normalizedCode =
    normalizeMermaidCode(code);

  useEffect(() => {
    let active = true;

    async function render() {
      try {
        const mermaid =
          (
            await import(
              "mermaid"
            )
          ).default;

        mermaid.initialize({
          startOnLoad: false,
          securityLevel:
            "strict",

          theme:
            document.documentElement
              .classList
              .contains(
                "dark",
              )
              ? "dark"
              : "neutral",

          flowchart: {
            htmlLabels:
              false,
          },
        });

        const id =
          `architecture-${reactId.replace(
            /:/g,
            "",
          )}`;

        const result =
          await mermaid.render(
            id,
            normalizedCode,
          );

        if (active) {
          setSvg(result.svg);
          setError(false);
        }
      } catch {
        if (active) {
          setError(true);
        }
      }
    }

    void render();

    return () => {
      active = false;
    };
  }, [
    code,
    normalizedCode,
    reactId,
  ]);

  if (error) {
    return (
      <pre
        className="
          overflow-x-auto
          rounded-md border
          bg-surface-subtle
          p-4 text-xs
        "
      >
        {normalizedCode}
      </pre>
    );
  }

  return (
    <div
      className="
        my-5
        overflow-hidden
        rounded-lg border
        bg-surface p-4
      "
    >
      <div
        className="
          overflow-x-auto
          [&_svg]:mx-auto
          [&_svg]:max-w-full
        "
        dangerouslySetInnerHTML={{
          __html: svg,
        }}
      />

      <button
        type="button"
        onClick={() =>
          navigator.clipboard.writeText(
            normalizedCode,
          )
        }
        className="
          mt-3 inline-flex
          items-center gap-2
          text-[10px]
          font-medium
          tracking-wider
          text-muted
          hover:text-foreground
        "
      >
        <Copy size={12} />
        COPY MERMAID
      </button>
    </div>
  );
}
