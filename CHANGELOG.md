# Changelog

## 3.0.0

### Breaking Changes

- **ESM-only** — dropped CommonJS/`require()` support
- **Named export** — use `import { createClient } from 'builtwith-api'` instead of default export
- **Zod validation** — invalid inputs throw `ZodError`; invalid API responses throw `ZodError` instead of silently returning unvalidated data
- **Typed responses** — all 12 endpoints return fully typed response objects (when using JSON format), matching the BuiltWith API documentation
- **Node.js >= 18** — uses native `fetch`, no more `node-fetch` dependency

### Added

- Zod 4 schemas for all request parameters and response shapes
- Full type safety on response data (e.g. `DomainResponse.Results[0].Meta.CompanyName` is `string`)
- Schema validation tests for all 12 response types
- `product` endpoint support
- `redirects` endpoint support
- `recommendations` endpoint support
- `tags` endpoint support
- `domainLive` endpoint support

### Removed

- `lodash` dependency
- `node-fetch` dependency
- `dotenv` dependency
- CommonJS build output

## 2.x

- JavaScript API wrapper with support for domain, lists, relationships, keywords, trends, companyToUrl, trust, and free endpoints
- CommonJS module format
- Multi-domain lookup support (up to 16 domains)
- Multiple response format support (JSON, XML, CSV, TSV, TXT)
