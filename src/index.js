const fetch = require('node-fetch')
const _ = require('lodash')

const VALID_RESPONSE_TYPES = {
  XML: 'xml',
  JSON: 'json'
}
/**
 *  Convert a parameters object into a query string, joined by the `&` char
 * { paramOne: 'hello', paramTwo: 'goodbye' }
 * @param {Object} params
 */
function paramsObjToQueryString(params) {
  // '&paramOne=hello&paramTwo=goodbye
  return Object.entries(params) // [['paramOne', 'hello'], ['paramTwo', 'goodbye]]
    .map(([key, value]) => {
      return `${key}=${value}` // ['paramOne=hello', 'paramTwo=goodbye']
    })
    .join('&') // 'paramOne=hello&paramTwo=goodBye'
}


function BuiltWith(apiKey, moduleParams = {}) {
  const responseFormat = _.get(moduleParams, 'responseFormat')

  if (!Object.values(VALID_RESPONSE_TYPES).includes(responseFormat)) {
    throw new Error(`Invalid 'responseFormat'. Valid format are 'xml' and 'json'. You input ${responseFormat}`)
  }


  function constructBuiltWithURL(
    apiName,
    lookupURL,
    additionalParams = {}
  ) {
    let bwURL = `https://api.builtwith.com/${apiName}/api.${responseFormat}?KEY=${apiKey}&LOOKUP=${lookupURL}`

    if (!_.isEmpty(additionalParams)) {
      bwURL += `&${paramsObjToQueryString(additionalParams)}`
    }

    return bwURL
  }



  return {
    /**
     *
     * @param {*} url
     */
    free: async function(url) {
      const bwURL = constructBuiltWithURL("free1", url);

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
     *
     * @param {*} url
     * @param {*} params
     */
    domain: async function(url, params) {
      const hideAll = _.get(params, 'hideAll', false)
      const noMetaData = _.get(params, "noMetaData", false);
      const noAttributeData = _.get(params, "noAttributeData", false);
      const hideDescriptionAndLinks = _.get(params, "hideDescriptionAndLinks", false)
      const onlyLiveTechnologies = _.get(params, "onlyLiveTechnologies", false);

      const bwURL = constructBuiltWithURL("v14", url, {
        HIDETEXT: hideAll,
        HIDEDL: hideDescriptionAndLinks,
        LIVEONLY: onlyLiveTechnologies,
        NOMETA: noMetaData,
        NOATTR: noAttributeData
      })

      const res = await fetch(bwURL, {}).then(res => {
        if (responseFormat === VALID_RESPONSE_TYPES.XML) {
          return res.text();
        } else {
          return res.json();
        }
      });

      return res;
    }
  };
}

// Constructor to authenticate and get module
module.exports = function(apiKey, moduleParams) {
  return BuiltWith(apiKey, moduleParams)
}
