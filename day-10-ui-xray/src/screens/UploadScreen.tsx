import {
  useState,
} from "react";

import {
  formatBytes,
  prepareImage,
} from "../lib/image";

import { ScreenshotUploader } from "../components/ScreenshotUploader";

import type {
  ImageAsset,
} from "../types/ui-analysis";

interface Props {
  onAnalyze: (asset: ImageAsset) => void;
}

export function UploadScreen({
  onAnalyze,
}: Props) {
  const [asset, setAsset] =
    useState<ImageAsset | null>(null);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  async function choose(file: File) {
    try {
      setLoading(true);
      setError(null);

      const next = await prepareImage(file);

      if (asset) {
        URL.revokeObjectURL(
          asset.previewUrl,
        );
      }

      setAsset(next);
    } catch (reason) {
      setError(
        reason instanceof Error
          ? reason.message
          : "Could not load screenshot.",
      );
    } finally {
      setLoading(false);
    }
  }

  if (!asset) {
    return (
      <main className="flex min-h-[calc(100vh-44px)] items-center justify-center px-5 py-12">
        <div className="w-full">
          <div className="mb-8 text-center">
            <div className="font-mono text-[9px] text-accent">
              01 / UPLOAD
            </div>

            <h1 className="mt-3 font-sans text-3xl font-semibold tracking-[-0.045em]">
              DROP A UI
              <br />
              SCREENSHOT
            </h1>

            {error && (
              <p className="mt-3 font-mono text-[9px] text-danger">
                {error}
              </p>
            )}
          </div>

          <div className="flex justify-center">
            <ScreenshotUploader
              onFile={choose}
              disabled={loading}
            />
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-[calc(100vh-44px)] flex-col p-4 sm:p-6">
      <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <div className="font-mono text-[9px] font-semibold">
              {asset.name}
            </div>

            <div className="mt-1 font-mono text-[8px] text-muted">
              {asset.width} × {asset.height}
              {" · "}
              {formatBytes(asset.size)}
            </div>
          </div>

          <button
            onClick={() => setAsset(null)}
            className="font-mono text-[9px] text-muted hover:text-ink"
          >
            CHOOSE ANOTHER
          </button>
        </div>

        <div className="flex min-h-0 flex-1 items-center justify-center border border-line bg-panel p-3">
          <img
            src={asset.previewUrl}
            alt={asset.name}
            className="max-h-[68vh] max-w-full object-contain"
          />
        </div>

        <button
          onClick={() =>
            onAnalyze(asset)
          }
          className="mt-3 h-11 bg-ink font-mono text-[10px] font-semibold text-white hover:bg-accent"
        >
          ANALYZE UI →
        </button>
      </div>
    </main>
  );
}