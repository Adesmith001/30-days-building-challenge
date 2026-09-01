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
    tagline:
      "A browser physics experiment where your cursor becomes part of the simulation.",
    description:
      "Cursor Chaos turns the pointer into a force inside a Matter.js and Three.js playground. Stir, attract, repel, toggle gravity, and drop new objects into a monochrome physics system.",
    date: "2026-09-01",
    status: "completed",
    stack: ["React", "TypeScript", "Matter.js", "Three.js", "Canvas"],
    images: [
      {
        src: "/projects/day-01/image.png",
        alt: "Cursor Chaos project preview",
      },
      {
        src: "/projects/day-01/cursor-chaos.svg",
        alt: "Cursor Chaos project preview",
      },
    ],
    liveUrl: "https://day-1-cursor-chaos.vercel.app/",
    githubUrl: "https://github.com/Adesmith001/30-days-building",
    twitterUrl: "https://x.com/yourcoderboy18/status/2094816204133159369?s=20",
    learned:
      "I learned how to sync Matter.js physics with Three.js rendering, turn cursor movement into real-time forces, and keep the simulation smooth by separating high-frequency physics updates from React state.",
  },
];
