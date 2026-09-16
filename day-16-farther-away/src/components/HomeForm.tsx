import type {
  CommuteMode,
  HomeOption,
} from "../types/comparison";

import MoneyInput from "./MoneyInput";
import NumberField from "./NumberField";
import PrimaryButton from "./PrimaryButton";

const modes: CommuteMode[] = [
  "Car",
  "Bus",
  "BRT",
  "Train",
  "Bike",
  "Walk",
  "Mixed",
];

interface Props {
  home: HomeOption;
  subtitle: string;
  buttonLabel: string;

  onChange:
    (home: HomeOption) => void;

  onNext: () => void;
}

export default function HomeForm({
  home,
  subtitle,
  buttonLabel,
  onChange,
  onNext,
}: Props) {
  const set = <
    K extends keyof HomeOption
  >(
    key: K,
    value: HomeOption[K],
  ) => {
    onChange({
      ...home,
      [key]: value,
    });
  };

  const valid =
    home.name.trim() &&
    home.annualRent > 0 &&
    home.oneWayMinutes >= 0 &&
    home.oneWayTransportCost >= 0;

  return (
    <div
      className="
        grid
        gap-10
        md:grid-cols-[1fr_2fr]
      "
    >
      <aside>
        <p
          className="
            font-serif
            text-2xl
          "
        >
          {subtitle}
        </p>

        <p
          className="
            mt-3
            max-w-xs
            text-sm
            leading-6
            text-muted
          "
        >
          No address required.
          A neighbourhood name
          or any label you
          recognise is enough.
        </p>
      </aside>

      <div className="space-y-8">
        <label
          className="
            block
            border-b
            border-ink
            pb-3
          "
        >
          <span
            className="
              mb-2
              block
              text-[11px]
              font-semibold
              uppercase
              tracking-[0.1em]
              text-muted
            "
          >
            NAME
          </span>

          <input
            value={home.name}
            onChange={(event) =>
              set(
                "name",
                event.target.value,
              )
            }
            placeholder={
              home.id === "a"
                ? "YABA"
                : "IKORODU"
            }
            className="
              w-full
              bg-transparent
              font-mono
              text-2xl
              uppercase
              outline-none
              md:text-3xl
            "
          />
        </label>

        <MoneyInput
          label="ANNUAL RENT"
          value={home.annualRent}
          onChange={(value) =>
            set(
              "annualRent",
              value,
            )
          }
          hint="/ YEAR"
        />

        <div
          className="
            grid
            gap-8
            md:grid-cols-2
          "
        >
          <NumberField
            label="ONE-WAY COMMUTE"
            value={
              home.oneWayMinutes
            }
            onChange={(value) =>
              set(
                "oneWayMinutes",
                value,
              )
            }
            suffix="MIN"
          />

          <MoneyInput
            label="ONE-WAY TRANSPORT"
            value={
              home.oneWayTransportCost
            }
            onChange={(value) =>
              set(
                "oneWayTransportCost",
                value,
              )
            }
          />
        </div>

        <label
          className="
            block
            border-b
            border-ink
            pb-3
          "
        >
          <span
            className="
              mb-2
              block
              text-[11px]
              font-semibold
              uppercase
              tracking-[0.1em]
              text-muted
            "
          >
            COMMUTE MODE
          </span>

          <select
            value={home.mode}
            onChange={(event) =>
              set(
                "mode",
                (event.target.value as CommuteMode),
              )
            }
            className="
              w-full
              bg-transparent
              py-1
              font-mono
              text-xl
              uppercase
              outline-none
            "
          >
            {modes.map(
              (mode) => (
                <option
                  key={mode}
                >
                  {mode}
                </option>
              ),
            )}
          </select>
        </label>

        <div
          className="
            flex
            justify-end
            pt-4
          "
        >
          <PrimaryButton
            disabled={!valid}
            onClick={onNext}
          >
            {buttonLabel}
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
}