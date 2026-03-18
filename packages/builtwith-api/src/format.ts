export function formatTable(data: unknown, indent = 0): string {
  const pad = "  ".repeat(indent);
  if (data === null || data === undefined) return `${pad}(none)`;
  if (typeof data !== "object") return `${pad}${data}`;

  if (Array.isArray(data)) {
    if (data.length === 0) return `${pad}(empty)`;
    // If array of flat objects (all values are primitives), render as aligned columns
    const allFlatObjects = data.every(
      (item) =>
        typeof item === "object" &&
        item !== null &&
        !Array.isArray(item) &&
        Object.values(item as Record<string, unknown>).every((v) => v === null || typeof v !== "object"),
    );
    if (allFlatObjects) {
      const keys = [...new Set(data.flatMap((item) => Object.keys(item as Record<string, unknown>)))];
      const widths = keys.map((k) =>
        Math.max(k.length, ...data.map((item) => String((item as Record<string, unknown>)[k] ?? "").length)),
      );
      const header = keys.map((k, i) => k.padEnd(widths[i])).join("  ");
      const separator = keys.map((_, i) => "─".repeat(widths[i])).join("  ");
      const rows = data.map((item) =>
        keys.map((k, i) => String((item as Record<string, unknown>)[k] ?? "").padEnd(widths[i])).join("  "),
      );
      return [pad + header, pad + separator, ...rows.map((r) => pad + r)].join("\n");
    }
    return data.map((item, i) => `${pad}[${i}]\n${formatTable(item, indent + 1)}`).join("\n");
  }

  const entries = Object.entries(data as Record<string, unknown>);
  if (entries.length === 0) return `${pad}(empty)`;
  const maxKey = Math.max(...entries.map(([k]) => k.length));
  return entries
    .map(([key, value]) => {
      if (typeof value === "object" && value !== null) {
        return `${pad}${key}:\n${formatTable(value, indent + 1)}`;
      }
      return `${pad}${key.padEnd(maxKey)}  ${value}`;
    })
    .join("\n");
}
