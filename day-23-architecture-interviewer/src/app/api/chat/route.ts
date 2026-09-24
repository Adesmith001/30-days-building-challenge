import type {
  ChatMessage,
  Conversation,
} from "@/types/chat";

import type {
  InterviewState,
} from "@/types/interview";

import {
  chatRequestSchema,
} from "@/lib/validation/chat";

import {
  requireUser,
} from "@/lib/supabase/auth";

import {
  createAdminClient,
} from "@/lib/supabase/admin";

import {
  createInitialInterviewState,
} from "@/lib/interview/state";

import {
  buildInterviewContext,
} from "@/lib/interview/context";

import {
  streamInterviewResponse,
} from "@/lib/ai/interviewer";

import {
  extractInterviewState,
} from "@/lib/ai/state-extractor";

import {
  mergeInterviewState,
} from "@/lib/interview/merge-state";

import {
  generateConversationTitle,
} from "@/lib/ai/title";

import {
  summarizeConversationContext,
} from "@/lib/ai/summary";

import {
  checkRateLimit,
} from "@/lib/rate-limit/check";

const encoder =
  new TextEncoder();

function encodeEvent(
  event: string,
  data: unknown,
) {
  return encoder.encode(
    `event: ${event}\ndata: ${JSON.stringify(
      data,
    )}\n\n`,
  );
}

