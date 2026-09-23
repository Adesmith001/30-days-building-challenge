import {
  createClient,
} from "@/lib/supabase/server";

import type {
  ChatMessage,
  Conversation,
  Profile,
} from "@/types/chat";

export async function getProfile(
  userId: string,
) {
  const supabase =
    await createClient();

  const { data } =
    await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

  return data as Profile | null;
}

export async function getConversations() {
  const supabase =
    await createClient();

  const { data } =
    await supabase
      .from("conversations")
      .select("*")
      .is("archived_at", null)
      .order(
        "updated_at",
        {
          ascending: false,
        },
      )
      .limit(50);

  return (
    data ?? []
  ) as Conversation[];
}

export async function getConversation(
  id: string,
) {
  const supabase =
    await createClient();

  const { data } =
    await supabase
      .from("conversations")
      .select("*")
      .eq("id", id)
      .maybeSingle();

  return data as Conversation | null;
}

export async function getMessages(
  conversationId: string,
) {
  const supabase =
    await createClient();

  const { data } =
    await supabase
      .from("messages")
      .select("*")
      .eq(
        "conversation_id",
        conversationId,
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

  return (
    data ?? []
  ) as ChatMessage[];
}
