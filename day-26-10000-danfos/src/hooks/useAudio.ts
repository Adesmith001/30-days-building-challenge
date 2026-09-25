import { useEffect, useRef } from "react";
import { useSimulationStore } from "../store/useSimulationStore";

export function useAudio() {
  const sound = useSimulationStore(
    (state) => state.sound,
  );

  const contextRef = useRef<AudioContext | null>(null);
  const humRef = useRef<OscillatorNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);

  useEffect(() => {
    if (!sound) {
      gainRef.current?.gain.setTargetAtTime(
        0,
        contextRef.current?.currentTime ?? 0,
        0.1,
      );

      return;
    }

    const context =
      contextRef.current ??
      new AudioContext();

    contextRef.current = context;

    void context.resume();

    if (!humRef.current) {
      const oscillator = context.createOscillator();
      const gain = context.createGain();

      oscillator.type = "sine";
      oscillator.frequency.value = 54;

      gain.gain.value = 0.012;

      oscillator.connect(gain);
      gain.connect(context.destination);

      oscillator.start();

      humRef.current = oscillator;
      gainRef.current = gain;
    }

    gainRef.current?.gain.setTargetAtTime(
      0.012,
      context.currentTime,
      0.2,
    );

    const hornTimer = window.setInterval(() => {
      if (Math.random() > 0.22) return;

      const horn = context.createOscillator();
      const gain = context.createGain();

      horn.type = "square";
      horn.frequency.value = 190 + Math.random() * 50;

      gain.gain.setValueAtTime(
        0.012,
        context.currentTime,
      );

      gain.gain.exponentialRampToValueAtTime(
        0.0001,
        context.currentTime + 0.18,
      );

      horn.connect(gain);
      gain.connect(context.destination);

      horn.start();
      horn.stop(context.currentTime + 0.2);
    }, 4200);

    return () =>
      window.clearInterval(hornTimer);
  }, [sound]);
}
