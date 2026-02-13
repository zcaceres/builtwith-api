import { VALID_RESPONSE_TYPES } from "./config";
import type { ResponseFormat } from "./types";

const TEXT_FORMATS: readonly ResponseFormat[] = [
  VALID_RESPONSE_TYPES.TXT,
  VALID_RESPONSE_TYPES.XML,
  VALID_RESPONSE_TYPES.CSV,
  VALID_RESPONSE_TYPES.TSV,
];

export const request = async (
  url: string,
  format: ResponseFormat,
): Promise<unknown> => {
  const res = await fetch(url);
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`BuiltWith API error ${res.status}: ${body}`);
  }
  return TEXT_FORMATS.includes(format) ? res.text() : res.json();
};

export const requestSafe = async (
  url: string,
  format: ResponseFormat,
): Promise<unknown> => {
  const res = await fetch(url);
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`BuiltWith API error ${res.status}: ${body}`);
  }
  if (TEXT_FORMATS.includes(format)) {
    return res.text();
  }
  const parsed = await res.text();
  try {
    return JSON.parse(parsed);
  } catch {
    console.warn(
      "BuiltWith sent an invalid JSON payload. Falling back to text parsing.",
    );
    return parsed;
  }
};
