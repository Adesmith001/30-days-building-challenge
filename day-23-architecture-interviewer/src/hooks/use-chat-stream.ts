"use client";

import {
  useRef,
  useState,
} from "react";

import type {
  ChatMessage,
} from "@/types/chat";

import type {
  InterviewState,
} from "@/types/interview";

interface SendInput {
  conversationId:
    string | null;

  content?: string;

  requestId: string;

  mode?:
    | "message"
    | "regenerate";

  userMessageId?:
    string;
}

interface DonePayload {
  conversationId: string;
  title: string;
  userMessage: ChatMessage;
  assistantMessage: ChatMessage;
  state: InterviewState;
}

interface Options {
  onDelta?:
    (text: string) => void;

  onDone?:
    (payload: DonePayload) => void;

  onError?:
    (message: string) => void;
}

export function useChatStream({
  onDelta,
  onDone,
  onError,
}: Options) {
  const [
    isStreaming,
    setIsStreaming,
  ] = useState(false);

  const controllerRef =
    useRef<AbortController | null>(
      null,
    );

  async function send(
    input: SendInput,
  ) {
    if (isStreaming) {
      return;
    }

    const controller =
      new AbortController();

    controllerRef.current =
      controller;

    setIsStreaming(true);

    try {
      const response =
        await fetch(
          "/api/chat",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify(
                input,
              ),

            signal:
              controller.signal,
          },
        );

      if (!response.ok) {
        const data =
          await response
            .json()
            .catch(
              () => null,
            );

        throw new Error(
          data?.error ||
          "Message wasn't sent.",
        );
      }

      if (!response.body) {
        throw new Error(
          "No response stream.",
        );
      }

      const reader =
        response.body.getReader();

      const decoder =
        new TextDecoder();

      let buffer = "";

      while (true) {
        const {
          done,
          value,
        } =
          await reader.read();

        if (done) {
          break;
        }

        buffer +=
          decoder.decode(
            value,
            {
              stream: true,
            },
          );

        const events =
          buffer.split(
            "\n\n",
          );

        buffer =
          events.pop() ??
          "";

        for (
          const raw
          of events
        ) {
          const lines =
            raw.split("\n");

          const event =
            lines
              .find(
                (line) =>
                  line.startsWith(
                    "event:",
                  ),
              )
              ?.slice(6)
              .trim();

          const dataLine =
            lines.find(
              (line) =>
                line.startsWith(
                  "data:",
                ),
            );

          if (
            !event ||
            !dataLine
          ) {
            continue;
          }

          const payload =
            JSON.parse(
              dataLine
                .slice(5)
                .trim(),
            );

          if (
            event ===
            "delta"
          ) {
            onDelta?.(
              payload.text,
            );
          }

          if (
            event ===
            "done"
          ) {
            onDone?.(
              payload,
            );
          }

          if (
            event ===
            "error"
          ) {
            onError?.(
              payload.message,
            );
          }
        }
      }
    } catch (error) {
      if (
        error instanceof
          DOMException &&
        error.name ===
          "AbortError"
      ) {
        return;
      }

      onError?.(
        error instanceof Error
          ? error.message
          : "Message wasn't sent.",
      );
    } finally {
      setIsStreaming(false);

      controllerRef.current =
        null;
    }
  }

  function stop() {
    controllerRef.current
      ?.abort();

    setIsStreaming(false);
  }

  return {
    send,
    stop,
    isStreaming,
  };
}
