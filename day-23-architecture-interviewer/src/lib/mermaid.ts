function quoteLabel(label: string) {
  const trimmed = label.trim();

  if (
    trimmed.startsWith('"') &&
    trimmed.endsWith('"')
  ) {
    return trimmed;
  }

  return `"${trimmed
    .replaceAll("\\", "\\\\")
    .replaceAll('"', '\\"')}"`;
}

export function normalizeMermaidCode(
  code: string,
) {
  return code
    .trim()
    .replace(/^```(?:mermaid)?\s*/i, "")
    .replace(/\s*```$/, "")
    .trim()
    .split(/\r?\n/)
    .map((line) =>
      line.replace(
        /\b([A-Za-z_][\w-]*)\[([^\]\r\n]+)\]/g,
        (_match, id: string, label: string) =>
          `${id}[${quoteLabel(label)}]`,
      ),
    )
    .join("\n");
}
