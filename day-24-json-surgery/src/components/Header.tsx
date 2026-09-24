"use client"

import { FileUp, FlaskConical, Redo2, RotateCcw, Undo2 } from "lucide-react"

type HeaderProps = {
  canUndo: boolean
  canRedo: boolean
  onNew: () => void
  onLoadSample: () => void
  onOpenFile: (file: File) => void
  onUndo: () => void
  onRedo: () => void
}

export function Header({ canUndo, canRedo, onNew, onLoadSample, onOpenFile, onUndo, onRedo }: HeaderProps) {
  return (
    <header className="topbar">
      <div className="brand-lockup">
        <span className="brand-mark">JS</span>
        <div>
          <p className="eyebrow">LOCAL-FIRST WORKBENCH</p>
          <h1>JSON Surgery</h1>
        </div>
      </div>
      <div className="top-actions">
        <button className="text-button" onClick={onNew}>NEW</button>
        <button className="text-button" onClick={onLoadSample}><FlaskConical size={14} /> SAMPLE</button>
        <label className="icon-button" title="Open JSON file">
          <FileUp size={16} />
          <span className="sr-only">Open JSON file</span>
          <input type="file" accept=".json,application/json" hidden onChange={(event) => {
            const file = event.target.files?.[0]
            if (file) onOpenFile(file)
            event.target.value = ""
          }} />
        </label>
        <span className="toolbar-divider" />
        <button className="icon-button" title="Undo" disabled={!canUndo} onClick={onUndo}><Undo2 size={16} /></button>
        <button className="icon-button" title="Redo" disabled={!canRedo} onClick={onRedo}><Redo2 size={16} /></button>
        <button className="icon-button" title="Reset pipeline" onClick={onNew}><RotateCcw size={16} /></button>
      </div>
    </header>
  )
}
