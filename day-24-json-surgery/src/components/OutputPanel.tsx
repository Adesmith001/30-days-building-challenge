"use client"

import { Check, Clipboard, Code2, Download, FileJson, TriangleAlert } from "lucide-react"
import type { JsonValue } from "../types/json"
import type { PipelineError } from "../types/operations"

type OutputPanelProps = { output: JsonValue | null; error: PipelineError | null; generatedCode: string; onCopy: (text: string, label: string) => void; onDownload: () => void; copied: string | null }

export function OutputPanel({ output, error, generatedCode, onCopy, onDownload, copied }: OutputPanelProps) {
  const [tab, setTab] = React.useState<"json" | "code">("json")
  const json = output === null ? "{}" : JSON.stringify(output, null, 2)
  const copyLabel = tab === "json" ? "JSON" : "CODE"
  return (
    <section className="panel output-panel">
      <div className="panel-heading"><div><span className="panel-index">03</span><span className="panel-title">OUTPUT</span></div><span className={`output-state ${error ? "error" : "ready"}`}><span />{error ? "BLOCKED" : "LIVE"}</span></div>
      {error && <div className="pipeline-error"><TriangleAlert size={16} /><div><strong>Step {error.step} stopped the pipeline</strong><span>{error.reason}</span></div></div>}
      <div className="output-tabs"><button className={tab === "json" ? "active" : ""} onClick={() => setTab("json")}><FileJson size={14} /> JSON</button><button className={tab === "code" ? "active" : ""} onClick={() => setTab("code")}><Code2 size={14} /> JAVASCRIPT</button><span className="tab-spacer" /><button className="output-action" onClick={() => onCopy(tab === "json" ? json : generatedCode, copyLabel)}>{copied === copyLabel ? <Check size={14} /> : <Clipboard size={14} />} {copied === copyLabel ? "COPIED" : "COPY"}</button>{tab === "json" && <button className="output-action" onClick={onDownload}><Download size={14} /> SAVE</button>}</div>
      <pre className={`output-code ${tab === "code" ? "code-mode" : ""}`}><code>{tab === "json" ? json : generatedCode}</code></pre>
    </section>
  )
}

import * as React from "react"
