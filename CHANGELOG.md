# Changelog

## 3.1.0

### Added

- CLI (`builtwith`) — all 13 API methods accessible from the command line
- MCP server (`builtwith-mcp`) — all 13 methods exposed as tools for LLM clients
- Shared command registry (`src/commands.ts`) used by both CLI and MCP
- `--api-key` flag for CLI and MCP (alternative to `BUILTWITH_API_KEY` env var)
- `--version` flag for CLI
- Human-readable error messages (Zod validation errors are now formatted cleanly)
- Cross-compiled standalone binaries via GitHub Actions release workflow
- Tests for CLI, MCP server, command registry, and error formatting

## 3.0.0

### Breaking Changes

- **ESM-only** — dropped CommonJS/`require()` support
- **Named export** — use `import { createClient } from 'builtwith'` instead of default export
- **Zod validation** — invalid inputs throw `ZodError`; invalid API responses throw `ZodError` instead of silently returning unvalidated data
- **Typed responses** — all 13 endpoints return fully typed response objects (when using JSON format), matching the BuiltWith API documentation
- **Node.js >= 18** — uses native `fetch`, no more `node-fetch` dependency

### Added

- Zod 4 schemas for all request parameters and response shapes
- Full type safety on response data (e.g. `DomainResponse.Results[0].Meta.CompanyName` is `string`)
- Schema validation tests for all 13 response types
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
