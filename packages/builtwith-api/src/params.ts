import type { BooleanMapping, QueryParams } from "./schemas.js";
import { MultiLookupSchema, SingleLookupSchema } from "./schemas.js";

export const toQueryString = (params: QueryParams): string =>
  Object.entries(params)
    .filter((entry): entry is [string, string | number] => entry[1] !== undefined)
    .map(([k, v]) => `${k}=${encodeURIComponent(v).replace(/%2C/gi, ",")}`)
    .join("&");

const booleanFlag = (value: unknown): "yes" | undefined => (value ? "yes" : undefined);

export const booleanParams = (
  params: Record<string, unknown> | null | undefined,
  mapping: BooleanMapping,
): QueryParams =>
  Object.fromEntries(Object.entries(mapping).map(([jsKey, apiKey]) => [apiKey, booleanFlag(params?.[jsKey])]));

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

export const validateLookup = (url: string | string[], { multi = false }: { multi?: boolean } = {}): void => {
  if (multi) {
    MultiLookupSchema.parse(url);
  } else {
    SingleLookupSchema.parse(url);
  }
  if (Array.isArray(url)) {
    if (!multi) throw new Error("API does not allow for multi-domain LOOKUP");
    if (url.length > 16) throw new Error("Domain LOOKUP size too big (16 max)");
  }
};
