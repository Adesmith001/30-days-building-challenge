import {
  requireUser,
} from "@/lib/supabase/auth";

import {
  createAdminClient,
} from "@/lib/supabase/admin";

export async function DELETE() {
  const {
    user,
  } =
    await requireUser();

  const admin =
    createAdminClient();

  const { error } =
    await admin.auth.admin.deleteUser(
      user.id,
    );

  if (error) {
    return Response.json(
      {
        error:
          "Couldn't delete the account.",
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
