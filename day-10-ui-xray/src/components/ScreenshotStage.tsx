import {
  Eye,
  ScanLine,
} from "lucide-react";

import { XRayOverlay } from "./XRayOverlay";

import type {
  DesignSystem,
  ImageAsset,
  XRayMode,
} from "../types/ui-analysis";

interface Props {
  asset: ImageAsset;
  system: DesignSystem;
  mode: XRayMode;
  selectedId: string | null;
  xray: boolean;
  onXrayChange: (value: boolean) => void;
  onSelect: (id: string) => void;
}

export function ScreenshotStage({
  asset,
  system,
  mode,
  selectedId,
  xray,
  onXrayChange,
  onSelect,
}: Props) {
  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex h-9 shrink-0 items-center justify-between border-b border-line px-3">
        <div className="truncate font-mono text-[9px] text-muted">
          {asset.name}
          <span className="mx-2">
            ·
          </span>
          {asset.width} × {asset.height}
        </div>

        <div className="flex border border-line">
          <button
            onClick={() =>
              onXrayChange(false)
            }
            className={[
              "flex h-6 items-center gap-1.5 px-2 font-mono text-[8px]",
              !xray
                ? "bg-ink text-white"
                : "bg-panel text-muted",
            ].join(" ")}
          >
            <Eye size={10} />
            ORIGINAL
          </button>

          <button
            onClick={() =>
              onXrayChange(true)
            }
            className={[
              "flex h-6 items-center gap-1.5 border-l border-line px-2 font-mono text-[8px]",
              xray
                ? "bg-ink text-white"
                : "bg-panel text-muted",
            ].join(" ")}
          >
            <ScanLine size={10} />
            X-RAY
          </button>
        </div>
      </div>

      <div className="flex min-h-0 flex-1 items-center justify-center overflow-auto bg-[linear-gradient(to_right,#e4e4e1_1px,transparent_1px),linear-gradient(to_bottom,#e4e4e1_1px,transparent_1px)] [background-size:16px_16px] p-4 sm:p-6">
        <div className="relative inline-block border border-line bg-panel">
          <img
            src={asset.previewUrl}
            alt={asset.name}
            className={[
              "block max-h-[calc(100vh-150px)] max-w-full object-contain transition-opacity",
              xray
                ? "opacity-80"
                : "opacity-100",
            ].join(" ")}
          />

          {xray && (
            <XRayOverlay
              system={system}
              mode={mode}
              selectedId={selectedId}
              onSelect={onSelect}
            />
          )}
        </div>
      </div>
    </div>
  );
}