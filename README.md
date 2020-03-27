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
- [ ] domain
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
