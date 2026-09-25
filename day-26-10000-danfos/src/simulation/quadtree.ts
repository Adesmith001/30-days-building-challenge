import type { SimState } from "./state";

interface QuadNode {
  x: number;
  z: number;
  half: number;
  items: number[];
  children: number[];
}

const CAPACITY = 12;
const MAX_DEPTH = 8;

export class Quadtree {
  private nodes: QuadNode[] = [];
  private used = 0;
  private halfSize: number;

  constructor(halfSize = 360) {
    this.halfSize = halfSize;
  }

  private acquire(x: number, z: number, half: number) {
    let node = this.nodes[this.used];

    if (!node) {
      node = {
        x,
        z,
        half,
        items: [],
        children: [],
      };

      this.nodes.push(node);
    }

    node.x = x;
    node.z = z;
    node.half = half;
    node.items.length = 0;
    node.children.length = 0;

    return this.used++;
  }

  rebuild(state: SimState) {
    this.used = 0;
    const root = this.acquire(0, 0, this.halfSize);

    for (let i = 0; i < state.count; i += 1) {
      this.insert(root, state, i, 0);
    }
  }

  private insert(
    nodeIndex: number,
    state: SimState,
    item: number,
    depth: number,
  ) {
    const node = this.nodes[nodeIndex];

    if (node.children.length === 0) {
      if (node.items.length < CAPACITY || depth >= MAX_DEPTH) {
        node.items.push(item);
        return;
      }

      this.split(nodeIndex, state, depth);
    }

    const child = this.childFor(nodeIndex, state.x[item], state.z[item]);
    this.insert(child, state, item, depth + 1);
  }

  private split(nodeIndex: number, state: SimState, depth: number) {
    const node = this.nodes[nodeIndex];
    const half = node.half / 2;

    node.children.push(
      this.acquire(node.x - half, node.z - half, half),
      this.acquire(node.x + half, node.z - half, half),
      this.acquire(node.x - half, node.z + half, half),
      this.acquire(node.x + half, node.z + half, half),
    );

    const existing = [...node.items];
    node.items.length = 0;

    for (const item of existing) {
      const child = this.childFor(nodeIndex, state.x[item], state.z[item]);
      this.insert(child, state, item, depth + 1);
    }
  }

  private childFor(nodeIndex: number, x: number, z: number) {
    const node = this.nodes[nodeIndex];
    const right = x >= node.x ? 1 : 0;
    const bottom = z >= node.z ? 2 : 0;

    return node.children[right + bottom];
  }

  query(x: number, z: number, radius: number, output: number[]) {
    output.length = 0;
    this.queryNode(0, x, z, radius, output);
  }

  private queryNode(
    index: number,
    x: number,
    z: number,
    radius: number,
    output: number[],
  ) {
    const node = this.nodes[index];
    if (!node) return;

    const dx = Math.max(Math.abs(x - node.x) - node.half, 0);
    const dz = Math.max(Math.abs(z - node.z) - node.half, 0);

    if (dx * dx + dz * dz > radius * radius) return;

    output.push(...node.items);

    for (const child of node.children) {
      this.queryNode(child, x, z, radius, output);
    }
  }
}
