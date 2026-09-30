"use client";

import { useState } from "react";
import { ArrowRight, Plus, X } from "lucide-react";

import { uid } from "@/lib/utils";
import type { SessionResource } from "@/types";

export interface SessionFormValue {
  outcome: string;
  definitionOfDone: string;
  firstAction: string;
  notDoing: string;
  duration: number;
  mode: "timed" | "open";
  resources: SessionResource[];
}

interface Props {
  value: SessionFormValue;
  onChange: (value: SessionFormValue) => void;
  onContinue: () => void;
}

const durations = [25, 50, 90, 120];

export function SessionForm({
  value,
  onChange,
  onContinue,
}: Props) {
  const [custom, setCustom] = useState(false);
  const [showScope, setShowScope] =
    useState(false);

  const valid =
    value.outcome.trim() &&
    value.definitionOfDone.trim() &&
    value.firstAction.trim();

  const patch = (
    update: Partial<SessionFormValue>,
  ) => onChange({ ...value, ...update });

  function addResource() {
    patch({
      resources: [
        ...value.resources,
        {
          id: uid(),
          type: "link",
          label: "",
          value: "",
        },
      ],
    });
  }

  function updateResource(
    id: string,
    field: "label" | "value",
    next: string,
  ) {
    patch({
      resources: value.resources.map(
        (resource) =>
          resource.id === id
            ? {
                ...resource,
                [field]: next,
              }
            : resource,
      ),
    });
  }

  return (
    <div className="mx-auto max-w-4xl">
      <header>
        <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--muted)]">
          New session
        </p>

        <h1 className="editorial mt-6 text-5xl leading-[0.9] md:text-7xl">
          What needs
          <br />
          your full attention?
        </h1>
      </header>

      <div className="mt-14 space-y-9">
        <Field
          label="Session outcome"
          value={value.outcome}
          placeholder="Finish Google OAuth."
          onChange={(outcome) =>
            patch({ outcome })
          }
          large
        />

        <Field
          label="What does done look like?"
          value={value.definitionOfDone}
          placeholder="Login, session persistence and logout all work locally."
          onChange={(definitionOfDone) =>
            patch({ definitionOfDone })
          }
        />

        <Field
          label="First action"
          value={value.firstAction}
          placeholder="Verify OAuth provider redirect configuration."
          onChange={(firstAction) =>
            patch({ firstAction })
          }
        />

        <section>
          <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--muted)]">
            Session length
          </p>

          <div className="flex flex-wrap gap-2">
            {durations.map((duration) => (
              <button
                key={duration}
                onClick={() => {
                  setCustom(false);

                  patch({
                    mode: "timed",
                    duration,
                  });
                }}
                className={`border px-4 py-3 text-xs font-semibold ${
                  value.mode === "timed" &&
                  value.duration === duration &&
                  !custom
                    ? "bg-[var(--foreground)] text-[var(--background)]"
                    : ""
                }`}
              >
                {duration} MIN
              </button>
            ))}

            <button
              onClick={() => {
                setCustom(true);
                patch({ mode: "timed" });
              }}
              className="border px-4 py-3 text-xs font-semibold"
            >
              CUSTOM
            </button>

            <button
              onClick={() => {
                setCustom(false);
                patch({ mode: "open" });
              }}
              className={`border px-4 py-3 text-xs font-semibold ${
                value.mode === "open"
                  ? "bg-[var(--foreground)] text-[var(--background)]"
                  : ""
              }`}
            >
              OPEN SESSION
            </button>
          </div>

          {custom && (
            <div className="mt-4 max-w-44">
              <input
                type="number"
                min={5}
                value={value.duration}
                onChange={(event) =>
                  patch({
                    duration: Math.max(
                      5,
                      Number(event.target.value),
                    ),
                  })
                }
                className="w-full border-b bg-transparent py-3 text-lg outline-none"
              />

              <p className="mt-1 text-[9px] uppercase tracking-[0.18em] text-[var(--muted)]">
                Minutes
              </p>
            </div>
          )}
        </section>

        <button
          onClick={() =>
            setShowScope((value) => !value)
          }
          className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em]"
        >
          {showScope ? (
            <X size={14} />
          ) : (
            <Plus size={14} />
          )}

          Keep this session small
        </button>

        {showScope && (
          <div className="space-y-8 border-l pl-5 md:pl-7">
            <Field
              label="Not doing this session"
              value={value.notDoing}
              placeholder="Redesigning the auth UI."
              onChange={(notDoing) =>
                patch({ notDoing })
              }
            />

            <section>
              <div className="mb-4 flex items-center justify-between">
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--muted)]">
                  Resources
                </p>

                <button
                  onClick={addResource}
                  className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-[0.16em]"
                >
                  <Plus size={12} />
                  Add
                </button>
              </div>

              <div className="space-y-3">
                {value.resources.map(
                  (resource) => (
                    <div
                      key={resource.id}
                      className="grid gap-2 md:grid-cols-[180px_1fr]"
                    >
                      <input
                        value={resource.label}
                        onChange={(event) =>
                          updateResource(
                            resource.id,
                            "label",
                            event.target.value,
                          )
                        }
                        placeholder="GitHub issue"
                        className="border-b bg-transparent py-2 outline-none"
                      />

                      <input
                        value={resource.value}
                        onChange={(event) =>
                          updateResource(
                            resource.id,
                            "value",
                            event.target.value,
                          )
                        }
                        placeholder="https://..."
                        className="border-b bg-transparent py-2 outline-none"
                      />
                    </div>
                  ),
                )}
              </div>
            </section>
          </div>
        )}

        <div className="pt-4">
          <button
            disabled={!valid}
            onClick={onContinue}
            className="flex w-full items-center justify-between bg-[var(--foreground)] px-5 py-4 text-xs font-bold uppercase tracking-[0.16em] text-[var(--background)] disabled:cursor-not-allowed disabled:opacity-30 md:w-auto md:min-w-64"
          >
            Continue
            <ArrowRight size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  placeholder,
  onChange,
  large = false,
}: {
  label: string;
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
  large?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-3 block text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--muted)]">
        {label}
      </span>

      <textarea
        rows={large ? 2 : 2}
        value={value}
        placeholder={placeholder}
        onChange={(event) =>
          onChange(event.target.value)
        }
        className={`w-full resize-none border-b bg-transparent pb-4 outline-none placeholder:text-[var(--muted)]/50 ${
          large
            ? "editorial text-3xl leading-tight md:text-5xl"
            : "text-lg leading-7"
        }`}
      />
    </label>
  );
}