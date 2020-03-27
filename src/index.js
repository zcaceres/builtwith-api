const fetch = require('node-fetch')
const _ = require('lodash')

const VALID_RESPONSE_TYPES = {
  XML: 'xml',
  JSON: 'json'
}

function BuiltWith(apiKey, moduleParams = {}) {
  const responseFormat = _.get(moduleParams, 'responseFormat')

  if (!Object.values(VALID_RESPONSE_TYPES).includes(responseFormat)) {
    throw new Error(`Invalid 'responseFormat'. Valid format are 'xml' and 'json'. You input ${responseFormat}`)
  }

  return {
    free: async function(url) {
      const bwURL = `https://api.builtwith.com/free1/api.${responseFormat}?KEY=${apiKey}&LOOKUP=${url}`

      const res = await fetch(bwURL, {})
      // TODO: parse SML if `isXMLRequest` is true
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
