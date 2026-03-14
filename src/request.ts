import type { z } from "zod/v4";
import { VALID_RESPONSE_TYPES } from "./config.js";
import type { ResponseFormat } from "./schemas.js";

const TEXT_FORMATS: readonly ResponseFormat[] = [
  VALID_RESPONSE_TYPES.TXT,
  VALID_RESPONSE_TYPES.XML,
  VALID_RESPONSE_TYPES.CSV,
  VALID_RESPONSE_TYPES.TSV,
];

export const request = async <T = unknown>(
  url: string,
  format: ResponseFormat,
  schema?: z.ZodType<T>,
): Promise<T | string> => {
  const res = await fetch(url);
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`BuiltWith API error ${res.status}: ${body}`);
  }
  if (TEXT_FORMATS.includes(format)) {
    return res.text();
  }
  const data = await res.json();
  if (schema) {
    const result = schema.safeParse(data);
    if (!result.success) {
      console.warn("BuiltWith API response did not match expected schema:", result.error);
      return data as T;
    }
    return result.data;
  }
  return data as T;
};

export const requestSafe = async <T = unknown>(
  url: string,
  format: ResponseFormat,
  schema?: z.ZodType<T>,
): Promise<T | string> => {
  const res = await fetch(url);
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`BuiltWith API error ${res.status}: ${body}`);
  }
  if (TEXT_FORMATS.includes(format)) {
    return res.text();
  }
  const parsed = await res.text();
  let data: unknown;
  try {
    data = JSON.parse(parsed);
  } catch {
    console.warn(
      "BuiltWith sent an invalid JSON payload. Falling back to text parsing.",
    );
    return parsed;
  }
  if (schema) {
    const result = schema.safeParse(data);
    if (!result.success) {
      console.warn("BuiltWith API response did not match expected schema:", result.error);
      return data as T;
    }
    return result.data;
  }
  return data as T;
};
