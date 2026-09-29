"use client";

import { useState } from "react";
import {
  Code2,
  Files,
  Network,
} from "lucide-react";
import type { ReleaseSession } from "@/types/release";
import { ChangeMap } from "@/components/changes/change-map";

type Mode = "map" | "files" | "diff";

export function ChangesView({
  session,
}: {
  session: ReleaseSession;
}) {
  const [mode, setMode] = useState<Mode>("map");
  const [selectedFile, setSelectedFile] = useState(
    session.changedFiles[0],
  );

  return (
    <div className="mx-auto max-w-6xl p-5 md:p-8 lg:p-10">
      <div>
        <p className="font-mono text-[10px] tracking-[0.12em] text-neutral-400">
          CODE → IMPACT → GATES
        </p>

        <h1 className="mt-2 text-4xl font-semibold tracking-[-0.055em]">
          WHAT CHANGED?
        </h1>
      </div>

      <div className="mt-8 flex border-b border-neutral-200 dark:border-neutral-800">
        <Tab
          active={mode === "map"}
          onClick={() => setMode("map")}
          icon={Network}
        >
          CHANGE MAP
        </Tab>

        <Tab
          active={mode === "files"}
          onClick={() => setMode("files")}
          icon={Files}
        >
          FILES
        </Tab>

        <Tab
          active={mode === "diff"}
          onClick={() => setMode("diff")}
          icon={Code2}
        >
          DIFF
        </Tab>
      </div>

      <div className="mt-6">
        {mode === "map" && (
          <ChangeMap session={session} />
        )}

        {mode === "files" && (
          <div className="divide-y divide-neutral-200 border-y border-neutral-200 dark:divide-neutral-800 dark:border-neutral-800">
            {session.changedFiles.map((file) => (
              <button
                key={file.path}
                onClick={() => {
                  setSelectedFile(file);
                  setMode("diff");
                }}
                className="grid w-full grid-cols-[1fr_auto] gap-5 py-4 text-left"
              >
                <div className="min-w-0">
                  <p className="truncate font-mono text-xs">
                    {file.path}
                  </p>

                  <div className="mt-2 flex flex-wrap gap-1">
                    {file.areas.map((area) => (
                      <span
                        key={area}
                        className="border border-neutral-200 px-1.5 py-0.5 font-mono text-[8px] text-neutral-500 dark:border-neutral-800"
                      >
                        {area}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="font-mono text-xs">
                  <span className="text-emerald-600">
                    +{file.additions}
                  </span>{" "}
                  <span className="text-red-600">
                    -{file.deletions}
                  </span>
                </div>
              </button>
            ))}
          </div>
        )}

        {mode === "diff" && (
          <DiffViewer
            session={session}
            selected={selectedFile}
            onSelect={setSelectedFile}
          />
        )}
      </div>
    </div>
  );
}

function DiffViewer({
  session,
  selected,
  onSelect,
}: {
  session: ReleaseSession;
  selected: ReleaseSession["changedFiles"][number];
  onSelect: (
    file: ReleaseSession["changedFiles"][number],
  ) => void;
}) {
  return (
    <div className="grid gap-5 lg:grid-cols-[240px_1fr]">
      <div className="max-h-[600px] overflow-auto border border-neutral-200 dark:border-neutral-800">
        {session.changedFiles.map((file) => (
          <button
            key={file.path}
            onClick={() => onSelect(file)}
            className={`block w-full border-b border-neutral-200 p-3 text-left font-mono text-[10px] dark:border-neutral-800 ${
              selected.path === file.path
                ? "bg-blue-50 text-blue-700 dark:bg-blue-950/20 dark:text-blue-300"
                : ""
            }`}
          >
            {file.path}
          </button>
        ))}
      </div>

      <div className="min-w-0 border border-neutral-800 bg-neutral-950 text-neutral-200">
        <div className="border-b border-neutral-800 px-4 py-3 font-mono text-[10px]">
          {selected.path}
        </div>

        <pre className="max-h-[650px] overflow-auto p-4 text-[11px] leading-6">
          {(selected.patch ||
            "Patch unavailable for this file.")
            .split("\n")
            .map((line, index) => (
              <div
                key={`${index}-${line}`}
                className={
                  line.startsWith("+") &&
                  !line.startsWith("+++")
                    ? "bg-emerald-950/50 text-emerald-300"
                    : line.startsWith("-") &&
                        !line.startsWith("---")
                      ? "bg-red-950/40 text-red-300"
                      : ""
                }
              >
                <span className="mr-5 inline-block w-8 select-none text-right text-neutral-600">
                  {index + 1}
                </span>
                {line || " "}
              </div>
            ))}
        </pre>
      </div>
    </div>
  );
}

function Tab({
  active,
  onClick,
  icon: Icon,
  children,
}: {
  active: boolean;
  onClick: () => void;
  icon: typeof Network;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 border-b-2 px-4 py-3 text-xs font-semibold ${
        active
          ? "border-blue-500 text-blue-600"
          : "border-transparent text-neutral-400"
      }`}
    >
      <Icon size={14} />
      {children}
    </button>
  );
}