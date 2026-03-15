# Library Usage

## Quick Start

```ts
import { createClient } from "builtwith-api";

const client = createClient(process.env.BUILTWITH_API_KEY!);
```

All client methods return typed, Zod-validated responses. If the API returns unexpected data, a `ZodError` is thrown with details about which fields failed validation.

## Methods

### `free(lookup)`

Basic technology profile for a single domain. Available on free API plans.

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
| `firstDetectedRange` | `string` | Filter by first detected date range |
| `lastDetectedRange` | `string` | Filter by last detected date range |

### `domainLive(lookup)`

Real-time technology scan. Same response shape as `domain()`, but scans the site live.

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

Technology adoption trends and coverage data.

```ts
const trends = await client.trends("jQuery");
// trends.Tech.coverage.live, trends.Tech.coverage.ten_k, etc.
```

### `relationships(lookup)`

Find related domains that share identifiers (analytics IDs, ad accounts, etc.).

```ts
const related = await client.relationships("example.com");
// related.Relationships[].Identifiers[].Matches[]
```

### `keywords(lookup)`

Get SEO keywords associated with domains.

```ts
const kw = await client.keywords("example.com");
// kw.Keywords[].Keywords[]
```

### `trust(lookup, params?)`

Domain trust and verification scoring.

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

Get tracking and analytics tags found on a domain.

```ts
const tags = await client.tags("example.com");
```

### `recommendations(lookup)`

Get technology recommendations for a domain.

```ts
const recs = await client.recommendations("example.com");
```

### `redirects(lookup)`

Get inbound and outbound redirect chains.

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

By default, responses are JSON (parsed and validated). You can request other formats:

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
    // API errors: "BuiltWith API error 401: ..."
    // Validation errors: ZodError with detailed field info
    console.error(err.message);
  }
}
```
