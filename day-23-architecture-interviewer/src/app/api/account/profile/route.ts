import { z } from "zod";

import {
  requireUser,
} from "@/lib/supabase/auth";

const schema =
  z.object({
    displayName:
      z.string()
        .trim()
        .min(1)
        .max(80),
  });

export async function PATCH(
  request: Request,
) {
  const {
    user,
    supabase,
  } =
    await requireUser();

  const parsed =
    schema.safeParse(
      await request.json(),
    );

  if (!parsed.success) {
    return Response.json(
      {
        error:
          "Invalid display name.",
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
      .from("profiles")
      .update({
        display_name:
          parsed.data.displayName,
      })
      .eq(
        "id",
        user.id,
      )
      .select("*")
      .single();

  if (error) {
    throw error;
  }

  return Response.json({
    profile: data,
  });
}
