import type { CityLayout } from "../types";

export function edgeKey(a: number, b: number) {
  return a < b ? `${a}:${b}` : `${b}:${a}`;
}

export function buildNextHop(
  layout: CityLayout,
  blocked: Set<string> = new Set(),
) {
  const count = layout.nodes.length;
  const distances = new Float64Array(count * count);
  const next = new Int16Array(count * count);

  distances.fill(Number.POSITIVE_INFINITY);
  next.fill(-1);

  for (let i = 0; i < count; i += 1) {
    distances[i * count + i] = 0;
    next[i * count + i] = i;
  }

  for (const edge of layout.edges) {
    if (blocked.has(edgeKey(edge.a, edge.b))) continue;

    const a = layout.nodes[edge.a];
    const b = layout.nodes[edge.b];
    const distance = Math.hypot(b.x - a.x, b.z - a.z);

    distances[edge.a * count + edge.b] = distance;
    distances[edge.b * count + edge.a] = distance;

    next[edge.a * count + edge.b] = edge.b;
    next[edge.b * count + edge.a] = edge.a;
  }

  for (let k = 0; k < count; k += 1) {
    for (let i = 0; i < count; i += 1) {
      const ik = distances[i * count + k];
      if (!Number.isFinite(ik)) continue;

      for (let j = 0; j < count; j += 1) {
        const candidate = ik + distances[k * count + j];
        const index = i * count + j;

        if (candidate < distances[index]) {
          distances[index] = candidate;
          next[index] = next[i * count + k];
        }
      }
    }
  }

  return next;
}

export function nextNodeFor(
  table: Int16Array,
  nodeCount: number,
  from: number,
  destination: number,
) {
  return table[from * nodeCount + destination] ?? -1;
}
