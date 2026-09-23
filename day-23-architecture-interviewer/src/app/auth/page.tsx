import Link from "next/link";
import { redirect } from "next/navigation";

import {
  AuthForm,
} from "@/components/auth/auth-form";

import {
  createClient,
} from "@/lib/supabase/server";

interface Props {
  searchParams:
    Promise<{
      next?: string;
    }>;
}

export default async function AuthPage({
  searchParams,
}: Props) {
  const supabase =
    await createClient();

  const {
    data: { user },
  } =
    await supabase.auth.getUser();

  const query =
    await searchParams;

  if (user) {
    redirect(
      query.next || "/chat",
    );
  }

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
          flex w-full
          max-w-md
          flex-col
          items-center
          text-center
        "
      >
        <Link
          href="/"
          className="
            text-[11px]
            font-medium
            tracking-[0.13em]
          "
        >
          ARCHITECTURE INTERVIEWER
        </Link>

        <h1
          className="
            mt-10 text-4xl
            font-medium
            leading-[0.95]
            tracking-[-0.045em]
          "
        >
          SIGN IN TO
          <br />
          CONTINUE.
        </h1>

        <p
          className="
            mb-8 mt-5
            max-w-xs
            text-sm
            leading-6
            text-muted
          "
        >
          Your architecture conversations
          are saved to your account.
        </p>

        <AuthForm
          next={
            query.next ||
            "/chat"
          }
        />

        <p
          className="
            mt-9 text-[10px]
            tracking-[0.1em]
            text-muted
          "
        >
          PRIVACY Â· TERMS
        </p>
      </section>
    </main>
  );
}
