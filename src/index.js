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
    free: async function(url) {
      const bwURL = constructBuiltWithURL('free1', url)

      const res = await fetch(bwURL, {})
        .then(res => {
          if (responseFormat === VALID_RESPONSE_TYPES.XML) {
            return res.text()
          } else {
            return res.json()
          }
        })

      return res
    }
  }
}

// Constructor to authenticate and get module
module.exports = function(apiKey, moduleParams) {
  return BuiltWith(apiKey, moduleParams)
}
