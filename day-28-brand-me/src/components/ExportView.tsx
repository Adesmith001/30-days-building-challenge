import {
  Check,
  Clipboard,
  Download,
  FileJson,
  Package,
} from "lucide-react"
import {
  useMemo,
  useState,
} from "react"
import type {
  BrandProject,
  BrandSystem,
} from "../types"
import {
  downloadEverything,
  downloadText,
  exportCSS,
  exportSummary,
  exportTailwind,
  exportTokens,
} from "../lib/export"

type Tab =
  | "css"
  | "tailwind"
  | "json"
  | "summary"

export function ExportView({
  project,
  system,
}: {
  project: BrandProject
  system: BrandSystem
}) {
  const [tab, setTab] =
    useState<Tab>("css")

  const [copied, setCopied] =
    useState(false)

  const value = useMemo(() => {
    if (tab === "tailwind") {
      return exportTailwind(system)
    }

    if (tab === "json") {
      return exportTokens(system)
    }

    if (tab === "summary") {
      return exportSummary(
        project,
        system,
      )
    }

    return exportCSS(system)
  }, [tab, project, system])

  async function copy() {
    await navigator.clipboard.writeText(value)

    setCopied(true)

    setTimeout(() => {
      setCopied(false)
    }, 1200)
  }

  return (
    <div className="p-5 md:p-8">
      <div className="editor-eyebrow">
        EXPORT
      </div>

      <div className="flex flex-col justify-between gap-7 lg:flex-row lg:items-end">
        <h2 className="editor-title">
          SHIP
          <br />
          THE SYSTEM.
        </h2>

        <button
          onClick={() =>
            downloadEverything(
              project,
              system,
            )
          }
          className="flex h-12 items-center justify-center gap-2 bg-black px-5 text-xs font-bold text-white"
        >
          <Package size={15} />
          DOWNLOAD ALL
        </button>

        <button
          onClick={() =>
            downloadText(
              "brand.brandme.json",
              JSON.stringify(
                project,
                null,
                2,
              ),
              "application/json",
            )
          }
          className="editor-button"
        >
          DOWNLOAD BRAND FILE
        </button>
      </div>

      <div className="mt-10 flex overflow-x-auto border-b border-black/10">
        {[
          ["css", "CSS VARIABLES"],
          ["tailwind", "TAILWIND"],
          ["json", "JSON TOKENS"],
          ["summary", "BRAND SUMMARY"],
        ].map(([value, label]) => (
          <button
            key={value}
            onClick={() =>
              setTab(value as Tab)
            }
            className={
              tab === value
                ? "border-b-2 border-black px-4 py-3 text-[10px] font-bold"
                : "px-4 py-3 text-[10px] font-bold text-black/35"
            }
          >
            {label}
          </button>
        ))}
      </div>

      <div className="mt-5 overflow-hidden border border-black/15 bg-[#181816] text-white">
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
          <div className="flex items-center gap-2 text-[10px] font-bold tracking-[0.1em] text-white/45">
            <FileJson size={13} />
            GENERATED FROM CURRENT SYSTEM
          </div>

          <div className="flex gap-2">
            <button
              onClick={copy}
              className="flex items-center gap-2 border border-white/15 px-3 py-2 text-[10px] font-bold"
            >
              {copied ? (
                <Check size={12} />
              ) : (
                <Clipboard size={12} />
              )}

              {copied ? "COPIED" : "COPY"}
            </button>

            <button
              onClick={() =>
                downloadText(
                  tab === "json"
                    ? "brand.tokens.json"
                    : tab === "summary"
                      ? "BRAND.md"
                      : `${tab}.css`,
                  value,
                )
              }
              className="flex items-center gap-2 border border-white/15 px-3 py-2 text-[10px] font-bold"
            >
              <Download size={12} />
              DOWNLOAD
            </button>
          </div>
        </div>

        <pre className="max-h-[650px] overflow-auto p-5 font-mono text-[11px] leading-6 text-white/72">
          {value}
        </pre>
      </div>

      <div className="mt-5 flex justify-between border-t border-black/10 pt-5 text-[10px] font-bold tracking-[0.08em] text-black/35">
        <span>
          GENERATOR V{project.generatorVersion}
        </span>

        <span>
          SEED {project.seed}
        </span>
      </div>
    </div>
  )
}