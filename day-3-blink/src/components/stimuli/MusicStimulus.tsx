import {
  Heart,
  Pause,
  SkipBack,
  SkipForward,
} from "lucide-react";
import type { Stimulus } from "../../types/game";
import { cn } from "../../lib/utils";

type Props = {
  stimulus: Stimulus;
  reveal?: boolean;
};

export function MusicStimulus({
  stimulus,
  reveal = false,
}: Props) {
  const { data, question } = stimulus;
  const highlight = reveal && question.focusKey === "song";

  return (
    <div className="w-full max-w-3xl border border-slate-300 bg-white p-7 md:p-10">
      <div className="grid gap-8 md:grid-cols-[240px_1fr]">
        <div className="aspect-square bg-gradient-to-br from-violet-600 via-blue-600 to-orange-400" />

        <div className="flex flex-col justify-center">
          <div className="flex justify-between">
            <p className="font-mono text-xs tracking-[0.2em] text-slate-500">
              NOW PLAYING
            </p>

            <Heart className="size-5" />
          </div>

          <h2
            className={cn(
              "mt-7 text-4xl font-semibold",
              highlight && "ring-4 ring-blue-500",
            )}
          >
            {data.song}
          </h2>

          <p className="mt-3 text-lg text-slate-500">
            {data.artist}
          </p>

          <div className="mt-8">
            <div className="h-1 bg-slate-200">
              <div className="h-full w-[64%] bg-neutral-900" />
            </div>

            <div className="mt-2 flex justify-between font-mono text-xs text-slate-500">
              <span>2:01</span>
              <span>{data.duration}</span>
            </div>
          </div>

          <div className="mt-8 flex items-center justify-center gap-7">
            <SkipBack className="size-5" />

            <button
              type="button"
              className="grid size-14 place-items-center rounded-full bg-neutral-900 text-white"
            >
              <Pause className="size-5 fill-current" />
            </button>

            <SkipForward className="size-5" />
          </div>
        </div>
      </div>
    </div>
  );
}