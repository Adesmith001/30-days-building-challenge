"use client";

import {
  Check,
  CircleHelp,
  X,
} from "lucide-react";
import type {
  EnvironmentStatus,
  ReleaseSession,
} from "@/types/release";
import { useReleaseStore } from "@/stores/release-store";

export function EnvironmentPanel({
  session,
}: {
  session: ReleaseSession;
}) {
  const setEnvironment = useReleaseStore(
    (state) => state.setEnvironment,
  );

  if (!session.environments.length) {
    return (
      <Empty>
        No environment-variable changes were detected in
        this release.
      </Empty>
    );
  }

  return (
    <div>
      <p className="max-w-xl text-sm leading-6 text-neutral-500">
        Confirm whether each reference exists. ShipCheck
        stores confirmation state only — never the secret
        value.
      </p>

      <div className="mt-6 overflow-x-auto border border-neutral-200 dark:border-neutral-800">
        <table className="w-full min-w-[640px] border-collapse">
          <thead>
            <tr className="border-b border-neutral-200 text-left dark:border-neutral-800">
              <Th>REFERENCE</Th>
              <Th>LOCAL</Th>
              <Th>PREVIEW</Th>
              <Th>PRODUCTION</Th>
            </tr>
          </thead>

          <tbody>
            {session.environments.map((environment) => (
              <tr
                key={environment.key}
                className="border-b border-neutral-200 last:border-0 dark:border-neutral-800"
              >
                <td className="p-4 font-mono text-xs font-semibold">
                  {environment.key}
                </td>

                {(
                  [
                    "local",
                    "preview",
                    "production",
                  ] as const
                ).map((target) => (
                  <td key={target} className="p-4">
                    <StatusSelect
                      value={environment[target]}
                      onChange={(status) =>
                        setEnvironment(
                          environment.key,
                          target,
                          status,
                        )
                      }
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-4 font-mono text-[9px] tracking-[0.1em] text-neutral-400">
        VALUES ARE NOT STORED.
      </p>
    </div>
  );
}

function StatusSelect({
  value,
  onChange,
}: {
  value: EnvironmentStatus;
  onChange: (status: EnvironmentStatus) => void;
}) {
  const next =
    value === "not_verified"
      ? "confirmed"
      : value === "confirmed"
        ? "missing"
        : "not_verified";

  return (
    <button
      onClick={() => onChange(next)}
      className={`inline-flex items-center gap-2 border px-2.5 py-1.5 text-[10px] font-semibold ${
        value === "confirmed"
          ? "border-emerald-200 text-emerald-700"
          : value === "missing"
            ? "border-red-200 text-red-700"
            : "border-neutral-300 text-neutral-500 dark:border-neutral-700"
      }`}
    >
      {value === "confirmed" ? (
        <Check size={12} />
      ) : value === "missing" ? (
        <X size={12} />
      ) : (
        <CircleHelp size={12} />
      )}

      {value.replace("_", " ").toUpperCase()}
    </button>
  );
}

function Th({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <th className="p-4 font-mono text-[9px] tracking-[0.1em] text-neutral-400">
      {children}
    </th>
  );
}

function Empty({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="border border-neutral-200 p-6 text-sm text-neutral-500 dark:border-neutral-800">
      {children}
    </div>
  );
}