import type {
  SortItem,
} from "../types/game";

import {
  SortTile,
} from "./SortTile";

interface Props {
  items: SortItem[];
  slots:
    Array<string | null>;
  disabled?: boolean;
  onSelect: (
    id: string,
  ) => void;
}

export function TileGrid({
  items,
  slots,
  disabled,
  onSelect,
}: Props) {
  return (
    <div
      className="
        grid
        grid-cols-2
        gap-3
      "
    >
      {items.map(
        (
          item,
          index,
        ) => {
          const selectedPosition =
            slots.findIndex(
              (id) =>
                id ===
                item.id,
            );

          return (
            <SortTile
              key={item.id}
              item={item}
              index={index}
              selectedPosition={
                selectedPosition >=
                0
                  ? selectedPosition
                  : undefined
              }
              disabled={
                disabled ||
                selectedPosition >=
                  0
              }
              onSelect={() =>
                onSelect(
                  item.id,
                )
              }
            />
          );
        },
      )}
    </div>
  );
}