import type { Stimulus } from "../types/game";
import { AnalyticsStimulus } from "./stimuli/AnalyticsStimulus";
import { CheckoutStimulus } from "./stimuli/CheckoutStimulus";
import { FlightStimulus } from "./stimuli/FlightStimulus";
import { MusicStimulus } from "./stimuli/MusicStimulus";
import { WeatherStimulus } from "./stimuli/WeatherStimulus";

type Props = {
  stimulus: Stimulus;
  reveal?: boolean;
};

export function StimulusRenderer({
  stimulus,
  reveal = false,
}: Props) {
  if (stimulus.template === "analytics") {
    return (
      <AnalyticsStimulus
        stimulus={stimulus}
        reveal={reveal}
      />
    );
  }

  if (stimulus.template === "checkout") {
    return (
      <CheckoutStimulus
        stimulus={stimulus}
        reveal={reveal}
      />
    );
  }

  if (stimulus.template === "flight") {
    return (
      <FlightStimulus
        stimulus={stimulus}
        reveal={reveal}
      />
    );
  }

  if (stimulus.template === "music") {
    return (
      <MusicStimulus
        stimulus={stimulus}
        reveal={reveal}
      />
    );
  }

  return (
    <WeatherStimulus
      stimulus={stimulus}
      reveal={reveal}
    />
  );
}