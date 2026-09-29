"use client";

import { useMemo, useState } from "react";
import { motion } from "motion/react";
import { ArrowRight, FileCode2 } from "lucide-react";
import type {
  ImpactArea,
  ReleaseSession,
} from "@/types/release";

export function ChangeMap({
  session,
}: {
  session: ReleaseSession;
}) {
  const [selected, setSelected] =
    useState<ImpactArea | null>(null);

  const areas = useMemo(() => {
    const set = new Set<ImpactArea>();

    for (const file of session.changedFiles) {
      for (const area of file.areas) {
        set.add(area);
      }
    }

    return [...set];
  }, [session.changedFiles]);

  const selectedFiles = selected
    ? session.changedFiles.filter((file) =>
        file.areas.includes(selected),
      )
    : [];

  const selectedGates = selected
    ? session.gates.filter(
        (gate) => gate.category === selected,
      )
    : [];

  return (
    <div>
      <div className="hidden min-h-[500px] grid-cols-[1fr_180px_1fr] gap-10 border border-neutral-200 bg-[#fafaf8] p-8 dark:border-neutral-800 dark:bg-neutral-950 lg:grid">
        <div>
          <Label>CHANGED FILES</Label>

          <div className="mt-5 space-y-2">
            {session.changedFiles
              .slice(0, 9)
              .map((file, index) => (
                <motion.button
                  key={file.path}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    delay: Math.min(index * 0.035, 0.3),
                  }}
                  onClick={() =>
                    setSelected(file.areas[0] ?? null)
                  }
                  className="flex w-full items-center gap-2 border border-neutral-200 bg-white p-3 text-left font-mono text-[10px] hover:border-blue-400 dark:border-neutral-800 dark:bg-neutral-900"
                >
                  <FileCode2
                    size={12}
                    className="shrink-0 text-neutral-400"
                  />

                  <span className="truncate">
                    {file.path}
                  </span>
                </motion.button>
              ))}

            {session.changedFiles.length > 9 && (
              <p className="pt-2 text-xs text-neutral-400">
                + {session.changedFiles.length - 9} more
                files
              </p>
            )}
          </div>
        </div>

        <div>
          <Label>IMPACT</Label>

          <div className="mt-5 space-y-2">
            {areas.map((area, index) => (
              <motion.button
                key={area}
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  delay: 0.15 + index * 0.05,
                }}
                onClick={() => setSelected(area)}
                className={`w-full border p-3 text-center font-mono text-[10px] font-semibold ${
                  selected === area
                    ? "border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-300"
                    : "border-neutral-300 bg-white dark:border-neutral-700 dark:bg-neutral-900"
                }`}
              >
                {area}

                <span className="mt-1 block text-[8px] font-normal text-neutral-400">
                  {
                    session.changedFiles.filter((file) =>
                      file.areas.includes(area),
                    ).length
                  }{" "}
                  FILES
                </span>
              </motion.button>
            ))}
          </div>
        </div>

        <div>
          <Label>RELEASE GATES</Label>

          <div className="mt-5 space-y-2">
            {session.gates
              .filter((gate) =>
                selected
                  ? gate.category === selected
                  : true,
              )
              .slice(0, 9)
              .map((gate, index) => (
                <motion.div
                  key={gate.id}
                  initial={{ opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    delay: 0.25 + index * 0.035,
                  }}
                  className="border border-neutral-200 bg-white p-3 dark:border-neutral-800 dark:bg-neutral-900"
                >
                  <div className="flex items-start gap-2">
                    <ArrowRight
                      size={12}
                      className="mt-0.5 shrink-0 text-neutral-400"
                    />

                    <span className="text-[10px] font-semibold">
                      {gate.title}
                    </span>
                  </div>
                </motion.div>
              ))}
          </div>
        </div>
      </div>

      <div className="space-y-5 lg:hidden">
        <FlowBlock
          label="FILES"
          values={session.changedFiles
            .slice(0, 5)
            .map((file) => file.path)}
        />

        <div className="text-center text-neutral-400">
          ↓
        </div>

        <FlowBlock
          label="IMPACT AREAS"
          values={areas}
          onClick={(value) =>
            setSelected(value as ImpactArea)
          }
        />

        <div className="text-center text-neutral-400">
          ↓
        </div>

        <FlowBlock
          label="GATES"
          values={session.gates
            .slice(0, 6)
            .map((gate) => gate.title)}
        />
      </div>

      {selected && (
        <div className="mt-5 border border-blue-200 bg-blue-50 p-5 dark:border-blue-900 dark:bg-blue-950/20">
          <div className="flex items-center justify-between">
            <div>
              <Label>SELECTED IMPACT</Label>

              <h3 className="mt-2 text-2xl font-semibold">
                {selected}
              </h3>
            </div>

            <button
              onClick={() => setSelected(null)}
              className="text-xs text-neutral-500"
            >
              CLOSE
            </button>
          </div>

          <div className="mt-5 grid gap-5 md:grid-cols-2">
            <div>
              <Label>FILES</Label>

              <div className="mt-3 space-y-2">
                {selectedFiles.map((file) => (
                  <div
                    key={file.path}
                    className="font-mono text-xs"
                  >
                    {file.path}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label>REQUIRED GATES</Label>

              <div className="mt-3 space-y-2">
                {selectedGates.map((gate) => (
                  <div
                    key={gate.id}
                    className="text-xs font-semibold"
                  >
                    {gate.title}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Label({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <p className="font-mono text-[9px] font-semibold tracking-[0.14em] text-neutral-400">
      {children}
    </p>
  );
}

function FlowBlock({
  label,
  values,
  onClick,
}: {
  label: string;
  values: string[];
  onClick?: (value: string) => void;
}) {
  return (
    <div className="border border-neutral-200 p-4 dark:border-neutral-800">
      <Label>{label}</Label>

      <div className="mt-3 space-y-2">
        {values.map((value) => (
          <button
            key={value}
            onClick={() => onClick?.(value)}
            className="block w-full border border-neutral-200 p-3 text-left font-mono text-[10px] dark:border-neutral-800"
          >
            {value}
          </button>
        ))}
      </div>
    </div>
  );
}