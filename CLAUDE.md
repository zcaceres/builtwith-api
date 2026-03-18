# CLAUDE.md — builtwith-api

## Project overview

TypeScript wrapper for the BuiltWith API suite. Exposes all 13 API endpoints as a **library**, **CLI**, and **MCP server**. Published on npm as `builtwith-api`.

## Tech stack

- **Runtime**: Bun (build, test, compile)
- **Language**: TypeScript (strict mode, ESM-only)
- **Validation**: Zod v4 (`zod/v4` import path)
- **Linting**: Biome
- **Docs**: VitePress + TypeDoc

## Key conventions

- **Schemas are the source of truth** — all types are inferred from Zod schemas via `z.infer<>`. Never duplicate types manually.
- **Response schemas use `z.strictObject()`** — this catches upstream API drift. If BuiltWith adds new fields, the schema parse will fail, signaling that the schema needs updating.
- **Input schemas also use `z.strictObject()`** — prevents typos in option names from being silently ignored.
- **Dual request functions** — `request()` for strict JSON parsing, `requestSafe()` for endpoints (lists, trends) that occasionally return malformed JSON.
- **Commands registry** — `src/commands.ts` defines all 13 commands once; both CLI and MCP consume the same definitions.
- **Minimal dependencies** — only `zod` and `@modelcontextprotocol/sdk` at runtime.

## Commands

```bash
bun run build       # Build JS + type declarations
bun run lint        # Biome check
bun run lint:fix    # Biome auto-fix
bun test            # Run all tests
bun run docs:dev    # Local docs dev server
```

## File structure

```
src/
  index.ts      — createClient() factory, all 13 API methods
  schemas.ts    — Zod schemas for inputs + responses, BuiltWithClient interface
  commands.ts   — Command registry shared by CLI and MCP
  params.ts     — URL building, query string, boolean flag mapping
  request.ts    — HTTP request + Zod validation
  errors.ts     — Error formatting (Zod + generic)
  config.ts     — Constants (response format enum)
  cli.ts        — CLI entry point
  mcp.ts        — MCP server entry point
test/
  *.test.ts     — Unit + integration tests (Bun test runner)
```

## CI/CD

- `.github/workflows/ci.yml` — lint + build + test on push/PR to main
- `.github/workflows/docs.yml` — build and deploy VitePress docs to GitHub Pages
- `.github/workflows/release.yml` — auto-create GitHub release + compile cross-platform binaries when version changes
