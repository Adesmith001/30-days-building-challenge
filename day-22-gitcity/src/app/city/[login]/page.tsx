import { notFound } from "next/navigation";

import { CityExperience } from "@/components/city/CityExperience";
import { generateCity } from "@/lib/city/generate-city";
import { fetchGitHubYear } from "@/lib/github/fetch-github-year";

export default async function CityPage({ params }: { params: Promise<{ login: string }> }) {
  const { login } = await params;
  const year = new Date().getFullYear();
  let snapshot;

  try {
    snapshot = await fetchGitHubYear(login, year);
  } catch {
    notFound();
  }

  const city = generateCity(snapshot);

  return <CityExperience snapshot={snapshot} city={city} />;
}
