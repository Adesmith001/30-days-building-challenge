"use client";

import Link from "next/link";
import {
  usePathname,
} from "next/navigation";

import {
  differenceInCalendarDays,
  isToday,
  isYesterday,
} from "date-fns";

import type {
  Conversation,
} from "@/types/chat";

import { cn } from "@/lib/utils";

interface Props {
  conversations:
    Conversation[];
}

function groupName(
  value: string,
) {
  const date =
    new Date(value);

  if (isToday(date)) {
    return "TODAY";
  }

  if (isYesterday(date)) {
    return "YESTERDAY";
  }

  if (
    differenceInCalendarDays(
      new Date(),
      date,
    ) <= 7
  ) {
    return "PREVIOUS 7 DAYS";
  }

  return "OLDER";
}

export function ConversationHistory({
  conversations,
}: Props) {
  const pathname =
    usePathname();

  const groups =
    new Map<
      string,
      Conversation[]
    >();

  for (
    const conversation
    of conversations
  ) {
    const name =
      groupName(
        conversation.updated_at,
      );

    const current =
      groups.get(name) ?? [];

    current.push(
      conversation,
    );

    groups.set(
      name,
      current,
    );
  }

  return (
    <div
      className="
        space-y-6
      "
    >
      {[
        "TODAY",
        "YESTERDAY",
        "PREVIOUS 7 DAYS",
        "OLDER",
      ].map((name) => {
        const items =
          groups.get(name);

        if (
          !items?.length
        ) {
          return null;
        }

        return (
          <section
            key={name}
          >
            <p
              className="
                mb-2 px-2
                text-[9px]
                font-medium
                tracking-[0.12em]
                text-muted
              "
            >
              {name}
            </p>

            <div
              className="
                space-y-0.5
              "
            >
              {items.map(
                (item) => {
                  const selected =
                    pathname ===
                    `/chat/${item.id}`;

                  return (
                    <Link
                      key={
                        item.id
                      }
                      href={
                        `/chat/${item.id}`
                      }
                      className={cn(
                        "block truncate",
                        "rounded-md",
                        "px-2 py-2",
                        "text-[13px]",
                        "transition-colors",

                        selected
                          ? "bg-surface-hover text-foreground"
                          : "text-muted-foreground hover:bg-surface-hover hover:text-foreground",
                      )}
                    >
                      {item.title}
                    </Link>
                  );
                },
              )}
            </div>
          </section>
        );
      })}
    </div>
  );
}
