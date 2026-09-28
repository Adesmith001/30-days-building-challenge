import { create } from "zustand"
import type {
  BrandProject,
  DNAKey,
  PreviewMode,
  WorkspaceView,
} from "../types"
import {
  remixSeed,
} from "../lib/seed"
import {
  saveProject,
} from "../lib/storage"

interface BrandState {
  project: BrandProject | null

  past: BrandProject[]
  future: BrandProject[]

  view: WorkspaceView
  previewMode: PreviewMode

  theme: "light" | "dark"

  showBefore: boolean

  setProject:
    (project: BrandProject | null) => void

  checkpoint: () => void

  updateDNA:
    (key: DNAKey, value: number) => void

  setOverride:
    (
      key:
        | "primaryColor"
        | "headingFont"
        | "bodyFont",
      value?: string,
    ) => void

  toggleLock:
    (
      key:
        | "primary"
        | "headingFont"
        | "bodyFont"
        | "radii",
      value: unknown,
    ) => void

  remix: () => void

  undo: () => void
  redo: () => void

  setView: (view: WorkspaceView) => void

  setPreviewMode:
    (mode: PreviewMode) => void

  toggleTheme: () => void

  setShowBefore:
    (value: boolean) => void
}

function persist(project: BrandProject) {
  const next = {
    ...project,
    updatedAt: Date.now(),
  }

  saveProject(next)

  return next
}

export const useBrandStore =
  create<BrandState>((set, get) => ({
    project: null,

    past: [],
    future: [],

    view: "preview",
    previewMode: "landing",

    theme: "light",

    showBefore: false,

    setProject(project) {
      set({
        project,
        past: [],
        future: [],
        view: "preview",
        previewMode: "landing",
      })

      if (project) {
        saveProject(project)
      }
    },

    checkpoint() {
      const project = get().project

      if (!project) {
        return
      }

      set((state) => ({
        past: [
          ...state.past.slice(-29),
          structuredClone(project),
        ],
        future: [],
      }))
    },

    updateDNA(key, value) {
      const project = get().project

      if (!project) {
        return
      }

      const next = persist({
        ...project,
        dna: {
          ...project.dna,
          [key]:
            Math.max(
              0,
              Math.min(1, value),
            ),
        },
      })

      set({ project: next })
    },

    setOverride(key, value) {
      const project = get().project

      if (!project) {
        return
      }

      get().checkpoint()

      const next = persist({
        ...project,
        overrides: {
          ...project.overrides,
          [key]: value,
        },
      })

      set({ project: next })
    },

    toggleLock(key, value) {
      const project = get().project

      if (!project) {
        return
      }

      get().checkpoint()

      const current =
        project.locks[key]

      const locks = {
        ...project.locks,
      }

      if (current !== undefined) {
        delete locks[key]
      } else {
        Object.assign(locks, {
          [key]: value,
        })
      }

      const next = persist({
        ...project,
        locks,
      })

      set({ project: next })
    },

    remix() {
      const project = get().project

      if (!project) {
        return
      }

      get().checkpoint()

      const nextNumber =
        project.variants.length + 1

      const nextSeed = remixSeed(
        project.seed,
        nextNumber,
      )

      const next = persist({
        ...project,
        seed: nextSeed,
        variants: [
          ...project.variants,
          {
            id: crypto.randomUUID(),
            label: String.fromCharCode(
              65 + project.variants.length,
            ),
            seed: nextSeed,
            dna: structuredClone(project.dna),
            locks: structuredClone(project.locks),
            overrides:
              structuredClone(project.overrides),
          },
        ],
      })

      set({ project: next })
    },

    undo() {
      const {
        project,
        past,
        future,
      } = get()

      const previous = past.at(-1)

      if (!project || !previous) {
        return
      }

      const nextProject = persist(previous)

      set({
        project: nextProject,
        past: past.slice(0, -1),
        future: [
          structuredClone(project),
          ...future,
        ].slice(0, 30),
      })
    },

    redo() {
      const {
        project,
        past,
        future,
      } = get()

      const next = future[0]

      if (!project || !next) {
        return
      }

      const nextProject = persist(next)

      set({
        project: nextProject,
        past: [
          ...past,
          structuredClone(project),
        ].slice(-30),
        future: future.slice(1),
      })
    },

    setView(view) {
      set({ view })
    },

    setPreviewMode(previewMode) {
      set({ previewMode })
    },

    toggleTheme() {
      set((state) => ({
        theme:
          state.theme === "light"
            ? "dark"
            : "light",
      }))
    },

    setShowBefore(showBefore) {
      set({ showBefore })
    },
  }))