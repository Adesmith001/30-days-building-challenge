import type {
  TaskOutput,
} from "../types/benchmark";

export function outputSignature(
  output: TaskOutput,
) {
  if (
    output.task === "primes"
  ) {
    return (
      `primes:${output.count}`
    );
  }

  const bytes =
    new Uint8ClampedArray(
      output.buffer,
    );

  let hash = 2166136261;

  const step =
    Math.max(
      4,
      Math.floor(
        bytes.length / 2048,
      ),
    );

  for (
    let index = 0;
    index < bytes.length;
    index += step
  ) {
    hash ^=
      bytes[index];

    hash =
      Math.imul(
        hash,
        16777619,
      );
  }

  return (
    `${output.task}:` +
    `${output.width}x` +
    `${output.height}:` +
    `${(hash >>> 0).toString(16)}`
  );
}