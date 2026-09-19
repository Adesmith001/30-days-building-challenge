import {
  useState,
} from "react";

import {
  AppShell,
} from "../components/AppShell";

import {
  PrimaryButton,
} from "../components/PrimaryButton";

import {
  markTutorialSeen,
} from "../lib/storage";

const tiles = [
  "A",
  "B",
  "C",
  "D",
];

export function TutorialScreen({
  onDone,
  onHome,
}: {
  onDone: () => void;
  onHome: () => void;
}) {
  const [
    order,
    setOrder,
  ] =
    useState<string[]>(
      [],
    );

  const [
    revealed,
    setRevealed,
  ] =
    useState(false);

  const select = (
    tile: string,
  ) => {
    if (
      !order.includes(
        tile,
      ) &&
      !revealed
    ) {
      setOrder(
        (current) => [
          ...current,
          tile,
        ],
      );
    }
  };

  const finish = () => {
    markTutorialSeen();
    onDone();
  };

  return (
    <AppShell
      hideNav
      onNavigate={() =>
        onHome()
      }
    >
      <div
        className="
          flex
          flex-1
          flex-col
          justify-center
          space-y-5
        "
      >
        <div
          className="
            text-center
          "
        >
          <span
            className="
              font-display
              text-xs
              font-bold
              tracking-widest
              text-emerald-300
            "
          >
            20 SECOND TUTORIAL
          </span>

          <h1
            className="
              mt-2
              font-display
              text-3xl
              font-bold
              text-gold
            "
          >
            OLDEST → NEWEST
          </h1>

          <p
            className="
              mt-2
              text-sm
              text-slate-300
            "
          >
            {revealed
              ? "THAT'S IT."
              : order.length ===
                  4
                ? "LOCK IT."
                : "TAP THEM IN ORDER."}
          </p>
        </div>

        {!revealed && (
          <div
            className="
              grid
              grid-cols-2
              gap-3
            "
          >
            {tiles.map(
              (tile) => {
                const position =
                  order.indexOf(
                    tile,
                  );

                return (
                  <button
                    key={tile}
                    onClick={() =>
                      select(
                        tile,
                      )
                    }
                    disabled={
                      position >=
                      0
                    }
                    className="
                      tactile-tile
                      relative
                      aspect-square
                      rounded-2xl
                      bg-white
                      font-display
                      text-4xl
                      font-bold
                      text-ink
                      disabled:opacity-40
                    "
                  >
                    {tile}

                    {position >=
                      0 && (
                      <span
                        className="
                          absolute
                          right-3
                          top-3
                          text-xs
                          text-amber-600
                        "
                      >
                        #
                        {position +
                          1}
                      </span>
                    )}
                  </button>
                );
              },
            )}
          </div>
        )}

        <div
          className="
            grid
            grid-cols-4
            gap-2
          "
        >
          {(revealed
            ? tiles
            : [
                0,
                1,
                2,
                3,
              ].map(
                (index) =>
                  order[
                    index
                  ],
              )
          ).map(
            (
              tile,
              index,
            ) => (
              <div
                key={index}
                className="
                  recessed
                  flex
                  h-20
                  items-center
                  justify-center
                  rounded-xl
                  border
                  border-white/10
                  bg-well
                "
              >
                {tile ? (
                  <span
                    className="
                      rounded-lg
                      bg-white
                      px-4
                      py-3
                      font-display
                      text-xl
                      font-bold
                      text-ink
                    "
                  >
                    {tile}
                  </span>
                ) : (
                  <span
                    className="
                      font-display
                      text-xl
                      font-bold
                      text-slate-700
                    "
                  >
                    {index + 1}
                  </span>
                )}
              </div>
            ),
          )}
        </div>

        {!revealed ? (
          <PrimaryButton
            disabled={
              order.length !==
              4
            }
            onClick={() =>
              setRevealed(
                true,
              )
            }
          >
            LOCK ORDER →
          </PrimaryButton>
        ) : (
          <div
            className="
              space-y-3
            "
          >
            <div
              className="
                rounded-2xl
                border
                border-emerald-400/30
                bg-emerald-400/10
                p-4
                text-center
              "
            >
              <strong
                className="
                  font-display
                  text-xl
                "
              >
                PERFECT ORDER.
              </strong>

              <p
                className="
                  mt-1
                  text-sm
                  text-slate-300
                "
              >
                Tap, lock,
                watch the
                correction,
                move on.
              </p>
            </div>

            <PrimaryButton
              onClick={
                finish
              }
            >
              PLAY →
            </PrimaryButton>
          </div>
        )}
      </div>
    </AppShell>
  );
}