import type {
  ChatMessage,
} from "@/types/chat";

import type {
  InterviewState,
} from "@/types/interview";

import {
  requireUser,
} from "@/lib/supabase/auth";

import {
  createAdminClient,
} from "@/lib/supabase/admin";

import {
  checkRateLimit,
} from "@/lib/rate-limit/check";

import {
  generateFinalReview,
} from "@/lib/ai/review";

export async function POST(
  _request: Request,
  {
    params,
  }: {
    params:
      Promise<{
        id: string;
      }>;
  },
) {
  const { id } =
    await params;

  const {
    user,
    supabase,
  } =
    await requireUser();

  const allowed =
    await checkRateLimit({
      userId: user.id,
      bucket: "review",
      limit: 5,
      windowSeconds: 600,
    });

  if (!allowed) {
    return Response.json(
      {
        error:
          "Review limit reached. Try again later.",
      },
      {
        status: 429,
      },
    );
  }

  const {
    data: conversation,
  } =
    await supabase
      .from("conversations")
      .select("*")
      .eq("id", id)
      .maybeSingle();

  if (!conversation) {
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

  const {
    data: messages,
  } =
    await supabase
      .from("messages")
      .select("*")
      .eq(
        "conversation_id",
        id,
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
      );

  const admin =
    createAdminClient();

  const {
    data: summary,
  } =
    await admin
      .from(
        "conversation_summaries",
      )
      .select("summary")
      .eq(
        "conversation_id",
        id,
      )
      .maybeSingle();

  const markdown =
    await generateFinalReview({
      state:
        conversation.interview_state as InterviewState,

      summary:
        summary?.summary,

      messages:
        (messages ??
          []) as ChatMessage[],
    });

  const {
    data: message,
    error,
  } =
    await admin.rpc(
      "insert_server_message",
      {
        p_conversation_id:
          id,

        p_user_id:
          user.id,

        p_role:
          "assistant",

        p_content:
          markdown,

        p_metadata: {
          kind:
            "review",
        },
      },
    );

  if (error) {
    throw error;
  }

  return Response.json({
    message,
  });
}
