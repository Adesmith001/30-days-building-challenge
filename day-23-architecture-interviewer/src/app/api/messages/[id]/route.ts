import {
  editMessageSchema,
} from "@/lib/validation/chat";

import {
  requireUser,
} from "@/lib/supabase/auth";

import {
  createAdminClient,
} from "@/lib/supabase/admin";

export async function PATCH(
  request: Request,
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

  const parsed =
    editMessageSchema.safeParse(
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

  const {
    data: message,
  } =
    await supabase
      .from("messages")
      .select("*")
      .eq("id", id)
      .eq("role", "user")
      .maybeSingle();

  if (!message) {
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

  const {
    data: updated,
    error,
  } =
    await supabase
      .from("messages")
      .update({
        content:
          parsed.data.content,
      })
      .eq("id", id)
      .select("*")
      .single();

  if (error) {
    throw error;
  }

  const admin =
    createAdminClient();

  await admin
    .from("messages")
    .delete()
    .eq(
      "conversation_id",
      message.conversation_id,
    )
    .gt(
      "sequence_number",
      message.sequence_number,
    );

  await admin
    .from(
      "conversation_summaries",
    )
    .delete()
    .eq(
      "conversation_id",
      message.conversation_id,
    );

  await admin
    .from("conversations")
    .update({
      updated_at:
        new Date()
          .toISOString(),
    })
    .eq(
      "id",
      message.conversation_id,
    )
    .eq(
      "user_id",
      user.id,
    );

  return Response.json({
    message:
      updated,
  });
}
