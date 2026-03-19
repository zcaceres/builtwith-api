# Changelog

## 3.2.0

### Added

- **Monorepo split** — MCP server is now a separate npm package (`builtwith-mcp`), installable standalone via `npx -y builtwith-mcp`
- **CLI `--table` flag** — human-readable pretty-print output instead of raw JSON
- **Strict response schemas** — all response schemas use `z.strictObject()` to catch upstream API drift
- **Date range validation** — `firstDetectedRange` and `lastDetectedRange` params validated with regex
- **Homebrew distribution** — `brew install zcaceres/tap/builtwith`
- **Pre-commit hook** — lint, build, and test run automatically on every commit
- **VitePress docs site** — deployed to [builtwith.zach.dev](https://builtwith.zach.dev) with TypeDoc API reference
- **Rate limit documentation** — per-second throttle and credit-based quota guidance
- Biome linter for consistent code formatting
- Comprehensive test coverage for non-JSON response formats (XML, CSV, TSV, TXT)
- Network error and HTTP status code tests

### Changed

- `builtwith-api` now depends only on `zod` (removed `@modelcontextprotocol/sdk` from runtime deps)
- Library users no longer pull MCP SDK as a transitive dependency

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
- **Named export** — use `import { createClient } from 'builtwith-api'` instead of default export
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
