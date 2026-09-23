import {
  redirect,
} from "next/navigation";

import {
  ChatView,
} from "@/components/chat/chat-view";

import {
  getConversation,
  getMessages,
} from "@/lib/supabase/queries";

interface Props {
  params:
    Promise<{
      id: string;
    }>;
}

export default async function ConversationPage({
  params,
}: Props) {
  const { id } =
    await params;

  const conversation =
    await getConversation(id);

  if (!conversation) {
    redirect(
      "/chat?new=1",
    );
  }

  const messages =
    await getMessages(id);

  return (
    <ChatView
      conversation={
        conversation
      }
      initialMessages={
        messages
      }
      initialState={
        conversation.interview_state
      }
    />
  );
}
