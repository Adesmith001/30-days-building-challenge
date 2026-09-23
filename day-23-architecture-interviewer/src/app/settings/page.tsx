import {
  redirect,
} from "next/navigation";

import Link from "next/link";

import {
  ArrowLeft,
} from "lucide-react";

import {
  SettingsView,
} from "@/components/account/settings-view";

import {
  createClient,
} from "@/lib/supabase/server";

import {
  getProfile,
} from "@/lib/supabase/queries";

export default async function SettingsPage() {
  const supabase =
    await createClient();

  const {
    data: { user },
  } =
    await supabase.auth.getUser();

  if (!user) {
    redirect(
      "/auth?next=/settings",
    );
  }

  const profile =
    await getProfile(
      user.id,
    );

  return (
    <div
      className="
        min-h-dvh
      "
    >
      <header
        className="
          flex h-14
          items-center
          border-b
          px-4
        "
      >
        <Link
          href="/chat"
          className="
            inline-flex
            items-center
            gap-2
            text-xs
          "
        >
          <ArrowLeft
            size={14}
          />

          CHAT
        </Link>
      </header>

      <SettingsView
        name={
          profile?.display_name
        }
        email={
          user.email
        }
      />
    </div>
  );
}
