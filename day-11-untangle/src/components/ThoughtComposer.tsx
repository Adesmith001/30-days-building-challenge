import type { RefObject } from "react";
import { Command } from "lucide-react";
import { VoiceInput } from "./VoiceInput";

interface ThoughtComposerProps {
  text: string;
  textareaRef: RefObject<HTMLTextAreaElement | null>;
  canSubmit: boolean;
  onTextChange: (text: string) => void;
  onSubmit: () => void;
  onTryExample: () => void;
}

export function ThoughtComposer({
  text,
  textareaRef,
  canSubmit,
  onTextChange,
  onSubmit,
  onTryExample,
}: ThoughtComposerProps) {
  return (
    <>
      <div className="rounded-xl border border-line-dark/75 bg-panel p-5 shadow-[0_1px_2px_rgba(0,0,0,0.025)] transition focus-within:border-black sm:p-6">
        <textarea
          ref={textareaRef}
          value={text}
          maxLength={2000}
          rows={8}
          onChange={(event) =>
            onTextChange(event.target.value)
          }
          onKeyDown={(event) => {
            if (
              (event.metaKey || event.ctrlKey) &&
              event.key === "Enter"
            ) {
              event.preventDefault();
              onSubmit();
            }
          }}
          placeholder="I need to finish my assignment, reply to Sarah, buy groceries, figure out what I'm doing this weekend, and I've been thinking about..."
          className="min-h-[230px] w-full resize-none border-0 bg-transparent text-[18px] leading-8 text-black outline-none placeholder:text-zinc-400"
        />

        <div className="mt-4 flex items-center justify-between border-t border-line pt-4 text-xs text-muted sm:text-sm">
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-line-dark" />
            <span>
              Don&apos;t organize it. That&apos;s our job.
            </span>
          </div>

          <span className="font-mono text-xs">
            {text.length.toLocaleString()} / 2,000
          </span>
        </div>

        <VoiceInput
          text={text}
          onTextChange={onTextChange}
        />
      </div>

      <button
        type="button"
        disabled={!canSubmit}
        onClick={onSubmit}
        className="mt-6 flex w-full items-center justify-center gap-3 rounded-xl bg-black px-5 py-4 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-35"
      >
        Untangle my thoughts →
        <span className="hidden items-center gap-1 rounded-md border border-zinc-700 bg-zinc-900 px-2 py-1 font-mono text-[11px] text-zinc-400 sm:flex">
          <Command size={11} />
          Enter
        </span>
      </button>

      <div className="mt-5 text-center">
        <button
          type="button"
          onClick={onTryExample}
          className="text-sm text-zinc-600 transition hover:text-black"
        >
          Not sure what to write?{" "}
          <span className="underline underline-offset-4">
            Try an example
          </span>
        </button>
      </div>
    </>
  );
}
