import type { RefObject } from "react";
import { Download, Share2 } from "lucide-react";
import { toPng } from "html-to-image";
import type { RunStats } from "../types/game";
import { getRank } from "../lib/rank";

interface Props {
  stats: RunStats;
  targetRef: RefObject<HTMLDivElement | null>;
}

export function ShareActions({
  stats,
  targetRef,
}: Props) {
  const rank = getRank(stats.score);

  const shareText = [
    "DO NOT TOUCH",
    "DAY 05 / 30",
    "",
    stats.score.toLocaleString(),
    rank.name,
    "",
    `${stats.levelsCleared} / 10 CLEARED`,
    `MISSES ${stats.misses}`,
    "",
    "THE BUTTON LOST.",
  ].join("\n");

  const share = async () => {
    if (navigator.share) {
      await navigator.share({
        title: "Do Not Touch",
        text: shareText,
      });

      return;
    }

    await navigator.clipboard.writeText(shareText);
    window.alert("Result copied to clipboard.");
  };

  const save = async () => {
    if (!targetRef.current) return;

    const image = await toPng(targetRef.current, {
      pixelRatio: 2,
      cacheBust: true,
    });

    const link = document.createElement("a");

    link.download = "do-not-touch-result.png";
    link.href = image;
    link.click();
  };

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <button
        onClick={share}
        className="flex min-h-14 items-center justify-center gap-3 bg-[#1248ff] px-5 font-mono text-[12px] font-bold text-white"
      >
        <Share2 size={16} />
        SHARE RESULT
      </button>

      <button
        onClick={save}
        className="flex min-h-14 items-center justify-center gap-3 border border-[#171717] px-5 font-mono text-[12px] font-bold"
      >
        <Download size={16} />
        SAVE RESULT
      </button>
    </div>
  );
}