import type { BrandProject } from "../types"

const PREFIX = "brandme:project:"
const INDEX = "brandme:projects"

interface ProjectIndexEntry {
  id: string
  name: string
  updatedAt: number
  createdAt: number
}

export function saveProject(
  project: BrandProject,
) {
  localStorage.setItem(
    `${PREFIX}${project.id}`,
    JSON.stringify(project),
  )

  const existing =
    getProjectIndex()
      .filter((item) => item.id !== project.id)

  const next = [
    {
      id: project.id,
      name: project.name,
      updatedAt: project.updatedAt,
      createdAt: project.createdAt,
    },
    ...existing,
  ]

  localStorage.setItem(
    INDEX,
    JSON.stringify(next.slice(0, 30)),
  )
}

export function loadProject(id: string) {
  const raw = localStorage.getItem(
    `${PREFIX}${id}`,
  )

  if (!raw) {
    return null
  }

  try {
    return JSON.parse(raw) as BrandProject
  } catch {
    return null
  }
}

export function deleteProject(id: string) {
  localStorage.removeItem(`${PREFIX}${id}`)

  const next =
    getProjectIndex()
      .filter((project) => project.id !== id)

  localStorage.setItem(
    INDEX,
    JSON.stringify(next),
  )
}

export function getProjectIndex():
  ProjectIndexEntry[] {
  try {
    return JSON.parse(
      localStorage.getItem(INDEX) ?? "[]",
    )
  } catch {
    return []
  }
}

export function allProjects() {
  return getProjectIndex()
    .map((item) => loadProject(item.id))
    .filter(
      (project): project is BrandProject =>
        Boolean(project),
    )
}