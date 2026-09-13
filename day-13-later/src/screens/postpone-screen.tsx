import {
  useState,
} from "react";

import {
  addDays,
  addHours,
  addMinutes,
  set,
} from "date-fns";

import { AppShell } from "../components/app-shell";
import { OptionRow } from "../components/option-row";
import { Button } from "../components/ui/button";

import {
  toDateTimeLocalValue,
} from "../lib/time";

import type {
  Commitment,
} from "../types/commitment";

type Props = {
  commitment: Commitment;
  onCancel: () => void;
  onPostpone: (
    scheduledFor: number,
  ) => void;
};

export function PostponeScreen({
  commitment,
  onCancel,
  onPostpone,
}: Props) {
  const [custom, setCustom] =
    useState(false);

  const now = new Date();

  function tomorrow() {
    return set(
      addDays(now, 1),
      {
        hours: 9,
        minutes: 0,
        seconds: 0,
        milliseconds: 0,
      },
    );
  }

  return (
    <AppShell
      onLogoClick={onCancel}
      right={
        <button
          className="text-[12px] text-[#71717a]"
          onClick={onCancel}
        >
          Cancel
        </button>
      }
    >
      <div
        className={[
          "mx-auto w-full",
          "max-w-[520px]",
          "px-5 py-16",
        ].join(" ")}
      >
        <p className="text-[12px] text-[#a1a1aa]">
          {commitment.title}
        </p>

        <h1
          className={[
            "mt-3 text-[30px]",
            "font-semibold",
            "tracking-[-0.04em]",
          ].join(" ")}
        >
          We're doing this again?
        </h1>

        <p className="mt-2 text-[15px] text-[#71717a]">
          How much more time do you
          need?
        </p>

        {!custom ? (
          <div className="mt-8 space-y-2">
            <OptionRow
              title="10 minutes"
              onClick={() =>
                onPostpone(
                  addMinutes(
                    now,
                    10,
                  ).getTime(),
                )
              }
            />

            <OptionRow
              title="30 minutes"
              onClick={() =>
                onPostpone(
                  addMinutes(
                    now,
                    30,
                  ).getTime(),
                )
              }
            />

            <OptionRow
              title="1 hour"
              onClick={() =>
                onPostpone(
                  addHours(
                    now,
                    1,
                  ).getTime(),
                )
              }
            />

            <OptionRow
              title="Tomorrow"
              onClick={() =>
                onPostpone(
                  tomorrow().getTime(),
                )
              }
            />

            <OptionRow
              title="Pick a time"
              onClick={() =>
                setCustom(true)
              }
            />
          </div>
        ) : (
          <CustomPostpone
            onCancel={() =>
              setCustom(false)
            }
            onSubmit={
              onPostpone
            }
          />
        )}

        <p
          className={[
            "mt-8 border-t",
            "border-[#e4e4e7]",
            "pt-5 text-[12px]",
            "text-[#71717a]",
          ].join(" ")}
        >
          Times postponed:{" "}
          {commitment.postponements}
        </p>
      </div>
    </AppShell>
  );
}

function CustomPostpone({
  onCancel,
  onSubmit,
}: {
  onCancel: () => void;
  onSubmit: (
    value: number,
  ) => void;
}) {
  const minimum =
    toDateTimeLocalValue(
      new Date(),
    );

  const [value, setValue] =
    useState(minimum);

  return (
    <div
      className={[
        "mt-8 rounded-xl border",
        "border-[#e4e4e7]",
        "bg-white p-5",
      ].join(" ")}
    >
      <input
        type="datetime-local"
        min={minimum}
        value={value}
        onChange={(event) =>
          setValue(
            event.target.value,
          )
        }
        className={[
          "w-full rounded-lg",
          "border border-[#e4e4e7]",
          "px-4 py-3 outline-none",
          "focus:border-black",
        ].join(" ")}
      />

      <div className="mt-4 flex gap-2">
        <Button
          className="flex-1"
          variant="secondary"
          onClick={onCancel}
        >
          Back
        </Button>

        <Button
          className="flex-1"
          onClick={() =>
            onSubmit(
              new Date(
                value,
              ).getTime(),
            )
          }
        >
          Confirm
        </Button>
      </div>
    </div>
  );
}