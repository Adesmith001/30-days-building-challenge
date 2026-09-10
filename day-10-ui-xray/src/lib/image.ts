import type { ImageAsset } from "../types/ui-anaylsis";

const ACCEPTED_TYPES = [
  "image/png",
  "image/jpeg",
  "image/webp",
];

const MAX_DIMENSION = 1800;

function canvasToBlob(
  canvas: HTMLCanvasElement,
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob);
          return;
        }

        reject(new Error("Could not process image."));
      },
      "image/jpeg",
      0.82,
    );
  });
}

function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      resolve(String(reader.result));
    };

    reader.onerror = () => {
      reject(new Error("Could not read image."));
    };

    reader.readAsDataURL(blob);
  });
}

export async function prepareImage(
  file: File,
): Promise<ImageAsset> {
  if (!ACCEPTED_TYPES.includes(file.type)) {
    throw new Error("Use a PNG, JPG or WEBP screenshot.");
  }

  const bitmap = await createImageBitmap(file);

  const longest = Math.max(
    bitmap.width,
    bitmap.height,
  );

  const scale = Math.min(
    1,
    MAX_DIMENSION / longest,
  );

  const width = Math.round(bitmap.width * scale);
  const height = Math.round(bitmap.height * scale);

  const canvas = document.createElement("canvas");

  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext("2d");

  if (!context) {
    throw new Error("Canvas is not available.");
  }

  context.fillStyle = "#FFFFFF";
  context.fillRect(0, 0, width, height);

  context.drawImage(
    bitmap,
    0,
    0,
    width,
    height,
  );

  bitmap.close();

  const processed = await canvasToBlob(canvas);
  const analysisDataUrl =
    await blobToDataUrl(processed);

  return {
    file,
    name: file.name,
    width: width,
    height: height,
    size: file.size,
    previewUrl: URL.createObjectURL(file),
    analysisDataUrl,
  };
}

export function formatBytes(bytes: number) {
  if (bytes < 1024) {
    return `${bytes} B`;
  }

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }

  return `${(
    bytes /
    1024 /
    1024
  ).toFixed(1)} MB`;
}