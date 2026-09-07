export function DeckLayers() {
  return (
    <>
      <div
        className="
          pointer-events-none absolute inset-x-3
          bottom-[-16px] top-4 rounded-2xl border
          border-[#c2ccc3] bg-[#efeeeb]
        "
      />

      <div
        className="
          pointer-events-none absolute inset-x-1.5
          bottom-[-8px] top-2 rounded-2xl border
          border-[#c2ccc3] bg-[#f7f6f3]
        "
      />
    </>
  );
}