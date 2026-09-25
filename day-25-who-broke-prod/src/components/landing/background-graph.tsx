export function BackgroundGraph() {
  return (
    <svg
      className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.12]"
      viewBox="0 0 1200 700"
      aria-hidden="true"
    >
      <g
        fill="none"
        stroke="#64748b"
        strokeWidth="1"
      >
        <path d="M70 360 H270" />
        <path d="M350 360 H550" />
        <path d="M630 360 L790 190" />
        <path d="M630 360 H790" />
        <path d="M630 360 L790 530" />
        <path d="M870 530 H1080" />
      </g>

      {[
        [70, 360],
        [270, 360],
        [550, 360],
        [790, 190],
        [790, 360],
        [790, 530],
        [1080, 530],
      ].map(([x, y], index) => (
        <rect
          key={index}
          x={x - 24}
          y={y - 10}
          width="48"
          height="20"
          fill="#111827"
          stroke="#64748b"
        />
      ))}
    </svg>
  );
}
