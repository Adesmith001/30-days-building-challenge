"use client";

import { useMemo, useState } from "react";
import {
  Check,
  Clipboard,
  Download,
} from "lucide-react";
import type { ReleaseSession } from "@/types/release";
import {
  generateReleasePacket,
  generateReleaseSummary,
} from "@/lib/export/packet";
import { Button } from "@/components/ui/button";

export function PacketView({
  session,
}: {
  session: ReleaseSession;
}) {
  const markdown = useMemo(
    () => generateReleasePacket(session),
    [session],
  );

  const summary = useMemo(
    () => generateReleaseSummary(session),
    [session],
  );

  const [copied, setCopied] = useState("");

  async function copy(
    text: string,
    kind: string,
  ) {
    await navigator.clipboard.writeText(text);
    setCopied(kind);

    window.setTimeout(() => setCopied(""), 1500);
  }

  function download(
    content: string,
    type: string,
    extension: string,
  ) {
    const blob = new Blob([content], { type });
    const href = URL.createObjectURL(blob);

    const anchor = document.createElement("a");

    anchor.href = href;
    anchor.download = `${session.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")}-shipcheck.${extension}`;

    anchor.click();
    URL.revokeObjectURL(href);
  }

  return (
    <div className="mx-auto max-w-5xl p-5 md:p-8 lg:p-10">
      <p className="font-mono text-[10px] tracking-[0.12em] text-neutral-400">
        FINAL OUTPUT
      </p>

      <h1 className="mt-2 text-4xl font-semibold tracking-[-0.055em]">
        RELEASE
        <br />
        PACKET.
      </h1>

      <div className="mt-7 flex flex-wrap gap-2">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => void copy(markdown, "md")}
        >
          {copied === "md" ? (
            <Check size={13} />
          ) : (
            <Clipboard size={13} />
          )}

          COPY MARKDOWN
        </Button>

        <Button
          variant="secondary"
          size="sm"
          onClick={() =>
            download(
              markdown,
              "text/markdown",
              "md",
            )
          }
        >
          <Download size={13} />
          DOWNLOAD .MD
        </Button>

        <Button
          variant="secondary"
          size="sm"
          onClick={() =>
            download(
              JSON.stringify(session, null, 2),
              "application/json",
              "json",
            )
          }
        >
          <Download size={13} />
          DOWNLOAD JSON
        </Button>

        <Button
          variant="secondary"
          size="sm"
          onClick={() =>
            void copy(summary, "summary")
          }
        >
          {copied === "summary" ? (
            <Check size={13} />
          ) : (
            <Clipboard size={13} />
          )}
          COPY SUMMARY
        </Button>
      </div>

      <div className="mt-7 overflow-hidden border border-neutral-200 bg-[#fafaf8] dark:border-neutral-800 dark:bg-neutral-900">
        <div className="border-b border-neutral-200 px-5 py-3 font-mono text-[9px] text-neutral-400 dark:border-neutral-800">
          RELEASE-PACKET.MD
        </div>

        <pre className="max-h-[700px] overflow-auto whitespace-pre-wrap p-5 font-mono text-[11px] leading-6">
          {markdown}
        </pre>
      </div>
    </div>
  );
}