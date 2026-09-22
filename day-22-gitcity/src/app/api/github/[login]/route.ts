import { NextResponse } from "next/server";

import { fetchGitHubYear } from "@/lib/github/fetch-github-year";

export async function GET(
  request: Request,
  context: { params: Promise<{ login: string }> },
) {
  const { login } = await context.params;
  const year = Number(new URL(request.url).searchParams.get("year")) || new Date().getFullYear();

  if (!/^[a-z\d-]{1,39}$/i.test(login)) {
    return NextResponse.json({ error: "Enter a valid GitHub username." }, { status: 400 });
  }

  try {
    const snapshot = await fetchGitHubYear(login, year);

    return NextResponse.json(snapshot);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to load GitHub data.";

    return NextResponse.json({ error: message }, { status: 502 });
  }
}
