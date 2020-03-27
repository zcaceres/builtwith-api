const fetch = require('node-fetch')
const _ = require('lodash')

function BuiltWith(apiKey) {
  return {
    free: async function(url, params) {
      const isXMLRequest = _.get(params, 'isXMLRequest', false)

      const bwURL = `https://api.builtwith.com/free1/api.${isXMLRequest ? 'xml' : 'json'}?KEY=${apiKey}&LOOKUP=${url}`

      const res = await fetch(bwURL, {})
        .then(res => res.json())

      return res
    }
  }
}

// Constructor to authenticate and get module
module.exports = function(apiKey) {
  return BuiltWith(apiKey)
}
