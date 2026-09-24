"use client";

import {
  useState,
} from "react";

import Link from "next/link";
import {
  useRouter,
} from "next/navigation";

import {
  LogOut,
  Settings,
} from "lucide-react";

import {
  createClient,
} from "@/lib/supabase/client";

import {
  getInitials,
} from "@/lib/utils";

interface Props {
  name?: string | null;
  email?: string | null;
  avatarUrl?: string | null;
}

export function AccountMenu({
  name,
  email,
  avatarUrl,
}: Props) {
  const [
    open,
    setOpen,
  ] = useState(false);

  const router =
    useRouter();

  async function signOut() {
    const supabase =
      createClient();

    await supabase.auth.signOut();

    router.push(
      "/signed-out",
    );

    router.refresh();
  }

  return (
    <div
      className="
        relative
      "
    >
      {open && (
        <div
          className="
            absolute
            bottom-12
            left-0
            w-full
            rounded-lg
            border
            bg-background
            p-2
            shadow-[0_8px_30px_rgba(0,0,0,0.08)]
          "
        >
          <div
            className="
              border-b
              px-2 pb-3
              pt-1
            "
          >
            <p
              className="
                truncate
                text-xs
                font-medium
              "
            >
              {name ||
                "Account"}
            </p>

            <p
              className="
                mt-1 truncate
                text-[11px]
                text-muted
              "
            >
              {email}
            </p>
          </div>

          <Link
            href="/settings"
            className="
              mt-2 flex
              items-center
              gap-2
              rounded-md
              px-2 py-2
              text-xs
              hover:bg-surface-hover
            "
          >
            <Settings
              size={14}
            />

            SETTINGS
          </Link>

          <button
            type="button"
            onClick={signOut}
            className="
              flex w-full
              items-center
              gap-2
              rounded-md
              px-2 py-2
              text-xs
              hover:bg-surface-hover
            "
          >
            <LogOut
              size={14}
            />

            SIGN OUT
          </button>
        </div>
      )}

      <button
        type="button"
        onClick={() =>
          setOpen(
            (value) =>
              !value,
          )
        }
        className="
          flex w-full
          items-center
          gap-3
          rounded-md
          p-2
          text-left
          hover:bg-surface-hover
        "
      >
        <span
          className="
            grid size-7
            shrink-0
            place-items-center
            rounded-full
            border
            bg-surface
            text-[10px]
            font-medium
          "
        >
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={name || "Account avatar"}
              className="size-full rounded-full object-cover"
            />
          ) : (
            getInitials(
              name,
              email,
            )
          )}
        </span>

        <span
          className="
            min-w-0 flex-1
          "
        >
          <span
            className="
              block truncate
              text-xs
              font-medium
            "
          >
            {name ||
              email ||
              "Account"}
          </span>

          {name && email && (
            <span
              className="
                mt-0.5
                block truncate
                text-[10px]
                text-muted
              "
            >
              {email}
            </span>
          )}
        </span>
      </button>
    </div>
  );
}
