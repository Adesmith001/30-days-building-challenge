import type { TransformOperation } from "../types/operations"

export const SAMPLE_JSON = JSON.stringify([
  { id: 101, first_name: "Ada", email: "ada@lumen.dev", plan: "pro", active: "true", spend: "1280" },
  { id: 102, first_name: "Tobi", email: "tobi@lumen.dev", plan: "starter", active: "true", spend: "420" },
  { id: 103, first_name: "Maya", email: "maya@lumen.dev", plan: "pro", active: "false", spend: "860" },
], null, 2)

export const SAMPLE_OPERATIONS: TransformOperation[] = [
  { id: "rename-name", type: "RENAME_KEY", enabled: true, path: [{ type: "each" }, { type: "property", key: "first_name" }], params: { newKey: "firstName" } },
  { id: "convert-spend", type: "CONVERT_TYPE", enabled: true, path: [{ type: "each" }, { type: "property", key: "spend" }], params: { targetType: "number" } },
  { id: "active-only", type: "FILTER", enabled: true, path: [], params: { field: "active", operator: "eq", value: "true" } },
]
