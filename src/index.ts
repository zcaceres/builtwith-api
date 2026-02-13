/* eslint-disable @typescript-eslint/no-require-imports */
// Runtime imports use require() for CJS compat with `export =`.
// Type-only imports use `import type` (erased at runtime).
const { VALID_RESPONSE_TYPES } = require("./config") as typeof import("./config");
const { buildURL, booleanParams, cleanWords, validateLookup } = require("./params") as typeof import("./params");
const { request, requestSafe } = require("./request") as typeof import("./request");

import type {
  ResponseFormat,
  ClientOptions,
  DomainParams,
  ListsParams,
  TrendsParams,
  CompanyToUrlParams,
  TrustParams,
  BuiltWithClient,
  BooleanMapping,
  QueryParams,
} from "./types";

const DOMAIN_BOOLEANS: BooleanMapping = {
  hideAll: "HIDETEXT",
  hideDescriptionAndLinks: "HIDEDL",
  onlyLiveTechnologies: "LIVEONLY",
  noMetaData: "NOMETA",
  noAttributeData: "NOATTR",
  noPII: "NOPII",
};

function createClient(
  apiKey: string,
  moduleParams: ClientOptions = {},
): BuiltWithClient {
  if (!apiKey) {
    throw new Error("You must initialize the BuiltWith module with an api key");
  }

  const format: ResponseFormat = moduleParams.responseFormat || "json";

  if (
    !(Object.values(VALID_RESPONSE_TYPES) as string[]).includes(format)
  ) {
    throw new Error(
      `Invalid 'responseFormat'. Valid formats are 'xml', 'txt', 'csv', 'tsv', and 'json'. You input ${format}`,
    );
  }

  if (format === VALID_RESPONSE_TYPES.TXT) {
    console.warn(
      "TXT response format is only supported for the BuiltWith Lists API. See: https://api.builtwith.com/lists-api",
    );
  }

  const url = (path: string, params: QueryParams) =>
    buildURL(apiKey, format, path, params);
  const get = (bwURL: string) => request(bwURL, format);
  const getSafe = (bwURL: string) => requestSafe(bwURL, format);

  return {
    free: async (lookup: string) => {
      validateLookup(lookup);
      return get(url("free1", { LOOKUP: lookup }));
    },

    domain: async (lookup: string | string[], params?: DomainParams) => {
      validateLookup(lookup, { multi: true });
      return get(
        url("v22", {
          LOOKUP: Array.isArray(lookup) ? lookup.join(",") : lookup,
          ...booleanParams(params, DOMAIN_BOOLEANS),
          FDRANGE: params?.firstDetectedRange,
          LDRANGE: params?.lastDetectedRange,
        }),
      );
    },

    lists: async (technology: string, params?: ListsParams) => {
      return getSafe(
        url("lists12", {
          TECH: technology,
          META: params?.includeMetaData ? "yes" : undefined,
          OFFSET: params?.offset,
          SINCE: params?.since,
        }),
      );
    },

    relationships: async (lookup: string | string[]) => {
      validateLookup(lookup, { multi: true });
      return get(
        url("rv4", {
          LOOKUP: Array.isArray(lookup) ? lookup.join(",") : lookup,
        }),
      );
    },

    keywords: async (lookup: string | string[]) => {
      validateLookup(lookup, { multi: true });
      return get(
        url("kw2", {
          LOOKUP: Array.isArray(lookup) ? lookup.join(",") : lookup,
        }),
      );
    },

    trends: async (technology: string, params?: TrendsParams) => {
      return getSafe(
        url("trends/v6", {
          TECH: technology,
          DATE: params?.date,
        }),
      );
    },

    companyToUrl: async (companyName: string, params?: CompanyToUrlParams) => {
      return get(
        url("ctu3", {
          COMPANY: companyName,
          TLD: params?.tld,
          AMOUNT: params?.amount,
        }),
      );
    },

    domainLive: async (lookup: string) => {
      validateLookup(lookup);
      return get(url("ddlv2", { LOOKUP: lookup }));
    },

    trust: async (lookup: string, params?: TrustParams) => {
      validateLookup(lookup);
      return get(
        url("trustv1", {
          LOOKUP: lookup,
          WORDS: cleanWords(params?.words),
          LIVE: params?.live ? "yes" : undefined,
        }),
      );
    },

    tags: async (lookup: string) => {
      validateLookup(lookup);
      return get(url("tag1", { LOOKUP: lookup }));
    },

    recommendations: async (lookup: string) => {
      validateLookup(lookup);
      return get(url("rec1", { LOOKUP: lookup }));
    },

    redirects: async (lookup: string) => {
      validateLookup(lookup);
      return get(url("redirect1", { LOOKUP: lookup }));
    },

    product: async (query: string) => {
      return get(url("productv1", { QUERY: query }));
    },
  };
}

declare namespace createClient {
  export type {
    ResponseFormat,
    ClientOptions,
    DomainParams,
    ListsParams,
    TrendsParams,
    CompanyToUrlParams,
    TrustParams,
    BuiltWithClient,
    BooleanMapping,
    QueryParams,
  };
}

export = createClient;
