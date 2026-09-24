import type { JsonPath, JsonValue } from "./json"

export type OperationType = "RENAME_KEY" | "DELETE" | "CONVERT_TYPE" | "FILTER"
export type ConvertTarget = "string" | "number" | "boolean"
export type FilterOperator = "eq" | "neq" | "gt" | "gte" | "lt" | "lte" | "contains"

export type TransformOperation = {
  id: string
  type: OperationType
  enabled: boolean
  path: JsonPath
  params: {
    newKey?: string
    targetType?: ConvertTarget
    field?: string
    operator?: FilterOperator
    value?: JsonValue
  }
}

export type PipelineError = {
  step: number
  operationId: string
  operationType: OperationType
  reason: string
}

export type PipelineResult = {
  output: JsonValue
  error: PipelineError | null
  completedSteps: number
  durationMs: number
}
