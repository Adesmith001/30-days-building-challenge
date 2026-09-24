import { describe, expect, it } from "vitest"
import { parsePath } from "../lib/json"
import { executePipeline } from "../lib/operations"
import type { TransformOperation } from "../types/operations"

const op = (partial: Partial<TransformOperation>): TransformOperation => ({ id: "test", type: "DELETE", enabled: true, path: [], params: {}, ...partial })

describe("JSON Surgery operations", () => {
  it("expands wildcard paths when renaming keys", () => {
    const result = executePipeline([{ first_name: "Ada" }, { first_name: "Tobi" }], [op({
      type: "RENAME_KEY", path: parsePath("[*].first_name"), params: { newKey: "firstName" },
    })])
    expect(result.error).toBeNull()
    expect(result.output).toEqual([{ firstName: "Ada" }, { firstName: "Tobi" }])
  })

  it("deletes a field and converts strings to numbers", () => {
    const result = executePipeline({ age: "28", secret: true }, [
      op({ type: "CONVERT_TYPE", path: parsePath("age"), params: { targetType: "number" } }),
      op({ type: "DELETE", path: parsePath("secret") }),
    ])
    expect(result.output).toEqual({ age: 28 })
  })

  it("filters records using a nested field", () => {
    const result = executePipeline([{ name: "Ada", score: 97 }, { name: "Tobi", score: 62 }], [op({
      type: "FILTER", path: [], params: { field: "score", operator: "gte", value: 90 },
    })])
    expect(result.output).toEqual([{ name: "Ada", score: 97 }])
  })

  it("stops with a useful error when conversion is invalid", () => {
    const result = executePipeline({ age: "unknown" }, [op({
      type: "CONVERT_TYPE", path: parsePath("age"), params: { targetType: "number" },
    })])
    expect(result.error?.reason).toContain("Cannot convert")
    expect(result.output).toEqual({ age: "unknown" })
  })
})
