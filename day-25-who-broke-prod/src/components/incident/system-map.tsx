import { cn } from "@/lib/cn";
import type { IncidentScenario } from "@/types";

interface Props {
  scenario: IncidentScenario;
  compact?: boolean;
}

export function SystemMap({
  scenario,
  compact = false,
}: Props) {
  const serviceMap = Object.fromEntries(
    scenario.services.map((service) => [
      service.id,
      service,
    ]),
  );

  return (
    <div
      className={cn(
        "relative overflow-hidden border border-zinc-800 bg-[#090b0d]",
        compact
          ? "h-[300px]"
          : "h-[520px]",
      )}
    >
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.025)_1px,transparent_1px)] bg-[size:28px_28px]" />

      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        {scenario.dependencies.map(
          (edge) => {
            const from =
              serviceMap[edge.from];
            const to = serviceMap[edge.to];

            if (!from || !to) {
              return null;
            }

            return (
              <line
                key={`${edge.from}-${edge.to}`}
                x1={from.x}
                y1={from.y}
                x2={to.x}
                y2={to.y}
                stroke="#3f3f46"
                strokeWidth="0.22"
                strokeDasharray="1.3 1.3"
              />
            );
          },
        )}
      </svg>

      {scenario.services.map((service) => {
        const affected =
          service.id ===
          scenario.rootCause.componentId;

        return (
          <button
            key={service.id}
            style={{
              left: `${service.x}%`,
              top: `${service.y}%`,
            }}
            className={cn(
              "absolute min-w-[100px] -translate-x-1/2 -translate-y-1/2 border bg-[#0d0f12] px-3 py-2 text-left shadow-xl transition hover:border-zinc-500",
              affected
                ? "border-zinc-600"
                : "border-zinc-800",
            )}
          >
            <span className="block truncate font-mono text-[10px] text-zinc-300">
              {service.name}
            </span>

            <span className="mt-1 block text-[8px] uppercase tracking-wider text-zinc-600">
              {service.kind}
              {service.version
                ? ` · ${service.version}`
                : ""}
            </span>
          </button>
        );
      })}
    </div>
  );
}
