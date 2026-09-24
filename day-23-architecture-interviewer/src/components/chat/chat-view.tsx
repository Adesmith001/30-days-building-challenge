"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  useRouter,
} from "next/navigation";

import type {
  ChatMessage,
  Conversation,
} from "@/types/chat";

import type {
  InterviewState,
} from "@/types/interview";

import {
  createInitialInterviewState,
} from "@/lib/interview/state";

import {
  stageLabels,
} from "@/lib/interview/stages";

import {
  useChatStream,
} from "@/hooks/use-chat-stream";

import {
  ChatHeader,
} from "@/components/chat/chat-header";

import {
  ChatComposer,
} from "@/components/chat/chat-composer";

import {
  ChatMessageItem,
} from "@/components/chat/chat-message";

import {
  MarkdownMessage,
} from "@/components/conversation/markdown-message";

import {
  StateSheet,
} from "@/components/conversation/state-sheet";

import {
  Modal,
} from "@/components/ui/modal";

interface Props {
  conversation?:
    Conversation | null;

  initialMessages?:
    ChatMessage[];

  initialState?:
    InterviewState;
}

type SheetMode =
  | "assumptions"
  | "decisions"
  | "risks"
  | "contradictions";

export function ChatView({
  conversation = null,
  initialMessages = [],
  initialState,
}: Props) {
  const router =
    useRouter();

  const [
    currentConversationId,
    setCurrentConversationId,
  ] = useState<
    string | null
  >(
    conversation?.id ??
      null,
  );

  const [
    title,
    setTitle,
  ] = useState(
    conversation?.title ??
      "New Chat",
  );

  const [
    state,
    setState,
  ] = useState(
    initialState ??
      createInitialInterviewState(),
  );

  const [
    messages,
    setMessages,
  ] = useState<
    ChatMessage[]
  >(initialMessages);

  const [
    streamingText,
    setStreamingText,
  ] = useState("");

  const [
    draft,
    setDraft,
  ] = useState("");

  const [
    error,
    setError,
  ] = useState<
    string | null
  >(null);

  const [
    renameOpen,
    setRenameOpen,
  ] = useState(false);

  const [
    deleteOpen,
    setDeleteOpen,
  ] = useState(false);

  const [
    renameValue,
    setRenameValue,
  ] = useState(title);

  const [
    sheet,
    setSheet,
  ] = useState<
    SheetMode | null
  >(null);

  const [
    actionState,
    setActionState,
  ] = useState<
    string | null
  >(null);

  const [
    stoppedText,
    setStoppedText,
  ] = useState("");

  const [
    retryPayload,
    setRetryPayload,
  ] = useState<{
    content: string;
    requestId: string;
  } | null>(null);

  const bottomRef =
    useRef<HTMLDivElement>(
      null,
    );

  const stream =
    useChatStream({
      onDelta(text) {
        setStreamingText(
          (current) =>
            current + text,
        );
      },

      onDone(payload) {
        setStreamingText("");
        setStoppedText("");
        setError(null);
        setRetryPayload(null);

        setCurrentConversationId(
          payload.conversationId,
        );

        setTitle(
          payload.title,
        );

        setState(
          payload.state,
        );

        setMessages(
          (current) => {
            const withoutTemp =
              current.filter(
                (message) =>
                  !message.id.startsWith(
                    "temp:",
                  ),
              );

            const userExists =
              withoutTemp.some(
                (message) =>
                  message.id ===
                  payload.userMessage.id,
              );

            const base =
              userExists
                ? withoutTemp
                : [
                    ...withoutTemp,
                    payload.userMessage,
                  ];

            return [
              ...base.filter(
                (message) =>
                  message.id !==
                  payload.assistantMessage.id,
              ),

              payload.assistantMessage,
            ].sort(
              (a, b) =>
                a.sequence_number -
                b.sequence_number,
            );
          },
        );

        if (
          !conversation
        ) {
          router.replace(
            `/chat/${payload.conversationId}`,
          );
        }

        router.refresh();
      },

      onError(message) {
        setError(
          message,
        );

        if (
          streamingText
        ) {
          setStoppedText(
            streamingText,
          );
        }
      },
    });

  useEffect(() => {
    bottomRef.current
      ?.scrollIntoView({
        behavior:
          stream.isStreaming
            ? "auto"
            : "smooth",

        block: "end",
      });
  }, [
    messages,
    streamingText,
    stream.isStreaming,
    actionState,
  ]);

  async function send() {
    const content =
      draft.trim();

    if (
      !content ||
      stream.isStreaming
    ) {
      return;
    }

    const requestId =
      crypto.randomUUID();

    const tempMessage:
      ChatMessage = {
      id:
        `temp:${requestId}`,

      conversation_id:
        currentConversationId ??
        "pending",

      user_id: "self",

      role: "user",

      content,

      metadata: {},

      sequence_number:
        messages.length + 1,

      client_request_id:
        requestId,

      created_at:
        new Date()
          .toISOString(),
    };

    setMessages(
      (current) => [
        ...current,
        tempMessage,
      ],
    );

    setDraft("");
    setError(null);
    setStreamingText("");
    setStoppedText("");

    setRetryPayload({
      content,
      requestId,
    });

    await stream.send({
      conversationId:
        currentConversationId,

      content,
      requestId,

      mode:
        "message",
    });
  }

  async function retrySend() {
    if (!retryPayload) {
      return;
    }

    setError(null);
    setStreamingText("");

    await stream.send({
      conversationId:
        currentConversationId,

      content:
        retryPayload.content,

      requestId:
        retryPayload.requestId,

      mode:
        "message",
    });
  }

  function stop() {
    if (
      streamingText
    ) {
      setStoppedText(
        streamingText,
      );
    }

    stream.stop();
    setStreamingText("");
  }

  async function regenerate(
    assistant:
      ChatMessage,
  ) {
    const index =
      messages.findIndex(
        (message) =>
          message.id ===
          assistant.id,
      );

    const userMessage =
      [...messages]
        .slice(
          0,
          index,
        )
        .reverse()
        .find(
          (message) =>
            message.role ===
            "user",
        );

    if (
      !userMessage ||
      !currentConversationId
    ) {
      return;
    }

    setMessages(
      messages.filter(
        (message) =>
          message.sequence_number <=
          userMessage.sequence_number,
      ),
    );

    setStreamingText("");
    setError(null);

    await stream.send({
      conversationId:
        currentConversationId,

      requestId:
        crypto.randomUUID(),

      mode:
        "regenerate",

      userMessageId:
        userMessage.id,
    });
  }

  async function editMessage(
    message:
      ChatMessage,
    content: string,
  ) {
    const response =
      await fetch(
        `/api/messages/${message.id}`,
        {
          method:
            "PATCH",

          headers: {
            "Content-Type":
              "application/json",
          },

          body:
            JSON.stringify({
              content,
            }),
        },
      );

    if (!response.ok) {
      setError(
        "Couldn't edit this message.",
      );

      return;
    }

    const data =
      await response.json();

    const edited =
      data.message as ChatMessage;

    setMessages(
      (current) =>
        current
          .filter(
            (item) =>
              item.sequence_number <=
              edited.sequence_number,
          )
          .map(
            (item) =>
              item.id ===
              edited.id
                ? edited
                : item,
          ),
    );

    await stream.send({
      conversationId:
        currentConversationId,

      requestId:
        crypto.randomUUID(),

      mode:
        "regenerate",

      userMessageId:
        edited.id,
    });
  }

  async function rename() {
    if (
      !currentConversationId ||
      !renameValue.trim()
    ) {
      return;
    }

    const response =
      await fetch(
        `/api/conversations/${currentConversationId}`,
        {
          method:
            "PATCH",

          headers: {
            "Content-Type":
              "application/json",
          },

          body:
            JSON.stringify({
              title:
                renameValue.trim(),
            }),
        },
      );

    if (response.ok) {
      setTitle(
        renameValue.trim(),
      );

      setRenameOpen(
        false,
      );

      router.refresh();
    }
  }

  async function removeConversation() {
    if (
      !currentConversationId
    ) {
      return;
    }

    const response =
      await fetch(
        `/api/conversations/${currentConversationId}`,
        {
          method:
            "DELETE",
        },
      );

    if (response.ok) {
      router.push(
        "/chat?new=1",
      );

      router.refresh();
    }
  }

  async function generateReview() {
    if (
      !currentConversationId
    ) {
      return;
    }

    setActionState(
      "BUILDING ARCHITECTURE REVIEW...",
    );

    try {
      const response =
        await fetch(
          `/api/conversations/${currentConversationId}/review`,
          {
            method:
              "POST",
          },
        );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.error,
        );
      }

      setMessages(
        (current) => [
          ...current,
          data.message,
        ],
      );

      router.refresh();
    } catch {
      setError(
        "Couldn't generate the architecture review.",
      );
    } finally {
      setActionState(
        null,
      );
    }
  }

  async function generateDiagram() {
    if (
      !currentConversationId
    ) {
      return;
    }

    setActionState(
      "THINKING...",
    );

    try {
      const response =
        await fetch(
          `/api/conversations/${currentConversationId}/diagram`,
          {
            method:
              "POST",
          },
        );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.error,
        );
      }

      setMessages(
        (current) => [
          ...current,
          data.message,
        ],
      );

      router.refresh();
    } catch {
      setError(
        "Couldn't generate the diagram.",
      );
    } finally {
      setActionState(
        null,
      );
    }
  }

  async function exportMarkdown() {
    if (
      !currentConversationId
    ) {
      return;
    }

    const response =
      await fetch(
        `/api/conversations/${currentConversationId}/export`,
      );

    if (!response.ok) {
      return;
    }

    const text =
      await response.text();

    const blob =
      new Blob(
        [text],
        {
          type:
            "text/markdown",
        },
      );

    const url =
      URL.createObjectURL(
        blob,
      );

    const anchor =
      document.createElement(
        "a",
      );

    anchor.href = url;

    anchor.download =
      `${title
        .toLowerCase()
        .replace(
          /[^a-z0-9]+/g,
          "-",
        )}.md`;

    anchor.click();

    URL.revokeObjectURL(
      url,
    );
  }

  const empty =
    messages.length ===
      0 &&
    !streamingText;

  return (
    <div
      className="
        flex h-dvh
        flex-col
        bg-background
      "
    >
      <ChatHeader
        title={title}
        stage={
          currentConversationId
            ? stageLabels[
                state.stage
              ]
            : undefined
        }
        hasConversation={
          Boolean(
            currentConversationId,
          )
        }
        onRename={() => {
          setRenameValue(
            title,
          );

          setRenameOpen(
            true,
          );
        }}
        onReview={
          generateReview
        }
        onDiagram={
          generateDiagram
        }
        onExport={
          exportMarkdown
        }
        onDelete={() =>
          setDeleteOpen(
            true,
          )
        }
        onAssumptions={() =>
          setSheet(
            "assumptions",
          )
        }
        onDecisions={() =>
          setSheet(
            "decisions",
          )
        }
        onRisks={() =>
          setSheet(
            "risks",
          )
        }
        onContradictions={() =>
          setSheet(
            "contradictions",
          )
        }
      />

      <div
        className="
          min-h-0 flex-1
          overflow-y-auto
        "
      >
        {empty ? (
          <div
            className="
              mx-auto flex
              h-full
              max-w-[780px]
              flex-col
              items-center
              justify-center
              px-6 pb-24
              text-center
            "
          >
            <h1
              className="
                text-4xl
                font-medium
                leading-[0.95]
                tracking-[-0.04em]
                md:text-5xl
              "
            >
              WHAT ARE YOU
              <br />
              BUILDING?
            </h1>

            <p
              className="
                mt-5 max-w-md
                text-sm
                leading-6
                text-muted
              "
            >
              Describe the system,
              constraints and decisions
              you&apos;ve made so far.
            </p>

            <div
              className="
                mt-8 flex
                flex-wrap
                justify-center
                gap-x-5 gap-y-3
              "
            >
              {[
                "Design a system",
                "Review my architecture",
                "Prepare me for an interview",
              ].map(
                (item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() =>
                      setDraft(
                        item,
                      )
                    }
                    className="
                      text-[10px]
                      font-medium
                      tracking-wide
                      text-muted
                      hover:text-foreground
                    "
                  >
                    {item.toUpperCase()}
                  </button>
                ),
              )}
            </div>
          </div>
        ) : (
          <div
            className="
              mx-auto
              w-full
              max-w-[780px]
              space-y-9
              px-5 py-8
              md:px-8 md:py-10
            "
          >
            {messages.map(
              (message) => (
                <ChatMessageItem
                  key={
                    message.id
                  }
                  message={
                    message
                  }
                  onRegenerate={
                    message.role ===
                    "assistant"
                      ? regenerate
                      : undefined
                  }
                  onEdit={
                    editMessage
                  }
                />
              ),
            )}

            {streamingText && (
              <div>
                <MarkdownMessage
                  content={
                    streamingText
                  }
                />

                <span
                  className="
                    streaming-cursor
                  "
                />
              </div>
            )}

            {stoppedText &&
              !streamingText && (
              <div>
                <MarkdownMessage
                  content={
                    stoppedText
                  }
                />

                <div
                  className="
                    mt-3 flex
                    gap-4
                    text-[10px]
                    font-medium
                    tracking-wide
                    text-muted
                  "
                >
                  <button
                    type="button"
                    onClick={
                      retrySend
                    }
                  >
                    CONTINUE
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      navigator.clipboard.writeText(
                        stoppedText,
                      )
                    }
                  >
                    COPY
                  </button>
                </div>
              </div>
            )}

            {actionState && (
              <p
                className="
                  text-xs
                  tracking-wide
                  text-muted
                "
              >
                {actionState}
              </p>
            )}

            {error && (
              <div
                className="
                  border-l-2
                  pl-4
                "
              >
                <p
                  className="
                    text-sm
                  "
                >
                  {error}
                </p>

                {retryPayload && (
                  <button
                    type="button"
                    onClick={
                      retrySend
                    }
                    className="
                      mt-2 text-xs
                      font-medium
                    "
                  >
                    TRY AGAIN
                  </button>
                )}
              </div>
            )}

            <div
              ref={
                bottomRef
              }
            />
          </div>
        )}
      </div>

      <ChatComposer
        value={draft}
        onChange={
          setDraft
        }
        onSend={send}
        onStop={stop}
        streaming={
          stream.isStreaming
        }
        error={
          draft.length >=
          20_000
            ? "Message limit reached."
            : null
        }
      />

      <StateSheet
        open={
          Boolean(sheet)
        }
        mode={
          sheet ||
          "assumptions"
        }
        state={state}
        onClose={() =>
          setSheet(null)
        }
      />

      <Modal
        open={
          renameOpen
        }
        title="RENAME CONVERSATION"
        onClose={() =>
          setRenameOpen(
            false,
          )
        }
      >
        <input
          value={
            renameValue
          }
          onChange={(event) =>
            setRenameValue(
              event.target.value,
            )
          }
          className="
            h-10 w-full
            rounded-md border
            bg-surface px-3
            text-sm
            outline-none
          "
        />

        <div
          className="
            mt-5 flex
            justify-end
            gap-4
          "
        >
          <button
            type="button"
            onClick={() =>
              setRenameOpen(
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
              rename
            }
            className="
              text-xs
              font-medium
            "
          >
            SAVE
          </button>
        </div>
      </Modal>

      <Modal
        open={
          deleteOpen
        }
        title="DELETE THIS CONVERSATION?"
        onClose={() =>
          setDeleteOpen(
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
          This permanently removes its
          messages.
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
              setDeleteOpen(
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
              removeConversation
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
    </div>
  );
}
