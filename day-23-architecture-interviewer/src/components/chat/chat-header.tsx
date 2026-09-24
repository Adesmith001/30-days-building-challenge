"use client";

import {
  Menu,
} from "lucide-react";

import {
  useAppShell,
} from "@/components/chat/app-shell";

import {
  ConversationMenu,
} from "@/components/conversation/conversation-menu";

interface Props {
  title: string;
  stage?: string;
  hasConversation:
    boolean;

  onRename: () => void;
  onReview: () => void;
  onDiagram: () => void;
  onExport: () => void;
  onDelete: () => void;

  onAssumptions:
    () => void;

  onDecisions:
    () => void;

  onRisks:
    () => void;

  onContradictions:
    () => void;
}

export function ChatHeader({
  title,
  stage,
  hasConversation,
  ...actions
}: Props) {
  const {
    openMobile,
  } =
    useAppShell();

  return (
    <header
      className="
        flex h-14
        items-center
        border-b
        px-3 md:px-5
      "
    >
      <button
        type="button"
        onClick={
          openMobile
        }
        className="
          mr-2
          grid size-8
          place-items-center
          rounded-md
          hover:bg-surface-hover
          md:hidden
        "
      >
        <Menu size={17} />
      </button>

      <div
        className="
          min-w-0 flex-1
        "
      >
        <p
          className="
            truncate
            text-xs
            font-medium
          "
        >
          {title}
        </p>

        {stage && (
          <p
            className="
              mt-0.5
              truncate
              text-[9px]
              tracking-[0.08em]
              text-muted
            "
          >
            {stage}
          </p>
        )}
      </div>

      <ConversationMenu
        disabled={
          !hasConversation
        }
        {...actions}
      />
    </header>
  );
}
