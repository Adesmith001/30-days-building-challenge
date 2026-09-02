import { toPng } from "html-to-image";
import type { RefObject } from "react";

export function useReceiptExport(
  ref: RefObject<HTMLElement | null>,
  filename: string,
) {
  async function image() {
    if (!ref.current) return null;

    return toPng(ref.current, {
      cacheBust: true,
      pixelRatio: 2,
      backgroundColor: "#ffffff",
    });
  }

  async function save() {
    const dataUrl = await image();

    if (!dataUrl) return;

    const link = document.createElement("a");

    link.download = filename;
    link.href = dataUrl;
    link.click();
  }

  async function share() {
    const dataUrl = await image();

    if (!dataUrl) return;

    try {
      const blob = await fetch(dataUrl).then(
        (response) => response.blob(),
      );

      const file = new File([blob], filename, {
        type: "image/png",
      });

      if (
        navigator.share &&
        navigator.canShare?.({ files: [file] })
      ) {
        await navigator.share({
          title: "Meeting Cost",
          files: [file],
        });

        return;
      }
    } catch {
      //
    }

    await save();
  }

  return {
    save,
    share,
  };
}