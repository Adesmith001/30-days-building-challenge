import type { CityLandmark, CityModel, CityLot, BuildingStyle } from "@/types/city";
import type { GitHubYearSnapshot } from "@/types/github";

import { contributionHeight } from "./building-height";
import { boroughForPosition, lotPosition } from "./layout";
import { createSeededRandom } from "./seeded-random";

const styles: BuildingStyle[] = ["slab", "tower", "wide", "needle"];

export function generateCity(snapshot: GitHubYearSnapshot): CityModel {
  const seed = `${snapshot.login}:${snapshot.year}`;
  const random = createSeededRandom(seed);
  const lots: CityLot[] = snapshot.days.map((day, index) => {
    const [x, , z] = lotPosition(index, snapshot.days.length);
    const status = day.isFuture ? "future" : day.count > 0 ? "active" : "empty";
    const isToday = day.date === new Date().toISOString().slice(0, 10);

    return {
      id: day.date,
      date: day.date,
      contributionCount: day.count,
      position: [x, 0, z],
      footprint: [0.95 + random() * 0.2, 0.95 + random() * 0.2],
      height: day.isFuture ? 0.08 : contributionHeight(day.count),
      style: styles[Math.floor(random() * styles.length)],
      borough: boroughForPosition(x, z),
      status: isToday ? "today" : status,
    };
  });

  const landmarks: CityLandmark[] = snapshot.repositories
    .slice(0, 8)
    .map((repository, index) => {
      const angle = (index / 8) * Math.PI * 2;
      const radius = 10.5;

      return {
        repositoryId: repository.id,
        repositoryName: repository.name,
        repositoryUrl: repository.url,
        position: [Math.cos(angle) * radius, 0, Math.sin(angle) * radius],
        height: Math.min(4 + repository.commitContributions / 10, 16),
        footprint: 1.45,
        commitContributions: repository.commitContributions,
        language: repository.primaryLanguage?.name ?? null,
        languageColor: repository.primaryLanguage?.color ?? null,
      };
    });

  return {
    seed,
    generatorVersion: 1,
    lots,
    landmarks,
    hall: {
      position: [0, 0, 0],
      height: 5.5,
    },
  };
}
