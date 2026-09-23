import {
  requireUser,
} from "@/lib/supabase/auth";

export async function DELETE() {
  const {
    user,
    supabase,
  } =
    await requireUser();

  const { error } =
    await supabase
      .from("conversations")
      .delete()
      .eq(
        "user_id",
        user.id,
      );

  if (error) {
    return Response.json(
      {
        error:
          "Couldn't delete conversations.",
      },
      {
        status: 500,
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
