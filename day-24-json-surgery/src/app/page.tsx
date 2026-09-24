"use client"

import { useMemo, useState } from "react"
import { executePipeline } from "../lib/operations"
import { generateJavaScript } from "../lib/codegen"
import { SAMPLE_JSON, SAMPLE_OPERATIONS } from "../lib/samples"
import { Header } from "../components/Header"
import { JsonEditor } from "../components/JsonEditor"
import { OutputPanel } from "../components/OutputPanel"
import { PipelinePanel } from "../components/PipelinePanel"
import type { JsonValue } from "../types/json"
import type { OperationType, TransformOperation } from "../types/operations"

type Snapshot = { source: string; operations: TransformOperation[] }
const id = () => typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : Math.random().toString(36).slice(2)
const cloneOperations = (operations: TransformOperation[]) => operations.map((operation) => ({ ...operation, path: [...operation.path], params: { ...operation.params } }))

function parseSource(source: string): { value: JsonValue | null; error: string | null } {
  if (!source.trim()) return { value: null, error: "Paste JSON to begin." }
  try { return { value: JSON.parse(source) as JsonValue, error: null } } catch (error) {
    const message = error instanceof Error ? error.message : "Invalid JSON."
    const position = message.match(/position (\d+)/i)?.[1]
    const line = position ? source.slice(0, Number(position)).split("\n").length : null
    return { value: null, error: line ? `Invalid JSON near line ${line}.` : "Invalid JSON. Check your syntax." }
  }
}

function defaultOperation(type: OperationType): TransformOperation {
  const base = { id: id(), type, enabled: true, path: [], params: {} }
  if (type === "RENAME_KEY") return { ...base, path: [{ type: "each" }, { type: "property", key: "first_name" }], params: { newKey: "firstName" } }
  if (type === "DELETE") return { ...base, path: [{ type: "each" }, { type: "property", key: "secret" }] }
  if (type === "CONVERT_TYPE") return { ...base, path: [{ type: "each" }, { type: "property", key: "spend" }], params: { targetType: "number" } }
  return { ...base, params: { field: "active", operator: "eq", value: "true" } }
}

export default function Home() {
  const [source, setSource] = useState(SAMPLE_JSON)
  const [operations, setOperations] = useState<TransformOperation[]>(cloneOperations(SAMPLE_OPERATIONS))
  const [past, setPast] = useState<Snapshot[]>([])
  const [future, setFuture] = useState<Snapshot[]>([])
  const [copied, setCopied] = useState<string | null>(null)
  const parsed = useMemo(() => parseSource(source), [source])
  const result = useMemo(() => parsed.value === null ? null : executePipeline(parsed.value, operations), [parsed.value, operations])
  const generatedCode = useMemo(() => generateJavaScript(operations), [operations])
  const commit = (next: Snapshot) => { setPast((current) => [...current, { source, operations: cloneOperations(operations) }]); setFuture([]); setSource(next.source); setOperations(next.operations) }
  const updateOperations = (next: TransformOperation[]) => commit({ source, operations: next })
  const copy = async (text: string, label: string) => { await navigator.clipboard?.writeText(text); setCopied(label); window.setTimeout(() => setCopied(null), 1600) }
  const download = () => { const blob = new Blob([JSON.stringify(result?.output ?? {}, null, 2)], { type: "application/json" }); const link = document.createElement("a"); link.href = URL.createObjectURL(blob); link.download = "json-surgery-output.json"; link.click(); URL.revokeObjectURL(link.href) }
  const undo = () => { const previous = past.at(-1); if (!previous) return; setFuture((current) => [{ source, operations: cloneOperations(operations) }, ...current]); setPast((current) => current.slice(0, -1)); setSource(previous.source); setOperations(previous.operations) }
  const redo = () => { const next = future[0]; if (!next) return; setPast((current) => [...current, { source, operations: cloneOperations(operations) }]); setFuture((current) => current.slice(1)); setSource(next.source); setOperations(next.operations) }
  const loadSample = () => commit({ source: SAMPLE_JSON, operations: cloneOperations(SAMPLE_OPERATIONS) })
  const newSession = () => commit({ source: "{\n  \n}", operations: [] })
  const openFile = async (file: File) => commit({ source: await file.text(), operations: [] })
  const updateOperation = (operationId: string, patch: Partial<TransformOperation>) => updateOperations(operations.map((operation) => operation.id === operationId ? { ...operation, ...patch } : operation))
  const moveOperation = (index: number, direction: -1 | 1) => { const next = [...operations]; const target = index + direction; [next[index], next[target]] = [next[target], next[index]]; updateOperations(next) }
  return <main className="app-shell">
    <Header canUndo={past.length > 0} canRedo={future.length > 0} onNew={newSession} onLoadSample={loadSample} onOpenFile={openFile} onUndo={undo} onRedo={redo} />
    <div className="privacy-note"><span className="privacy-dot" /> Your JSON stays in this browser <span className="privacy-separator">·</span> No uploads, no accounts</div>
    <div className="workspace"><JsonEditor value={source} error={parsed.error} onChange={(value) => commit({ source: value, operations })} /><PipelinePanel operations={operations} onAdd={(type) => updateOperations([...operations, defaultOperation(type)])} onUpdate={updateOperation} onDelete={(operationId) => updateOperations(operations.filter((operation) => operation.id !== operationId))} onMove={moveOperation} /><OutputPanel output={result?.output ?? parsed.value} error={result?.error ?? null} generatedCode={generatedCode} onCopy={copy} onDownload={download} copied={copied} /></div>
    <footer className="statusbar"><span><i className="status-live" /> {result?.error ? "PIPELINE PAUSED" : "PIPELINE LIVE"}</span><span>{operations.filter((operation) => operation.enabled).length} active steps</span><span>{result?.durationMs ?? 0}ms transform</span><span className="status-spacer" /><span className="mono">DAY 24 / JSON SURGERY</span></footer>
  </main>
}
