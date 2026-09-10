import {
  useCallback,
  useEffect,
  useState,
} from "react";

import { sampleDominantColors } from "../lib/color";
import { normalizeAnalysis } from "../lib/normalize";
import { rawAnalysisSchema } from "../schemas/analysis";

import type {
  DesignSystem,
  ImageAsset,
} from "../types/ui-analysis";

const MIN_PROCESSING_TIME = 2600;

function wait(ms: number) {
  return new Promise((resolve) =>
    window.setTimeout(resolve, ms),
  );
}

export function useImageAnalysis(
  asset: ImageAsset | null,
  existing: DesignSystem | null,
) {
  const [result, setResult] =
    useState<DesignSystem | null>(existing);

  const [step, setStep] = useState(0);
  const [error, setError] =
    useState<string | null>(null);

  const [attempt, setAttempt] = useState(0);

  const retry = useCallback(() => {
    setResult(null);
    setError(null);
    setStep(0);
    setAttempt((value) => value + 1);
  }, []);

  useEffect(() => {
    if (!asset || existing) {
      return;
    }

    const currentAsset = asset;

    let cancelled = false;

    const timer = window.setInterval(() => {
      setStep((value) =>
        Math.min(value + 1, 4),
      );
    }, 620);

    async function run() {
      try {
        setError(null);

        const localPromise =
          sampleDominantColors(
            currentAsset.analysisDataUrl,
          );

        const requestPromise = fetch(
          "/api/analyze-ui",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              image: currentAsset.analysisDataUrl,
              meta: {
                width: currentAsset.width,
                height: currentAsset.height,
                name: currentAsset.name,
              },
            }),
          },
        );

        const [response, localColors] =
          await Promise.all([
            requestPromise,
            localPromise,
            wait(MIN_PROCESSING_TIME),
          ]);

        if (!response.ok) {
          const body = await response
            .json()
            .catch(() => null);

          throw new Error(
            body?.error ??
              "The analysis failed.",
          );
        }

        const json = await response.json();
        const raw =
          rawAnalysisSchema.parse(json);

        const normalized =
          normalizeAnalysis(
            raw,
            localColors,
          );

        if (!cancelled) {
          setStep(5);
          setResult(normalized);
        }
      } catch (reason) {
        if (!cancelled) {
          setError(
            reason instanceof Error
              ? reason.message
              : "The analysis failed.",
          );
        }
      } finally {
        window.clearInterval(timer);
      }
    }

    run();

    return () => {
      cancelled = true;
      window.clearInterval(timer);
    };
  }, [asset, existing, attempt]);

  return {
    result,
    step,
    error,
    retry,
  };
}
