import type { JsonPath, JsonPathSegment, JsonValue } from "../types/json"

export function cloneJson<T extends JsonValue>(value: T): T {
  return structuredClone(value)
}

export function parsePath(input: string): JsonPath {
  const text = input.trim().replace(/^\$\.?/, "")
  if (!text) return []

  const segments: JsonPath = []
  const pattern = /(?:^|\.)([^.[\]]+)|\[(\*|\d+|"(?:[^"\\]|\\.)*")\]/g
  for (const match of text.matchAll(pattern)) {
    if (match[1]) segments.push({ type: "property", key: match[1] })
    else if (match[2] === "*") segments.push({ type: "each" })
    else if (match[2]) {
      const token = match[2]
      segments.push(token.startsWith('"')
        ? { type: "property", key: JSON.parse(token) as string }
        : { type: "index", index: Number(token) })
    }
  }
  return segments
}

export function pathToString(path: JsonPath): string {
  if (!path.length) return "$"
  return path.reduce((result, segment) => {
    if (segment.type === "each") return `${result}[*]`
    if (segment.type === "index") return `${result}[${segment.index}]`
    return /^[A-Za-z_$][\w$]*$/.test(segment.key)
      ? `${result}.${segment.key}`
      : `${result}[${JSON.stringify(segment.key)}]`
  }, "")
}

export function getAtPath(root: unknown, path: JsonPath): unknown {
  let current = root
  for (const segment of path) {
    if (segment.type === "each" || current === null || typeof current !== "object") return undefined
    current = segment.type === "index"
      ? Array.isArray(current) ? current[segment.index] : undefined
      : Array.isArray(current) ? undefined : (current as Record<string, unknown>)[segment.key]
  }
  return current
}

export function expandPaths(root: unknown, path: JsonPath): JsonPath[] {
  const results: JsonPath[] = []
  const walk = (value: unknown, index: number, current: JsonPath) => {
    if (index === path.length) {
      results.push(current)
      return
    }
    const segment = path[index]
    if (segment.type === "each") {
      if (Array.isArray(value)) value.forEach((item, itemIndex) => walk(item, index + 1, [...current, { type: "index", index: itemIndex }]))
      return
    }
    if (segment.type === "index") {
      if (Array.isArray(value) && segment.index in value) walk(value[segment.index], index + 1, [...current, segment])
      return
    }
    if (value !== null && typeof value === "object" && !Array.isArray(value)) {
      const next = (value as Record<string, unknown>)[segment.key]
      if (segment.key in value || index === path.length - 1) walk(next, index + 1, [...current, segment])
    }
  }
  walk(root, 0, [])
  return results
}

export function setAtPath(root: JsonValue, path: JsonPath, value: JsonValue): JsonValue {
  if (!path.length) return value
  const parentPath = path.slice(0, -1)
  const leaf = path.at(-1) as JsonPathSegment
  const parent = getAtPath(root, parentPath)
  if (leaf.type === "property" && parent && typeof parent === "object" && !Array.isArray(parent)) {
    ;(parent as Record<string, JsonValue>)[leaf.key] = value
  } else if (leaf.type === "index" && Array.isArray(parent)) {
    parent[leaf.index] = value
  }
  return root
}

export function deleteAtPath(root: JsonValue, path: JsonPath): JsonValue {
  if (!path.length) return null
  const parent = getAtPath(root, path.slice(0, -1))
  const leaf = path.at(-1) as JsonPathSegment
  if (leaf.type === "property" && parent && typeof parent === "object" && !Array.isArray(parent)) delete (parent as Record<string, unknown>)[leaf.key]
  if (leaf.type === "index" && Array.isArray(parent)) parent.splice(leaf.index, 1)
  return root
}
