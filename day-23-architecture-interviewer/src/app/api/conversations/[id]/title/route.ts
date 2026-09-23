import type {
  ChatMessage,
} from "@/types/chat";

import {
  requireUser,
} from "@/lib/supabase/auth";

import {
  createAdminClient,
} from "@/lib/supabase/admin";

import {
  generateConversationTitle,
} from "@/lib/ai/title";

import {
  checkRateLimit,
} from "@/lib/rate-limit/check";

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
      bucket: "title",
      limit: 10,
      windowSeconds: 600,
    });

  if (!allowed) {
    return Response.json(
      {
        error:
          "Title generation limit reached.",
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
      .select("id")
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
    data,
  } =
    await supabase
      .from("messages")
      .select("*")
      .eq(
        "conversation_id",
        id,
      )
      .eq(
        "role",
        "user",
      )
      .order(
        "sequence_number",
        {
          ascending: true,
        },
      )
      .limit(1)
      .maybeSingle();

  if (!data) {
    return Response.json(
      {
        error:
          "No user message found.",
      },
      {
        status: 400,
      },
    );
  }

  const first =
    data as ChatMessage;

  const title =
    await generateConversationTitle(
      first.content,
    );

  const admin =
    createAdminClient();

  await admin
    .from("conversations")
    .update({
      title,
    })
    .eq("id", id)
    .eq(
      "user_id",
      user.id,
    );

  return Response.json({
    title,
  });
}
