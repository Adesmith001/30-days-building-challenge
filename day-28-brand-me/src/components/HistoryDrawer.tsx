/* eslint-disable react-hooks/exhaustive-deps */
import {
  Copy,
  FolderOpen,
  Trash2,
  X,
} from "lucide-react"
import {
  useMemo,
  useState,
} from "react"
import type {
  BrandProject,
} from "../types"
import {
  allProjects,
  deleteProject,
  saveProject,
} from "../lib/storage"

interface Props {
  open: boolean
  onClose: () => void
  onOpen:
    (project: BrandProject) => void
}

export function HistoryDrawer({
  open,
  onClose,
  onOpen,
}: Props) {
  const [revision, setRevision] =
    useState(0)

  const projects = useMemo(
    () => allProjects(),
    [revision, open],
  )

  if (!open) {
    return null
  }

  return (
    <div className="fixed inset-0 z-[90] flex justify-end bg-black/25">
      <div className="h-full w-full max-w-xl overflow-y-auto border-l border-black/10 bg-[#f5f4ef] shadow-2xl">
        <header className="flex h-16 items-center justify-between border-b border-black/10 px-5">
          <div>
            <div className="editor-eyebrow">
              PROJECT HISTORY
            </div>

            <div className="text-sm font-black">
              MY BRANDS
            </div>
          </div>

          <button
            onClick={onClose}
            className="editor-icon-button"
          >
            <X size={15} />
          </button>
        </header>

        <div className="p-5">
          {projects.length === 0 && (
            <div className="border border-dashed border-black/20 p-10 text-center">
              <div className="text-sm font-bold">
                NO SAVED BRANDS YET
              </div>

              <p className="mt-2 text-xs text-black/40">
                Generated brands are saved locally.
              </p>
            </div>
          )}

          {projects.map((project) => (
            <div
              key={project.id}
              className="border-b border-black/10 py-5"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-xl font-black">
                    {project.name}
                  </div>

                  <div className="mt-2 max-w-sm text-xs leading-5 text-black/45">
                    {project.summary}
                  </div>

                  <div className="mt-3 text-[9px] font-bold tracking-[0.1em] text-black/30">
                    UPDATED{" "}
                    {new Date(
                      project.updatedAt,
                    ).toLocaleString()}
                  </div>
                </div>

                <div className="flex gap-1">
                  <button
                    onClick={() => {
                      onOpen(project)
                      onClose()
                    }}
                    className="editor-icon-button"
                    title="Open"
                  >
                    <FolderOpen size={14} />
                  </button>

                  <button
                    onClick={() => {
                      const duplicate = {
                        ...structuredClone(
                          project,
                        ),
                        id:
                          crypto.randomUUID(),
                        name:
                          `${project.name} Copy`,
                        createdAt: Date.now(),
                        updatedAt: Date.now(),
                      }

                      saveProject(duplicate)

                      setRevision(
                        (value) => value + 1,
                      )
                    }}
                    className="editor-icon-button"
                    title="Duplicate"
                  >
                    <Copy size={14} />
                  </button>

                  <button
                    onClick={() => {
                      deleteProject(project.id)

                      setRevision(
                        (value) => value + 1,
                      )
                    }}
                    className="editor-icon-button"
                    title="Delete"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <button
        aria-label="Close history"
        onClick={onClose}
        className="min-w-10 flex-1"
      />
    </div>
  )
}