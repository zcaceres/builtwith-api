const utils = require("./utils");
const { VALID_RESPONSE_TYPES } = require("./config");

function BuiltWith(apiKey, moduleParams = {}) {
  const responseFormat = moduleParams.responseFormat || "json";

  if (!Object.values(VALID_RESPONSE_TYPES).includes(responseFormat)) {
    throw new Error(
      `Invalid 'responseFormat'. Valid formats are 'xml', 'txt', 'csv', 'tsv', and 'json'. You input ${responseFormat}`,
    );
  }

  if (responseFormat === VALID_RESPONSE_TYPES.TXT) {
    console.warn(
      "TXT response format is only supported for the BuiltWith Lists API. See: https://api.builtwith.com/lists-api",
    );
  }

  function constructBuiltWithURL(
    apiName,
    requestParams = {},
    subdomain = "api",
  ) {
    let bwURL = `https://${subdomain}.builtwith.com/${apiName}/api.${responseFormat}?KEY=${apiKey}`;

    const qs = utils.paramsObjToQueryString(requestParams);
    if (qs) {
      bwURL += `&${qs}`;
    }

    return bwURL;
  }

  function checkUrlData(url, isMultiDomain = true) {
    if (Array.isArray(url)) {
      if (!isMultiDomain) throw new Error("API does not allow for multi-domain LOOKUP");
      if (url.length > 16) throw new Error("Domain LOOKUP size too big (16 max)");
    }
  }

  return {
    /**
     * Make a request to the BuiltWith Free API
     *
     * @see https://api.builtwith.com/free-api
     * @param {String} url
     */
    free: async function (url) {
      checkUrlData(url, false);

      const bwURL = constructBuiltWithURL("free1", {
        LOOKUP: url,
      });

      return utils.makeStandardRequest(bwURL, responseFormat);
    },

    /**
     * Make a request to the BuiltWith Domain API
     *
     * @see https://api.builtwith.com/domain-api
     * @param {(string|string[])} url
     * @param {Object} params
     */
    domain: async function (url, params) {
      checkUrlData(url);
      const hideAll = params && params.hideAll !== undefined ? params.hideAll : false;
      const noMetaData = params && params.noMetaData !== undefined ? params.noMetaData : false;
      const noAttributeData = params && params.noAttributeData !== undefined ? params.noAttributeData : false;
      const hideDescriptionAndLinks = params && params.hideDescriptionAndLinks !== undefined ? params.hideDescriptionAndLinks : false;
      const onlyLiveTechnologies = params && params.onlyLiveTechnologies !== undefined ? params.onlyLiveTechnologies : false;
      const noPII = params && params.noPII !== undefined ? params.noPII : undefined;
      const firstDetectedRange = params && params.firstDetectedRange !== undefined ? params.firstDetectedRange : undefined;
      const lastDetectedRange = params && params.lastDetectedRange !== undefined ? params.lastDetectedRange : undefined;

      const bwURL = constructBuiltWithURL("v22", {
        LOOKUP: url,
        HIDETEXT: hideAll,
        HIDEDL: hideDescriptionAndLinks,
        LIVEONLY: onlyLiveTechnologies,
        NOMETA: noMetaData,
        NOATTR: noAttributeData,
        NOPII: noPII,
        FDRANGE: firstDetectedRange,
        LDRANGE: lastDetectedRange,
      });

      return utils.makeStandardRequest(bwURL, responseFormat);
    },

    /**
     * Make a request to the BuiltWith Lists API
     *
     * @see https://api.builtwith.com/lists-api
     * @param {String} technology
     * @param {Object} params
     */
    lists: async function (technology, params) {
      const includeMetaData = params && params.includeMetaData !== undefined ? params.includeMetaData : false;
      const offset = params && params.offset;
      const since = params && params.since;

      const bwURL = constructBuiltWithURL("lists12", {
        TECH: technology,
        META: includeMetaData,
        OFFSET: offset,
        SINCE: since,
      });

      return utils.makeBulletProofRequest(bwURL, responseFormat);
    },

    /**
     * Make a request to the BuiltWith Relationships API
     *
     * @see https://api.builtwith.com/relationships-api
     * @param {(string|string[])} url
     */
    relationships: async function (url) {
      checkUrlData(url);
      const bwURL = constructBuiltWithURL("rv4", {
        LOOKUP: url,
      });

      return utils.makeStandardRequest(bwURL, responseFormat);
    },

    /**
     * Make a request to the BuiltWith Keywords API
     *
     * @see https://api.builtwith.com/keywords-api
     * @param {(string|string[])} url
     */
    keywords: async function (url) {
      checkUrlData(url);
      const bwURL = constructBuiltWithURL("kw2", {
        LOOKUP: url,
      });

      return utils.makeStandardRequest(bwURL, responseFormat);
    },

    /**
     * Make a request to the BuiltWith Trends API
     *
     * @see https://api.builtwith.com/trends-api
     * @param {String} technology
     * @param {Object} params
     */
    trends: async function (technology, params) {
      const date = params && params.date;

      const bwURL = constructBuiltWithURL("trends/v6", {
        TECH: technology,
        DATE: date,
      });

      return utils.makeBulletProofRequest(bwURL, responseFormat);
    },

    /**
     * Make a request to the BuiltWith Company to URL API
     *
     * @see https://api.builtwith.com/company-to-url-api
     * @param {String} companyName
     * @param {Object} params
     */
    companyToUrl: async function (companyName, params) {
      const tld = params && params.tld;
      const amount = params && params.amount;

      const bwURL = constructBuiltWithURL("ctu3", {
        COMPANY: encodeURIComponent(companyName),
        TLD: tld,
        AMOUNT: amount,
      });

      return utils.makeStandardRequest(bwURL, responseFormat);
    },

    /**
     * Make a request to the BuiltWith Domain Live API
     *
     * @see https://api.builtwith.com/domain-live-api
     * @param {String} url
     */
    domainLive: async function (url) {
      const bwURL = constructBuiltWithURL("ddlv2", {
        LOOKUP: url,
      });

      return utils.makeStandardRequest(bwURL, responseFormat);
    },

    /**
     * Make a request to the BuiltWith Trust API
     *
     * @see https://api.builtwith.com/trust-api
     * @param {String} url
     * @param {Object} params
     */
    trust: async function (url, params) {
      const words = (params && params.words) || "";
      const live = params && params.live !== undefined ? params.live : false;

      const bwURL = constructBuiltWithURL("trustv1", {
        LOOKUP: url,
        WORDS: words
          .split(",")
          .map((wrd) => wrd.trim())
          .join(","),
        LIVE: live,
      });

      return utils.makeStandardRequest(bwURL, responseFormat);
    },

    /**
     * Make a request to the BuiltWith Tags API
     *
     * @see https://api.builtwith.com/tags-api
     * @param {String} lookup - domain or IP (use format IP-1.2.3.4 for IP lookups)
     */
    tags: async function (lookup) {
      checkUrlData(lookup, false);

      const bwURL = constructBuiltWithURL("tag1", {
        LOOKUP: lookup,
      });

      return utils.makeStandardRequest(bwURL, responseFormat);
    },

    /**
     * Make a request to the BuiltWith Recommendations API
     *
     * @see https://api.builtwith.com/recommendations-api
     * @param {String} url
     */
    recommendations: async function (url) {
      checkUrlData(url, false);

      const bwURL = constructBuiltWithURL("rec1", {
        LOOKUP: url,
      });

      return utils.makeStandardRequest(bwURL, responseFormat);
    },

    /**
     * Make a request to the BuiltWith Redirects API
     *
     * @see https://api.builtwith.com/redirects-api
     * @param {String} url
     */
    redirects: async function (url) {
      checkUrlData(url, false);

      const bwURL = constructBuiltWithURL("redirect1", {
        LOOKUP: url,
      });

      return utils.makeStandardRequest(bwURL, responseFormat);
    },

    /**
     * Make a request to the BuiltWith Product API
     *
     * @see https://api.builtwith.com/product-api
     * @param {String} query - product search query
     */
    product: async function (query) {
      const bwURL = constructBuiltWithURL("productv1", {
        QUERY: query,
      });

      return utils.makeStandardRequest(bwURL, responseFormat);
    },
  };
}

// Constructor to authenticate and get module
module.exports = function (apiKey, moduleParams) {
  if (!apiKey) {
    throw new Error("You must initialize the BuiltWith module with an api key");
  }
  return BuiltWith(apiKey, moduleParams);
};
