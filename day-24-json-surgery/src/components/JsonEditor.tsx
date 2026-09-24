"use client"

import { AlertCircle, Braces } from "lucide-react"

type JsonEditorProps = {
  value: string
  error: string | null
  onChange: (value: string) => void
}

export function JsonEditor({ value, error, onChange }: JsonEditorProps) {
  const lines = value.split("\n").length
  return (
    <section className="panel editor-panel">
      <div className="panel-heading">
        <div><span className="panel-index">01</span><span className="panel-title">INPUT JSON</span></div>
        <span className="panel-meta"><Braces size={13} /> {value.length.toLocaleString()} bytes</span>
      </div>
      <div className="editor-wrap">
        <div className="line-count" aria-hidden="true">{Array.from({ length: Math.max(lines, 1) }, (_, index) => <span key={index}>{String(index + 1).padStart(2, "0")}</span>)}</div>
        <textarea aria-label="Input JSON" spellCheck={false} value={value} onChange={(event) => onChange(event.target.value)} />
      </div>
      {error ? <div className="error-strip" role="alert"><AlertCircle size={15} /><span>{error}</span></div> : <p className="editor-hint">Edit the source directly. All transformations run in your browser.</p>}
    </section>
  )
}
