"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  Search,
  X,
} from "lucide-react";

import type {
  Conversation,
} from "@/types/chat";

import {
  ConversationHistory,
} from "@/components/sidebar/conversation-history";

interface Props {
  initial:
    Conversation[];
}

export function HistorySearch({
  initial,
}: Props) {
  const [
    query,
    setQuery,
  ] = useState("");

  const [
    results,
    setResults,
  ] = useState<
    Conversation[]
  >(initial);

  const [
    searching,
    setSearching,
  ] = useState(false);

  useEffect(() => {
    const clean =
      query.trim();

    if (!clean) {
      return;
    }

    const timer =
      setTimeout(
        async () => {
          setSearching(
            true,
          );

          try {
            const response =
              await fetch(
                `/api/conversations/search?q=${encodeURIComponent(
                  clean,
                )}`,
              );

            const data =
              await response.json();

            setResults(
              data.conversations ??
                [],
            );
          } finally {
            setSearching(
              false,
            );
          }
        },
        250,
      );

    return () =>
      clearTimeout(
        timer,
      );
  }, [
    query,
  ]);

  const visibleResults =
    query.trim() ? results : initial;

  const isSearching =
    query.trim() && searching;

  return (
    <>
      <div
        className="
          relative mb-5
        "
      >
        <Search
          size={13}
          className="
            absolute
            left-2.5 top-1/2
            -translate-y-1/2
            text-muted
          "
        />

        <input
          value={query}
          onChange={(event) =>
            setQuery(
              event.target.value,
            )
          }
          placeholder="Search"
          className="
            h-9 w-full
            rounded-md
            border
            bg-transparent
            pl-8 pr-8
            text-xs
            outline-none
            placeholder:text-muted
          "
        />

        {query && (
          <button
            type="button"
            onClick={() =>
              setQuery("")
            }
            className="
              absolute
              right-2 top-1/2
              -translate-y-1/2
              text-muted
            "
          >
            <X size={13} />
          </button>
        )}
      </div>

      {isSearching ? (
        <div
          className="
            space-y-2
          "
        >
          {Array.from({
            length: 4,
          }).map(
            (_, index) => (
              <div
                key={index}
                className="
                  h-8
                  animate-pulse
                  rounded-md
                  bg-surface-subtle
                "
              />
            ),
          )}
        </div>
      ) : visibleResults.length ===
        0 && query ? (
        <div
          className="
            px-2 py-5
          "
        >
          <p
            className="
              text-[11px]
              font-medium
              tracking-wide
            "
          >
            NO CONVERSATIONS FOUND.
          </p>

          <p
            className="
              mt-1 text-xs
              text-muted
            "
          >
            Try another search.
          </p>
        </div>
      ) : (
        <ConversationHistory
          conversations={
            visibleResults
          }
        />
      )}
    </>
  );
}
