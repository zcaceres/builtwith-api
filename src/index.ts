import { VALID_RESPONSE_TYPES } from "./config.js";
import { booleanParams, buildURL, cleanWords, validateLookup } from "./params.js";
import { request, requestSafe } from "./request.js";
import type {
  BooleanMapping,
  BuiltWithClient,
  ClientOptions,
  CompanyToUrlParams,
  DomainParams,
  ListsParams,
  QueryParams,
  ResponseFormat,
  TrendsParams,
  TrustParams,
} from "./schemas.js";
import {
  ClientOptionsSchema,
  CompanyToUrlParamsSchema,
  CompanyToUrlResponseSchema,
  DomainParamsSchema,
  DomainResponseSchema,
  FreeResponseSchema,
  KeywordsResponseSchema,
  ListsParamsSchema,
  ListsResponseSchema,
  ProductResponseSchema,
  RecommendationsResponseSchema,
  RedirectsResponseSchema,
  RelationshipsResponseSchema,
  TagsResponseSchema,
  TrendsParamsSchema,
  TrendsResponseSchema,
  TrustParamsSchema,
  TrustResponseSchema,
} from "./schemas.js";

const DOMAIN_BOOLEANS: BooleanMapping = {
  hideAll: "HIDETEXT",
  hideDescriptionAndLinks: "HIDEDL",
  onlyLiveTechnologies: "LIVEONLY",
  noMetaData: "NOMETA",
  noAttributeData: "NOATTR",
  noPII: "NOPII",
};

export function createClient(apiKey: string, moduleParams: ClientOptions = {}): BuiltWithClient {
  if (!apiKey) {
    throw new Error("You must initialize the BuiltWith module with an api key");
  }

  const parsed = ClientOptionsSchema.parse(moduleParams);
  const format: ResponseFormat = parsed.responseFormat || "json";

  if (format === VALID_RESPONSE_TYPES.TXT) {
    console.warn(
      "TXT response format is only supported for the BuiltWith Lists API. See: https://api.builtwith.com/lists-api",
    );
  }

  const url = (path: string, params: QueryParams) => buildURL(apiKey, format, path, params);
  const get = <T>(bwURL: string, schema: import("zod/v4").ZodType<T>) => request(bwURL, format, schema);
  const getSafe = <T>(bwURL: string, schema: import("zod/v4").ZodType<T>) => requestSafe(bwURL, format, schema);

  return {
    free: async (lookup: string) => {
      validateLookup(lookup);
      return get(url("free1", { LOOKUP: lookup }), FreeResponseSchema);
    },

    domain: async (lookup: string | string[], params?: DomainParams) => {
      validateLookup(lookup, { multi: true });
      if (params) DomainParamsSchema.parse(params);
      return get(
        url("v22", {
          LOOKUP: Array.isArray(lookup) ? lookup.join(",") : lookup,
          ...booleanParams(params, DOMAIN_BOOLEANS),
          FDRANGE: params?.firstDetectedRange,
          LDRANGE: params?.lastDetectedRange,
        }),
        DomainResponseSchema,
      );
    },

    lists: async (technology: string, params?: ListsParams) => {
      if (params) ListsParamsSchema.parse(params);
      return getSafe(
        url("lists12", {
          TECH: technology,
          META: params?.includeMetaData ? "yes" : undefined,
          OFFSET: params?.offset,
          SINCE: params?.since,
        }),
        ListsResponseSchema,
      );
    },

    relationships: async (lookup: string | string[]) => {
      validateLookup(lookup, { multi: true });
      return get(
        url("rv4", {
          LOOKUP: Array.isArray(lookup) ? lookup.join(",") : lookup,
        }),
        RelationshipsResponseSchema,
      );
    },

    keywords: async (lookup: string | string[]) => {
      validateLookup(lookup, { multi: true });
      return get(
        url("kw2", {
          LOOKUP: Array.isArray(lookup) ? lookup.join(",") : lookup,
        }),
        KeywordsResponseSchema,
      );
    },

    trends: async (technology: string, params?: TrendsParams) => {
      if (params) TrendsParamsSchema.parse(params);
      return getSafe(
        url("trends/v6", {
          TECH: technology,
          DATE: params?.date,
        }),
        TrendsResponseSchema,
      );
    },

    companyToUrl: async (companyName: string, params?: CompanyToUrlParams) => {
      if (params) CompanyToUrlParamsSchema.parse(params);
      return get(
        url("ctu3", {
          COMPANY: companyName,
          TLD: params?.tld,
          AMOUNT: params?.amount,
        }),
        CompanyToUrlResponseSchema,
      );
    },

    domainLive: async (lookup: string) => {
      validateLookup(lookup);
      return get(url("ddlv2", { LOOKUP: lookup }), DomainResponseSchema);
    },

    trust: async (lookup: string, params?: TrustParams) => {
      validateLookup(lookup);
      if (params) TrustParamsSchema.parse(params);
      return get(
        url("trustv1", {
          LOOKUP: lookup,
          WORDS: cleanWords(params?.words),
          LIVE: params?.live ? "yes" : undefined,
        }),
        TrustResponseSchema,
      );
    },

    tags: async (lookup: string) => {
      validateLookup(lookup);
      return get(url("tag1", { LOOKUP: lookup }), TagsResponseSchema);
    },

    recommendations: async (lookup: string) => {
      validateLookup(lookup);
      return get(url("rec1", { LOOKUP: lookup }), RecommendationsResponseSchema);
    },

    redirects: async (lookup: string) => {
      validateLookup(lookup);
      return get(url("redirect1", { LOOKUP: lookup }), RedirectsResponseSchema);
    },

    product: async (query: string) => {
      return get(url("productv1", { QUERY: query }), ProductResponseSchema);
    },
  };
}

export type {
  BooleanMapping,
  BuiltWithClient,
  ClientOptions,
  CompanyToUrlParams,
  DomainParams,
  ListsParams,
  QueryParams,
  ResponseFormat,
  TrendsParams,
  TrustParams,
} from "./schemas.js";
