import {
  describe,
  expect,
  it,
} from "vitest";

import {
  normalizeMermaidCode,
} from "@/lib/mermaid";

describe("Mermaid normalization", () => {
  it("quotes node labels containing parser-sensitive characters", () => {
    const code = [
      "flowchart TD",
      "Payment --> Gateway[Local Payment Gateway (Naira)]",
      "Payment --> Trial[Free 14-day Trial]",
    ].join("\n");

    expect(normalizeMermaidCode(code)).toContain(
      'Gateway["Local Payment Gateway (Naira)"]',
    );
    expect(normalizeMermaidCode(code)).toContain(
      'Trial["Free 14-day Trial"]',
    );
  });

  it("produces syntax accepted by Mermaid 12", async () => {
    const mermaid = (
      await import("mermaid")
    ).default;

    await expect(
      mermaid.parse(
        normalizeMermaidCode(
          "flowchart TD\nPayment --> Gateway[Local Payment Gateway (Naira)]",
        ),
      ),
    ).resolves.toMatchObject({
      diagramType: "flowchart-v2",
    });
  });
});
