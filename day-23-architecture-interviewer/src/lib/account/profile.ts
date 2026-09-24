import type {
  Profile,
} from "@/types/chat";

interface AuthUserLike {
  id: string;
  email?: string | null;
  user_metadata?: Record<string, unknown> | null;
}

function metadataString(
  user: AuthUserLike,
  key: string,
) {
  const value = user.user_metadata?.[key];

  return typeof value === "string" && value.trim()
    ? value.trim()
    : null;
}

export function getProfileDisplayName(
  profile: Pick<Profile, "display_name"> | null | undefined,
  user: AuthUserLike,
) {
  return (
    profile?.display_name?.trim() ||
    metadataString(user, "full_name") ||
    metadataString(user, "name") ||
    user.email?.split("@")[0] ||
    null
  );
}

export function getProfileAvatarUrl(
  profile: Pick<Profile, "avatar_url"> | null | undefined,
  user: AuthUserLike,
) {
  return (
    profile?.avatar_url?.trim() ||
    metadataString(user, "avatar_url") ||
    metadataString(user, "picture") ||
    null
  );
}

export function buildProfileUpsert(
  user: AuthUserLike,
  displayName: string,
) {
  return {
    id: user.id,
    display_name: displayName,
    avatar_url: getProfileAvatarUrl(null, user),
  };
}
