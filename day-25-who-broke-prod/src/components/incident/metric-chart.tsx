import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type {
  Deployment,
  MetricConfig,
  MetricPoint,
} from "@/types";

interface Props {
  metric: MetricConfig;
  data: MetricPoint[];
  deploys: Deployment[];
}

export function MetricChart({
  metric,
  data,
  deploys,
}: Props) {
  const latest =
    data[data.length - 1]?.value ?? 0;

  return (
    <div className="border border-zinc-800 bg-[#0a0c0e] p-4">
      <div className="mb-5 flex items-end justify-between gap-4">
        <div>
          <p className="font-mono text-[9px] tracking-[0.14em] text-zinc-600">
            {metric.label}
          </p>

          <p className="mt-1 font-mono text-xl text-zinc-200">
            {latest.toLocaleString()}
            {metric.unit}
          </p>
        </div>

        <span className="font-mono text-[9px] text-zinc-700">
          LAST 20M
        </span>
      </div>

      <div className="h-44">
        <ResponsiveContainer
          width="100%"
          height="100%"
        >
          <LineChart
            data={data}
            syncId="incident"
            margin={{
              top: 5,
              right: 5,
              left: -24,
              bottom: 0,
            }}
          >
            <CartesianGrid
              stroke="#202328"
              strokeDasharray="2 4"
              vertical={false}
            />

            <XAxis
              dataKey="time"
              tick={{
                fill: "#52525b",
                fontSize: 9,
              }}
              axisLine={false}
              tickLine={false}
              minTickGap={50}
            />

            <YAxis
              tick={{
                fill: "#52525b",
                fontSize: 9,
              }}
              axisLine={false}
              tickLine={false}
              width={56}
            />

            <Tooltip
              contentStyle={{
                background: "#0b0d0f",
                border: "1px solid #3f3f46",
                fontSize: 11,
              }}
              labelStyle={{
                color: "#a1a1aa",
              }}
              formatter={(value) => [
                `${Number(value).toLocaleString()}${metric.unit}`,
                metric.label,
              ]}
            />

            {deploys.map((deploy) => {
              const point = data.find(
                (item) =>
                  Math.abs(
                    item.t - deploy.offset,
                  ) < 16,
              );

              if (!point) {
                return null;
              }

              return (
                <ReferenceLine
                  key={deploy.id}
                  x={point.time}
                  stroke="#d97706"
                  strokeDasharray="3 3"
                />
              );
            })}

            <Line
              dataKey="value"
              type="monotone"
              stroke="#60a5fa"
              strokeWidth={1.5}
              dot={false}
              activeDot={{
                r: 3,
                fill: "#60a5fa",
              }}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
