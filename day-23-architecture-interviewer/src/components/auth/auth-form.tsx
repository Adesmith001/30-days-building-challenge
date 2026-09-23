"use client";

import {
  useState,
} from "react";

import {
  GitBranch,
  Mail,
} from "lucide-react";

import {
  Button,
} from "@/components/ui/button";

import {
  createClient,
} from "@/lib/supabase/client";

import {
  publicEnv,
} from "@/lib/env";

interface AuthFormProps {
  next?: string;
}

export function AuthForm({
  next = "/chat",
}: AuthFormProps) {
  const supabase = createClient();

  const [email, setEmail] =
    useState("");

  const [status, setStatus] =
    useState<string | null>(null);

  const [loading, setLoading] =
    useState(false);

  function callbackUrl() {
    const url = new URL(
      "/auth/callback",
      publicEnv.NEXT_PUBLIC_APP_URL,
    );

    url.searchParams.set(
      "next",
      next,
    );

    return url.toString();
  }

  async function signInOAuth(
    provider: "google" | "github",
  ) {
    setLoading(true);
    setStatus(null);

    const { error } =
      await supabase.auth.signInWithOAuth({
        provider,

        options: {
          redirectTo:
            callbackUrl(),
        },
      });

    if (error) {
      setStatus(error.message);
      setLoading(false);
    }
  }

  async function signInEmail() {
    if (!email.trim()) {
      return;
    }

    setLoading(true);
    setStatus(null);

    const { error } =
      await supabase.auth.signInWithOtp({
        email: email.trim(),

        options: {
          emailRedirectTo:
            callbackUrl(),
        },
      });

    if (error) {
      setStatus(error.message);
    } else {
      setStatus(
        "CHECK YOUR EMAIL FOR THE SIGN-IN LINK.",
      );
    }

    setLoading(false);
  }

  return (
    <div
      className="
        w-full max-w-sm
      "
    >
      <Button
        className="w-full"
        onClick={() =>
          signInOAuth("github")
        }
        disabled={loading}
      >
        <GitBranch size={16} />
        CONTINUE WITH GITHUB
      </Button>

      <Button
        className="mt-2 w-full"
        onClick={() =>
          signInOAuth("google")
        }
        disabled={loading}
      >
        <span
          className="
            text-sm
            font-semibold
          "
        >
          G
        </span>

        CONTINUE WITH GOOGLE
      </Button>

      <div
        className="
          my-6 flex
          items-center gap-3
        "
      >
        <span
          className="
            h-px flex-1
            bg-border
          "
        />

        <span
          className="
            text-[10px]
            tracking-widest
            text-muted
          "
        >
          OR
        </span>

        <span
          className="
            h-px flex-1
            bg-border
          "
        />
      </div>

      <label
        htmlFor="email"
        className="
          mb-2 block
          text-[11px]
          font-medium
          tracking-wide
          text-muted
        "
      >
        EMAIL
      </label>

      <input
        id="email"
        type="email"
        value={email}
        placeholder="you@example.com"
        onChange={(event) =>
          setEmail(
            event.target.value,
          )
        }
        onKeyDown={(event) => {
          if (
            event.key === "Enter"
          ) {
            void signInEmail();
          }
        }}
        className="
          h-11 w-full
          rounded-md border
          bg-surface
          px-3 text-sm
          outline-none
          placeholder:text-muted
          focus:border-border-strong
        "
      />

      <Button
        className="mt-2 w-full"
        onClick={signInEmail}
        disabled={
          loading ||
          !email.trim()
        }
      >
        <Mail size={15} />
        CONTINUE WITH EMAIL
      </Button>

      {status && (
        <p
          className="
            mt-4 text-center
            text-xs
            leading-5
            text-muted
          "
        >
          {status}
        </p>
      )}
    </div>
  );
}
