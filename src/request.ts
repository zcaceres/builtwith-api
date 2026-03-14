import type { z } from "zod/v4";
import { VALID_RESPONSE_TYPES } from "./config.js";
import type { ResponseFormat } from "./schemas.js";

const TEXT_FORMATS: readonly ResponseFormat[] = [
  VALID_RESPONSE_TYPES.TXT,
  VALID_RESPONSE_TYPES.XML,
  VALID_RESPONSE_TYPES.CSV,
  VALID_RESPONSE_TYPES.TSV,
];

export const request = async <T>(
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
  const data: unknown = await res.json();
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
    console.warn(
      "BuiltWith sent an invalid JSON payload. Falling back to text parsing.",
    );
    return raw;
  }
  return schema.parse(data);
};
