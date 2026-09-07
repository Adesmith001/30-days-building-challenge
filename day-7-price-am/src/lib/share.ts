import { toPng } from "html-to-image";

async function createResultImage(
  element: HTMLElement,
) {
  return toPng(element, {
    cacheBust: true,
    pixelRatio: 2,
  });
}

export async function saveResultCard(
  element: HTMLElement,
) {
  const dataUrl = await createResultImage(element);
  const link = document.createElement("a");
  link.href = dataUrl;
  link.download = "price-am-result.png";
  link.click();
}

export async function shareResultCard(
  element: HTMLElement,
) {
  const dataUrl = await createResultImage(element);

  const response = await fetch(dataUrl);
  const blob = await response.blob();

  const file = new File(
    [blob],
    "price-am-result.png",
    {
      type: "image/png",
    },
  );

  if (
    navigator.share &&
    navigator.canShare?.({ files: [file] })
  ) {
    await navigator.share({
      title: "Price Am",
      text: "You know market?",
      files: [file],
    });

    return;
  }

  await saveResultCard(element);
}