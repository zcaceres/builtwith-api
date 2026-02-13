import type { BooleanMapping, QueryParams } from "./types";

export const toQueryString = (params: QueryParams): string =>
  Object.entries(params)
    .filter(([, v]) => v !== undefined)
    .map(([k, v]) => `${k}=${encodeURIComponent(v!).replace(/%2C/gi, ",")}`)
    .join("&");

const booleanFlag = (value: unknown): "yes" | undefined =>
  value ? "yes" : undefined;

export const booleanParams = (
  params: object | null | undefined,
  mapping: BooleanMapping,
): QueryParams =>
  Object.fromEntries(
    Object.entries(mapping).map(([jsKey, apiKey]) => [
      apiKey,
      booleanFlag((params as Record<string, unknown> | null | undefined)?.[jsKey]),
    ]),
  );

export const cleanWords = (words: string | undefined): string | undefined =>
  words
    ? words
        .split(",")
        .map((w) => w.trim())
        .join(",")
    : undefined;

export const buildURL = (
  apiKey: string,
  format: string,
  path: string,
  params: QueryParams,
  subdomain: string = "api",
): string => {
  const base = `https://${subdomain}.builtwith.com/${path}/api.${format}?KEY=${apiKey}`;
  const qs = toQueryString(params);
  return qs ? `${base}&${qs}` : base;
};

export const validateLookup = (
  url: string | string[],
  { multi = false }: { multi?: boolean } = {},
): void => {
  if (!Array.isArray(url)) return;
  if (!multi) throw new Error("API does not allow for multi-domain LOOKUP");
  if (url.length > 16) throw new Error("Domain LOOKUP size too big (16 max)");
};
