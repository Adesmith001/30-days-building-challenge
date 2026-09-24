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

import {
  getProfileAvatarUrl,
  getProfileDisplayName,
} from "@/lib/account/profile";

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
        getProfileDisplayName(
          profile,
          user,
        )
      }
      avatarUrl={
        getProfileAvatarUrl(
          profile,
          user,
        )
      }
      email={
        user.email
      }
    >
      {children}
    </AppShell>
  );
}
