import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const experienceSource = readFileSync(new URL("./CityExperience.tsx", import.meta.url), "utf8");
const menuSource = readFileSync(new URL("./MobileCityMenu.tsx", import.meta.url), "utf8");

describe("mobile city layout", () => {
  it("moves city information and controls into a mobile menu", () => {
    expect(experienceSource).toContain("MobileCityMenu");
    expect(experienceSource).toContain("md:backdrop-blur-xl");
    expect(experienceSource).toMatch(/hidden[^\"]*md:grid/);
    expect(experienceSource).toMatch(/hidden[^\"]*md:flex/);
    expect(menuSource).toContain('aria-label="Open city menu"');
    expect(menuSource).toContain('event.key === "Escape"');
    expect(menuSource).toContain("onNavigate={() => setOpen(false)}");
    expect(menuSource).toContain("onStart={() => setOpen(false)}");
    expect(menuSource).toContain("onSelect={() => setOpen(false)}");
  });
});
