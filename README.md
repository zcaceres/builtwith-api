# Builtwith API

## How to Use

JSON


```
builtwith.[api](url, {
  ...apiSpecificCustomParams,
  isXMLRequest: true
})
```
____________________

## TODO

- [X] JSON support
- [X] XML support

- [X] free
- [X] domain
- [X] lists
  - [X] TXT support
- [X] relationships
- [ ] keywords
- [ ] trends
- [ ] companyToUrl
- [ ] domainLive

- [ ] PARSERS for responses

________________

Use:

```js
const builtwith = require('builtwith')

const builtwith = BuiltWith(process.env.BW_API_KEY, {
  responseFormat: 'txt'
})

const url = 'facebook.com'

builtwith.free(url)

builtwith.domain(url, {
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
builtwith.lists(technology, {
  // Brings back meta data with the results, which includes names, titles, social links, addresses, emails, telephone numbers, traffic ranks etc.
  includeMetaData: true,
  // Gets the next page of results - use the exact value from NextOffset in response. If the value of NextOffset is END there are no more results.
  offset: 'oQEwEnH2FJuIzeXOEk2T',
  // Gets live sites using the technology since a certain time, accepts dates and queries i.e. 30 Days Ago or Last January for example.
  since: '2016-01-20'
})

builtwith.relationships(url)

builtwith.keywords(url)

builtwith.trends(technology, {
  // Totals will be the closest to this date - providing the ability to get historical totals
  date: '2016-01-20'
})

builtwith.companyToUrl(url, {

})

builtwith.domainLive(url, {

})

```
