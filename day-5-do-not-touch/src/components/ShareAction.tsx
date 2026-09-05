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
    `${stats.levelsCleared} / 10 WE CLEAR`,
    `MISS ${stats.misses}`,
    "",
    "THE BUTTON DON LOSE.",
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
    window.alert("Result don copy to clipboard.");
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
    <div className="flex gap-3">
      <button
        type="button"
        onClick={share}
        aria-label="Share result"
        title="Share result"
        className="flex min-h-14 min-w-14 flex-1 items-center justify-center bg-[#1248ff] text-white transition-colors hover:bg-[#0d39d4]"
      >
        <Share2 size={16} />
      </button>

      <button
        type="button"
        onClick={save}
        aria-label="Save result"
        title="Save result"
        className="flex min-h-14 min-w-14 flex-1 items-center justify-center border border-[#171717] transition-colors hover:bg-[#171717] hover:text-white"
      >
        <Download size={16} />
      </button>
    </div>
  );
}