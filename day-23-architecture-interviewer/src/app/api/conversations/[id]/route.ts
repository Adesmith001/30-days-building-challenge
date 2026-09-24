import {
  renameConversationSchema,
} from "@/lib/validation/chat";

import {
  requireUser,
} from "@/lib/supabase/auth";

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
    supabase,
  } =
    await requireUser();

  const parsed =
    renameConversationSchema.safeParse(
      await request.json(),
    );

  if (!parsed.success) {
    return Response.json(
      {
        error:
          "Invalid title.",
      },
      {
        status: 400,
      },
    );
  }

  const {
    data,
    error,
  } =
    await supabase
      .from("conversations")
      .update({
        title:
          parsed.data.title,
      })
      .eq("id", id)
      .select("*")
      .maybeSingle();

  if (
    error ||
    !data
  ) {
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

  return Response.json({
    conversation:
      data,
  });
}

export async function DELETE(
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

  const { error } =
    await supabase
      .from("conversations")
      .delete()
      .eq("id", id);

  if (error) {
    return Response.json(
      {
        error:
          "Couldn't delete this conversation.",
      },
      {
        status: 400,
      },
    );
  }

  return new Response(
    null,
    {
      status: 204,
    },
  );
}
