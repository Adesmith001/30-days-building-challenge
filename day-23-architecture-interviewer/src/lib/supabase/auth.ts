import { createClient } from "@/lib/supabase/server";

export class AuthenticationError extends Error {
  constructor() {
    super("Authentication required.");
    this.name = "AuthenticationError";
  }
}

export async function requireUser() {
  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    throw new AuthenticationError();
  }

  return {
    user,
    supabase,
  };
}