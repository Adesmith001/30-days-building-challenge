/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/set-state-in-effect */
import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import type {
  CatchOutcome,
  LevelConfig,
  Point,
  ScoreBurstData,
} from "../types/game";
import {
  predictedPoint,
  randomPoint,
  separatedPoints,
} from "../lib/geometry";
import { getButtonLabel } from "../data/copy";
import { usePointerTracker } from "../hooks/usePointerTracker";
import { useEscapeBehavior } from "../hooks/useEscapeBehavior";
import { useFreezeWindow } from "../hooks/useFreezeWindow";
import { EscapeButton } from "./EscapeButton";
import { DecoyButton } from "./DecoyButton";
import { ScoreBurst } from "./ScoreBurst";

interface Props {
  level: LevelConfig;
  bossHits: number;
  onMiss: () => void;
  onCatch: () => CatchOutcome;
}

export function Arena({
  level,
  bossHits,
  onMiss,
  onCatch,
}: Props) {
  const arenaRef = useRef<HTMLDivElement>(null);
  const [bounds, setBounds] = useState<Point>({
    x: 800,
    y: 560,
  });

  const [position, setPosition] = useState<Point>({
    x: 400,
    y: 280,
  });

  const [decoys, setDecoys] = useState<Point[]>([]);
  const [movement, setMovement] =
    useState<"dodge" | "teleport">("dodge");

  const [dodges, setDodges] = useState(0);
  const [scale, setScale] = useState(1);
  const [locked, setLocked] = useState(false);
  const [taunt, setTaunt] = useState("");
  const [burst, setBurst] =
    useState<ScoreBurstData | null>(null);

  const { pointer, trackPointer, leavePointer } =
    usePointerTracker();

  const frozen = useFreezeWindow(level, !locked);

  const buttonWidth = Math.max(
    100,
    level.buttonWidth * scale,
  );

  const rearrange = useCallback(() => {
    if (bounds.x <= 0 || bounds.y <= 0) return;

    if (level.mechanics.includes("decoy")) {
      const points = separatedPoints(
        (level.decoys ?? 0) + 1,
        bounds,
        buttonWidth,
      );

      setPosition(points[0]);
      setDecoys(points.slice(1));
      return;
    }

    setDecoys([]);

    if (level.id <= 2) {
      setPosition({
        x: bounds.x / 2,
        y: bounds.y / 2,
      });
    } else {
      setPosition(randomPoint(bounds, buttonWidth));
    }
  }, [
    bounds,
    buttonWidth,
    level.decoys,
    level.id,
    level.mechanics,
  ]);

  useEffect(() => {
    const element = arenaRef.current;

    if (!element) return;

    const update = () => {
      setBounds({
        x: element.clientWidth,
        y: element.clientHeight,
      });
    };

    update();

    const observer = new ResizeObserver(update);
    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    setScale(1);
    setDodges(0);
    setLocked(false);
    rearrange();
  }, [level.id, bounds.x, bounds.y]);

  useEffect(() => {
    if (!taunt) return;

    const timer = window.setTimeout(() => {
      setTaunt("");
    }, 720);

    return () => window.clearTimeout(timer);
  }, [taunt]);

  const moveButton = useCallback(
    (next: Point, mode: "dodge" | "teleport") => {
      setMovement(mode);
      setPosition(next);
    },
    [],
  );

  const registerEvade = useCallback(() => {
    setDodges((value) => value + 1);

    if (!level.mechanics.includes("shrink")) return;

    if (level.id >= 9 && Math.random() > 0.58) {
      return;
    }

    setScale((value) =>
      Math.max(level.id === 4 ? 0.7 : 0.76, value - 0.09),
    );
  }, [level.id, level.mechanics]);

  useEscapeBehavior({
    active: !locked,
    frozen,
    level,
    pointer,
    position,
    bounds,
    buttonWidth,
    onMove: moveButton,
    onEvade: registerEvade,
  });

  const realAttempt = (pointerType: string) => {
    if (locked) return;

    const touchLike =
      pointerType !== "mouse" &&
      pointerType !== "keyboard";

    if (
      touchLike &&
      !frozen &&
      Math.random() < level.touchEvadeChance
    ) {
      registerEvade();
      setMovement("teleport");
      setPosition(randomPoint(bounds, buttonWidth));
      return;
    }

    const outcome = onCatch();

    setBurst({
      id: Date.now(),
      points: outcome.points,
      label: outcome.label,
      x: position.x,
      y: position.y,
    });

    if (outcome.completed) {
      setLocked(true);
    } else {
      rearrange();
    }
  };

  const decoyMiss = () => {
    onMiss();
    setTaunt("NA WRONG ONE.");
    rearrange();
  };

  const arenaPointerDown = (
    event: React.PointerEvent<HTMLDivElement>,
  ) => {
    trackPointer(event);

    const target = event.target as HTMLElement;

    if (target.closest("[data-game-button='true']")) {
      return;
    }

    onMiss();
    setTaunt("YOU MISS.");

    if (event.pointerType !== "mouse") {
      setMovement("teleport");
      setPosition(randomPoint(bounds, buttonWidth));
    }
  };

  const prediction = predictedPoint(
    pointer,
    level.predictionMs ?? 180,
  );

  return (
    <div
      ref={arenaRef}
      onPointerMove={trackPointer}
      onPointerDown={arenaPointerDown}
      onPointerLeave={leavePointer}
      className="relative h-[calc(100dvh-290px)] min-h-[430px] max-h-[660px] w-full overflow-hidden border border-[#cfd3df] bg-[#f8f6f3] touch-none"
      style={{
        backgroundImage:
          "linear-gradient(#e3e4e9 1px, transparent 1px), linear-gradient(90deg, #e3e4e9 1px, transparent 1px)",
        backgroundSize: "140px 140px",
      }}
    >
      <div className="absolute left-5 top-4 z-30 font-mono text-[9px] tracking-[0.1em] text-[#70768a]">
        ARENA_BOUNDS [{Math.round(bounds.x)}×
        {Math.round(bounds.y)}]
      </div>

      <div className="absolute right-5 top-4 z-30 font-mono text-[9px] tracking-[0.1em] text-[#414653]">
        {frozen
          ? "[*] SMALL WINDOW OPEN"
          : "WE DEY TRACK YOUR MOVE"}
      </div>

      {level.mechanics.includes("predictive") &&
        pointer.inside && (
          <svg className="pointer-events-none absolute inset-0 z-0 h-full w-full">
            <line
              x1={pointer.x}
              y1={pointer.y}
              x2={prediction.x}
              y2={prediction.y}
              stroke="#1248ff"
              strokeWidth="1.5"
              strokeDasharray="5 5"
            />
            <circle
              cx={prediction.x}
              cy={prediction.y}
              r="6"
              fill="none"
              stroke="#1248ff"
              strokeWidth="1.5"
            />
          </svg>
        )}

      {decoys.map((decoy, index) => (
        <DecoyButton
          key={`${level.id}-${index}`}
          position={decoy}
          width={buttonWidth}
          scale={scale}
          label="TOUCH ME"
          onMiss={decoyMiss}
        />
      ))}

      <EscapeButton
        position={position}
        width={buttonWidth}
        scale={scale}
        label={getButtonLabel(level.id, dodges, bossHits)}
        movement={movement}
        frozen={frozen}
        disabled={locked}
        onAttempt={realAttempt}
      />

      <ScoreBurst burst={burst} />

      {taunt && (
        <div className="absolute left-1/2 top-[18%] -translate-x-1/2 font-mono text-[11px] font-bold tracking-[0.14em] text-[#b92a13]">
          [!] {taunt}
        </div>
      )}

      <div className="absolute bottom-4 left-5 font-mono text-[9px] tracking-[0.1em] text-[#747b8e]">
        SPEED: {pointer.speed.toFixed(2)} PX/MS
      </div>

      <div className="absolute bottom-4 right-5 font-mono text-[9px] tracking-[0.1em] text-[#1248ff]">
        LOC: ({Math.round(position.x)},{" "}
        {Math.round(position.y)}) [*] READY
      </div>
    </div>
  );
}