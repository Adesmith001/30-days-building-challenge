export type ProjectStatus = "completed";

export type ProjectImage = {
  src: string;
  alt: string;
};

export type Project = {
  day: number;
  title: string;
  tagline: string;
  description: string;
  date: string;
  status: ProjectStatus;
  stack: string[];
  images: ProjectImage[];
  liveUrl: string;
  githubUrl: string;
  twitterUrl?: string;
  learned: string;
};

export const challengeStartDate = "2026-09-01";

export const projects: Project[] = [
  {
    day: 1,
    title: "Cursor Chaos",
    tagline: "A browser physics experiment where your cursor becomes part of the simulation.",
    description:
      "Cursor Chaos turns the pointer into a force inside a Matter.js and Three.js playground. Stir, attract, repel, toggle gravity, and drop new objects into a monochrome physics system.",
    date: "2026-09-01",
    status: "completed",
    stack: ["React", "TypeScript", "Matter.js", "Three.js", "Canvas"],
    images: [
      {
        src: "/projects/day-01/cursor-chaos.svg",
        alt: "Cursor Chaos project preview"
      }
    ],
    liveUrl: "/day-01-cursor-chaos/",
    githubUrl: "https://github.com/Adesmith001/30-days-building",
    twitterUrl: "",
    learned:
      "The useful version came from reducing the simulation to a few strong inputs, splitting the large app file into focused modules, and tuning the canvas for mobile performance."
  }
];
