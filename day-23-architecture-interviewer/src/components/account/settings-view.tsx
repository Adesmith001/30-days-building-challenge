"use client";

import {
  useState,
} from "react";

import {
  useRouter,
} from "next/navigation";

import {
  useTheme,
} from "next-themes";

import {
  Modal,
} from "@/components/ui/modal";

interface Props {
  name?: string | null;
  email?: string | null;
}

export function SettingsView({
  name,
  email,
}: Props) {
  const router =
    useRouter();

  const {
    theme,
    setTheme,
  } =
    useTheme();

  const [
    displayName,
    setDisplayName,
  ] =
    useState(
      name ?? "",
    );

  const [
    deleteAllOpen,
    setDeleteAllOpen,
  ] =
    useState(false);

  const [
    deleteAccountOpen,
    setDeleteAccountOpen,
  ] =
    useState(false);

  const [
    confirmation,
    setConfirmation,
  ] =
    useState("");

  async function saveProfile() {
    await fetch(
      "/api/account/profile",
      {
        method:
          "PATCH",

        headers: {
          "Content-Type":
            "application/json",
        },

        body:
          JSON.stringify({
            displayName,
          }),
      },
    );

    router.refresh();
  }

  async function deleteAll() {
    const response =
      await fetch(
        "/api/account/conversations",
        {
          method:
            "DELETE",
        },
      );

    if (response.ok) {
      setDeleteAllOpen(
        false,
      );

      router.push(
        "/chat?new=1",
      );

      router.refresh();
    }
  }

  async function deleteAccount() {
    if (
      confirmation !==
      "DELETE"
    ) {
      return;
    }

    const response =
      await fetch(
        "/api/account",
        {
          method:
            "DELETE",
        },
      );

    if (response.ok) {
      router.push(
        "/signed-out",
      );

      router.refresh();
    }
  }

  return (
    <>
      <main
        className="
          mx-auto
          w-full
          max-w-2xl
          px-6 py-10
          md:py-16
        "
      >
        <h1
          className="
            text-2xl
            font-medium
            tracking-[-0.025em]
          "
        >
          SETTINGS
        </h1>

        <section
          className="
            mt-10
            border-t pt-6
          "
        >
          <h2
            className="
              text-[10px]
              font-semibold
              tracking-[0.12em]
              text-muted
            "
          >
            ACCOUNT
          </h2>

          <label
            className="
              mt-5 block
              text-xs
              text-muted
            "
          >
            DISPLAY NAME
          </label>

          <input
            value={
              displayName
            }
            onChange={(event) =>
              setDisplayName(
                event.target.value,
              )
            }
            className="
              mt-2 h-10
              w-full
              rounded-md border
              bg-surface
              px-3 text-sm
              outline-none
            "
          />

          <label
            className="
              mt-5 block
              text-xs
              text-muted
            "
          >
            EMAIL
          </label>

          <div
            className="
              mt-2 text-sm
            "
          >
            {email}
          </div>

          <button
            type="button"
            onClick={
              saveProfile
            }
            className="
              mt-5
              rounded-md
              bg-foreground
              px-4 py-2
              text-xs
              font-medium
              text-background
            "
          >
            SAVE PROFILE
          </button>
        </section>

        <section
          className="
            mt-10
            border-t pt-6
          "
        >
          <h2
            className="
              text-[10px]
              font-semibold
              tracking-[0.12em]
              text-muted
            "
          >
            APPEARANCE
          </h2>

          <div
            className="
              mt-5 flex
              flex-wrap gap-2
            "
          >
            {[
              "system",
              "light",
              "dark",
            ].map(
              (value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() =>
                    setTheme(
                      value,
                    )
                  }
                  className={[
                    "rounded-md",
                    "border",
                    "px-4 py-2",
                    "text-xs",
                    "font-medium",

                    theme ===
                    value
                      ? "bg-foreground text-background"
                      : "bg-surface",
                  ].join(" ")}
                >
                  {value.toUpperCase()}
                </button>
              ),
            )}
          </div>
        </section>

        <section
          className="
            mt-10
            border-t pt-6
          "
        >
          <h2
            className="
              text-[10px]
              font-semibold
              tracking-[0.12em]
              text-muted
            "
          >
            DATA
          </h2>

          <div
            className="
              mt-5 space-y-3
            "
          >
            <button
              type="button"
              onClick={() =>
                setDeleteAllOpen(
                  true,
                )
              }
              className="
                block text-sm
                text-destructive
              "
            >
              DELETE ALL CONVERSATIONS
            </button>

            <button
              type="button"
              onClick={() =>
                setDeleteAccountOpen(
                  true,
                )
              }
              className="
                block text-sm
                text-destructive
              "
            >
              DELETE ACCOUNT
            </button>
          </div>
        </section>
      </main>

      <Modal
        open={
          deleteAllOpen
        }
        title="DELETE ALL CONVERSATIONS?"
        onClose={() =>
          setDeleteAllOpen(
            false,
          )
        }
      >
        <p
          className="
            text-sm
            leading-6
            text-muted
          "
        >
          This permanently removes all
          architecture interviews.
        </p>

        <div
          className="
            mt-6 flex
            justify-end
            gap-4
          "
        >
          <button
            type="button"
            onClick={() =>
              setDeleteAllOpen(
                false,
              )
            }
            className="
              text-xs
              text-muted
            "
          >
            CANCEL
          </button>

          <button
            type="button"
            onClick={
              deleteAll
            }
            className="
              text-xs
              font-medium
              text-destructive
            "
          >
            DELETE
          </button>
        </div>
      </Modal>

      <Modal
        open={
          deleteAccountOpen
        }
        title="DELETE ACCOUNT?"
        onClose={() => {
          setDeleteAccountOpen(
            false,
          );

          setConfirmation(
            "",
          );
        }}
      >
        <p
          className="
            text-sm
            leading-6
            text-muted
          "
        >
          This removes your conversations
          and Architecture Interviewer
          account.
        </p>

        <label
          className="
            mt-5 block
            text-xs
            text-muted
          "
        >
          TYPE DELETE TO CONFIRM
        </label>

        <input
          value={
            confirmation
          }
          onChange={(event) =>
            setConfirmation(
              event.target.value,
            )
          }
          className="
            mt-2 h-10
            w-full
            rounded-md border
            bg-surface px-3
            text-sm
            outline-none
          "
        />

        <div
          className="
            mt-6 flex
            justify-end
            gap-4
          "
        >
          <button
            type="button"
            onClick={() =>
              setDeleteAccountOpen(
                false,
              )
            }
            className="
              text-xs
              text-muted
            "
          >
            CANCEL
          </button>

          <button
            type="button"
            disabled={
              confirmation !==
              "DELETE"
            }
            onClick={
              deleteAccount
            }
            className="
              text-xs
              font-medium
              text-destructive
              disabled:opacity-30
            "
          >
            DELETE ACCOUNT
          </button>
        </div>
      </Modal>
    </>
  );
}
