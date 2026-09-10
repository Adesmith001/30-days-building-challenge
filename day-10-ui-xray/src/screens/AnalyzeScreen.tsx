/* eslint-disable react-hooks/set-state-in-effect */
import {
  useEffect,
  useRef,
  useState,
} from "react";

import { colorDistance } from "../lib/color";
import { useImageAnalysis } from "../hooks/useImageAnalysis";

import { Inspector } from "../components/Inspector";
import { ModeTabs } from "../components/ModeTabs";
import { ProcessingState } from "../components/ProcessingState";
import { ScreenshotStage } from "../components/ScreenshotStage";

import type {
  ColorToken,
  DesignSystem,
  ImageAsset,
  XRayMode,
} from "../types/ui-analysis";

interface Props {
  asset: ImageAsset;
  system: DesignSystem | null;
  onSystemChange: (
    system: DesignSystem,
  ) => void;
  onComplete: (
    name: string,
    system: DesignSystem,
  ) => void;
}

export function AnalyzeScreen({
  asset,
  system,
  onSystemChange,
  onComplete,
}: Props) {
  const {
    result,
    step,
    error,
    retry,
  } = useImageAnalysis(asset, system);

  const [mode, setMode] =
    useState<XRayMode>("structure");

  const [selectedId, setSelectedId] =
    useState<string | null>(null);

  const [xray, setXray] = useState(true);

  const completedRef = useRef(false);

  useEffect(() => {
    setSelectedId(null);
  }, [mode]);

  useEffect(() => {
    if (!result || system === result) {
      return;
    }

    onSystemChange(result);

    if (!completedRef.current) {
      completedRef.current = true;

      onComplete(
        asset.name,
        result,
      );
    }
  }, [
    result,
    system,
    asset.name,
    onSystemChange,
    onComplete,
  ]);

  const current = system ?? result;

  if (error && !current) {
    return (
      <main className="flex min-h-[calc(100vh-44px)] items-center justify-center px-5">
        <div className="max-w-md border border-line bg-panel p-8 text-center">
          <div className="font-mono text-[9px] text-danger">
            X-RAY INTERRUPTED
          </div>

          <h1 className="mt-3 font-sans text-2xl font-semibold">
            Your screenshot is still here.
          </h1>

          <p className="mt-3 text-sm leading-6 text-muted">
            The model response could not be
            turned into a valid analysis.
          </p>

          <button
            onClick={retry}
            className="mt-6 bg-ink px-5 py-2.5 font-mono text-[10px] font-semibold text-white hover:bg-accent"
          >
            TRY AGAIN
          </button>
        </div>
      </main>
    );
  }

  if (!current) {
    return (
      <div className="h-[calc(100vh-44px)]">
        <ProcessingState
          asset={asset}
          step={step}
        />
      </div>
    );
  }

  const active = current;

  function updateColor(
    id: string,
    patch: Partial<ColorToken>,
  ) {
    onSystemChange({
      ...active,
      colors: active.colors.map(
        (token) =>
          token.id === id
            ? {
                ...token,
                ...patch,
              }
            : token,
      ),
    });
  }

  function mergeColor(id: string) {
    const source =
      active.colors.find(
        (color) =>
          color.id === id &&
          !color.ignored,
      );

    if (!source) return;

    const candidate = active.colors
      .filter(
        (color) =>
          color.id !== source.id &&
          !color.ignored &&
          color.kind === source.kind,
      )
      .map((color) => ({
        color,
        distance: colorDistance(
          source.hex,
          color.hex,
        ),
      }))
      .sort(
        (a, b) =>
          a.distance - b.distance,
      )[0];

    if (
      !candidate ||
      candidate.distance > 42
    ) {
      return;
    }

    onSystemChange({
      ...active,
      colors: active.colors.map(
        (color) => {
          if (color.id === source.id) {
            return {
              ...color,
              bounds: [
                ...color.bounds,
                ...candidate.color.bounds,
              ],
              occurrences:
                color.occurrences +
                candidate.color.occurrences,
              edited: true,
            };
          }

          if (
            color.id === candidate.color.id
          ) {
            return {
              ...color,
              ignored: true,
            };
          }

          return color;
        },
      ),
    });
  }

  return (
    <main className="flex h-[calc(100vh-44px)] min-h-0 flex-col">
      <div className="grid min-h-0 flex-1 grid-cols-1 lg:grid-cols-[minmax(0,1fr)_340px]">
        <ScreenshotStage
          asset={asset}
          system={current}
          mode={mode}
          selectedId={selectedId}
          xray={xray}
          onXrayChange={setXray}
          onSelect={setSelectedId}
        />

        <div className="hidden min-h-0 border-l border-line lg:block">
          <Inspector
            system={current}
            mode={mode}
            selectedId={selectedId}
            onSelect={setSelectedId}
            onUpdateColor={updateColor}
            onMergeColor={mergeColor}
          />
        </div>
      </div>

      <ModeTabs
        value={mode}
        onChange={setMode}
      />

      <div className="max-h-[42vh] overflow-y-auto border-t border-line lg:hidden">
        <Inspector
          system={current}
          mode={mode}
          selectedId={selectedId}
          onSelect={setSelectedId}
          onUpdateColor={updateColor}
          onMergeColor={mergeColor}
        />
      </div>
    </main>
  );
}
