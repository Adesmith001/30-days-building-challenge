import {
  FormEvent,
  useState,
} from "react";
import { getScenario } from "@/data/incidents";
import { getScenarioLogs } from "@/lib/telemetry";
import { SectionHeader } from "@/components/ui/section-header";
import { useGameStore } from "@/store/use-game-store";

interface Entry {
  command: string;
  result: string;
}

export function TerminalPanel() {
  const run = useGameStore(
    (state) => state.run,
  );

  const [command, setCommand] =
    useState("");

  const [entries, setEntries] =
    useState<Entry[]>([
      {
        command: "help",
        result:
          "commands: incident status · kubectl get pods · kubectl logs <service> · redis info · queue stats · db stats",
      },
    ]);

  if (!run) return null;

  const activeRun = run;

  const scenario = getScenario(
    activeRun.scenarioId,
  );

  function execute(
    event: FormEvent,
  ) {
    event.preventDefault();

    const input = command.trim();

    if (!input) return;

    let result =
      "unknown simulated command";

    if (input === "help") {
      result =
        "incident status · kubectl get pods · kubectl logs <service> · redis info · queue stats · db stats";
    }

    if (input === "incident status") {
      result = `${scenario.severity} ${scenario.subtitle} · ${activeRun.status.toUpperCase()} · impact=${activeRun.impact}`;
    }

    if (input === "kubectl get pods") {
      result = scenario.services
        .filter(
          (service) =>
            service.kind === "api" ||
            service.kind === "worker",
        )
        .map(
          (service) =>
            `${service.name.padEnd(24)} 1/1 Running ${service.version ?? ""}`,
        )
        .join("\n");
    }

    if (
      input.startsWith(
        "kubectl logs ",
      )
    ) {
      const service = input.replace(
        "kubectl logs ",
        "",
      );

      result = getScenarioLogs(
        scenario,
      )
        .filter(
          (log) =>
            log.service === service,
        )
        .slice(0, 8)
        .map(
          (log) =>
            `${log.level.padEnd(5)} ${log.message}`,
        )
        .join("\n");

      if (!result) {
        result = `no logs for ${service}`;
      }
    }

    if (input === "redis info") {
      result =
        scenario.tools.cache.stats
          .map(
            (stat) =>
              `${stat.label}: ${stat.value}`,
          )
          .join("\n");
    }

    if (input === "queue stats") {
      result =
        scenario.tools.queues.stats
          .map(
            (stat) =>
              `${stat.label}: ${stat.value}`,
          )
          .join("\n");
    }

    if (input === "db stats") {
      result =
        scenario.tools.database.stats
          .map(
            (stat) =>
              `${stat.label}: ${stat.value}`,
          )
          .join("\n");
    }

    setEntries((current) => [
      ...current,
      {
        command: input,
        result,
      },
    ]);

    setCommand("");
  }

  return (
    <div>
      <SectionHeader
        eyebrow="SIMULATED SHELL"
        title="TERMINAL"
        description="Safe commands operate only against deterministic incident fixtures."
      />

      <div className="border border-zinc-800 bg-black">
        <div className="max-h-[560px] overflow-y-auto p-4 font-mono text-[11px] leading-6">
          {entries.map(
            (entry, index) => (
              <div
                key={`${entry.command}-${index}`}
                className="mb-5"
              >
                <p className="text-blue-400">
                  prod@oncall:~${" "}
                  <span className="text-zinc-300">
                    {entry.command}
                  </span>
                </p>

                <pre className="mt-1 whitespace-pre-wrap text-zinc-500">
                  {entry.result}
                </pre>
              </div>
            ),
          )}
        </div>

        <form
          onSubmit={execute}
          className="flex border-t border-zinc-800 p-3 font-mono text-xs"
        >
          <span className="mr-2 text-blue-400">
            $
          </span>

          <input
            value={command}
            onChange={(event) =>
              setCommand(
                event.target.value,
              )
            }
            autoComplete="off"
            className="w-full bg-transparent text-zinc-200 outline-none"
            placeholder="help"
          />
        </form>
      </div>
    </div>
  );
}
