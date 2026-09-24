"use client"

import { ChevronDown, ChevronUp, Copy, GripVertical, Plus, Trash2 } from "lucide-react"
import { parsePath, pathToString } from "../lib/json"
import type { ConvertTarget, FilterOperator, OperationType, TransformOperation } from "../types/operations"

type PipelineProps = {
  operations: TransformOperation[]
  onAdd: (type: OperationType) => void
  onUpdate: (id: string, patch: Partial<TransformOperation>) => void
  onDelete: (id: string) => void
  onMove: (index: number, direction: -1 | 1) => void
}

const labels: Record<OperationType, string> = { RENAME_KEY: "RENAME FIELD", DELETE: "DELETE", CONVERT_TYPE: "CONVERT TYPE", FILTER: "FILTER ARRAY" }
const descriptions: Record<OperationType, string> = { RENAME_KEY: "Change a property name", DELETE: "Remove a value", CONVERT_TYPE: "Coerce a primitive", FILTER: "Keep matching records" }

function pathText(operation: TransformOperation) { return pathToString(operation.path).replace(/^\$/, "") || "root" }

function StepEditor({ operation, onUpdate }: { operation: TransformOperation; onUpdate: PipelineProps["onUpdate"] }) {
  const updatePath = (value: string) => onUpdate(operation.id, { path: parsePath(value) })
  return (
    <div className="step-fields">
      {operation.type !== "FILTER" && <label><span>PATH</span><input value={pathText(operation)} onChange={(event) => updatePath(event.target.value)} /></label>}
      {operation.type === "RENAME_KEY" && <label><span>NEW FIELD</span><input value={operation.params.newKey ?? ""} onChange={(event) => onUpdate(operation.id, { params: { ...operation.params, newKey: event.target.value } })} /></label>}
      {operation.type === "CONVERT_TYPE" && <label><span>TARGET TYPE</span><select value={operation.params.targetType ?? "string"} onChange={(event) => onUpdate(operation.id, { params: { ...operation.params, targetType: event.target.value as ConvertTarget } })}><option value="string">string</option><option value="number">number</option><option value="boolean">boolean</option></select></label>}
      {operation.type === "FILTER" && <>
        <label><span>ARRAY PATH</span><input value={pathText(operation)} onChange={(event) => updatePath(event.target.value === "root" ? "" : event.target.value)} /></label>
        <label><span>FIELD</span><input value={operation.params.field ?? ""} onChange={(event) => onUpdate(operation.id, { params: { ...operation.params, field: event.target.value } })} /></label>
        <label><span>OPERATOR</span><select value={operation.params.operator ?? "eq"} onChange={(event) => onUpdate(operation.id, { params: { ...operation.params, operator: event.target.value as FilterOperator } })}><option value="eq">equals</option><option value="neq">does not equal</option><option value="gte">at least</option><option value="gt">greater than</option><option value="contains">contains</option></select></label>
        <label><span>VALUE</span><input value={String(operation.params.value ?? "")} onChange={(event) => onUpdate(operation.id, { params: { ...operation.params, value: event.target.value } })} /></label>
      </>}
    </div>
  )
}

export function PipelinePanel({ operations, onAdd, onUpdate, onDelete, onMove }: PipelineProps) {
  return (
    <section className="panel pipeline-panel">
      <div className="panel-heading"><div><span className="panel-index">02</span><span className="panel-title">SURGERY STEPS</span></div><span className="step-count">{operations.length} / 12</span></div>
      <div className="steps-list">
        {operations.length === 0 && <div className="empty-steps"><Copy size={18} /><p>No steps yet.</p><span>Add one below to start shaping the output.</span></div>}
        {operations.map((operation, index) => <article className={`step-card ${operation.enabled ? "" : "is-disabled"}`} key={operation.id}>
          <div className="step-topline"><span className="grip"><GripVertical size={15} /></span><span className="step-number">{String(index + 1).padStart(2, "0")}</span><select className="step-type" value={operation.type} onChange={(event) => onUpdate(operation.id, { type: event.target.value as OperationType })}>{Object.keys(labels).map((type) => <option key={type} value={type}>{labels[type as OperationType]}</option>)}</select><button className={`toggle ${operation.enabled ? "on" : ""}`} aria-label={`${operation.enabled ? "Disable" : "Enable"} ${labels[operation.type]}`} onClick={() => onUpdate(operation.id, { enabled: !operation.enabled })}><span /></button><button className="step-icon" title="Move step up" disabled={index === 0} onClick={() => onMove(index, -1)}><ChevronUp size={14} /></button><button className="step-icon" title="Move step down" disabled={index === operations.length - 1} onClick={() => onMove(index, 1)}><ChevronDown size={14} /></button><button className="step-icon danger" title="Delete step" onClick={() => onDelete(operation.id)}><Trash2 size={14} /></button></div>
          <p className="step-description">{descriptions[operation.type]}</p>
          <StepEditor operation={operation} onUpdate={onUpdate} />
        </article>)}
      </div>
      <div className="add-step"><Plus size={15} /><select aria-label="Operation to add" defaultValue="RENAME_KEY" onChange={(event) => onAdd(event.target.value as OperationType)}><option value="RENAME_KEY">Add rename field</option><option value="DELETE">Add delete</option><option value="CONVERT_TYPE">Add convert type</option><option value="FILTER">Add filter</option></select></div>
    </section>
  )
}
