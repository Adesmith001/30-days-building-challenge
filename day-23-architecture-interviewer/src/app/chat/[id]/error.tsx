"use client";

import Link from "next/link";

export default function ConversationError({
  reset,
}: {
  reset: () => void;
}) {
  return (
    <main
      className="
        grid h-dvh
        place-items-center
        px-6
      "
    >
      <section
        className="
          text-center
        "
      >
        <h1
          className="
            text-3xl
            font-medium
            leading-[1]
            tracking-[-0.04em]
          "
        >
          COULDN&apos;T LOAD
          <br />
          THIS CONVERSATION.
        </h1>

        <div
          className="
            mt-7 flex
            justify-center
            gap-5
            text-xs
            font-medium
          "
        >
          <button
            type="button"
            onClick={reset}
          >
            TRY AGAIN
          </button>

          <Link
            href="/chat?new=1"
          >
            NEW CHAT
          </Link>
        </div>
      </section>
    </main>
  );
}
