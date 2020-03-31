# Builtwith API

`builtwith-api` is a utility wrapper for the BuiltWith API suite.

## Features

Response Formats
- JSON support
- XML support
- TXT support (only for lists API)

APIS
- free
- domain
- lists
- relationships
- keywords
- trends
- companyToUrl
- domainLive
- trust

________________

## How To Use

```js
const builtwith = require('builtwith')

const builtwith = BuiltWith(process.env.YOUR_BUILTWITH_API_KEY, {
  responseFormat: 'json' // 'json' 'xml' 'txt' (only for lists API)
})

const url = 'facebook.com'

await builtwith.free(url)

await builtwith.domain(url, {
  // This will hide technology description, link, tag and category fields
  hideAll: false,
  // This will hide technology description and link fields (but keep tag and categories)
  hideDescriptionAndLinks: false,
  // This will only return technologies we consider to be live
  onlyLiveTechnologies: true,
  // No meta data (like address, names etc..) will be returned. Improves performance.
  noMetaData: true,
  // No attributes data will be returned
  noAttributeData: true
})

const technologies = 'Shopify'
// The name of a technology. Spaces automatically replaced with dashes (-).
await builtwith.lists(technology, {
  // Brings back meta data with the results, which includes names, titles, social links, addresses, emails, telephone numbers, traffic ranks etc.
  includeMetaData: true,
  // Gets the next page of results - use the exact value from NextOffset in response. If the value of NextOffset is END there are no more results.
  offset: 'oQEwEnH2FJuIzeXOEk2T',
  // Gets live sites using the technology since a certain time, accepts dates and queries i.e. 30 Days Ago or Last January for example.
  since: '2016-01-20'
})

await builtwith.relationships(url)

await builtwith.keywords(url)

await builtwith.trends(technology, {
  // Totals will be the closest to this date - providing the ability to get historical totals
  date: '2016-01-20'
})

const companyName = 'Shell'
await builtwith.companyToUrl(companyName, {
  // Bring back domains in order of priority - the first result is generally the one we think the website is
  amount: 1,
  // Set the priority extension - if you know the country of the company supply the most likely TLD. i.e. for United Kingdom use 'uk'
  tld: 'com'
})

await builtwith.domainLive(url)

await builtwith.trust(url, {
  // If the words specified here are in the HTML of the website the result will have Stopwords set to true for LIVE lookups.
  words: 'medicine,masks',
  // Performs a live lookup of the website in question. This slows down the response. A result with a status of 'needLive' requires the LIVE option to determine if the website is suspect or not. Live lookups slow down the response of the API, you should consider calling this if the non-LIVE lookup response status is 'needLive'.
  live: false
})
```

Made live on Facebook by Zach Caceres during Covid-19 Quarantine
