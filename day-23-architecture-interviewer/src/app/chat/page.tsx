import {
  redirect,
} from "next/navigation";

import {
  ChatView,
} from "@/components/chat/chat-view";

import {
  getConversations,
} from "@/lib/supabase/queries";

interface Props {
  searchParams:
    Promise<{
      new?: string;
    }>;
}

export default async function ChatPage({
  searchParams,
}: Props) {
  const query =
    await searchParams;

  if (
    query.new !== "1"
  ) {
    const conversations =
      await getConversations();

    const mostRecent =
      conversations[0];

    if (mostRecent) {
      // Server components need the current time for the seven-day restore rule.
      const age =
        Date.now() - // eslint-disable-line react-hooks/purity
        new Date(
          mostRecent.updated_at,
        ).getTime();

      const sevenDays =
        7 *
        24 *
        60 *
        60 *
        1000;

      if (
        age <= sevenDays
      ) {
        redirect(
          `/chat/${mostRecent.id}`,
        );
      }
    }
  }

  return (
    <ChatView />
  );
}
