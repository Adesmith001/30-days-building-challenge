import { useState } from "react";

const GAME_KEY =
  "farther-away-game-v1";

const rewards: Record<
  string,
  {
    xp: number;
    label: string;
  }
> = {
  routine: {
    xp: 10,
    label: "ROUTINE LOCKED IN",
  },

  homes: {
    xp: 20,
    label: "TWO HOMES COMPARED",
  },

  money: {
    xp: 8,
    label: "MONEY LENS OPENED",
  },

  time: {
    xp: 10,
    label: "TIME LENS OPENED",
  },

  breakEven: {
    xp: 12,
    label: "BREAK-EVEN FOUND",
  },

  whatIf: {
    xp: 10,
    label: "SCENARIO MODE",
  },

  remote: {
    xp: 10,
    label: "REMOTE RETHINK",
  },

  timeValue: {
    xp: 10,
    label: "TIME VALUE TESTED",
  },

  save: {
    xp: 5,
    label: "COMPARISON SAVED",
  },

  share: {
    xp: 5,
    label: "TRADE-OFF SHARED",
  },
};

interface GameState {
  unlocked: string[];
}

function readGame(): GameState {
  try {
    const raw =
      localStorage.getItem(
        GAME_KEY,
      );

    return raw
      ? JSON.parse(raw)
      : {
          unlocked: [],
        };
  } catch {
    return {
      unlocked: [],
    };
  }
}

export function useGame() {
  const [state, setState] =
    useState<GameState>(
      () => readGame(),
    );

  const [toast, setToast] =
    useState<string | null>(
      null,
    );

  const xp =
    state.unlocked.reduce(
      (sum, id) =>
        sum +
        (rewards[id]?.xp ?? 0),
      0,
    );

  const unlock = (
    id: string,
  ) => {
    if (
      !rewards[id] ||
      state.unlocked.includes(id)
    ) {
      return;
    }

    const next = {
      unlocked: [
        ...state.unlocked,
        id,
      ],
    };

    setState(next);

    localStorage.setItem(
      GAME_KEY,
      JSON.stringify(next),
    );

    setToast(
      `+${rewards[id].xp} XP · ${rewards[id].label}`,
    );

    window.setTimeout(
      () => setToast(null),
      2200,
    );
  };

  return {
    xp: Math.min(100, xp),
    toast,
    unlock,
  };
}