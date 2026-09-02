import {
  Maximize2,
  Pause,
  Play,
  Plus,
} from "lucide-react";

import { Button } from "../ui/Button";

interface Props {
  paused: boolean;
  onPause: () => void;
  onResume: () => void;
  onAdd: () => void;
  onFocus: () => void;
  onEnd: () => void;
}

export function LiveControls({
  paused,
  onPause,
  onResume,
  onAdd,
  onFocus,
  onEnd,
}: Props) {
  return (
    <div className="mt-auto grid w-full grid-cols-2 gap-3 pt-8 md:flex md:justify-end">
      <Button
        onClick={paused ? onResume : onPause}
      >
        {paused ? (
          <Play size={14} />
        ) : (
          <Pause size={14} />
        )}

        {paused ? "RESUME" : "PAUSE"}
      </Button>

      <Button onClick={onAdd}>
        <Plus size={14} />
        PERSON
      </Button>

      <Button
        onClick={onFocus}
        className="hidden md:inline-flex"
      >
        <Maximize2 size={14} />
        FOCUS
      </Button>

      <Button
        variant="primary"
        className="col-span-2 md:min-w-40"
        onClick={onEnd}
      >
        END MEETING
      </Button>
    </div>
  );
}