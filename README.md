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

// The name of a technology, replaces spaces with dashes (-).
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

await builtwith.companyToUrl(url, {
  // Company name URL encoded
  companyName: 'Shell',
  // Bring back domains in order of priority - the first result is generally the one we think the website is
  amount: 1,
  // Set the priority extension - if you know the country of the company supply the most likely TLD. i.e. for United Kingdom use 'uk'
  tld: 'com'
})

await builtwith.domainLive(url)
```

Made live on Facebook by Zach Caceres during Covid-19 Quarantine
