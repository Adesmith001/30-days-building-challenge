export type Screen = "home" | "modes" | "battle" | "atlas" | "history" | "results";

const paths: Record<Screen, string> = {
  home: "/",
  modes: "/modes",
  battle: "/battle",
  atlas: "/atlas",
  history: "/history",
  results: "/results",
};

export function pathForScreen(screen: Screen) {
  return paths[screen];
}

export function screenFromPath(pathname: string): Screen {
  const path = pathname !== "/" ? pathname.replace(/\/$/, "") : pathname;
  return (Object.entries(paths).find(([, value]) => value === path)?.[0] as Screen | undefined) ?? "home";
}

export function resolveActiveScreen(screen: Screen, hasRun: boolean, hasResults: boolean): Screen {
  if (hasResults) return "results";
  if (screen === "battle" && !hasRun || screen === "results") return "home";
  return screen;
}
