import type { InteractionMode, PointerForce } from "../types";
import { MAX_DANFOS } from "../types";

interface RuntimeState {
  worker: Worker | null;

  liveBuffer: Float32Array;
  transferView: Float32Array | null;
  replayBuffer: Float32Array | null;

  sharedHeader: Int32Array | null;

  pointer: PointerForce;

  lastPointerSent: number;
}

export const runtime: RuntimeState = {
  worker: null,

  liveBuffer: new Float32Array(MAX_DANFOS * 4),
  transferView: null,
  replayBuffer: null,

  sharedHeader: null,

  pointer: {
    active: false,
    x: 0,
    z: 0,
    mode: "push",
    radius: 38,
  },

  lastPointerSent: 0,
};

export function renderBuffer() {
  return runtime.replayBuffer ?? runtime.liveBuffer;
}

export function sendWorker(message: unknown, transfer?: Transferable[]) {
  runtime.worker?.postMessage(message, transfer ?? []);
}

export function updatePointer(
  x: number,
  z: number,
  active: boolean,
  mode: InteractionMode,
  radius: number,
) {
  runtime.pointer.x = x;
  runtime.pointer.z = z;
  runtime.pointer.active = active;
  runtime.pointer.mode = mode;
  runtime.pointer.radius = radius;

  const now = performance.now();

  if (now - runtime.lastPointerSent < 24) return;

  runtime.lastPointerSent = now;

  sendWorker({
    type: "SET_POINTER",
    pointer: runtime.pointer,
  });
}
