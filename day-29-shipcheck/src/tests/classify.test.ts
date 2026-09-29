import { describe, expect, it } from "vitest";
import { classifyFile } from "@/lib/analysis/classify";

describe("file classification", () => {
  it("classifies CSS without inventing database impact", () => {
    const areas = classifyFile(
      "src/styles/checkout.css",
    );

    expect(areas).toContain("FRONTEND");
    expect(areas).not.toContain("DATABASE");
    expect(areas).not.toContain("CONFIG");
  });

  it("classifies migrations", () => {
    const areas = classifyFile(
      "supabase/migrations/add_state.sql",
    );

    expect(areas).toContain("DATABASE");
  });

  it("can classify one file into multiple surfaces", () => {
    const areas = classifyFile(
      "src/api/payment-webhook.ts",
    );

    expect(areas).toContain("API");
    expect(areas).toContain("PAYMENTS");
  });
});