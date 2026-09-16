import {
  useState,
} from "react";

import {
  motion,
} from "motion/react";

import ResultStrip from "../components/ResultStrip";
import ScenarioSlider from "../components/ScenarioSlider";

import {
  timeAdjustedCost,
} from "../lib/calculations";

import {
  formatNaira,
  formatNairaCompact,
} from "../lib/currency";

import type {
  ComparisonDraft,
  ComparisonMetrics,
  ComparisonPrefs,
} from "../types/comparison";

type Control =
  | "rent"
  | "commute"
  | "remote"
  | "time";

interface Props {
  draft: ComparisonDraft;
  metrics: ComparisonMetrics;
  prefs: ComparisonPrefs;

  onDraftChange:
    (draft: ComparisonDraft) => void;

  onPrefsChange:
    (prefs: ComparisonPrefs) => void;

  onExplore:
    (
      kind:
        | "whatIf"
        | "remote"
        | "timeValue",
    ) => void;

  onReset: () => void;
}

export default function WhatIfView({
  draft,
  metrics,
  prefs,
  onDraftChange,
  onPrefsChange,
  onExplore,
  onReset,
}: Props) {
  const [
    control,
    setControl,
  ] = useState<Control>("rent");

  const setHomeB = (
    patch:
      Partial<
        ComparisonDraft["homeB"]
      >,
  ) => {
    onDraftChange({
      ...draft,

      homeB: {
        ...draft.homeB,
        ...patch,
      },
    });
  };

  const setRoutine = (
    patch:
      Partial<
        ComparisonDraft["routine"]
      >,
  ) => {
    onDraftChange({
      ...draft,

      routine: {
        ...draft.routine,
        ...patch,
      },
    });
  };

  const adjustedA =
    timeAdjustedCost(
      metrics.homeA.annualCashCost,
      metrics.homeA.annualCommuteHours,
      prefs.hourlyValue,
    );

  const adjustedB =
    timeAdjustedCost(
      metrics.homeB.annualCashCost,
      metrics.homeB.annualCommuteHours,
      prefs.hourlyValue,
    );

  const cashDiff =
    metrics.homeA.annualCashCost -
    metrics.homeB.annualCashCost;

  const adjustedDiff =
    adjustedA -
    adjustedB;

  const flipped =
    prefs.valueTimeEnabled &&
    Math.sign(cashDiff) !== 0 &&
    Math.sign(adjustedDiff) !== 0 &&
    Math.sign(cashDiff) !==
      Math.sign(adjustedDiff);

  const controls: {
    id: Control;
    label: string;
  }[] = [
    {
      id: "rent",
      label: "RENT",
    },
    {
      id: "commute",
      label: "COMMUTE",
    },
    {
      id: "remote",
      label: "REMOTE WORK",
    },
    {
      id: "time",
      label: "TIME VALUE",
    },
  ];

  return (
    <motion.div
      initial={{
        opacity: 0,
      }}
      animate={{
        opacity: 1,
      }}
      className="space-y-8"
    >
      <header
        className="
          flex
          flex-wrap
          items-end
          justify-between
          gap-4
        "
      >
        <div>
          <p
            className="
              font-mono
              text-[10px]
              text-muted
            "
          >
            SCENARIO LAB //
            LIVE MODEL
          </p>

          <h1
            className="
              mt-2
              font-serif
              text-5xl
            "
          >
            WHAT IF?
          </h1>

          <p
            className="
              mt-3
              max-w-xl
              text-sm
              text-muted
            "
          >
            Change one assumption
            at a time. The central
            trade-off updates
            immediately.
          </p>
        </div>

        <button
          onClick={onReset}
          className="
            border
            border-line
            px-4
            py-2
            font-mono
            text-[10px]
            hover:border-ink
          "
        >
          RESET SCENARIO
        </button>
      </header>

      <ResultStrip
        cashSavingsB={
          metrics.cashSavingsB
        }
        extraHoursB={
          metrics.extraHoursB
        }
        bName={
          draft.homeB.name
        }
      />

      <div
        className="
          flex
          gap-5
          overflow-x-auto
          border-b
          border-line
        "
      >
        {controls.map(
          (item) => (
            <button
              key={item.id}
              onClick={() =>
                setControl(
                  item.id,
                )
              }
              className={`
                whitespace-nowrap
                border-b-2
                pb-3
                text-[10px]
                font-semibold
                tracking-[0.08em]
                ${
                  control === item.id
                    ? "border-cobalt text-cobalt"
                    : "border-transparent text-muted"
                }
              `}
            >
              {item.label}
            </button>
          ),
        )}
      </div>

      <div
        className="
          max-w-3xl
        "
      >
        {control === "rent" && (
          <ScenarioSlider
            label="HOME B ANNUAL RENT"
            value={
              draft.homeB
                .annualRent
            }
            min={500_000}
            max={5_000_000}
            step={50_000}
            display={
              formatNaira(
                draft.homeB
                  .annualRent,
              )
            }
            left="₦500K"
            right="₦5M"
            onChange={(
              value,
            ) => {
              setHomeB({
                annualRent:
                  value,
              });

              onExplore(
                "whatIf",
              );
            }}
          />
        )}

        {control ===
          "commute" && (
          <ScenarioSlider
            label="HOME B ONE-WAY COMMUTE"
            value={
              draft.homeB
                .oneWayMinutes
            }
            min={0}
            max={180}
            step={5}
            display={
              `${draft.homeB.oneWayMinutes} MIN`
            }
            left="0 MIN"
            right="180 MIN"
            onChange={(
              value,
            ) => {
              setHomeB({
                oneWayMinutes:
                  value,
              });

              onExplore(
                "whatIf",
              );
            }}
          />
        )}

        {control ===
          "remote" && (
          <ScenarioSlider
            label="REMOTE DAYS / WEEK"
            value={
              draft.routine
                .remoteDaysPerWeek
            }
            min={0}
            max={
              draft.routine
                .workDaysPerWeek
            }
            step={1}
            display={
              `${
                draft.routine
                  .remoteDaysPerWeek
              } DAY${
                draft.routine
                  .remoteDaysPerWeek ===
                1
                  ? ""
                  : "S"
              } / WEEK`
            }
            left="0"
            right={`${draft.routine.workDaysPerWeek}`}
            onChange={(
              value,
            ) => {
              setRoutine({
                remoteDaysPerWeek:
                  value,
              });

              onExplore(
                "remote",
              );
            }}
          />
        )}

        {control === "time" && (
          <div
            className="
              space-y-5
            "
          >
            <button
              onClick={() => {
                onPrefsChange({
                  ...prefs,

                  valueTimeEnabled:
                    !prefs.valueTimeEnabled,
                });

                onExplore(
                  "timeValue",
                );
              }}
              className={`
                flex
                w-full
                items-center
                justify-between
                border
                border-ink
                px-5
                py-4
                text-left
                ${
                  prefs.valueTimeEnabled
                    ? "bg-ink text-paper"
                    : "bg-transparent"
                }
              `}
            >
              <span>
                <span
                  className="
                    block
                    text-xs
                    font-semibold
                  "
                >
                  VALUE MY TIME
                </span>

                <span
                  className="
                    mt-1
                    block
                    text-[11px]
                    opacity-70
                  "
                >
                  Optional. You
                  decide what this
                  number means.
                </span>
              </span>

              <span
                className="
                  font-mono
                  text-xs
                "
              >
                {prefs.valueTimeEnabled
                  ? "ON"
                  : "OFF"}
              </span>
            </button>

            {prefs.valueTimeEnabled && (
              <ScenarioSlider
                label="MY PERSONAL TIME"
                value={
                  prefs.hourlyValue
                }
                min={0}
                max={10_000}
                step={100}
                display={
                  `${formatNaira(
                    prefs.hourlyValue,
                  )} / HOUR`
                }
                left="₦0"
                right="₦10K"
                onChange={(
                  value,
                ) => {
                  onPrefsChange({
                    ...prefs,
                    hourlyValue:
                      value,
                  });

                  onExplore(
                    "timeValue",
                  );
                }}
              />
            )}
          </div>
        )}
      </div>

      {prefs.valueTimeEnabled && (
        <section
          className="
            grid
            gap-5
            border
            border-line
            p-5
            md:grid-cols-3
            md:p-7
          "
        >
          <div>
            <p
              className="
                text-[10px]
                font-semibold
                tracking-[0.08em]
                text-muted
              "
            >
              AT{" "}
              {formatNaira(
                prefs.hourlyValue,
              )}{" "}
              / HOUR
            </p>

            <p
              className="
                mt-2
                font-serif
                text-2xl
              "
            >
              TIME-ADJUSTED
            </p>
          </div>

          <div
            className="
              font-mono
              text-sm
            "
          >
            <p className="text-muted">
              HOME A
            </p>

            <p
              className="
                mt-1
                text-xl
              "
            >
              {formatNairaCompact(
                adjustedA,
              )}
            </p>
          </div>

          <div
            className="
              font-mono
              text-sm
            "
          >
            <p className="text-muted">
              HOME B
            </p>

            <p
              className="
                mt-1
                text-xl
              "
            >
              {formatNairaCompact(
                adjustedB,
              )}
            </p>
          </div>

          {flipped && (
            <div
              className="
                border-t
                border-cobalt
                pt-4
                font-serif
                text-2xl
                text-cobalt
                md:col-span-3
              "
            >
              THE TRADE-OFF
              JUST FLIPPED.
            </div>
          )}
        </section>
      )}
    </motion.div>
  );
}