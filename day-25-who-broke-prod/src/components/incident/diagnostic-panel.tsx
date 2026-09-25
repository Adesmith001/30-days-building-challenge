import { Pin } from "lucide-react";
import type {
  DiagnosticPanel as DiagnosticData,
  EvidencePin,
} from "@/types";
import { cn } from "@/lib/cn";
import { Button } from "@/components/ui/button";
import { SectionHeader } from "@/components/ui/section-header";
import { useGameStore } from "@/store/use-game-store";

interface Props {
  data: DiagnosticData;
  kind: EvidencePin["kind"];
}

export function DiagnosticPanelView({
  data,
  kind,
}: Props) {
  const pinEvidence = useGameStore(
    (state) => state.pinEvidence,
  );

  return (
    <div>
      <div className="flex items-start justify-between gap-4">
        <SectionHeader
          eyebrow={data.subtitle}
          title={data.title}
          description={data.note}
        />

        {data.evidenceId &&
          data.evidenceLabel && (
            <Button
              variant="secondary"
              onClick={() =>
                pinEvidence({
                  sourceId:
                    data.evidenceId!,
                  kind,
                  label:
                    data.evidenceLabel!,
                })
              }
            >
              <Pin size={12} />
              PIN
            </Button>
          )}
      </div>

      <div className="grid gap-px border border-zinc-800 bg-zinc-800 sm:grid-cols-2 xl:grid-cols-3">
        {data.stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-[#0a0c0e] p-5"
          >
            <p className="font-mono text-[9px] tracking-wider text-zinc-600">
              {stat.label}
            </p>

            <p
              className={cn(
                "mt-3 font-mono text-2xl",
                stat.state ===
                  "critical" &&
                  "text-red-300",
                stat.state ===
                  "warning" &&
                  "text-amber-300",
                (!stat.state ||
                  stat.state ===
                    "normal") &&
                  "text-zinc-200",
              )}
            >
              {stat.value}
            </p>

            <span
              className={cn(
                "mt-3 block font-mono text-[8px] uppercase tracking-wider",
                stat.state ===
                  "critical" &&
                  "text-red-700",
                stat.state ===
                  "warning" &&
                  "text-amber-700",
                (!stat.state ||
                  stat.state ===
                    "normal") &&
                  "text-emerald-800",
              )}
            >
              {stat.state ?? "normal"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