export async function POST(
  request: Request,
) {
  const requestId =
    crypto.randomUUID();

  try {
    const {
      user,
      supabase,
    } =
      await requireUser();

    const allowed =
      await checkRateLimit({
        userId: user.id,
        bucket: "chat",
        limit: 30,
        windowSeconds: 60,
      });

    if (!allowed) {
      return Response.json(
        {
          error:
            "Too many requests. Try again shortly.",
        },
        {
          status: 429,
        },
      );
    }

    const parsed =
      chatRequestSchema.safeParse(
        await request.json(),
      );

    if (!parsed.success) {
      return Response.json(
        {
          error:
            parsed.error.issues[0]
              ?.message,
        },
        {
          status: 400,
        },
      );
    }

    const body =
      parsed.data;

    let conversation:
      Conversation;

    if (
      body.conversationId
    ) {
      const { data } =
        await supabase
          .from(
            "conversations",
          )
          .select("*")
          .eq(
            "id",
            body.conversationId,
          )
          .maybeSingle();

      if (!data) {
        return Response.json(
          {
            error:
              "Conversation not found.",
          },
          {
            status: 404,
          },
        );
      }

      conversation =
        data as Conversation;
    } else {
      const {
        data,
        error,
      } =
        await supabase
          .from(
            "conversations",
          )
          .insert({
            user_id:
              user.id,

            title:
              "New Chat",
          })
          .select("*")
          .single();

      if (
        error ||
        !data
      ) {
        throw (
          error ||
          new Error(
            "Conversation creation failed.",
          )
        );
      }

      conversation =
        data as Conversation;
    }

    let userMessage:
      ChatMessage;

    const admin =
      createAdminClient();

    if (
      body.mode ===
      "regenerate"
    ) {
      const {
        data,
      } =
        await supabase
          .from("messages")
          .select("*")
          .eq(
            "id",
            body.userMessageId!,
          )
          .eq(
            "conversation_id",
            conversation.id,
          )
          .eq(
            "role",
            "user",
          )
          .maybeSingle();

      if (!data) {
        return Response.json(
          {
            error:
              "Message not found.",
          },
          {
            status: 404,
          },
        );
      }

      userMessage =
        data as ChatMessage;

      await admin
        .from("messages")
        .delete()
        .eq(
          "conversation_id",
          conversation.id,
        )
        .gt(
          "sequence_number",
          userMessage.sequence_number,
        );

      await admin
        .from(
          "conversation_summaries",
        )
        .delete()
        .eq(
          "conversation_id",
          conversation.id,
        );
    } else {
      const {
        data,
        error,
      } =
        await supabase.rpc(
          "insert_user_message",
          {
            p_conversation_id:
              conversation.id,

            p_content:
              body.content!,

            p_client_request_id:
              body.requestId,
          },
        );

      if (
        error ||
        !data
      ) {
        throw (
          error ||
          new Error(
            "Message save failed.",
          )
        );
      }

      userMessage =
        data as ChatMessage;
    }

    const {
      data: recentData,
    } =
      await supabase
        .from("messages")
        .select("*")
        .eq(
          "conversation_id",
          conversation.id,
        )
        .neq(
          "role",
          "system_internal",
        )
        .order(
          "sequence_number",
          {
            ascending: true,
          },
        )
        .limit(100);

    const recentMessages =
      (
        recentData ?? []
      ) as ChatMessage[];

    const {
      data: summaryData,
    } =
      await admin
        .from(
          "conversation_summaries",
        )
        .select("*")
        .eq(
          "conversation_id",
          conversation.id,
        )
        .maybeSingle();

    const state =
      (
        conversation.interview_state ||
        createInitialInterviewState()
      ) as InterviewState;

    const context =
      buildInterviewContext({
        messages:
          recentMessages,

        state,

        summary:
          summaryData?.summary ??
          null,
      });

    const stream =
      await streamInterviewResponse(
        context,
        request.signal,
      );

    const readable =
      new ReadableStream({
        async start(
          controller,
        ) {
          let assistantText =
            "";

          try {
            for await (
              const chunk
              of stream
            ) {
              const text =
                chunk.choices[0]
                  ?.delta
                  ?.content;

              if (!text) {
                continue;
              }

              assistantText +=
                text;

              controller.enqueue(
                encodeEvent(
                  "delta",
                  {
                    text,
                  },
                ),
              );
            }

            if (
              !assistantText.trim()
            ) {
              throw new Error(
                "The model returned an empty response.",
              );
            }

            const {
              data: assistantData,
              error:
                assistantError,
            } =
              await admin.rpc(
                "insert_server_message",
                {
                  p_conversation_id:
                    conversation.id,

                  p_user_id:
                    user.id,

                  p_role:
                    "assistant",

                  p_content:
                    assistantText,

                  p_metadata: {
                    kind:
                      "interview",

                    regenerated:
                      body.mode ===
                      "regenerate",
                  },
                },
              );

            if (
              assistantError ||
              !assistantData
            ) {
              throw (
                assistantError ||
                new Error(
                  "Assistant message save failed.",
                )
              );
            }

            const assistantMessage =
              assistantData as ChatMessage;

            let nextState =
              state;

            try {
              const extracted =
                await extractInterviewState(
                  state,
                  userMessage.content,
                  assistantText,
                );

              nextState =
                mergeInterviewState(
                  state,
                  extracted,
                );
            } catch (
              extractionError
            ) {
              console.error(
                "State extraction failed",
                {
                  requestId,
                  conversationId:
                    conversation.id,
                  error:
                    extractionError,
                },
              );
            }

            let title =
              conversation.title;

            if (
              conversation.title ===
              "New Chat"
            ) {
              title =
                await generateConversationTitle(
                  userMessage.content,
                );
            }

            await admin
              .from(
                "conversations",
              )
              .update({
                title,

                interview_stage:
                  nextState.stage,

                interview_state:
                  nextState,

                updated_at:
                  new Date()
                    .toISOString(),
              })
              .eq(
                "id",
                conversation.id,
              )
              .eq(
                "user_id",
                user.id,
              );

            const messageCount =
              recentMessages.length +
              1;

            if (
              messageCount >= 16 &&
              messageCount % 8 ===
                0
            ) {
              try {
                const summary =
                  await summarizeConversationContext(
                    {
                      previousSummary:
                        summaryData?.summary,

                      messages: [
                        ...recentMessages,

                        assistantMessage,
                      ],

                      state:
                        nextState,
                    },
                  );

                await admin
                  .from(
                    "conversation_summaries",
                  )
                  .upsert({
                    conversation_id:
                      conversation.id,

                    summary,

                    structured_summary:
                      nextState,

                    through_sequence:
                      assistantMessage.sequence_number,

                    updated_at:
                      new Date()
                        .toISOString(),
                  });
              } catch (
                summaryError
              ) {
                console.error(
                  "Summary update failed",
                  {
                    requestId,
                    conversationId:
                      conversation.id,
                    error:
                      summaryError,
                  },
                );
              }
            }

            controller.enqueue(
              encodeEvent(
                "done",
                {
                  conversationId:
                    conversation.id,

                  title,

                  userMessage,

                  assistantMessage,

                  state:
                    nextState,
                },
              ),
            );

            controller.close();
          } catch (error) {
            if (
              assistantText.trim()
            ) {
              try {
                await admin.rpc(
                  "insert_server_message",
                  {
                    p_conversation_id:
                      conversation.id,

                    p_user_id:
                      user.id,

                    p_role:
                      "assistant",

                    p_content:
                      assistantText,

                    p_metadata: {
                      kind:
                        "interview",

                      stopped:
                        true,
                    },
                  },
                );
              } catch {
                // Connection may already be gone.
              }
            }

            try {
              controller.enqueue(
                encodeEvent(
                  "error",
                  {
                    message:
                      "Something interrupted the response.",

                    requestId,
                  },
                ),
              );

              controller.close();
            } catch {
              // Browser may have aborted.
            }

            console.error(
              "Chat stream failed",
              {
                requestId,
                route:
                  "/api/chat",

                provider:
                  "groq",

                conversationId:
                  conversation.id,

                error,
              },
            );
          }
        },
      });

    return new Response(
      readable,
      {
        headers: {
          "Content-Type":
            "text/event-stream",

          "Cache-Control":
            "no-cache, no-transform",

          Connection:
            "keep-alive",
        },
      },
    );
  } catch (error) {
    console.error(
      "Chat request failed",
      {
        requestId,
        route: "/api/chat",
        provider: "groq",
        error,
      },
    );

    return Response.json(
      {
        error:
          "Unable to start the interview response.",

        requestId,
      },
      {
        status: 500,
      },
    );
  }
}
