export type Screen =
  | "home"
  | "daily"
  | "tutorial"
  | "game"
  | "results"
  | "history"
  | "categories"
  | "blind"
  | "gap";

const paths: Record<Screen, string> = {
  home: "/",
  daily: "/daily",
  tutorial: "/tutorial",
  game: "/game",
  results: "/results",
  history: "/history",
  categories: "/categories",
  blind: "/blind",
  gap: "/gap",
};

export function pathToScreen(pathname: string): Screen {
  const normalizedPath =
    pathname !== "/"
      ? pathname.replace(/\/+$/, "")
      : pathname;
  const entry = Object.entries(paths).find(
    ([, path]) => path === normalizedPath,
  );
  return (entry?.[0] as Screen | undefined) ?? "home";
}

export function screenToPath(screen: Screen): string {
  return paths[screen];
}
