"use client";

import {
  useState,
} from "react";

import {
  Check,
  Copy,
  Pencil,
  RotateCcw,
  X,
} from "lucide-react";

import {
  MarkdownMessage,
} from "@/components/conversation/markdown-message";

import type {
  ChatMessage,
} from "@/types/chat";

interface Props {
  message: ChatMessage;
  onRegenerate?:
    (message: ChatMessage) => void;
  onEdit?:
    (
      message: ChatMessage,
      content: string,
    ) => void;
}

export function ChatMessageItem({
  message,
  onRegenerate,
  onEdit,
}: Props) {
  const [
    editing,
    setEditing,
  ] = useState(false);

  const [
    draft,
    setDraft,
  ] = useState(
    message.content,
  );

  const [
    copied,
    setCopied,
  ] = useState(false);

  async function copy() {
    await navigator.clipboard.writeText(
      message.content,
    );

    setCopied(true);

    setTimeout(
      () =>
        setCopied(false),
      1200,
    );
  }

  if (
    message.role ===
    "user"
  ) {
    return (
      <article
        className="
          group ml-auto
          w-fit max-w-[88%]
          md:max-w-[80%]
        "
      >
        {editing ? (
          <div
            className="
              min-w-[280px]
              rounded-lg border
              bg-surface
              p-3
            "
          >
            <textarea
              value={draft}
              onChange={(event) =>
                setDraft(
                  event.target.value,
                )
              }
              className="
                min-h-28 w-full
                bg-transparent
                text-sm
                leading-6
                outline-none
              "
            />

            <p
              className="
                mt-2
                text-[10px]
                text-muted
              "
            >
              Messages after this point
              will be replaced.
            </p>

            <div
              className="
                mt-3 flex
                justify-end
                gap-2
              "
            >
              <button
                type="button"
                onClick={() => {
                  setDraft(
                    message.content,
                  );

                  setEditing(
                    false,
                  );
                }}
                className="
                  inline-flex
                  items-center gap-1
                  text-xs
                  text-muted
                "
              >
                <X size={13} />
                CANCEL
              </button>

              <button
                type="button"
                onClick={() => {
                  const clean =
                    draft.trim();

                  if (!clean) {
                    return;
                  }

                  onEdit?.(
                    message,
                    clean,
                  );

                  setEditing(
                    false,
                  );
                }}
                className="
                  inline-flex
                  items-center
                  gap-1
                  text-xs
                  font-medium
                "
              >
                <Check
                  size={13}
                />

                SAVE & REGENERATE
              </button>
            </div>
          </div>
        ) : (
          <>
            <div
              className="
                rounded-lg
                bg-surface-subtle
                px-4 py-3
                text-[15px]
                leading-7
                whitespace-pre-wrap
              "
            >
              {message.content}
            </div>

            <div
              className="
                mt-1 flex
                justify-end
                gap-1
                opacity-0
                transition-opacity
                group-hover:opacity-100
                group-focus-within:opacity-100
              "
            >
              <button
                type="button"
                onClick={() =>
                  setEditing(
                    true,
                  )
                }
                className="
                  rounded p-1.5
                  text-muted
                  hover:bg-surface-hover
                  hover:text-foreground
                "
                aria-label="Edit message"
              >
                <Pencil
                  size={13}
                />
              </button>

              <button
                type="button"
                onClick={copy}
                className="
                  rounded p-1.5
                  text-muted
                  hover:bg-surface-hover
                  hover:text-foreground
                "
                aria-label="Copy message"
              >
                {copied ? (
                  <Check
                    size={13}
                  />
                ) : (
                  <Copy
                    size={13}
                  />
                )}
              </button>
            </div>
          </>
        )}
      </article>
    );
  }

  return (
    <article
      className="
        group w-full
      "
    >
      <MarkdownMessage
        content={
          message.content
        }
      />

      {message.metadata
        ?.stopped && (
        <p
          className="
            mt-2 text-xs
            text-muted
          "
        >
          Generation stopped.
        </p>
      )}

      <div
        className="
          mt-1 flex
          gap-1
          opacity-0
          transition-opacity
          group-hover:opacity-100
          group-focus-within:opacity-100
        "
      >
        <button
          type="button"
          onClick={copy}
          className="
            rounded p-1.5
            text-muted
            hover:bg-surface-hover
            hover:text-foreground
          "
          aria-label="Copy response"
        >
          {copied ? (
            <Check size={13} />
          ) : (
            <Copy size={13} />
          )}
        </button>

        {onRegenerate && (
          <button
            type="button"
            onClick={() =>
              onRegenerate(
                message,
              )
            }
            className="
              rounded p-1.5
              text-muted
              hover:bg-surface-hover
              hover:text-foreground
            "
            aria-label="Regenerate response"
          >
            <RotateCcw
              size={13}
            />
          </button>
        )}
      </div>
    </article>
  );
}
