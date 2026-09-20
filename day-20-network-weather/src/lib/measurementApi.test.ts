import { describe, expect, it } from "vitest";
import { GET as download } from "../../api/download";
import { GET as ping } from "../../api/ping";
import { OPTIONS as uploadOptions } from "../../api/upload";

describe("remote measurement API", () => {
  it("allows cross-origin ping and download requests", async () => {
    const pingResponse = await ping();
    const downloadResponse = await download(
      new Request("https://network-test.example/api/download?bytes=65536"),
    );

    expect(pingResponse.headers.get("Access-Control-Allow-Origin")).toBe("*");
    expect(downloadResponse.headers.get("Access-Control-Allow-Origin")).toBe(
      "*",
    );
  });

  it("answers upload preflight requests", () => {
    const response = uploadOptions();

    expect(response.status).toBe(204);
    expect(response.headers.get("Access-Control-Allow-Methods")).toContain(
      "POST",
    );
  });
});
