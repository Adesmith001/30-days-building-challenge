import {
  toPng,
} from "html-to-image";

import type {
  RunRecord,
} from "../types/game";

export function shareText(
  record: RunRecord,
) {
  return [
    "SORTED. — DAY 18 / 30",
    `${
      record.score.toLocaleString()
    } / ${
      record.maxScore.toLocaleString()
    }`,
    `${
      record.perfectOrders
    } PERFECT`,
    `${
      record.exactPositions
    } EXACT POSITIONS`,
    "4 THINGS. 1 ORDER.",
  ].join("\n");
}

export async function shareRun(
  node: HTMLElement,
  record: RunRecord,
) {
  const text =
    shareText(record);

  const dataUrl =
    await toPng(
      node,
      {
        cacheBust: true,
        pixelRatio: 2,
      },
    );

  const blob =
    await (
      await fetch(
        dataUrl,
      )
    ).blob();

  const file =
    new File(
      [blob],
      "sorted-result.png",
      {
        type: "image/png",
      },
    );

  if (
    navigator.share &&
    navigator.canShare?.({
      files: [file],
    })
  ) {
    await navigator.share({
      title: "SORTED.",
      text,
      files: [file],
    });

    return "shared" as const;
  }

  await navigator.clipboard
    .writeText(
      text,
    );

  const link =
    document.createElement(
      "a",
    );

  link.href = dataUrl;
  link.download =
    "sorted-result.png";

  link.click();

  return "copied" as const;
}