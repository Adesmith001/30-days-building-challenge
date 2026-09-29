import { isIP } from "node:net";
import { lookup } from "node:dns/promises";

export function isPrivateAddress(
  address: string,
): boolean {
  if (address === "::1") return true;

  if (address.startsWith("fc") || address.startsWith("fd")) {
    return true;
  }

  if (address.startsWith("fe80:")) {
    return true;
  }

  const parts = address.split(".").map(Number);

  if (parts.length !== 4 || parts.some(Number.isNaN)) {
    return false;
  }

  const [a, b] = parts;

  return (
    a === 10 ||
    a === 127 ||
    a === 0 ||
    (a === 169 && b === 254) ||
    (a === 172 && b >= 16 && b <= 31) ||
    (a === 192 && b === 168) ||
    (a === 100 && b >= 64 && b <= 127)
  );
}

export async function assertSafeHttpUrl(
  value: string,
): Promise<URL> {
  const url = new URL(value);

  if (!["http:", "https:"].includes(url.protocol)) {
    throw new Error("Only HTTP and HTTPS are allowed.");
  }

  if (url.username || url.password) {
    throw new Error("Credentials in URLs are not allowed.");
  }

  const hostname = url.hostname.toLowerCase();

  if (
    hostname === "localhost" ||
    hostname.endsWith(".localhost")
  ) {
    throw new Error("Local addresses are not allowed.");
  }

  if (isIP(hostname)) {
    if (isPrivateAddress(hostname)) {
      throw new Error("Private addresses are not allowed.");
    }

    return url;
  }

  const addresses = await lookup(hostname, {
    all: true,
    verbatim: true,
  });

  if (!addresses.length) {
    throw new Error("Host could not be resolved.");
  }

  if (
    addresses.some((entry) =>
      isPrivateAddress(entry.address),
    )
  ) {
    throw new Error("Host resolves to a private address.");
  }

  return url;
}