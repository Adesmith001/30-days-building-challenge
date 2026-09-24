import {
  describe,
  expect,
  it,
} from "vitest";

import {
  buildProfileUpsert,
  getProfileAvatarUrl,
  getProfileDisplayName,
} from "@/lib/account/profile";

describe("profile updates", () => {
  it("upserts a profile row and preserves the user's avatar", () => {
    expect(
      buildProfileUpsert(
        {
          id: "user-1",
          user_metadata: {
            avatar_url: "https://example.com/ada.png",
          },
        },
        "Ada Lovelace",
      ),
    ).toEqual({
      id: "user-1",
      display_name: "Ada Lovelace",
      avatar_url: "https://example.com/ada.png",
    });
  });
});

describe("profile fallbacks", () => {
  it("uses auth metadata when a profile row is unavailable", () => {
    const user = {
      id: "user-1",
      email: "ada@example.com",
      user_metadata: {
        full_name: "Ada Lovelace",
        picture: "https://example.com/ada.png",
      },
    };

    expect(getProfileDisplayName(null, user)).toBe(
      "Ada Lovelace",
    );
    expect(getProfileAvatarUrl(null, user)).toBe(
      "https://example.com/ada.png",
    );
  });
});
