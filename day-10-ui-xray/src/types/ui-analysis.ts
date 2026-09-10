export interface Bounds {
  x: number;
  y: number;
  width: number;
  height: number;
}

export type ColorKind = "ui" | "content";

export interface RawColor {
  hex: string;
  role: string;
  kind: ColorKind;
  confidence: number;
  occurrences: number;
  bounds: Bounds[];
  usage: string[];
}

export interface TypographySample {
  role: string;
  text: string;
  estimatedSize: number;
  estimatedWeight: number;
  estimatedLineHeight: number;
  familyClass: "sans" | "serif" | "mono";
  confidence: number;
  bounds: Bounds[];
}

export interface SpacingSample {
  value: number;
  role: string;
  confidence: number;
  bounds: Bounds[];
}

export interface RadiusSample {
  value: number;
  confidence: number;
  bounds: Bounds[];
}

export interface ShadowSample {
  value: string;
  role: string;
  confidence: number;
}

export interface BorderAnalysis {
  width: number;
  style: string;
  color: string;
  confidence: number;
}

export interface DetectedSection {
  id: string;
  name: string;
  bounds: Bounds;
  confidence: number;
}

export interface ComponentTokens {
  background?: string;
  text?: string;
  radius?: string;
  padding?: string;
  type?: string;
}

export interface DetectedComponent {
  id: string;
  name: string;
  count: number;
  instances: Bounds[];
  confidence: number;
  tokens: ComponentTokens;
}

export interface LayoutAnalysis {
  contentWidth: number;
  pageGutter: number;
  columns: number;
  sidebarWidth: number | null;
  confidence: number;
}

export interface UIAnalysis {
  colors: RawColor[];
  typography: TypographySample[];
  spacing: SpacingSample[];
  radii: RadiusSample[];
  shadows: ShadowSample[];
  border: BorderAnalysis;
  components: DetectedComponent[];
  sections: DetectedSection[];
  layout: LayoutAnalysis;
  personality: string;
  confidence: number;
}

export interface ColorToken extends RawColor {
  id: string;
  name: string;
  ignored?: boolean;
  edited?: boolean;
}

export interface TypeToken {
  id: string;
  name: string;
  sample: string;
  size: number;
  weight: number;
  lineHeight: number;
  familyClass: "sans" | "serif" | "mono";
  confidence: number;
  bounds: Bounds[];
}

export interface NumberToken {
  id: string;
  name: string;
  value: number;
  confidence: number;
  bounds: Bounds[];
}

export interface DesignSystem {
  colors: ColorToken[];
  typography: TypeToken[];
  spacing: NumberToken[];
  radii: NumberToken[];
  shadows: ShadowSample[];
  border: BorderAnalysis;
  components: DetectedComponent[];
  sections: DetectedSection[];
  layout: LayoutAnalysis;
  personality: string;
  confidence: number;
}

export type XRayMode =
  | "structure"
  | "colors"
  | "type"
  | "spacing"
  | "components";

export interface ImageAsset {
  file: File;
  name: string;
  width: number;
  height: number;
  size: number;
  previewUrl: string;
  analysisDataUrl: string;
}

export interface HistoryRecord {
  id: string;
  name: string;
  createdAt: string;
  system: DesignSystem;
}