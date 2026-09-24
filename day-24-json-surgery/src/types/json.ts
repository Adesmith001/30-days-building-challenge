export type JsonPrimitive = string | number | boolean | null

export type JsonObject = { [key: string]: JsonValue }
export type JsonValue = JsonPrimitive | JsonObject | JsonValue[]

export type JsonPathSegment =
  | { type: "property"; key: string }
  | { type: "index"; index: number }
  | { type: "each" }

export type JsonPath = JsonPathSegment[]

export function isObject(value: unknown): value is JsonObject {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value)
}
