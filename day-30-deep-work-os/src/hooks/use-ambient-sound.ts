"use client";

import { useEffect, useRef } from "react";

import type {
  SoundMode,
} from "@/stores/settings-store";

export function useAmbientSound(
  mode: SoundMode,
  volume: number,
  enabled: boolean,
) {
  const contextRef =
    useRef<AudioContext | null>(null);

  useEffect(() => {
    if (
      !enabled ||
      mode === "none" ||
      typeof AudioContext === "undefined"
    ) {
      return;
    }

    const context = new AudioContext();
    contextRef.current = context;

    const seconds = 4;

    const buffer = context.createBuffer(
      1,
      context.sampleRate * seconds,
      context.sampleRate,
    );

    const data =
      buffer.getChannelData(0);

    let last = 0;

    for (let i = 0; i < data.length; i++) {
      const white =
        Math.random() * 2 - 1;

      if (mode === "brown") {
        last =
          (last + 0.02 * white) / 1.02;

        data[i] = last * 3.2;
      } else {
        data[i] = white;
      }
    }

    const source =
      context.createBufferSource();

    source.buffer = buffer;
    source.loop = true;

    const filter =
      context.createBiquadFilter();

    if (mode === "rain") {
      filter.type = "highpass";
      filter.frequency.value = 800;
    } else if (mode === "air") {
      filter.type = "lowpass";
      filter.frequency.value = 1300;
    } else if (mode === "cafe") {
      filter.type = "bandpass";
      filter.frequency.value = 550;
      filter.Q.value = 0.45;
    } else {
      filter.type = "lowpass";
      filter.frequency.value = 500;
    }

    const gain = context.createGain();
    gain.gain.value = volume * 0.2;

    source.connect(filter);
    filter.connect(gain);
    gain.connect(context.destination);

    void context.resume();
    source.start();

    return () => {
      source.stop();
      void context.close();
      contextRef.current = null;
    };
  }, [enabled, mode, volume]);
}