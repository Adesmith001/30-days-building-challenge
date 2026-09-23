"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import {
  DiagramBlock,
} from "@/components/conversation/diagram-block";

export function MarkdownMessage({
  content,
}: {
  content: string;
}) {
  return (
    <div
      className="
        max-w-none
        text-[15px]
        leading-7
        text-foreground

        [&_h1]:mb-4
        [&_h1]:mt-7
        [&_h1]:text-lg
        [&_h1]:font-semibold

        [&_h2]:mb-3
        [&_h2]:mt-6
        [&_h2]:text-sm
        [&_h2]:font-semibold
        [&_h2]:tracking-wide

        [&_h3]:mb-2
        [&_h3]:mt-5
        [&_h3]:text-sm
        [&_h3]:font-medium

        [&_p]:my-3

        [&_ul]:my-3
        [&_ul]:list-disc
        [&_ul]:pl-5

        [&_ol]:my-3
        [&_ol]:list-decimal
        [&_ol]:pl-5

        [&_li]:my-1

        [&_blockquote]:
        border-l-2

        [&_blockquote]:
        border-border-strong

        [&_blockquote]:
        pl-4

        [&_blockquote]:
        text-muted

        [&_table]:
        my-5

        [&_table]:
        w-full

        [&_table]:
        border-collapse

        [&_th]:
        border-b

        [&_th]:
        px-2

        [&_th]:
        py-2

        [&_th]:
        text-left

        [&_th]:
        text-xs

        [&_td]:
        border-b

        [&_td]:
        px-2

        [&_td]:
        py-2

        [&_td]:
        text-sm
      "
    >
      <ReactMarkdown
        remarkPlugins={[
          remarkGfm,
        ]}
        components={{
          code({
            className,
            children,
            ...props
          }) {
            const match =
              /language-(\w+)/.exec(
                className || "",
              );

            const language =
              match?.[1];

            const text =
              String(
                children,
              ).replace(
                /\n$/,
                "",
              );

            if (
              language ===
              "mermaid"
            ) {
              return (
                <DiagramBlock
                  code={text}
                />
              );
            }

            if (!language) {
              return (
                <code
                  className="
                    rounded
                    bg-surface-subtle
                    px-1.5 py-0.5
                    text-[0.92em]
                  "
                  {...props}
                >
                  {children}
                </code>
              );
            }

            return (
              <code
                className={
                  className
                }
                {...props}
              >
                {children}
              </code>
            );
          },

          pre({
            children,
          }) {
            return (
              <pre
                className="
                  my-4
                  overflow-x-auto
                  rounded-md
                  border
                  bg-surface-subtle
                  p-4
                  text-xs
                  leading-6
                "
              >
                {children}
              </pre>
            );
          },

          a({
            children,
            ...props
          }) {
            return (
              <a
                {...props}
                target="_blank"
                rel="noreferrer"
                className="
                  underline
                  underline-offset-4
                "
              >
                {children}
              </a>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
