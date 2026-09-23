"use client";

import Link from "next/link";

import {
  PanelLeftClose,
  Plus,
} from "lucide-react";

import type {
  Conversation,
} from "@/types/chat";

import {
  AccountMenu,
} from "@/components/account/account-menu";

import {
  HistorySearch,
} from "@/components/sidebar/history-search";

interface Props {
  conversations:
    Conversation[];

  name?: string | null;
  email?: string | null;

  onCloseMobile?:
    () => void;

  collapsed?: boolean;

  onCollapse?:
    () => void;
}

export function AppSidebar({
  conversations,
  name,
  email,
  onCloseMobile,
  collapsed,
  onCollapse,
}: Props) {
  if (collapsed) {
    return (
      <aside
        className="
          flex h-full
          w-[58px]
          flex-col
          border-r
          bg-surface-subtle/40
          p-2
        "
      >
        <button
          type="button"
          onClick={
            onCollapse
          }
          className="
            grid size-9
            place-items-center
            rounded-md
            hover:bg-surface-hover
          "
          aria-label="Expand sidebar"
        >
          AI
        </button>

        <Link
          href="/chat?new=1"
          className="
            mt-2 grid
            size-9
            place-items-center
            rounded-md
            hover:bg-surface-hover
          "
        >
          <Plus size={16} />
        </Link>

        <div
          className="
            mt-auto
            grid size-9
            place-items-center
            rounded-full
            border
            text-[10px]
          "
        >
          {name?.[0]?.toUpperCase() ||
            email?.[0]?.toUpperCase() ||
            "A"}
        </div>
      </aside>
    );
  }

  return (
    <aside
      className="
        flex h-full
        w-[264px]
        shrink-0
        flex-col
        border-r
        bg-surface-subtle/40
      "
    >
      <div
        className="
          flex
          items-center
          justify-between
          px-4 pt-4
        "
      >
        <Link
          href="/chat?new=1"
          className="
            text-[10px]
            font-semibold
            tracking-[0.09em]
          "
          onClick={
            onCloseMobile
          }
        >
          ARCHITECTURE
          <br />
          INTERVIEWER
        </Link>

        {onCollapse && (
          <button
            type="button"
            onClick={
              onCollapse
            }
            className="
              rounded-md p-1.5
              text-muted
              hover:bg-surface-hover
            "
          >
            <PanelLeftClose
              size={15}
            />
          </button>
        )}
      </div>

      <div
        className="
          px-3 pt-5
        "
      >
        <Link
          href="/chat?new=1"
          onClick={
            onCloseMobile
          }
          className="
            flex h-9
            items-center
            gap-2
            rounded-md
            border
            bg-background
            px-3
            text-xs
            font-medium
            hover:bg-surface
          "
        >
          <Plus size={14} />
          NEW CHAT
        </Link>
      </div>

      <div
        className="
          min-h-0 flex-1
          overflow-y-auto
          px-3 pb-5
          pt-4
        "
      >
        <HistorySearch
          initial={
            conversations
          }
        />
      </div>

      <div
        className="
          border-t p-3
        "
      >
        <AccountMenu
          name={name}
          email={email}
        />
      </div>
    </aside>
  );
}
