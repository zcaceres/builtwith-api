const _ = require('lodash')

const utils = require("./utils")
const { VALID_RESPONSE_TYPES } = require("./config")


function BuiltWith(apiKey, moduleParams = {}) {
  const responseFormat = _.get(moduleParams, 'responseFormat', 'json')

  if (!Object.values(VALID_RESPONSE_TYPES).includes(responseFormat)) {
    throw new Error(`Invalid 'responseFormat'. Valid format are 'xml', 'txt', and 'json'. You input ${responseFormat}`)
  }

  if (responseFormat === VALID_RESPONSE_TYPES.TXT) {
    console.warn("TXT response format is only supported for the BuiltWith Lists API. See: https://api.builtwith.com/lists-api");
  }

  function constructBuiltWithURL(
    apiName,
    requestParams = {},
    subdomain = 'api'
  ) {
    let bwURL = `https://${subdomain}.builtwith.com/${apiName}/api.${responseFormat}?KEY=${apiKey}`

    if (!_.isEmpty(requestParams)) {
      bwURL += `&${utils.paramsObjToQueryString(requestParams)}`
    }

    return bwURL
  }


  return {
    /**
     * Make a request to the BuiltWith Free API
     *
     * @see https://api.builtwith.com/free-api
     * @param {String} url
     */
    free: async function(url) {
      const bwURL = constructBuiltWithURL("free1", {
        LOOKUP: url
      });

      const res = await utils.makeStandardRequest(bwURL, responseFormat)
      return res;
    },

    /**
     * Make a request to the BuiltWith Domain API
     *
     * @see https://api.builtwith.com/domain-api
     * @param {String} url
     * @param {Object} params
     */
    domain: async function(url, params) {
      const hideAll = _.get(params, "hideAll", false);
      const noMetaData = _.get(params, "noMetaData", false);
      const noAttributeData = _.get(params, "noAttributeData", false);
      const hideDescriptionAndLinks = _.get(
        params,
        "hideDescriptionAndLinks",
        false
      );
      const onlyLiveTechnologies = _.get(params, "onlyLiveTechnologies", false);

      const bwURL = constructBuiltWithURL("v14", {
        LOOKUP: url,
        HIDETEXT: hideAll,
        HIDEDL: hideDescriptionAndLinks,
        LIVEONLY: onlyLiveTechnologies,
        NOMETA: noMetaData,
        NOATTR: noAttributeData
      });

      const res = await utils.makeStandardRequest(bwURL, responseFormat);

      return res;
    },

    /**
     * Make a request to the BuiltWith Lists API
     *
     * @see: https://api.builtwith.com/lists-api
     * @param {String} technology
     * @param {Object} params
     */
    lists: async function(technology, params) {
      const includeMetaData = _.get(params, "includeMetaData", false);
      const offset = _.get(params, "offset");
      const since = _.get(params, "since");

      const bwURL = constructBuiltWithURL("lists5", {
        TECH: technology,
        META: includeMetaData,
        OFFSET: offset,
        SINCE: since
      });

      const res = await utils.makeBulletProofRequest(bwURL)
      return res
    },

    /**
     * Make a request to the BuiltWith Relationships API
     *
     * @note Relationships API may throw an error related to the maxJSONLength property for certain URLs. This is thrown in BuiltWith and cannot be handled here.
     *
     * @see https://api.builtwith.com/relationships-api
     * @param {String} url
     */
    relationships: async function(url) {
      const bwURL = constructBuiltWithURL("rv1", {
        LOOKUP: url
      });

      const res = await utils.makeStandardRequest(bwURL, responseFormat);

      return res;
    },

    /**
     * Make a request to the BuiltWith Keywords API
     *
     * @see https://api.builtwith.com/keywords-api
     * @param {String} url
     */
    keywords: async function(url) {
      const bwURL = constructBuiltWithURL("kw2", {
        LOOKUP: url
      });

      const res = await utils.makeStandardRequest(bwURL, responseFormat)
      return res;
    },

    /**
     * Make a request to the BuiltWith Trends API
     *
     * @see: https://api.builtwith.com/trends-api
     * @param {String} technology
     * @param {Object} params
     */
    trends: async function(technology, params) {
      const date = _.get(params, "date");

      const bwURL = constructBuiltWithURL("trends/v6", {
        TECH: technology,
        DATE: date
      });

      const res = await utils.makeBulletProofRequest(bwURL);
      return res
    },

    /**
     * Make a request to the BuiltWith Company to URL API
     *
     * @see: https://api.builtwith.com/trends-api
     * @param {String} companyName
     * @param {Object} params
     */
    companyToUrl: async function(companyName, params) {
      const tld = _.get(params, "tld");
      const amount = _.get(params, "noMetaData");

      const bwURL = constructBuiltWithURL(
        "ctu1",
        {
          COMPANY: encodeURIComponent(companyName),
          TLD: tld,
          AMOUNT: amount
        },
        "ctu"
      );

      const res = await utils.makeStandardRequest(bwURL, responseFormat)
      return res;
    },

    /**
     * Make a request to the BuiltWith Domain Live API
     *
     * @see https://api.builtwith.com/domain-live-api
     * @param {String} url
     */
    domainLive: async function(url) {
      const bwURL = constructBuiltWithURL("dlv1", {
        LOOKUP: url
      });

      const res = await utils.makeStandardRequest(bwURL, responseFormat)
      return res;
    },

    /**
     * Make a request to the BuiltWith Domain Live API
     *
     * @see https://api.builtwith.com/trust-api
     * @param {String} url
     * @param {Object} params
     */
    trust: async function(url, params) {
      const words = _.get(params, "words", "")
      const live = _.get(params, "live", false)

      const bwURL = constructBuiltWithURL("trustv1", {
        LOOKUP: url,
        // 'wordOne, wordTwo' ==> 'wordOne,wordTwo'
        WORDS: words.split(',').map(wrd => wrd.trim()).join(','),
        LIVE: live
      });

      const res = await utils.makeStandardRequest(bwURL, responseFormat)
      return res;
    },

  };
}

// Constructor to authenticate and get module
module.exports = function(apiKey, moduleParams) {
  if (!apiKey) {
    throw new Error('You must initialize the BuiltWith module with an api key')
  }
  return BuiltWith(apiKey, moduleParams)
}
