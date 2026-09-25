import { useEffect, useRef } from "react";
import { runtime, renderBuffer, sendWorker } from "../simulation/runtime";
import { useSimulationStore } from "../store/useSimulationStore";

const MAX_FRAMES = 80;

export function useReplay() {
  const frames = useRef<Float32Array[]>([]);
  const lastRequest = useRef(0);

  const recording = useSimulationStore(
    (state) => state.recording,
  );

  const replayRequest = useSimulationStore(
    (state) => state.replayRequest,
  );

  const population = useSimulationStore(
    (state) => state.population,
  );

  useEffect(() => {
    if (!recording) return;

    const timer = window.setInterval(() => {
      const source = renderBuffer();

      frames.current.push(
        source.slice(0, population * 4),
      );

      if (frames.current.length > MAX_FRAMES) {
        frames.current.shift();
      }
    }, 100);

    return () => window.clearInterval(timer);
  }, [recording, population]);

  useEffect(() => {
    if (
      replayRequest === 0 ||
      replayRequest === lastRequest.current ||
      frames.current.length === 0
    ) {
      return;
    }

    lastRequest.current = replayRequest;

    const store = useSimulationStore.getState();

    store.setReplaying(true);

    sendWorker({
      type: "SET_PLAYING",
      playing: false,
    });

    let index = 0;

    const timer = window.setInterval(() => {
      const frame = frames.current[index];

      if (!frame) {
        window.clearInterval(timer);

        runtime.replayBuffer = null;

        store.setReplaying(false);

        sendWorker({
          type: "SET_PLAYING",
          playing: store.playing,
        });

        return;
      }

      runtime.replayBuffer = frame;
      index += 1;
    }, 90);

    return () => {
      window.clearInterval(timer);
      runtime.replayBuffer = null;
    };
  }, [replayRequest]);
}
