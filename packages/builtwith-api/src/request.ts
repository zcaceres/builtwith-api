import { z } from "zod/v4";
import { VALID_RESPONSE_TYPES } from "./config.js";
import type { ResponseFormat } from "./schemas.js";

const TEXT_FORMATS: readonly ResponseFormat[] = [
  VALID_RESPONSE_TYPES.TXT,
  VALID_RESPONSE_TYPES.XML,
  VALID_RESPONSE_TYPES.CSV,
  VALID_RESPONSE_TYPES.TSV,
];

const ApiErrorSchema = z.object({
  Errors: z.array(z.object({ Message: z.string() })),
});

function checkForApiError(data: unknown): void {
  const parsed = ApiErrorSchema.safeParse(data);
  if (parsed.success && parsed.data.Errors.length > 0) {
    const messages = parsed.data.Errors.map((e) => e.Message).join("; ");
    throw new Error(`BuiltWith API error: ${messages}`);
  }
}

export const request = async <T>(url: string, format: ResponseFormat, schema: z.ZodType<T>): Promise<T | string> => {
  const res = await fetch(url);
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`BuiltWith API error ${res.status}: ${body}`);
  }
  if (TEXT_FORMATS.includes(format)) {
    return res.text();
  }
  const raw = await res.text();
  let data: unknown;
  try {
    data = JSON.parse(raw);
  } catch {
    throw new Error(`BuiltWith returned invalid JSON: ${raw.slice(0, 200)}`);
  }
  checkForApiError(data);
  return schema.parse(data);
};

export const requestSafe = async <T>(
  url: string,
  format: ResponseFormat,
  schema: z.ZodType<T>,
): Promise<T | string> => {
  const res = await fetch(url);
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`BuiltWith API error ${res.status}: ${body}`);
  }
  if (TEXT_FORMATS.includes(format)) {
    return res.text();
  }
  const raw = await res.text();
  let data: unknown;
  try {
    data = JSON.parse(raw);
  } catch {
    console.warn("BuiltWith sent an invalid JSON payload. Falling back to text parsing.");
    return raw;
  }
  checkForApiError(data);
  return schema.parse(data);
};
