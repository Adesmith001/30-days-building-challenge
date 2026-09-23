import "@testing-library/jest-dom/vitest";

import { vi } from "vitest";

process.env.NEXT_PUBLIC_SUPABASE_URL ??=
  "https://example.supabase.co";
process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??=
  "test-publishable-key";
process.env.NEXT_PUBLIC_APP_URL ??=
  "http://localhost:3000";

vi.mock("server-only", () => ({}));
