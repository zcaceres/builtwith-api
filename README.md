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
- [ ] lists
- [ ] relationships
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
  responseFormat: 'xml'
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

builtwith.lists(url, {

})

builtwith.relationships(url, {

})

builtwith.keywords(url, {

})

builtwith.trends(url, {

})

builtwith.companyToUrl(url, {

})

builtwith.domainLive(url, {

})
```
