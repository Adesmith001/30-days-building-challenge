import {
  redirect,
} from "next/navigation";

import {
  AppShell,
} from "@/components/chat/app-shell";

import {
  createClient,
} from "@/lib/supabase/server";

import {
  getConversations,
  getProfile,
} from "@/lib/supabase/queries";

export default async function ChatLayout({
  children,
}: {
  children:
    React.ReactNode;
}) {
  const supabase =
    await createClient();

  const {
    data: { user },
  } =
    await supabase.auth.getUser();

  if (!user) {
    redirect(
      "/auth?next=/chat",
    );
  }

  const [
    conversations,
    profile,
  ] =
    await Promise.all([
      getConversations(),
      getProfile(
        user.id,
      ),
    ]);

  return (
    <AppShell
      conversations={
        conversations
      }
      name={
        profile?.display_name
      }
      email={
        user.email
      }
    >
      {children}
    </AppShell>
  );
}
