export function lotPosition(index: number, total: number): [number, number, number] {
  const columns = Math.ceil(Math.sqrt(total));
  const row = Math.floor(index / columns);
  const column = index % columns;
  const spacing = 1.9;
  const offset = (columns - 1) * spacing * 0.5;

  return [column * spacing - offset, 0, row * spacing - offset];
}

export function boroughForPosition(x: number, z: number): 1 | 2 | 3 | 4 {
  if (x < 0 && z < 0) {
    return 1;
  }

  if (x >= 0 && z < 0) {
    return 2;
  }

  if (x < 0 && z >= 0) {
    return 3;
  }

  return 4;
}
