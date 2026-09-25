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
  {
    day: 11,
    title: "Untangle",
    tagline:
      "A thoughtful workspace that turns the noise in your head into one clear next step.",
    description:
      "Untangle helps you dump tasks, ideas, worries, and reminders into one place, then organizes them into focused actions, ideas, and things you can let go of.",
    date: "2026-09-11",
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
        src: "/projects/day-11/1.png",
        alt: "Untangle project preview",
      },
      {
        src: "/projects/day-11/2.png",
        alt: "Untangle project preview",
      },
      {
        src: "/projects/day-11/3.png",
        alt: "Untangle project preview",
      },
      {
        src: "/projects/day-11/4.png",
        alt: "Untangle project preview",
      },
      {
        src: "/projects/day-11/5.png",
        alt: "Untangle project preview",
      },
      {
        src: "/projects/day-11/6.png",
        alt: "Untangle project preview",
      },
      {
        src: "/projects/day-11/7.png",
        alt: "Untangle project preview",
      },
    ],
    liveUrl: "https://day-11-untangle.vercel.app/",
    githubUrl: "https://github.com/Adesmith001/30-days-building-challenge",
    twitterUrl: "https://x.com/yourcoderboy18/status/2098458080958652649",
    learned:
      "I learned how to turn an unstructured brain dump into categorized, prioritized actions with AI, preserve sessions locally, and design a calmer workflow for choosing what deserves attention next.",
  },
  {
    day: 12,
    title: "Either",
    tagline:
      "A focused decision-making tool for choosing between options one comparison at a time.",
    description:
      "Either helps you stop overthinking by turning a long list of options into simple head-to-head choices. Compare, undo, reveal your ranking, and revisit the decisions you have made.",
    date: "2026-09-12",
    status: "completed",
    stack: [
      "React",
      "TypeScript",
      "Tailwind CSS",
      "Motion",
      "Lucide",
      "LocalStorage",
    ],
    images: [
      {
        src: "/projects/day-12/1.png",
        alt: "Either project preview",
      },
      {
        src: "/projects/day-12/2.png",
        alt: "Either project preview",
      },
      {
        src: "/projects/day-12/3.png",
        alt: "Either project preview",
      },
      {
        src: "/projects/day-12/4.png",
        alt: "Either project preview",
      },
      {
        src: "/projects/day-12/5.png",
        alt: "Either project preview",
      },
      {
        src: "/projects/day-12/6.png",
        alt: "Either project preview",
      },
      {
        src: "/projects/day-12/7.png",
        alt: "Either project preview",
      },
    ],
    liveUrl: "https://day-12-either.vercel.app/",
    githubUrl: "https://github.com/Adesmith001/30-days-building-challenge",
    twitterUrl: "https://x.com/yourcoderboy18/status/2098792490606182400",
    learned:
      "I learned how to turn pairwise comparisons into a complete ranking flow, persist an undoable sorting session locally, and make decision history useful after the initial choice is complete.",
  },
  {
    day: 13,
    title: "Later",
    tagline:
      "A calm commitment tracker for deciding what can wait — and knowing when later is now.",
    description:
      "Later gives postponed tasks a clear home. Create commitments, choose an exact time or a softer window, get a notification when they are due, and keep the full postponement history visible without losing context.",
    date: "2026-09-13",
    status: "completed",
    stack: ["React", "TypeScript", "CSS", "LocalStorage", "Notifications API"],
    images: [
      {
        src: "/projects/day-13/1.png",
        alt: "Later project home screen",
      },
      {
        src: "/projects/day-13/2.png",
        alt: "Later project commitment screen",
      },
      {
        src: "/projects/day-13/3.png",
        alt: "Later project scheduling screen",
      },
      {
        src: "/projects/day-13/4.png",
        alt: "Later project dashboard",
      },
      {
        src: "/projects/day-13/5.png",
        alt: "Later project due commitment screen",
      },
      {
        src: "/projects/day-13/6.png",
        alt: "Later project commitment details",
      },
      {
        src: "/projects/day-13/7.png",
        alt: "Later project completed commitment screen",
      },
    ],
    liveUrl: "https://day-13-later.vercel.app/",
    githubUrl: "https://github.com/Adesmith001/30-days-building-challenge",
    twitterUrl: "https://x.com/yourcoderboy18/status/2099170993751081024",
    learned:
      "I learned how to model a commitment through waiting, due, and completed states, keep postponement history useful, schedule browser notifications, and make a time-based workflow feel calm instead of punitive.",
  },
  {
    day: 14,
    title: "Expiry",
    tagline:
      "Private links for messages that should disappear when they have done their job.",
    description:
      "Expiry creates browser-encrypted messages with controlled lifetimes. Share a private link, reveal it once, and keep a private archive of the messages you have created without storing plaintext on the server.",
    date: "2026-09-14",
    status: "completed",
    stack: [
      "React",
      "TypeScript",
      "Vite",
      "Supabase",
      "AES-GCM",
      "Vercel Functions",
    ],
    images: [
      {
        src: "/projects/day-14/01-login-desktop.png",
        alt: "Expiry login screen",
      },
      {
        src: "/projects/day-14/02-create-desktop.png",
        alt: "Expiry create message screen",
      },
      {
        src: "/projects/day-14/03-ready-desktop.png",
        alt: "Expiry private link ready screen",
      },
      {
        src: "/projects/day-14/04-pre-reveal-desktop.png",
        alt: "Expiry private message reveal screen",
      },
      {
        src: "/projects/day-14/05-revealed-desktop.png",
        alt: "Expiry revealed message screen",
      },
      {
        src: "/projects/day-14/06-gone-desktop.png",
        alt: "Expiry expired message screen",
      },
      {
        src: "/projects/day-14/07-create-mobile.png",
        alt: "Expiry mobile create message screen",
      },
      {
        src: "/projects/day-14/08-history-mobile.png",
        alt: "Expiry mobile history screen",
      },
    ],
    liveUrl: "https://day-14-expiry.vercel.app/",
    githubUrl: "https://github.com/Adesmith001/30-days-building-challenge",
    twitterUrl: "https://x.com/yourcoderboy18/status/2099576696458338673",
    learned:
      "I learned how to encrypt messages in the browser with AES-GCM, build one-time reveal and expiry flows, protect lifecycle operations with serverless functions and Supabase, and keep creator history separate from message content.",
  },
  {
    day: 15,
    title: "Rent Is Lava",
    tagline:
      "A 12-month financial survival simulator for staying ready when rent is due.",
    description:
      "Rent Is Lava turns budgeting into a seeded survival run. Balance income, normal expenses, emergency buffers, and rent savings across a simulated year while unexpected costs and difficult choices test your stability.",
    date: "2026-09-15",
    status: "completed",
    stack: [
      "React",
      "TypeScript",
      "Vite",
      "Tailwind CSS",
      "Motion",
      "LocalStorage",
    ],
    images: [
      {
        src: "/projects/day-15/1.png",
        alt: "Rent Is Lava project preview",
      },
      {
        src: "/projects/day-15/2.png",
        alt: "Rent Is Lava project preview",
      },
      {
        src: "/projects/day-15/3.png",
        alt: "Rent Is Lava project preview",
      },
      {
        src: "/projects/day-15/4.png",
        alt: "Rent Is Lava project preview",
      },
      {
        src: "/projects/day-15/5.png",
        alt: "Rent Is Lava project preview",
      },
      {
        src: "/projects/day-15/6.png",
        alt: "Rent Is Lava project preview",
      },
      {
        src: "/projects/day-15/7.png",
        alt: "Rent Is Lava project preview",
      },
      {
        src: "/projects/day-15/8.png",
        alt: "Rent Is Lava project preview",
      },
      {
        src: "/projects/day-15/9.png",
        alt: "Rent Is Lava project preview",
      },
      {
        src: "/projects/day-15/10.png",
        alt: "Rent Is Lava project preview",
      },
    ],
    liveUrl: "https://day-15-rent-is-lava.vercel.app/",
    githubUrl: "https://github.com/Adesmith001/30-days-building-challenge",
    twitterUrl: "",
    learned:
      "I learned how to model a seeded 12-month financial simulation, turn unexpected costs into meaningful funding decisions, and score stability across rent readiness, spending, buffers, and deficits.",
  },
  {
    day: 16,
    title: "Farther Away",
    tagline:
      "A financial planning simulator for seeing how today's choices shape the year ahead.",
    description:
      "Farther Away turns long-term financial planning into an interactive scenario. Explore income, spending, savings, and trade-offs across a full year to understand what it takes to move a little farther from financial uncertainty.",
    date: "2026-09-16",
    status: "completed",
    stack: ["React", "TypeScript", "Vite", "CSS", "LocalStorage"],
    images: [
      { src: "/projects/day-16/1.png", alt: "Farther Away project preview" },
      { src: "/projects/day-16/2.png", alt: "Farther Away project preview" },
      { src: "/projects/day-16/3.png", alt: "Farther Away project preview" },
      { src: "/projects/day-16/4.png", alt: "Farther Away project preview" },
      { src: "/projects/day-16/5.png", alt: "Farther Away project preview" },
      { src: "/projects/day-16/6.png", alt: "Farther Away project preview" },
      { src: "/projects/day-16/7.png", alt: "Farther Away project preview" },
    ],
    liveUrl: "https://day-16-farther-away.vercel.app/",
    githubUrl: "https://github.com/Adesmith001/30-days-building-challenge",
    twitterUrl: "https://x.com/yourcoderboy18/status/2100300816712089984?s=20",
    learned:
      "I learned how to turn a long-term financial model into a clear interactive experience, make scenario trade-offs legible, and use a year-at-a-glance view to connect small decisions with future outcomes.",
  },
  {
    day: 17,
    title: "Sabi Search",
    tagline:
      "A Nigerian word game for finding the Naija word hiding inside the clue.",
    description:
      "Sabi Search gives you a meaning, context, or bit of street wisdom and five tries to find the Nigerian word behind it. Play the shared Daily Sabi, run endless random rounds, use one contextual hint, track your streak locally, and share your score.",
    date: "2026-09-17",
    status: "completed",
    stack: [
      "React",
      "TypeScript",
      "Vite",
      "Tailwind CSS",
      "Motion",
      "Lucide",
      "LocalStorage",
      "Web Share API",
    ],
    images: [
      { src: "/projects/day-17/1.png", alt: "Sabi Search home screen" },
      { src: "/projects/day-17/2.png", alt: "Sabi Search daily game screen" },
      { src: "/projects/day-17/3.png", alt: "Sabi Search clue screen" },
      { src: "/projects/day-17/4.png", alt: "Sabi Search keyboard screen" },
      { src: "/projects/day-17/5.png", alt: "Sabi Search result screen" },
      { src: "/projects/day-17/6.png", alt: "Sabi Search stats screen" },
    ],
    liveUrl: "https://day-17-sabi-search.vercel.app/",
    githubUrl: "https://github.com/Adesmith001/30-days-building-challenge",
    twitterUrl: "https://x.com/yourcoderboy18/status/2100490242817991118?s=20",
    learned:
      "I learned how to build a Wordle-style word game around Nigerian language and culture, seed a shared daily puzzle, evaluate repeated letters correctly, persist local stats, and add shareable results without a backend.",
  },
  {
    day: 18,
    title: "Sorted.",
    tagline:
      "A visual ordering game that tests how well you know what comes first.",
    description:
      "Sorted. challenges you to put four things in the correct order across daily, blind, category, and gap-sorting modes. Play through topics from Nigerian culture to science, learn from each reveal, and track your runs locally.",
    date: "2026-09-18",
    status: "completed",
    stack: [
      "React",
      "TypeScript",
      "Vite",
      "Tailwind CSS",
      "Motion",
      "LocalStorage",
      "html-to-image",
    ],
    images: [
      { src: "/projects/day-18/1.png", alt: "Sorted. project preview" },
      { src: "/projects/day-18/2.png", alt: "Sorted. project preview" },
      { src: "/projects/day-18/3.png", alt: "Sorted. project preview" },
      { src: "/projects/day-18/4.png", alt: "Sorted. project preview" },
      { src: "/projects/day-18/5.png", alt: "Sorted. project preview" },
    ],
    liveUrl: "https://day-18-sorted.vercel.app/",
    githubUrl: "https://github.com/Adesmith001/30-days-building-challenge",
    twitterUrl: "https://x.com/yourcoderboy18/status/2101349750096216224",
    learned:
      "I learned how to turn factual ordering puzzles into a reusable game loop, build multiple sorting modes, seed daily runs, persist local history, and generate shareable result cards in the browser.",
  },
  {
    day: 19,
    title: "Beat Your Browser",
    tagline:
      "A browser performance lab that shows what your device can do under real interactive workloads.",
    description:
      "Beat Your Browser runs calibrated benchmark workloads in the main thread and a Web Worker, then compares the results across guided experiments and an open lab. Explore rendering, computation, and responsiveness without treating the results as a universal device ranking.",
    date: "2026-09-19",
    status: "completed",
    stack: [
      "React",
      "TypeScript",
      "Vite",
      "Tailwind CSS",
      "Motion",
      "Web Workers",
      "Canvas",
      "LocalStorage",
    ],
    images: [
      { src: "/projects/day-19/1.png", alt: "Beat Your Browser project preview" },
      { src: "/projects/day-19/2.png", alt: "Beat Your Browser project preview" },
      { src: "/projects/day-19/3.png", alt: "Beat Your Browser project preview" },
      { src: "/projects/day-19/4.png", alt: "Beat Your Browser project preview" },
      { src: "/projects/day-19/5.png", alt: "Beat Your Browser project preview" },
      { src: "/projects/day-19/6.png", alt: "Beat Your Browser project preview" },
      { src: "/projects/day-19/7.png", alt: "Beat Your Browser project preview" },
    ],
    liveUrl: "https://day-19-beat-your-browser.vercel.app/",
    githubUrl: "https://github.com/Adesmith001/30-days-building-challenge",
    twitterUrl: "https://x.com/yourcoderboy18/status/2101350054988583401",
    learned:
      "I learned how to build a calibrated browser benchmark with deterministic workloads, compare main-thread and worker execution, keep high-frequency measurements out of React state, and present performance results with the right caveats.",
  },
  {
    day: 20,
    title: "Network Weather",
    tagline:
      "A plain-language network diagnostic that turns connection quality into a weather report.",
    description:
      "Network Weather measures latency, jitter, failed requests, download speed, and upload speed against a remote test API. Quick checks summarize current conditions, while deep scans, live monitoring, and local history make changes easier to understand over time.",
    date: "2026-09-20",
    status: "completed",
    stack: [
      "React",
      "TypeScript",
      "Vite",
      "Vercel Functions",
      "Network Information API",
      "LocalStorage",
    ],
    images: [
      { src: "/projects/day-20/1.png", alt: "Network weatherproject preview" },
      { src: "/projects/day-20/2.png", alt: "Network weatherproject preview" },
      { src: "/projects/day-20/3.png", alt: "Network weatherproject preview" },
      { src: "/projects/day-20/4.png", alt: "Network weatherproject preview" },

    ],
    liveUrl: "https://day-20-network-weather.vercel.app/",
    githubUrl: "https://github.com/Adesmith001/30-days-building-challenge",
    twitterUrl: "",
    learned:
      "I learned how to separate browser estimates from measured throughput, avoid misleading localhost speed tests, build adaptive download and upload checks against a remote endpoint, and translate latency, jitter, and failures into useful network conditions.",
  },
  {
    day: 21,
    title: "State Fight",
    tagline:
      "A Nigerian state battle game where real data decides which stronghold wins.",
    description:
      "State Fight turns facts about Nigeria's states into head-to-head battles. Compare population, land area, density, local governments, and history across campaign, daily, and sudden-death modes while unlocking every state in the atlas.",
    date: "2026-09-21",
    status: "completed",
    stack: [
      "React",
      "TypeScript",
      "Vite",
      "Tailwind CSS",
      "Motion",
      "LocalStorage",
      "html-to-image",
    ],
    images: [
      { src: "/projects/day-21/1.png", alt: "State Fight project preview" },
      { src: "/projects/day-21/2.png", alt: "State Fight project preview" },
      { src: "/projects/day-21/3.png", alt: "State Fight project preview" },
      { src: "/projects/day-21/4.png", alt: "State Fight project preview" },
      { src: "/projects/day-21/5.png", alt: "State Fight project preview" },
      { src: "/projects/day-21/6.png", alt: "State Fight project preview" },
    ],
    liveUrl: "https://day-21-state-fight.vercel.app/",
    githubUrl: "https://github.com/Adesmith001/30-days-building-challenge",
    twitterUrl: "",
    learned:
      "I learned how to turn real Nigerian state data into a replayable comparison game, generate deterministic battle decks, model campaign and sudden-death modes, persist player progress locally, and reveal facts through an unlockable state atlas.",
  },
  {
    day: 22,
    title: "GitCity",
    tagline:
      "An explorable 3D city generated from a year of GitHub contributions.",
    description:
      "GitCity turns contribution days into city lots, repositories into landmarks, and activity patterns into a navigable skyline with camera presets, profile statistics, temporal layers, and responsive controls.",
    date: "2026-09-22",
    status: "completed",
    stack: [
      "Next.js",
      "React",
      "TypeScript",
      "Three.js",
      "React Three Fiber",
      "Drei",
      "Tailwind CSS",
      "GitHub GraphQL API",
    ],
    images: [
      { src: "/projects/day-22/1.png", alt: "GitCity landing page" },
      { src: "/projects/day-22/2.png", alt: "GitCity contribution skyline overview" },
      { src: "/projects/day-22/3.png", alt: "GitCity street-level camera view" },
      { src: "/projects/day-22/4.png", alt: "GitCity city hall camera view" },
    ],
    liveUrl: "https://gitcityy.vercel.app/",
    githubUrl: "https://github.com/Adesmith001/30-days-building-challenge",
    twitterUrl: "",
    learned:
      "I learned how to transform GitHub contribution data into deterministic 3D geometry, coordinate React state with a Three.js camera, layer temporal comparisons onto a live scene, and keep a dense WebGL interface usable across desktop and mobile screens.",
  },
  {
    day: 23,
    title: "Architecture Interviewer",
    tagline:
      "A streamed AI architecture interview that turns an idea into a defensible system design.",
    description:
      "Architecture Interviewer guides you through requirements, constraints, trade-offs, scale, risks, and open questions in a persistent architecture interview. It saves conversations, extracts structured design state, generates Mermaid diagrams, and produces a final review you can export.",
    date: "2026-09-23",
    status: "completed",
    stack: [
      "Next.js",
      "React",
      "TypeScript",
      "Tailwind CSS",
      "Supabase",
      "Groq",
      "Mermaid",
    ],
    images: [
      { src: "/projects/day-23/1.png", alt: "Architecture Interviewer landing page" },
      { src: "/projects/day-23/2.png", alt: "Architecture Interviewer chat interface" },
      { src: "/projects/day-23/3.png", alt: "Architecture Interviewer architecture diagram" },
      { src: "/projects/day-23/4.png", alt: "Architecture Interviewer review interface" },
    ],
    liveUrl: "https://day-23-architecture-interviewer.vercel.app/",
    githubUrl: "https://github.com/Adesmith001/30-days-building-challenge",
    twitterUrl: "",
    learned:
      "I learned how to build a streamed AI workflow with Supabase persistence, structured interview state, authenticated conversation history, Mermaid diagram generation, and review/export flows around one continuous architecture conversation.",
  },
  {
    day: 24,
    title: "JSON Surgery",
    tagline:
      "A local-first transformation workbench for turning messy JSON into useful data.",
    description:
      "JSON Surgery lets you paste or load JSON, compose readable transformation steps, preview the result live, and generate a matching JavaScript transform without sending source data to a server.",
    date: "2026-09-24",
    status: "completed",
    stack: [
      "Next.js",
      "React",
      "TypeScript",
      "Tailwind CSS",
      "Vitest",
      "Local-first browser APIs",
    ],
    images: [
      { src: "/projects/day-24/1.png", alt: "JSON Surgery input and transformation workbench" },
      { src: "/projects/day-24/2.png", alt: "JSON Surgery pipeline steps and output preview" },
      { src: "/projects/day-24/3.png", alt: "JSON Surgery generated JavaScript output" },
    ],
    liveUrl: "https://day-24-json-surgery.vercel.app/",
    githubUrl: "https://github.com/Adesmith001/30-days-building-challenge",
    twitterUrl: "",
    learned:
      "I learned how to model JSON transformations as a deterministic pipeline, keep the internal executor aligned with generated JavaScript, and design a local-first data tool that makes each step inspectable and reversible.",
  },
  {
    day: 25,
    title: "Who Broke Prod?",
    tagline:
      "A production-incident investigation game for finding the signal before the outage finds you.",
    description:
      "Who Broke Prod? puts you on call during deterministic production incidents. Correlate telemetry, logs, traces, deployments, and system state, pin evidence, test hypotheses, choose mitigations, verify recovery, and submit a scored root-cause analysis.",
    date: "2026-09-25",
    status: "completed",
    stack: [
      "React",
      "TypeScript",
      "Vite",
      "Tailwind CSS",
      "Zustand",
      "Recharts",
      "Motion",
      "Lucide React",
      "Vitest",
    ],
    images: [
        { src: "/projects/day-25/1.png", alt: "Who broke prod? landing screen" },
      { src: "/projects/day-25/2.png", alt: "Who broke prod? screen 2" },
      { src: "/projects/day-25/3.png", alt: "Who broke prod? screen 3" },
      { src: "/projects/day-25/4.png", alt: "Who broke prod? screen 4" },
    ],
    liveUrl: "https://day-25-who-broke-prodd.netlify.app/",
    githubUrl: "https://github.com/Adesmith001/30-days-building-challenge",
    twitterUrl: "",
    learned:
      "I learned how to model production incidents as deterministic simulations, generate correlated observability data, persist resumable investigations locally, and turn evidence, mitigation choices, recovery verification, and root-cause analysis into an explainable score.",
  },
  {
    day: 26,
    title: "10,000 Danfos",
    tagline:
      "A 10,000-agent Lagos traffic simulation built as an interactive spatial-search engineering game.",
    description:
      "10,000 Danfos turns a live Three.js city into a technical playground. Calibrate the simulation to your device, scale traffic from 500 to 10,000 vehicles, compare grid, brute-force, and quadtree neighbour search, place roadblocks, inspect agents, reveal flow and density, run benchmarks, and export the result.",
    date: "2026-09-26",
    status: "completed",
    stack: [
      "Vite",
      "React",
      "TypeScript",
      "Three.js",
      "React Three Fiber",
      "Zustand",
      "Web Workers",
      "Vitest",
    ],
    images: [
      { src: "/projects/day-26/1.png", alt: "10,000 Danfos cinematic landing screen" },
      { src: "/projects/day-26/2.png", alt: "Live Lagos-inspired traffic simulation city" },
      { src: "/projects/day-26/3.png", alt: "10,000 Danfos spatial search engine panel" },
    ],
    liveUrl: "https://day-26-10000-danfos.netlify.app/",
    githubUrl: "https://github.com/Adesmith001/30-days-building-challenge",
    twitterUrl: "",
    learned:
      "I learned how to keep 10,000 moving agents outside React state, share typed-array snapshots from a worker, render vehicles with instancing, compare spatial data structures with real counters, and turn a performance experiment into a responsive interactive game.",
  },
];
