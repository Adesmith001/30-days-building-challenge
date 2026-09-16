export type Screen =
  | "landing"
  | "routine"
  | "homeA"
  | "homeB"
  | "compare"
  | "history"
  | "about";

const paths: Record<Screen, string> = {
  landing: "/",
  routine: "/routine",
  homeA: "/home-a",
  homeB: "/home-b",
  compare: "/compare",
  history: "/history",
  about: "/about",
};

export function pathToScreen(pathname: string): Screen {
  const entry = Object.entries(paths).find(([, path]) => path === pathname);
  return (entry?.[0] as Screen | undefined) ?? "landing";
}

export function screenToPath(screen: Screen): string {
  return paths[screen];
}
