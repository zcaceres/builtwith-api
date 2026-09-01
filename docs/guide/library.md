# Library

Use the BuiltWith API from TypeScript with typed, Zod-validated responses. The package supports ESM.

## Quick Start

Create a client with your API key, then call any method.

```ts
import { createClient } from "builtwith-api";

const client = createClient(process.env.BUILTWITH_API_KEY!);

// Free lookup: basic tech profile
const profile = await client.free("google.com");

// Full domain lookup with options
const details = await client.domain("example.com", {
  onlyLiveTechnologies: true,
});
```

## Methods

### `free(lookup)`

A basic technology profile for one domain. This method works with free API plans.

```ts
const profile = await client.free("stripe.com");
// profile.domain, profile.groups, profile.first, profile.last
```

### `domain(lookup, params?)`

Detailed technology profile with metadata, spend history, and attributes.

```ts
// Single domain
const result = await client.domain("example.com");

// Multiple domains (up to 16)
const results = await client.domain(["example.com", "stripe.com"]);

// With filters
const filtered = await client.domain("example.com", {
  onlyLiveTechnologies: true,
  hideAll: true,
  noPII: true,
});
```

**Parameters:**

| Name | Type | Description |
|------|------|-------------|
| `hideAll` | `boolean` | Hide description text and links |
| `hideDescriptionAndLinks` | `boolean` | Hide description and links only |
| `onlyLiveTechnologies` | `boolean` | Only return currently live technologies |
| `noMetaData` | `boolean` | Exclude company metadata |
| `noAttributeData` | `boolean` | Exclude attribute data |
| `noPII` | `boolean` | Exclude personally identifiable information |
| `includeTrust` | `boolean` | Include Trust API data (uses an additional API credit) |
| `firstDetectedRange` | `string` | Filter by first detected date range (`YYYY-MM-DD` or `YYYY-MM-DD\|YYYY-MM-DD`) |
| `lastDetectedRange` | `string` | Filter by last detected date range (`YYYY-MM-DD` or `YYYY-MM-DD\|YYYY-MM-DD`) |

### `domainLive(lookup)`

Scans a site in real time and returns the same response shape as `domain()`.

```ts
const live = await client.domainLive("example.com");
```

### `lists(technology, params?)`

Find domains using a specific technology.

```ts
const shopifySites = await client.lists("Shopify");

// With pagination
const page2 = await client.lists("Shopify", {
  offset: shopifySites.NextOffset,
});

// Filter by date
const recent = await client.lists("React", {
  since: "2024-01-01",
  includeMetaData: true,
});
```

### `trends(technology, params?)`

Returns adoption trends and coverage data for a technology.

```ts
const trends = await client.trends("jQuery");
// trends.Tech.coverage.live, trends.Tech.coverage.ten_k, etc.
```

### `relationships(lookup)`

Find domains that share identifiers such as analytics IDs or ad accounts.

```ts
const related = await client.relationships("example.com");
// related.Relationships[].Identifiers[].Matches[]
```

### `keywords(lookup)`

Get SEO keywords for a domain.

```ts
const kw = await client.keywords("example.com");
// kw.Keywords[].Keywords[]
```

### `trust(lookup, params?)`

Get trust and verification scores for a domain.

```ts
const trust = await client.trust("example.com");
// trust.DBRecord.Established, trust.DBRecord.Ecommerce, etc.

// With keyword checking
const trustWords = await client.trust("example.com", {
  words: "shop,buy,discount",
  live: true,
});
```

### `companyToUrl(companyName, params?)`

Find domains associated with a company name.

```ts
const domains = await client.companyToUrl("Google");

// Filter by TLD
const comOnly = await client.companyToUrl("Google", {
  tld: "com",
  amount: 10,
});
```

### `tags(lookup)`

Get tracking and analytics tags for a domain.

```ts
const tags = await client.tags("example.com");
```

### `recommendations(lookup)`

Get technology recommendations for a domain.

```ts
const recs = await client.recommendations("example.com");
```

### `redirects(lookup)`

Get a domain's inbound and outbound redirect chains.

```ts
const redirects = await client.redirects("example.com");
// redirects.Inbound[], redirects.Outbound[]
```

### `product(query)`

Search for products across e-commerce sites.

```ts
const products = await client.product("wireless headphones");
// products.shops[].Products[]
```

## Response Format

Responses default to parsed, validated JSON. To request another format:

```ts
const client = createClient(API_KEY, { responseFormat: "xml" });
const xml = await client.free("example.com"); // returns raw XML string
```

Supported formats: `json`, `xml`, `txt`, `csv`, `tsv`

::: warning
Non-JSON formats return raw strings without type validation.
:::

## Error Handling

```ts
try {
  const result = await client.free("example.com");
} catch (err) {
  if (err instanceof Error) {
    // HTTP errors: "BuiltWith API error 401: ..."
    // BuiltWith errors (e.g. bad key): "BuiltWith API error: API Key is incorrect"
    // Validation errors: ZodError with detailed field info
    console.error(err.message);
  }
}
```

::: tip
BuiltWith sometimes returns a JSON `{"Errors":[...]}` body with HTTP 200. The client detects it and throws the API error instead of a Zod validation error.
:::

## Rate Limits

BuiltWith enforces two types of limits:

**Per-second throttle:** One request per second. Extra requests return HTTP 429. Space out calls or add a delay:

```ts
function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

for (const domain of domains) {
  const result = await client.free(domain);
  await delay(1000);
}
```

**Credit quota:** Each call uses credits from your API plan. Check the [BuiltWith dashboard](https://api.builtwith.com/) or the Product API's `credits`, `used`, and `remaining` fields.

::: tip
The `free` endpoint has its own, higher rate limit. Use it when you don't need full domain data.
:::
