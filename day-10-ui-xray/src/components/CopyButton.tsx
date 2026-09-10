import {
  Check,
  Copy,
} from "lucide-react";

import { useState } from "react";

interface Props {
  value: string;
}

export function CopyButton({
  value,
}: Props) {
  const [copied, setCopied] =
    useState(false);

  async function copy() {
    await navigator.clipboard.writeText(
      value,
    );

    setCopied(true);

    window.setTimeout(() => {
      setCopied(false);
    }, 1200);
  }

  return (
    <button
      onClick={copy}
      className="flex h-7 items-center gap-1.5 border border-line px-2 font-mono text-[8px] font-semibold hover:bg-subtle"
    >
      {copied ? (
        <Check size={10} />
      ) : (
        <Copy size={10} />
      )}

      {copied ? "COPIED" : "COPY"}
    </button>
  );
}