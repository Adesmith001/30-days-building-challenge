"use client";

import {
  useEffect,
  useRef,
} from "react";

import {
  ArrowUp,
  Square,
} from "lucide-react";

interface Props {
  value: string;
  onChange:
    (value: string) => void;
  onSend: () => void;
  onStop: () => void;
  streaming: boolean;
  error?: string | null;
}

export function ChatComposer({
  value,
  onChange,
  onSend,
  onStop,
  streaming,
  error,
}: Props) {
  const ref =
    useRef<HTMLTextAreaElement>(
      null,
    );

  useEffect(() => {
    const element =
      ref.current;

    if (!element) {
      return;
    }

    element.style.height =
      "auto";

    element.style.height =
      `${Math.min(
        element.scrollHeight,
        220,
      )}px`;
  }, [value]);

  function onKeyDown(
    event:
      React.KeyboardEvent<HTMLTextAreaElement>,
  ) {
    if (
      event.key === "Enter" &&
      !event.shiftKey
    ) {
      event.preventDefault();

      if (
        !streaming &&
        value.trim()
      ) {
        onSend();
      }
    }
  }

  return (
    <div
      className="
        mx-auto w-full
        max-w-[820px]
        px-4 pb-4
        md:px-6
      "
    >
      <div
        className="
          rounded-xl
          border
          bg-surface
          p-2
          shadow-[0_1px_3px_rgba(0,0,0,0.025)]
        "
      >
        <label
          htmlFor="architecture-message"
          className="sr-only"
        >
          Describe your architecture
        </label>

        <textarea
          ref={ref}
          id="architecture-message"
          autoFocus
          rows={1}
          maxLength={20_000}
          value={value}
          onChange={(event) =>
            onChange(
              event.target.value,
            )
          }
          onKeyDown={
            onKeyDown
          }
          placeholder="Describe your architecture..."
          className="
            max-h-[220px]
            min-h-[56px]
            w-full
            bg-transparent
            px-2 py-2
            text-[15px]
            leading-6
            outline-none
            placeholder:text-muted
          "
        />

        <div
          className="
            flex items-center
            justify-between
            gap-3 px-1
          "
        >
          <span
            className="
              hidden
              text-[9px]
              tracking-wide
              text-muted
              sm:inline
            "
          >
            ENTER TO SEND Â· SHIFT +
            ENTER FOR NEW LINE
          </span>

          <span />

          {streaming ? (
            <button
              type="button"
              onClick={onStop}
              className="
                grid size-8
                place-items-center
                rounded-md
                bg-foreground
                text-background
              "
              aria-label="Stop generation"
            >
              <Square
                size={11}
                fill="currentColor"
              />
            </button>
          ) : (
            <button
              type="button"
              onClick={onSend}
              disabled={
                !value.trim()
              }
              className="
                grid size-8
                place-items-center
                rounded-md
                bg-foreground
                text-background
                transition-opacity
                disabled:opacity-25
              "
              aria-label="Send message"
            >
              <ArrowUp
                size={16}
              />
            </button>
          )}
        </div>
      </div>

      {error && (
        <div
          className="
            mt-2 flex
            items-center gap-2
            text-xs
            text-destructive
          "
        >
          <span>
            {error}
          </span>
        </div>
      )}
    </div>
  );
}
