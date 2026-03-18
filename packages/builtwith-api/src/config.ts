import type { ResponseFormat } from "./schemas.js";

export const VALID_RESPONSE_TYPES = {
  XML: "xml",
  JSON: "json",
  TXT: "txt",
  CSV: "csv",
  TSV: "tsv",
} as const satisfies Record<string, ResponseFormat>;
