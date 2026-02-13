const { VALID_RESPONSE_TYPES } = require("./config");
const { buildURL, booleanParams, cleanWords, validateLookup } = require("./params");
const { request, requestSafe } = require("./request");

const DOMAIN_BOOLEANS = {
  hideAll: "HIDETEXT",
  hideDescriptionAndLinks: "HIDEDL",
  onlyLiveTechnologies: "LIVEONLY",
  noMetaData: "NOMETA",
  noAttributeData: "NOATTR",
  noPII: "NOPII",
};

module.exports = function createClient(apiKey, moduleParams = {}) {
  if (!apiKey) {
    throw new Error("You must initialize the BuiltWith module with an api key");
  }

  const format = moduleParams.responseFormat || "json";

  if (!Object.values(VALID_RESPONSE_TYPES).includes(format)) {
    throw new Error(
      `Invalid 'responseFormat'. Valid formats are 'xml', 'txt', 'csv', 'tsv', and 'json'. You input ${format}`,
    );
  }

  if (format === VALID_RESPONSE_TYPES.TXT) {
    console.warn(
      "TXT response format is only supported for the BuiltWith Lists API. See: https://api.builtwith.com/lists-api",
    );
  }

  const url = (path, params) => buildURL(apiKey, format, path, params);
  const get = (bwURL) => request(bwURL, format);
  const getSafe = (bwURL) => requestSafe(bwURL, format);

  return {
    free: async (lookup) => {
      validateLookup(lookup);
      return get(url("free1", { LOOKUP: lookup }));
    },

    domain: async (lookup, params) => {
      validateLookup(lookup, { multi: true });
      return get(url("v22", {
        LOOKUP: Array.isArray(lookup) ? lookup.join(",") : lookup,
        ...booleanParams(params, DOMAIN_BOOLEANS),
        FDRANGE: params?.firstDetectedRange,
        LDRANGE: params?.lastDetectedRange,
      }));
    },

    lists: async (technology, params) => {
      return getSafe(url("lists12", {
        TECH: technology,
        META: params?.includeMetaData ? "yes" : undefined,
        OFFSET: params?.offset,
        SINCE: params?.since,
      }));
    },

    relationships: async (lookup) => {
      validateLookup(lookup, { multi: true });
      return get(url("rv4", {
        LOOKUP: Array.isArray(lookup) ? lookup.join(",") : lookup,
      }));
    },

    keywords: async (lookup) => {
      validateLookup(lookup, { multi: true });
      return get(url("kw2", {
        LOOKUP: Array.isArray(lookup) ? lookup.join(",") : lookup,
      }));
    },

    trends: async (technology, params) => {
      return getSafe(url("trends/v6", {
        TECH: technology,
        DATE: params?.date,
      }));
    },

    companyToUrl: async (companyName, params) => {
      return get(url("ctu3", {
        COMPANY: companyName,
        TLD: params?.tld,
        AMOUNT: params?.amount,
      }));
    },

    domainLive: async (lookup) => {
      validateLookup(lookup);
      return get(url("ddlv2", { LOOKUP: lookup }));
    },

    trust: async (lookup, params) => {
      validateLookup(lookup);
      return get(url("trustv1", {
        LOOKUP: lookup,
        WORDS: cleanWords(params?.words),
        LIVE: params?.live ? "yes" : undefined,
      }));
    },

    tags: async (lookup) => {
      validateLookup(lookup);
      return get(url("tag1", { LOOKUP: lookup }));
    },

    recommendations: async (lookup) => {
      validateLookup(lookup);
      return get(url("rec1", { LOOKUP: lookup }));
    },

    redirects: async (lookup) => {
      validateLookup(lookup);
      return get(url("redirect1", { LOOKUP: lookup }));
    },

    product: async (query) => {
      return get(url("productv1", { QUERY: query }));
    },
  };
};
