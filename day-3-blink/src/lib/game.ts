import {
  airportPairs,
  artists,
  checkoutItems,
  cities,
  colours,
  songNames,
  weatherConditions,
} from "../data/stimulusContent";
import type {
  Question,
  QuestionCategory,
  Stimulus,
  TemplateType,
} from "../types/game";
import {
  randomInt,
  randomItem,
  shuffle,
} from "./utils";

const templates: TemplateType[] = [
  "analytics",
  "checkout",
  "flight",
  "music",
  "weather",
];

function makeOptions(
  correct: string,
  distractors: string[],
) {
  return shuffle([correct, ...distractors.slice(0, 3)]).map(
    (label, index) => ({
      id: `${index}-${label}`,
      label,
    }),
  );
}

function analyticsStimulus(): Stimulus {
  const revenue = randomInt(42, 96) / 10;
  const revenueLabel = `₦${revenue.toFixed(1)}M`;

  const distractors = [
    `₦${(revenue + 0.5).toFixed(1)}M`,
    `₦${Math.max(1, revenue - 2).toFixed(1)}M`,
    `₦${(revenue + 1.2).toFixed(1)}M`,
  ];

  const question: Question = {
    prompt: "WHAT WAS THE REVENUE?",
    category: "number",
    correctAnswer: revenueLabel,
    options: makeOptions(revenueLabel, distractors),
    focusKey: "revenue",
  };

  return {
    id: crypto.randomUUID(),
    template: "analytics",
    data: {
      revenue: revenueLabel,
      growth: `+${randomInt(8, 24)}.${randomInt(1, 9)}%`,
      activeUsers: randomInt(800, 2400),
    },
    question,
  };
}

function checkoutStimulus(): Stimulus {
  const item = randomItem(checkoutItems);
  const total = randomInt(18, 94) * 1000;
  const totalLabel = `₦${total.toLocaleString()}`;
  const buttonColour = randomItem(colours);
  const askColour = Math.random() > 0.5;

  const question: Question = askColour
    ? {
        prompt: "WHAT COLOUR WAS THE MAIN BUTTON?",
        category: "colour",
        correctAnswer: buttonColour,
        options: makeOptions(
          buttonColour,
          shuffle(
            colours.filter((colour) => colour !== buttonColour),
          ),
        ),
        focusKey: "buttonColour",
      }
    : {
        prompt: "WHAT WAS THE TOTAL?",
        category: "number",
        correctAnswer: totalLabel,
        options: makeOptions(totalLabel, [
          `₦${(total + 5000).toLocaleString()}`,
          `₦${Math.max(1000, total - 7000).toLocaleString()}`,
          `₦${(total + 12000).toLocaleString()}`,
        ]),
        focusKey: "total",
      };

  return {
    id: crypto.randomUUID(),
    template: "checkout",
    data: {
      item,
      quantity: randomInt(1, 3),
      total: totalLabel,
      buttonColour,
    },
    question,
  };
}

function flightStimulus(): Stimulus {
  const [from, to] = randomItem(airportPairs);
  const seat = `${randomInt(2, 28)}${randomItem(["A", "C", "D", "F"])}`;

  return {
    id: crypto.randomUUID(),
    template: "flight",
    data: {
      from,
      to,
      seat,
      gate: `G${randomInt(2, 19)}`,
      time: `${randomInt(6, 22)}:${randomItem(["00", "15", "30", "45"])}`,
    },
    question: {
      prompt: "WHICH SEAT WAS SHOWN?",
      category: "text",
      correctAnswer: seat,
      options: makeOptions(seat, [
        `${randomInt(2, 28)}A`,
        `${randomInt(2, 28)}C`,
        `${randomInt(2, 28)}F`,
      ]),
      focusKey: "seat",
    },
  };
}

function musicStimulus(): Stimulus {
  const trackIndex = randomInt(0, songNames.length - 1);
  const song = songNames[trackIndex];
  const artist = artists[trackIndex];

  return {
    id: crypto.randomUUID(),
    template: "music",
    data: {
      song,
      artist,
      duration: `${randomInt(2, 4)}:${randomInt(10, 58)}`,
      plays: `${randomInt(12, 98)}K`,
    },
    question: {
      prompt: "WHICH SONG WAS PLAYING?",
      category: "text",
      correctAnswer: song,
      options: makeOptions(
        song,
        shuffle(songNames.filter((name) => name !== song)),
      ),
      focusKey: "song",
    },
  };
}

function weatherStimulus(): Stimulus {
  const city = randomItem(cities);
  const temperature = `${randomInt(21, 34)}°`;

  return {
    id: crypto.randomUUID(),
    template: "weather",
    data: {
      city,
      temperature,
      condition: randomItem(weatherConditions),
      humidity: `${randomInt(45, 89)}%`,
    },
    question: {
      prompt: "WHICH CITY WAS SHOWN?",
      category: "text",
      correctAnswer: city,
      options: makeOptions(
        city,
        shuffle(cities.filter((item) => item !== city)),
      ),
      focusKey: "city",
    },
  };
}

export function generateStimulus(): Stimulus {
  const template: TemplateType = randomItem(templates);

  const generators: Record<TemplateType, () => Stimulus> = {
    analytics: analyticsStimulus,
    checkout: checkoutStimulus,
    flight: flightStimulus,
    music: musicStimulus,
    weather: weatherStimulus,
  };

  return generators[template]();
}

export function getSpeedMultiplier(exposure: number) {
  if (exposure <= 150) return 3;
  if (exposure <= 200) return 2.5;
  if (exposure <= 250) return 2;
  if (exposure <= 300) return 1.6;
  if (exposure <= 350) return 1.4;
  if (exposure <= 400) return 1.2;

  return 1;
}

export function getStreakMultiplier(streak: number) {
  if (streak >= 5) return 2;
  if (streak === 4) return 1.5;
  if (streak === 3) return 1.25;
  if (streak === 2) return 1.1;

  return 1;
}

export function calculateRoundScore(
  exposure: number,
  streak: number,
) {
  return Math.round(
    100 *
      getSpeedMultiplier(exposure) *
      getStreakMultiplier(streak),
  );
}

const speedSteps = [
  500,
  450,
  400,
  350,
  300,
  250,
  200,
  150,
];

export function getNextExposure(
  exposure: number,
  correct: boolean,
) {
  const current = speedSteps.indexOf(exposure);

  if (correct) {
    return speedSteps[Math.min(current + 1, speedSteps.length - 1)];
  }

  return speedSteps[Math.max(current - 1, 0)];
}

export function calculateCategoryScore(
  results: {
    category: QuestionCategory;
    correct: boolean;
  }[],
  category: QuestionCategory,
) {
  const matching = results.filter(
    (result) => result.category === category,
  );

  if (!matching.length) {
    return 0;
  }

  const correct = matching.filter(
    (result) => result.correct,
  ).length;

  return Math.round((correct / matching.length) * 100);
}