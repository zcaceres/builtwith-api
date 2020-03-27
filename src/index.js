const fetch = require('node-fetch')
const _ = require('lodash')

const VALID_RESPONSE_TYPES = {
  XML: 'xml',
  JSON: 'json',
  TXT: 'txt'
}
/**
 *  Convert a parameters object into a query string, joined by the `&` char
 * { paramOne: 'hello', paramTwo: 'goodbye' }
 * @param {Object} params
 */
function paramsObjToQueryString(params) {
  // '&paramOne=hello&paramTwo=goodbye
  return Object.entries(params) // [['paramOne', 'hello'], ['paramTwo', 'goodbye]]
    .filter(([, value]) => {
      if (value === undefined) return false
      else return true
    })
    .map(([key, value]) => {
      return `${key}=${value}` // ['paramOne=hello', 'paramTwo=goodbye']
    })
    .join('&') // 'paramOne=hello&paramTwo=goodBye'
}


function BuiltWith(apiKey, moduleParams = {}) {
  const responseFormat = _.get(moduleParams, 'responseFormat')

  if (!Object.values(VALID_RESPONSE_TYPES).includes(responseFormat)) {
    throw new Error(`Invalid 'responseFormat'. Valid format are 'xml', 'txt', and 'json'. You input ${responseFormat}`)
  }

  if (responseFormat === VALID_RESPONSE_TYPES.TXT) {
    console.warn("TXT response format is only supported for the BuiltWith Lists API. See: https://api.builtwith.com/lists-api");
  }

  function constructBuiltWithURL(
    apiName,
    requestParams = {}
  ) {
    let bwURL = `https://api.builtwith.com/${apiName}/api.${responseFormat}?KEY=${apiKey}`

    if (!_.isEmpty(requestParams)) {
      bwURL += `&${paramsObjToQueryString(requestParams)}`
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

      const res = await fetch(bwURL, {}).then(res => {
        if (responseFormat === VALID_RESPONSE_TYPES.XML) {
          return res.text();
        } else {
          return res.json();
        }
      });

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

      const res = await fetch(bwURL, {}).then(res => {
        if (responseFormat === VALID_RESPONSE_TYPES.XML) {
          return res.text();
        } else {
          return res.json();
        }
      });

      return res;
    },

    /**
     * Make a request to the BuiltWith Lists API
     *
     * @see: https://api.builtwith.com/lists-api
     * @param {String} url
     * @param {Object} params
     */
    lists: async function(technologies, params) {
      const includeMetaData = _.get(params, "includeMetaData", false);
      const offset = _.get(params, "offset");
      const since = _.get(params, "since");

      const bwURL = constructBuiltWithURL("lists5", {
        TECH: technologies,
        META: includeMetaData,
        OFFSET: offset,
        SINCE: since
      });

      const res = await fetch(bwURL, {});

      if (
        responseFormat === VALID_RESPONSE_TYPES.TXT ||
        responseFormat === VALID_RESPONSE_TYPES.XML
      ) {
        return res.text();
      } else {
        /**
         * BuiltWith sends invalid formats as errors, which break JSON parsing.
         */
        let parsed = await res.text();

        try {
          return JSON.parse(parsed);
        } catch (e) {
          console.warn(
            "BuiltWith sent an invalid JSON payload. Falling back to text parsing."
          );
          return parsed;
        }
      }
    }
  };
}

// Constructor to authenticate and get module
module.exports = function(apiKey, moduleParams) {
  return BuiltWith(apiKey, moduleParams)
}
