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
      },
    ],
    liveUrl: "https://day-2-meeting-cost.vercel.app/",
    githubUrl:
      "https://github.com/Adesmith001/30-days-building-challenge-challenge",
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
      },
    ],
    liveUrl: "https://day-4-reflex-lab.vercel.app/",
    githubUrl: "https://github.com/Adesmith001/30-days-building-challenge",
    twitterUrl: "https://x.com/yourcoderboy18/status/2095887016147702123",
    learned:
      "I learned how to build timed reaction tests, generate varied stimuli without immediate repeats, use the Web Audio API for playable signals, score combos across different challenge types, and keep personal bests locally in the browser.",
  },
  {
    day: 5,
    title: "Do Not Touch",
    tagline:
      "A mischievous button-chasing game that tests patience, speed, and self-control.",
    description:
      "Do Not Touch puts one evasive button through ten levels of movement, shrinking, teleporting, decoys, and boss-level mischief. Catch the real button, protect your streak, and try not to lose your cool.",
    date: "2026-09-05",
    status: "completed",
    stack: [
      "React",
      "TypeScript",
      "Tailwind CSS",
      "Motion",
      "Lucide",
      "LocalStorage",
      "html-to-image",
    ],
    images: [
      {
        src: "/projects/day-05/image.png",
        alt: "Do Not Touch project preview",
      },
      {
        src: "/projects/day-05/image1.png",
        alt: "Do Not Touch project preview",
      },
      {
        src: "/projects/day-05/image2.png",
        alt: "Do Not Touch project preview",
      },
      {
        src: "/projects/day-05/image3.png",
        alt: "Do Not Touch project preview",
      },
      {
        src: "/projects/day-05/image4.png",
        alt: "Do Not Touch project preview",
      },
      {
        src: "/projects/day-05/image5.png",
        alt: "Do Not Touch project preview",
      },
    ],
    liveUrl: "https://day-5-do-not-touch.vercel.app/",
    githubUrl: "https://github.com/Adesmith001/30-days-building-challenge",
    twitterUrl: "https://x.com/yourcoderboy18/status/2096239663874752636",
    learned:
      "I learned how to build a multi-level pointer game with evasive movement, decoy interactions, escalating difficulty, boss states, local personal bests, and shareable result cards.",
  },
  {
    day: 6,
    title: "Danfo Dispatcher",
    tagline:
      "A real-time 3D Lagos transport simulation about keeping the city moving.",
    description:
      "Danfo Dispatcher turns Lagos into a living transport network. Route danfos through changing traffic, board passengers, manage fuel and queue pressure, survive random incidents, and build score through fast deliveries and strong flow.",
    date: "2026-09-06",
    status: "completed",
    stack: [
      "React",
      "TypeScript",
      "Three.js",
      "React Three Fiber",
      "Drei",
      "Tailwind CSS",
      "Motion",
      "LocalStorage",
    ],
    images: [
      {
        src: "/projects/day-06/1.png",
        alt: "Danfo Dispatcher project preview",
      },
      {
        src: "/projects/day-06/2.png",
        alt: "Danfo Dispatcher project preview",
      },
      {
        src: "/projects/day-06/3.png",
        alt: "Danfo Dispatcher project preview",
      },
    ],
    liveUrl: "https://day-6-danfo-dispatcher.vercel.app/",
    githubUrl: "https://github.com/Adesmith001/30-days-building-challenge",
    twitterUrl: "https://x.com/yourcoderboy18/status/2096679849008005448",
    learned:
      "I learned how to combine graph-based routing, real-time simulation state, 3D scene composition, passenger queues, dynamic traffic, events, upgrades, and persistent run records into one playable transport system.",
  },
  {
    day: 7,
    title: "Price Am",
    tagline:
      "A Nigerian price-guessing game that tests how well you know the market.",
    description:
      "Price Am challenges players to estimate the real cost of food, market items, gadgets, home essentials and Lagos life. Score points for accurate guesses, build streaks, track personal records and share your result.",
    date: "2026-09-07",
    status: "completed",
    stack: [
      "React",
      "TypeScript",
      "Tailwind CSS",
      "Lucide",
      "Motion",
      "LocalStorage",
      "html-to-image",
    ],
    images: [
      {
        src: "/projects/day-07/image.png",
        alt: "Price Am project preview",
      },
      {
        src: "/projects/day-07/1.png",
        alt: "Price Am project preview",
      },
      {
        src: "/projects/day-07/2.png",
        alt: "Price Am project preview",
      },
      {
        src: "/projects/day-07/3.png",
        alt: "Price Am project preview",
      },
      {
        src: "/projects/day-07/4.png",
        alt: "Price Am project preview",
      },
      {
        src: "/projects/day-07/5.png",
        alt: "Price Am project preview",
      },
      {
        src: "/projects/day-07/6.png",
        alt: "Price Am project preview",
      }
    ],
    liveUrl: "https://day-7-price-am.vercel.app/",
    githubUrl: "https://github.com/Adesmith001/30-days-building-challenge",
    twitterUrl: "https://x.com/yourcoderboy18/status/2096928711408791905",
    learned:
      "I learned how to build a price-guessing game with local market data, accuracy-based scoring, streaks, persistent records, result sharing and downloadable result cards.",
  },
  {
    day: 8,
    title: "Rubber Duck",
    tagline:
      "A Socratic thinking partner that helps you work through one useful question at a time.",
    description:
      "Rubber Duck turns vague problems into focused conversations. Chat through decisions, work, learning, writing, code and troubleshooting with an AI guide that surfaces assumptions, collects evidence, tracks clarity and helps you reach a practical next step.",
    date: "2026-09-08",
    status: "completed",
    stack: [
      "React",
      "TypeScript",
      "Tailwind CSS",
      "Motion",
      "Groq",
      "LocalStorage",
    ],
    images: [
      {
        src: "/projects/day-08/1.png",
        alt: "Rubber Duck project preview",
      },
      {
        src: "/projects/day-08/2.png",
        alt: "Rubber Duck project preview",
      },
      {
        src: "/projects/day-08/3.png",
        alt: "Rubber Duck project preview",
      },

    ],
    liveUrl: "https://day-8-rubber-duck.vercel.app/",
    githubUrl: "https://github.com/Adesmith001/30-days-building-challenge",
    twitterUrl: "https://x.com/yourcoderboy18/status/2097692255158956517",
    learned:
      "I learned how to build a structured AI conversation with Groq, preserve chat sessions locally, handle incomplete model responses safely, and turn a single-question flow into a more natural back-and-forth thinking experience.",
  },
  {
    day: 9,
    title: "Receipt Radar",
    tagline:
      "A receipt verification tool that turns messy purchases into clear, auditable data.",
    description:
      "Receipt Radar extracts receipt details, checks line items against totals, highlights mismatches, and lets you correct and save verified purchases in a local archive.",
    date: "2026-09-09",
    status: "completed",
    stack: ["React", "TypeScript", "Vite", "LocalStorage"],
    images: [
      {
        src: "/projects/day-09/1.png",
        alt: "Receipt Radar project preview",
      },
      {
        src: "/projects/day-09/2.png",
        alt: "Receipt Radar project preview",
      },
      {
        src: "/projects/day-09/3.png",
        alt: "Receipt Radar project preview",
      },
      {
        src: "/projects/day-09/4.png",
        alt: "Receipt Radar project preview",
      },
      {
        src: "/projects/day-09/5.png",
        alt: "Receipt Radar project preview",
      },
      {
        src: "/projects/day-09/6.png",
        alt: "Receipt Radar project preview",
      },
    ],
    liveUrl: "https://day-9-receipt-radar.vercel.app/",
    githubUrl: "https://github.com/Adesmith001/30-days-building-challenge",
    twitterUrl: "https://x.com/yourcoderboy18/status/2097820307792801976",
    learned:
      "I learned how to build a receipt review workflow with editable extracted data, arithmetic verification flags, confidence scoring, local history, and a resilient demo path when no image is uploaded.",
  },
  {
    day: 10,
    title: "UI X-Ray",
    tagline:
      "A screenshot analyzer that reveals the design system hiding inside any interface.",
    description:
      "UI X-Ray turns a UI screenshot into a practical design system. Upload an interface and inspect its colors, typography, spacing, components, tokens, and reusable visual patterns, then export the analysis for later use.",
    date: "2026-09-10",
    status: "completed",
    stack: [
      "React",
      "TypeScript",
      "Tailwind CSS",
      "Motion",
      "Groq",
      "LocalStorage",
    ],
    images: [
      {
        src: "/projects/day-10/1.png",
        alt: "UI X-Ray project preview",
      },
      {
        src: "/projects/day-10/2.png",
        alt: "UI X-Ray project preview",
      },
      {
        src: "/projects/day-10/3.png",
        alt: "UI X-Ray project preview",
      },
      {
        src: "/projects/day-10/4.png",
        alt: "UI X-Ray project preview",
      },
      {
        src: "/projects/day-10/5.png",
        alt: "UI X-Ray project preview",
      },
      {
        src: "/projects/day-10/6.png",
        alt: "UI X-Ray project preview",
      },
      {
        src: "/projects/day-10/7.png",
        alt: "UI X-Ray project preview",
      },
    ],
    liveUrl: "https://day-10-ui-xray.vercel.app/",
    githubUrl: "https://github.com/Adesmith001/30-days-building-challenge",
    twitterUrl: "https://x.com/yourcoderboy18/status/2098161019818311904",
    learned:
      "I learned how to turn screenshots into structured design-system data with AI, validate and normalize model responses, preserve analysis history locally, and present visual rules as inspectable tokens and reusable components.",
  },
];
