import { z } from "zod";

const boundsSchema = z.object({
  x: z.number().min(0).max(1),
  y: z.number().min(0).max(1),
  width: z.number().min(0).max(1),
  height: z.number().min(0).max(1),
});

const confidence = z.number().min(0).max(1);

const hex = z
  .string()
  .regex(/^#[0-9a-fA-F]{6}$/)
  .transform((value) => value.toUpperCase());

const colorSchema = z.object({
  hex,
  role: z.string(),
  kind: z.enum(["ui", "content"]).default("ui"),
  confidence,
  occurrences: z.number().int().nonnegative().default(1),
  bounds: z.array(boundsSchema).default([]),
  usage: z.array(z.string()).default([]),
});

const typographySchema = z.object({
  role: z.string(),
  text: z.string(),
  estimatedSize: z.number().positive(),
  estimatedWeight: z.number().min(100).max(900),
  estimatedLineHeight: z.number().positive(),
  familyClass: z.enum(["sans", "serif", "mono"]),
  confidence,
  bounds: z.array(boundsSchema).default([]),
});

const spacingSchema = z.object({
  value: z.number().nonnegative(),
  role: z.string(),
  confidence,
  bounds: z.array(boundsSchema).default([]),
});

const radiusSchema = z.object({
  value: z.number().nonnegative(),
  confidence,
  bounds: z.array(boundsSchema).default([]),
});

const shadowSchema = z.object({
  value: z.string(),
  role: z.string(),
  confidence,
});

const componentSchema = z.object({
  id: z.string(),
  name: z.string(),
  count: z.number().int().positive(),
  instances: z.array(boundsSchema).default([]),
  confidence,
  tokens: z
    .object({
      background: z.string().optional(),
      text: z.string().optional(),
      radius: z.string().optional(),
      padding: z.string().optional(),
      type: z.string().optional(),
    })
    .default({}),
});

const sectionSchema = z.object({
  id: z.string(),
  name: z.string(),
  bounds: boundsSchema,
  confidence,
});

export const rawAnalysisSchema = z.object({
  colors: z.array(colorSchema).default([]),
  typography: z.array(typographySchema).default([]),
  spacing: z.array(spacingSchema).default([]),
  radii: z.array(radiusSchema).default([]),
  shadows: z.array(shadowSchema).default([]),

  border: z.object({
    width: z.number().nonnegative(),
    style: z.string(),
    color: hex,
    confidence,
  }),

  components: z.array(componentSchema).default([]),
  sections: z.array(sectionSchema).default([]),

  layout: z.object({
    contentWidth: z.number().nonnegative(),
    pageGutter: z.number().nonnegative(),
    columns: z.number().int().nonnegative(),
    sidebarWidth: z.number().nonnegative().nullable(),
    confidence,
  }),

  personality: z.string(),
  confidence,
});