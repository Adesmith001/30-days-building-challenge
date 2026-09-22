export type BuildingStyle = "slab" | "tower" | "wide" | "needle";

export type LotStatus = "active" | "empty" | "future" | "today";

export interface CityLot {
  id: string;
  date: string;
  contributionCount: number;
  position: [number, number, number];
  footprint: [number, number];
  height: number;
  style: BuildingStyle;
  borough: 1 | 2 | 3 | 4;
  status: LotStatus;
}

export interface CityLandmark {
  repositoryId: string;
  repositoryName: string;
  repositoryUrl: string;
  position: [number, number, number];
  height: number;
  footprint: number;
  commitContributions: number;
  language: string | null;
  languageColor: string | null;
}

export interface CityModel {
  seed: string;
  generatorVersion: number;
  lots: CityLot[];
  landmarks: CityLandmark[];
  hall: {
    position: [number, number, number];
    height: number;
  };
}
