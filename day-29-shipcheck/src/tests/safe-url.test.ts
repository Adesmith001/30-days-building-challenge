import { describe, expect, it } from "vitest";
import { isPrivateAddress } from "@/lib/security/safe-url";

describe("private-address detection", () => {
  it("rejects loopback", () => {
    expect(isPrivateAddress("127.0.0.1")).toBe(true);
  });

  it("rejects RFC1918 addresses", () => {
    expect(isPrivateAddress("10.0.0.1")).toBe(true);
    expect(isPrivateAddress("172.16.5.10")).toBe(true);
    expect(isPrivateAddress("192.168.1.9")).toBe(true);
  });

  it("rejects metadata/link-local addresses", () => {
    expect(isPrivateAddress("169.254.169.254")).toBe(
      true,
    );
  });

  it("accepts a normal public IPv4 address", () => {
    expect(isPrivateAddress("8.8.8.8")).toBe(false);
  });

  it("rejects IPv6 loopback", () => {
    expect(isPrivateAddress("::1")).toBe(true);
  });
});