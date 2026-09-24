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
  generateArchitectureDiagram,
} from "@/lib/ai/diagram";

import type {
  InterviewState,
} from "@/types/interview";

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
      bucket: "diagram",
      limit: 5,
      windowSeconds: 600,
    });

  if (!allowed) {
    return Response.json(
      {
        error:
          "Diagram limit reached. Try again later.",
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

  const mermaid =
    await generateArchitectureDiagram(
      conversation.interview_state as InterviewState,
      summary?.summary ??
        null,
    );

  const content = [
    "```mermaid",
    mermaid,
    "```",
    "",
    "This reflects only the components we've discussed so far.",
  ].join("\n");

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
          content,

        p_metadata: {
          kind:
            "diagram",
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
