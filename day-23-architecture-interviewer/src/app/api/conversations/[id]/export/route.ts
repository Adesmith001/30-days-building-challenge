import type {
  ChatMessage,
  Conversation,
} from "@/types/chat";

import {
  requireUser,
} from "@/lib/supabase/auth";

import {
  buildMarkdownExport,
} from "@/lib/export/markdown";

export async function GET(
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
    supabase,
  } =
    await requireUser();

  const {
    data: conversation,
  } =
    await supabase
      .from("conversations")
      .select("*")
      .eq("id", id)
      .maybeSingle();

  if (!conversation) {
    return new Response(
      "Not found",
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
      .order(
        "sequence_number",
        {
          ascending: true,
        },
      );

  const markdown =
    buildMarkdownExport(
      conversation as Conversation,

      (messages ??
        []) as ChatMessage[],
    );

  return new Response(
    markdown,
    {
      headers: {
        "Content-Type":
          "text/markdown; charset=utf-8",

        "Content-Disposition":
          `attachment; filename="architecture-review-${id}.md"`,
      },
    },
  );
}
