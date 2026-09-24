import { cloneJson, deleteAtPath, expandPaths, getAtPath, parsePath, setAtPath } from "./json"
import type { JsonPath, JsonValue } from "../types/json"
import type { FilterOperator, PipelineError, PipelineResult, TransformOperation } from "../types/operations"

type OperationResult = { output: JsonValue; error: string | null }

function convert(value: unknown, target: TransformOperation["params"]["targetType"]): JsonValue {
  if (target === "string") return String(value)
  if (target === "number") {
    const number = typeof value === "number" ? value : Number(value)
    if (!Number.isFinite(number)) throw new Error(`Cannot convert ${JSON.stringify(value)} to a number.`)
    return number
  }
  if (target === "boolean") {
    if (value === true || value === "true" || value === 1) return true
    if (value === false || value === "false" || value === 0) return false
    throw new Error(`Cannot convert ${JSON.stringify(value)} to a boolean.`)
  }
  throw new Error("Choose a target type.")
}

function compare(value: unknown, operator: FilterOperator, expected: unknown): boolean {
  if (operator === "eq") return value === expected
  if (operator === "neq") return value !== expected
  if (operator === "contains") return typeof value === "string" && value.toLowerCase().includes(String(expected).toLowerCase())
  if (operator === "gt") return Number(value) > Number(expected)
  if (operator === "gte") return Number(value) >= Number(expected)
  if (operator === "lt") return Number(value) < Number(expected)
  return Number(value) <= Number(expected)
}

function filterArray(value: unknown, operation: TransformOperation): JsonValue {
  if (!Array.isArray(value)) throw new Error("Filter needs an array path.")
  const fieldPath = parsePath(operation.params.field ?? "")
  const operator = operation.params.operator ?? "eq"
  return value.filter((item) => compare(getAtPath(item, fieldPath), operator, operation.params.value)) as JsonValue[]
}

export function executeOperation(input: JsonValue, operation: TransformOperation): OperationResult {
  const output = cloneJson(input)
  try {
    if (operation.type === "FILTER") {
      const targetPath = operation.path
      return { output: setAtPath(output, targetPath, filterArray(getAtPath(output, targetPath), operation)), error: null }
    }

    const concretePaths = expandPaths(output, operation.path)
    if (operation.type === "RENAME_KEY") {
      const newKey = operation.params.newKey?.trim()
      if (!newKey) throw new Error("Enter a new field name.")
      concretePaths.reverse().forEach((path) => {
        const leaf = path.at(-1)
        const parent = getAtPath(output, path.slice(0, -1))
        if (leaf?.type === "property" && parent && typeof parent === "object" && !Array.isArray(parent)) {
          const record = parent as Record<string, JsonValue>
          record[newKey] = record[leaf.key]
          delete record[leaf.key]
        }
      })
    }
    if (operation.type === "DELETE") concretePaths.reverse().forEach((path) => deleteAtPath(output, path))
    if (operation.type === "CONVERT_TYPE") concretePaths.forEach((path) => setAtPath(output, path, convert(getAtPath(output, path), operation.params.targetType)))
    return { output, error: null }
  } catch (error) {
    return { output: input, error: error instanceof Error ? error.message : "Operation failed." }
  }
}

export function executePipeline(input: JsonValue, operations: TransformOperation[]): PipelineResult {
  const started = performance.now()
  let output = cloneJson(input)
  let completedSteps = 0
  let error: PipelineError | null = null
  for (const [index, operation] of operations.entries()) {
    if (!operation.enabled) continue
    const result = executeOperation(output, operation)
    if (result.error) {
      error = { step: index + 1, operationId: operation.id, operationType: operation.type, reason: result.error }
      break
    }
    output = result.output
    completedSteps += 1
  }
  return { output, error, completedSteps, durationMs: Math.round(performance.now() - started) }
}

export function pathFromText(value: string): JsonPath {
  return parsePath(value)
}
