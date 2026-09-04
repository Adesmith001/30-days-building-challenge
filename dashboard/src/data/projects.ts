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
    githubUrl: "https://github.com/Adesmith001/30-days-building-challenge",
    twitterUrl: "https://x.com/yourcoderboy18/status/2094816204133159369?s=20",
    learned:
      "I learned how to sync Matter.js physics with Three.js rendering, turn cursor movement into real-time forces, and keep the simulation smooth by separating high-frequency physics updates from React state.",
  },
  {
    day: 2,
    title: "Meeting Cost",
    tagline:
      "A live calculator that shows how much money a meeting consumes as it happens.",
    description:
      "Meeting Cost converts attendee salaries into an hourly burn rate, tracks meeting time from real timestamps, and produces a local receipt with history, efficiency scoring, and export support.",
    date: "2026-09-02",
    status: "completed",
    stack: [
      "React",
      "TypeScript",
      "Tailwind CSS",
      "Motion",
      "LocalStorage",
      "html-to-image",
    ],
    images: [
      {
        src: "/projects/day-02/image1.jpg",
        alt: "Meeting Cost project preview",
      },
      {
        src: "/projects/day-02/image2.jpg",
        alt: "Meeting Cost project preview",
      },
      {
        src: "/projects/day-02/image3.jpg",
        alt: "Meeting Cost project preview",
      },
      {
        src: "/projects/day-02/image4.jpg",
        alt: "Meeting Cost project preview",
      },
      {
        src: "/projects/day-02/image5.jpg",
        alt: "Meeting Cost project preview",
      },
      {
        src: "/projects/day-02/image6.jpg",
        alt: "Meeting Cost project preview",
      }
    ],
    liveUrl: "https://day-2-meeting-cost.vercel.app/",
    githubUrl: "https://github.com/Adesmith001/30-days-building-challenge-challenge",
    twitterUrl: "https://x.com/yourcoderboy18/status/2095163490214228275",
    learned:
      "I learned how to turn salary and working-hour inputs into a live meeting burn rate, keep elapsed time accurate with real timestamps, persist meeting history locally, and export a receipt view as an image without sending private salary data outside the browser.",
  },
  {
    day: 3,
    title: "Blink",
    tagline:
      "A fast visual memory game that measures how much detail you can catch in an instant.",
    description:
      "Blink presents short visual scenes, then tests recall across numbers, text, colours, and positions. Adaptive exposure times reward accurate answers with faster rounds, while local records track scores, streaks, category accuracy, and latency across sessions.",
    date: "2026-09-03",
    status: "completed",
    stack: [
      "React",
      "TypeScript",
      "Tailwind CSS",
      "Motion",
      "LocalStorage",
      "html-to-image",
    ],
    images: [
      {
        src: "/projects/day-03/image1.png",
        alt: "Blink project preview",
      },
      {
        src: "/projects/day-03/image2.png",
        alt: "Blink project preview",
      },
      {
        src: "/projects/day-03/image3.png",
        alt: "Blink project preview",
      },
      {
        src: "/projects/day-03/image4.png",
        alt: "Blink project preview",
      },
      {
        src: "/projects/day-03/image.png",
        alt: "Blink project preview",
      },
    ],
    liveUrl: "https://day-3-blink.vercel.app/",
    githubUrl: "https://github.com/Adesmith001/30-days-building-challenge",
    twitterUrl: "https://x.com/yourcoderboy18/status/2095461828323090522",
    learned:
      "I learned how to build timed visual-memory interactions, adjust difficulty from round performance, persist detailed session records locally, and tailor generated stimulus content with Nigerian states, weather, music, and store items.",
  },
  {
    day: 4,
    title: "Reflex Lab",
    tagline:
      "A Nigerian-flavoured reflex battery for testing speed, accuracy, and self-control.",
    description:
      "Reflex Lab puts users through visual, audio, choice, and fakeout tests with randomized stimuli, varied sounds, decoys, combo scoring, personal bests, and quick or full-battery sessions.",
    date: "2026-09-04",
    status: "completed",
    stack: [
      "React",
      "TypeScript",
      "Tailwind CSS",
      "Motion",
      "Web Audio API",
      "LocalStorage",
      "html-to-image",
    ],
    images: [
      {
        src: "/projects/day-04/image.png",
        alt: "Reflex Lab project preview",
      },
      {
        src: "/projects/day-04/image1.png",
        alt: "Reflex Lab project preview",
      },
      {
        src: "/projects/day-04/image2.png",
        alt: "Reflex Lab project preview",
      },
      {
        src: "/projects/day-04/image3.png",
        alt: "Reflex Lab project preview",
      },
      {
        src: "/projects/day-04/image4.png",
        alt: "Reflex Lab project preview",
      }
    ],
    liveUrl: "https://day-4-reflex-lab.vercel.app/",
    githubUrl: "https://github.com/Adesmith001/30-days-building-challenge",
    twitterUrl:"https://x.com/yourcoderboy18/status/2095887016147702123",
    learned:
      "I learned how to build timed reaction tests, generate varied stimuli without immediate repeats, use the Web Audio API for playable signals, score combos across different challenge types, and keep personal bests locally in the browser.",
  },
];
