import { useMemo, useState } from "react";
import {
  Pin,
  Search,
} from "lucide-react";
import { getScenario } from "@/data/incidents";
import { getScenarioLogs } from "@/lib/telemetry";
import { scenarioTime } from "@/lib/time";
import { cn } from "@/lib/cn";
import { SectionHeader } from "@/components/ui/section-header";
import { useGameStore } from "@/store/use-game-store";

export function LogsPanel() {
  const run = useGameStore(
    (state) => state.run,
  );

  const pinEvidence = useGameStore(
    (state) => state.pinEvidence,
  );

  const [query, setQuery] = useState("");
  const [level, setLevel] =
    useState("ALL");

  if (!run) return null;

  const scenario = getScenario(
    run.scenarioId,
  );

  const logs = useMemo(
    () => getScenarioLogs(scenario),
    [scenario],
  );

  const visible = logs.filter((log) => {
    const matchesQuery =
      !query ||
      `${log.service} ${log.message}`
        .toLowerCase()
        .includes(query.toLowerCase());

    const matchesLevel =
      level === "ALL" ||
      log.level === level;

    return matchesQuery && matchesLevel;
  });

  return (
    <div>
      <SectionHeader
        eyebrow={`${visible.length} LOG EVENTS`}
        title="LOGS"
        description="Search for application events. Warnings may be unrelated."
      />

      <div className="mb-4 grid gap-2 md:grid-cols-[1fr_160px]">
        <label className="flex items-center gap-2 border border-zinc-800 bg-[#0a0c0e] px-3">
          <Search
            size={13}
            className="text-zinc-600"
          />

          <input
            value={query}
            onChange={(event) =>
              setQuery(
                event.target.value,
              )
            }
            placeholder="Search logs…"
            className="h-11 w-full bg-transparent font-mono text-xs outline-none placeholder:text-zinc-700"
          />
        </label>

        <select
          value={level}
          onChange={(event) =>
            setLevel(event.target.value)
          }
          className="h-11 border border-zinc-800 bg-[#0a0c0e] px-3 font-mono text-[10px] text-zinc-400 outline-none"
        >
          <option>ALL</option>
          <option>ERROR</option>
          <option>WARN</option>
          <option>INFO</option>
        </select>
      </div>

      <div className="border border-zinc-800">
        <div className="hidden grid-cols-[90px_70px_130px_1fr_40px] border-b border-zinc-800 bg-zinc-900/60 px-3 py-2 font-mono text-[9px] tracking-wider text-zinc-600 md:grid">
          <span>TIME</span>
          <span>LEVEL</span>
          <span>SERVICE</span>
          <span>MESSAGE</span>
          <span />
        </div>

        <div className="max-h-[620px] overflow-y-auto">
          {visible.map((log) => (
            <div
              key={log.id}
              className="grid gap-2 border-b border-zinc-900 px-3 py-3 font-mono text-[10px] last:border-0 md:grid-cols-[90px_70px_130px_1fr_40px]"
            >
              <span className="text-zinc-600">
                {scenarioTime(
                  scenario,
                  log.offset,
                )}
              </span>

              <span
                className={cn(
                  log.level === "ERROR" &&
                    "text-red-400",
                  log.level === "WARN" &&
                    "text-amber-400",
                  log.level === "INFO" &&
                    "text-zinc-600",
                )}
              >
                {log.level}
              </span>

              <span className="text-zinc-400">
                {log.service}
              </span>

              <span className="break-words text-zinc-300">
                {log.message}
              </span>

              {log.evidenceLabel ? (
                <button
                  onClick={() =>
                    pinEvidence({
                      sourceId: log.id,
                      kind: "log",
                      label:
                        log.evidenceLabel!,
                    })
                  }
                  title="Pin evidence"
                  className="text-zinc-600 hover:text-blue-300"
                >
                  <Pin size={13} />
                </button>
              ) : (
                <span />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
