import { z } from "zod";

const owner = "[A-Za-z0-9_.-]+";
const repo = "[A-Za-z0-9_.-]+";

export interface ParsedRepository {
  owner: string;
  repo: string;
}

export interface ParsedPullRequest extends ParsedRepository {
  number: number;
}

export function normalizeRepository(value: string): ParsedRepository | null {
  const input = value.trim().replace(/\/+$/, "");

  const shorthand = input.match(
    new RegExp(`^(${owner})/(${repo})$`),
  );

  if (shorthand) {
    return {
      owner: shorthand[1],
      repo: shorthand[2].replace(/\.git$/, ""),
    };
  }

  const urlInput = input.startsWith("http")
    ? input
    : `https://${input}`;

  try {
    const url = new URL(urlInput);

    if (url.hostname !== "github.com") {
      return null;
    }

    const parts = url.pathname.split("/").filter(Boolean);

    if (parts.length < 2) {
      return null;
    }

    return {
      owner: parts[0],
      repo: parts[1].replace(/\.git$/, ""),
    };
  } catch {
    return null;
  }
}

export function parsePullRequestUrl(
  value: string,
): ParsedPullRequest | null {
  try {
    const normalized = value.startsWith("http")
      ? value
      : `https://${value}`;

    const url = new URL(normalized);

    if (url.hostname !== "github.com") {
      return null;
    }

    const parts = url.pathname.split("/").filter(Boolean);

    if (
      parts.length < 4 ||
      parts[2] !== "pull" ||
      !z.coerce.number().int().positive().safeParse(parts[3]).success
    ) {
      return null;
    }

    return {
      owner: parts[0],
      repo: parts[1],
      number: Number(parts[3]),
    };
  } catch {
    return null;
  }
}