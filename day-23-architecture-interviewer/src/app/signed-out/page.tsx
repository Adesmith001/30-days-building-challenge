import Link from "next/link";

import {
  ArrowRight,
} from "lucide-react";

export default function SignedOutPage() {
  return (
    <main
      className="
        grid min-h-dvh
        place-items-center
        px-6
      "
    >
      <section
        className="
          text-center
        "
      >
        <p
          className="
            text-[10px]
            font-medium
            tracking-[0.12em]
            text-muted
          "
        >
          ARCHITECTURE INTERVIEWER
        </p>

        <h1
          className="
            mt-8
            text-4xl
            font-medium
            tracking-[-0.04em]
          "
        >
          SIGNED OUT.
        </h1>

        <Link
          href="/auth"
          className="
            mt-8
            inline-flex
            items-center
            gap-2
            text-xs
            font-medium
          "
        >
          SIGN IN AGAIN

          <ArrowRight
            size={14}
          />
        </Link>

        <div>
          <Link
            href="/"
            className="
              mt-5
              inline-block
              text-xs
              text-muted
            "
          >
            BACK HOME
          </Link>
        </div>
      </section>
    </main>
  );
}
