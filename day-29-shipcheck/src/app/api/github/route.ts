/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { z } from "zod";
import { parsePullRequestUrl } from "@/lib/github/parse";
import { classifyFile } from "@/lib/analysis/classify";
import { analyzeRelease } from "@/lib/analysis/analyze";
import type {
  ChangedFile,
  CiCheck,
} from "@/types/release";

const schema = z.object({
  url: z.string().min(1),
});

export async function POST(request: Request) {
  try {
    const body = schema.parse(await request.json());
    const parsed = parsePullRequestUrl(body.url);

    if (!parsed) {
      return error("Enter a GitHub pull request URL.", 400);
    }

    const headers: HeadersInit = {
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
    };

    if (process.env.GITHUB_TOKEN) {
      headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
    }

    const prefix =
      `https://api.github.com/repos/` +
      `${parsed.owner}/${parsed.repo}`;

    const prResponse = await fetch(
      `${prefix}/pulls/${parsed.number}`,
      { headers, cache: "no-store" },
    );

    if (!prResponse.ok) {
      if (prResponse.status === 404) {
        return error(
          "Repository or pull request not found. It may be private.",
          404,
        );
      }

      return error("GitHub didn't answer successfully.", 502);
    }

    const pr = await prResponse.json();

    const rawFiles = await fetchPages(
      `${prefix}/pulls/${parsed.number}/files`,
      headers,
      5,
    );

    const files: ChangedFile[] = rawFiles.map((item) => ({
      path: item.filename,
      status: normalizeStatus(item.status),
      additions: item.additions ?? 0,
      deletions: item.deletions ?? 0,
      patch: item.patch,
      areas: classifyFile(item.filename),
    }));

    const checksResponse = await fetch(
      `${prefix}/commits/${pr.head.sha}/check-runs?per_page=100`,
      {
        headers: {
          ...headers,
          Accept: "application/vnd.github+json",
        },
        cache: "no-store",
      },
    );

    let ci: CiCheck[] = [];

    if (checksResponse.ok) {
      const checksJson = await checksResponse.json();

      ci = (checksJson.check_runs ?? []).map(
        (item: any, index: number) => ({
          id: String(item.id ?? index),
          name: item.name,
          required: true,
          status: conclusionToStatus(
            item.status,
            item.conclusion,
          ),
          url: item.html_url,
        }),
      );
    }

    const session = analyzeRelease({
      id: `gh-${parsed.owner}-${parsed.repo}-${parsed.number}-${pr.head.sha}`,
      title: pr.title,
      repository: `${parsed.owner}/${parsed.repo}`,
      source: {
        kind: "github-pr",
        prNumber: parsed.number,
        url: pr.html_url,
      },
      files,
      ci,
      baseSha: pr.base.sha,
      headSha: pr.head.sha,
    });

    return NextResponse.json(session);
  } catch (cause) {
    if (cause instanceof z.ZodError) {
      return error("Invalid request.", 400);
    }

    console.error(cause);
    return error("Release analysis failed.", 500);
  }
}

async function fetchPages(
  url: string,
  headers: HeadersInit,
  pages: number,
) {
  const all: any[] = [];

  for (let page = 1; page <= pages; page += 1) {
    const separator = url.includes("?") ? "&" : "?";

    const response = await fetch(
      `${url}${separator}per_page=100&page=${page}`,
      { headers, cache: "no-store" },
    );

    if (!response.ok) break;

    const items = await response.json();

    all.push(...items);

    if (items.length < 100) break;
  }

  return all;
}

function normalizeStatus(
  value: string,
): ChangedFile["status"] {
  if (value === "added") return "added";
  if (value === "removed") return "deleted";
  if (value === "renamed") return "renamed";

  return "modified";
}

function conclusionToStatus(
  status: string,
  conclusion?: string | null,
): CiCheck["status"] {
  if (status !== "completed") return "pending";

  if (
    ["success", "neutral", "skipped"].includes(
      conclusion ?? "",
    )
  ) {
    return "pass";
  }

  return "fail";
}

function error(message: string, status: number) {
  return NextResponse.json(
    { error: message },
    { status },
  );
}