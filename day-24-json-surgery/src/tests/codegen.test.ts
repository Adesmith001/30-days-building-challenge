import { describe, expect, it } from "vitest"
import { generateJavaScript } from "../lib/codegen"
import { executePipeline } from "../lib/operations"
import { parsePath } from "../lib/json"
import type { TransformOperation } from "../types/operations"

describe("generated JavaScript", () => {
  it("matches the internal pipeline output", () => {
    const input = [{ first_name: "Ada", age: "28" }, { first_name: "Tobi", age: "17" }]
    const operations: TransformOperation[] = [
      { id: "rename", type: "RENAME_KEY", enabled: true, path: parsePath("[*].first_name"), params: { newKey: "firstName" } },
      { id: "convert", type: "CONVERT_TYPE", enabled: true, path: parsePath("[*].age"), params: { targetType: "number" } },
      { id: "filter", type: "FILTER", enabled: true, path: [], params: { field: "age", operator: "gte", value: 18 } },
    ]
    const source = generateJavaScript(operations).replaceAll("export ", "")
    const transform = new Function(`${source}; return transform;`)() as (value: unknown) => unknown
    expect(transform(input)).toEqual(executePipeline(input, operations).output)
  })
})
