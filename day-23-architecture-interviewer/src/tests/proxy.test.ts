import {
  describe,
  expect,
  it,
} from "vitest";

import {
  isProtectedPath,
} from "@/lib/supabase/proxy";

describe(
  "route protection",
  () => {
    it(
      "protects application routes",
      () => {
        expect(
          isProtectedPath(
            "/chat",
          ),
        ).toBe(true);

        expect(
          isProtectedPath(
            "/chat/123",
          ),
        ).toBe(true);

        expect(
          isProtectedPath(
            "/settings",
          ),
        ).toBe(true);

        expect(
          isProtectedPath(
            "/",
          ),
        ).toBe(false);

        expect(
          isProtectedPath(
            "/auth",
          ),
        ).toBe(false);
      },
    );
  },
);
