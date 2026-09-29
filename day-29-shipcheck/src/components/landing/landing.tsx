"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Braces,
  LoaderCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";
import { makeDemoSession } from "@/lib/demo/demo-session";
import { parseUnifiedDiff } from "@/lib/analysis/diff";
import { analyzeRelease } from "@/lib/analysis/analyze";
import { useReleaseStore } from "@/stores/release-store";
import type { ReleaseSession } from "@/types/release";

export function Landing() {
  const router = useRouter();
  const setSession = useReleaseStore(
    (state) => state.setSession,
  );

  const sessions = useReleaseStore(
    (state) => state.sessions,
  );

  const [mode, setMode] =
    useState<"github" | "diff">("github");

  const [url, setUrl] = useState("");
  const [diff, setDiff] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function openSession(session: ReleaseSession) {
    setSession(session);
    router.push("/release");
  }

  async function analyzeGithub() {
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/github", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error);
      }

      openSession(data);
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "Could not analyze this release.",
      );
    } finally {
      setLoading(false);
    }
  }

  function analyzeDiff() {
    setError("");

    const files = parseUnifiedDiff(diff);

    if (!files.length) {
      setError(
        "Couldn't read this diff. Paste a unified Git diff or patch.",
      );

      return;
    }

    openSession(
      analyzeRelease({
        id: crypto.randomUUID(),
        title: "Pasted diff",
        repository: "local/pasted-diff",
        source: {
          kind: "pasted-diff",
        },
        files,
      }),
    );
  }

  return (
    <main className="min-h-screen">
      <header className="mx-auto flex h-16 max-w-[1440px] items-center justify-between px-5 md:px-8">
        <span className="text-xs font-semibold tracking-[0.14em] text-neutral-500">
          29 / 30
        </span>

        <Logo />

        <div className="flex items-center gap-5 text-xs text-neutral-500">
          <a href="#how">ABOUT</a>
          <a
            href="https://github.com/"
            target="_blank"
            rel="noreferrer"
          >
            SOURCE ↗
          </a>
        </div>
      </header>

      <section className="mx-auto grid max-w-[1440px] border-x border-t border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950 md:min-h-[calc(100vh-64px)] md:grid-cols-[1.05fr_.95fr]">
        <div className="flex flex-col justify-between border-b border-neutral-200 p-6 dark:border-neutral-800 md:border-r md:border-b-0 md:p-12 lg:p-16">
          <div>
            <div className="mb-10 flex items-center gap-3 font-mono text-[11px] tracking-[0.12em] text-neutral-500">
              <span className="size-2 bg-emerald-500" />
              RELEASE PREFLIGHT
            </div>

            <h1 className="max-w-[700px] text-[clamp(3rem,8vw,7.5rem)] leading-[0.86] font-semibold tracking-[-0.075em]">
              ABOUT TO
              <br />
              SHIP?
            </h1>

            <p className="mt-7 max-w-md text-base leading-7 text-neutral-500 md:text-lg">
              Give ShipCheck a pull request or diff.
              It turns what actually changed into an
              evidence-based release preflight.
            </p>
          </div>

          <div className="mt-16 flex flex-wrap gap-x-5 gap-y-2 font-mono text-[10px] tracking-[0.12em] text-neutral-400">
            <span>DIFF-AWARE</span>
            <span>·</span>
            <span>EVIDENCE-BASED</span>
            <span>·</span>
            <span>NO FAKE SCORES</span>
          </div>
        </div>

        <div className="flex items-center p-6 md:p-10 lg:p-16">
          <div className="w-full">
            <p className="mb-3 text-xs font-semibold tracking-[0.12em] text-neutral-500">
              CHECK IT FIRST.
            </p>

            <h2 className="text-3xl font-semibold tracking-[-0.05em] md:text-5xl">
              Prove the release
              <br />
              process has evidence.
            </h2>

            <div className="mt-9 flex gap-1 border-b border-neutral-200 dark:border-neutral-800">
              <button
                onClick={() => setMode("github")}
                className={`flex items-center gap-2 border-b-2 px-3 py-3 text-xs font-semibold ${
                  mode === "github"
                    ? "border-neutral-950 text-neutral-950 dark:border-white dark:text-white"
                    : "border-transparent text-neutral-400"
                }`}
              >
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  className="size-3.5 fill-current"
                >
                  <path d="M12 .5a12 12 0 0 0-3.79 23.39c.6.11.82-.26.82-.58v-2.05c-3.34.73-4.04-1.42-4.04-1.42-.55-1.4-1.34-1.77-1.34-1.77-1.09-.75.08-.74.08-.74 1.2.08 1.84 1.23 1.84 1.23 1.07 1.83 2.8 1.3 3.49.99.11-.77.42-1.3.76-1.6-2.67-.3-5.47-1.34-5.47-5.93 0-1.31.47-2.38 1.23-3.22-.12-.3-.53-1.52.12-3.17 0 0 1-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.3-1.55 3.3-1.23 3.3-1.23.65 1.65.24 2.87.12 3.17.76.84 1.23 1.91 1.23 3.22 0 4.6-2.8 5.62-5.48 5.92.43.37.81 1.1.81 2.22v3.29c0 .32.22.7.83.58A12 12 0 0 0 12 .5Z" />
                </svg>
                GITHUB PR
              </button>

              <button
                onClick={() => setMode("diff")}
                className={`flex items-center gap-2 border-b-2 px-3 py-3 text-xs font-semibold ${
                  mode === "diff"
                    ? "border-neutral-950 text-neutral-950 dark:border-white dark:text-white"
                    : "border-transparent text-neutral-400"
                }`}
              >
                <Braces size={14} />
                PASTE DIFF
              </button>
            </div>

            {mode === "github" ? (
              <div className="mt-5">
                <label className="mb-2 block text-[10px] font-semibold tracking-[0.12em] text-neutral-500">
                  GITHUB PULL REQUEST
                </label>

                <input
                  value={url}
                  onChange={(event) =>
                    setUrl(event.target.value)
                  }
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      void analyzeGithub();
                    }
                  }}
                  placeholder="github.com/owner/repository/pull/184"
                  className="h-14 w-full border border-neutral-300 bg-transparent px-4 font-mono text-sm outline-none focus:border-blue-500 dark:border-neutral-700"
                />

                <Button
                  size="lg"
                  className="mt-3 w-full"
                  disabled={!url || loading}
                  onClick={() => void analyzeGithub()}
                >
                  {loading ? (
                    <LoaderCircle
                      size={16}
                      className="animate-spin"
                    />
                  ) : (
                    <ArrowRight size={16} />
                  )}

                  {loading
                    ? "READING CHANGE"
                    : "CHECK RELEASE"}
                </Button>
              </div>
            ) : (
              <div className="mt-5">
                <textarea
                  value={diff}
                  onChange={(event) =>
                    setDiff(event.target.value)
                  }
                  placeholder={`diff --git a/src/api/checkout.ts b/src/api/checkout.ts
--- a/src/api/checkout.ts
+++ b/src/api/checkout.ts
+const secret = process.env.PAYMENT_WEBHOOK_SECRET`}
                  className="h-48 w-full resize-none border border-neutral-300 bg-neutral-950 p-4 font-mono text-xs leading-6 text-neutral-200 outline-none focus:border-blue-500 dark:border-neutral-700"
                />

                <Button
                  size="lg"
                  className="mt-3 w-full"
                  disabled={!diff.trim()}
                  onClick={analyzeDiff}
                >
                  ANALYZE DIFF
                  <ArrowRight size={16} />
                </Button>
              </div>
            )}

            {error && (
              <div className="mt-3 border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300">
                {error}
              </div>
            )}

            <div className="my-6 flex items-center gap-4">
              <div className="h-px flex-1 bg-neutral-200 dark:bg-neutral-800" />
              <span className="text-[10px] font-semibold tracking-[0.12em] text-neutral-400">
                OR
              </span>
              <div className="h-px flex-1 bg-neutral-200 dark:bg-neutral-800" />
            </div>

            <Button
              variant="secondary"
              size="lg"
              className="w-full"
              onClick={() =>
                openSession(makeDemoSession())
              }
            >
              TRY DEMO RELEASE
              <ArrowRight size={16} />
            </Button>

            {sessions.length > 0 && (
              <button
                onClick={() => router.push("/history")}
                className="mt-5 w-full text-center text-xs font-medium text-neutral-500 hover:text-neutral-950 dark:hover:text-white"
              >
                VIEW {sessions.length} RECENT RELEASE
                {sessions.length === 1 ? "" : "S"} →
              </button>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}