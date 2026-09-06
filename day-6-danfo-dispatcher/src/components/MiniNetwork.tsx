export function MiniNetwork() {
  return (
    <div
      className="
        relative h-48 overflow-hidden
        border border-[#aaa18d]
        bg-[#f8f6f2]
      "
    >
      <svg
        viewBox="0 0 500 220"
        className="h-full w-full"
      >
        <path
          d="M80 50 L215 95 L355 160"
          fill="none"
          stroke="#171717"
          strokeWidth="4"
        />

        <path
          d="M215 95 L150 165"
          fill="none"
          stroke="#355f4b"
          strokeWidth="3"
          strokeDasharray="8 7"
        />

        <path
          d="M355 160 L440 110"
          fill="none"
          stroke="#245eea"
          strokeWidth="3"
        />

        {[
          [80, 50],
          [215, 95],
          [150, 165],
          [355, 160],
          [440, 110],
        ].map(([x, y], index) => (
          <g key={index}>
            <circle
              cx={x}
              cy={y}
              r="13"
              fill="#f8f6f2"
              stroke="#171717"
              strokeWidth="4"
            />

            <circle
              cx={x}
              cy={y}
              r="4"
              fill={
                index === 1 ? "#ffd000" : "#171717"
              }
            />
          </g>
        ))}
      </svg>

      <div className="absolute left-6 top-5 text-[10px]">
        IKEJA
      </div>

      <div className="absolute left-[39%] top-[35%] bg-[#ffd000] px-2 py-1 text-[10px] font-bold">
        DANFO 01
      </div>

      <div className="absolute bottom-4 right-5 text-[10px] text-blue-600">
        LAGOS LAGOON
      </div>
    </div>
  );
}