# CLAUDE.md — builtwith-api

## Project overview

Bun workspace monorepo for the BuiltWith API suite. Two npm packages:

- **`builtwith-api`** — TypeScript SDK + CLI. All 13 API endpoints. Depends only on `zod`.
- **`builtwith-mcp`** — MCP server for Claude Desktop, Cursor, etc. Depends on `builtwith-api` + `@modelcontextprotocol/sdk`.

## Tech stack

- **Runtime**: Bun (build, test, compile, workspaces)
- **Language**: TypeScript (strict mode, ESM-only)
- **Validation**: Zod v4 (`zod/v4` import path)
- **Linting**: Biome
- **Docs**: VitePress + TypeDoc

## Key conventions

- **Schemas are the source of truth** — all types are inferred from Zod schemas via `z.infer<>`. Never duplicate types manually.
- **Response schemas use `z.strictObject()`** — this catches upstream API drift. If BuiltWith adds new fields, the schema parse will fail, signaling that the schema needs updating.
- **Input schemas also use `z.strictObject()`** — prevents typos in option names from being silently ignored.
- **Dual request functions** — `request()` for strict JSON parsing, `requestSafe()` for endpoints (lists, trends) that occasionally return malformed JSON.
- **Commands registry** — `packages/builtwith-api/src/commands.ts` defines all 13 commands once; both CLI and MCP consume the same definitions.
- **Minimal dependencies** — `builtwith-api` depends only on `zod`. `builtwith-mcp` adds `@modelcontextprotocol/sdk`.

## Commands

```bash
bun run build       # Build all packages
bun run test        # Test all packages
bun run lint        # Biome check
bun run lint:fix    # Biome auto-fix
bun run docs:dev    # Local docs dev server
```

## File structure

```
packages/
  builtwith-api/
    src/
      index.ts      — createClient() factory, all 13 API methods
      schemas.ts    — Zod schemas for inputs + responses, BuiltWithClient interface
      commands.ts   — Command registry shared by CLI and MCP
      params.ts     — URL building, query string, boolean flag mapping
      request.ts    — HTTP request, API error detection + Zod validation
      errors.ts     — Error formatting (Zod + generic)
      config.ts     — Constants (response format enum)
      cli.ts        — CLI entry point
      format.ts     — Table formatter for --table CLI output
    test/
      *.test.ts     — Unit + integration tests (Bun test runner)
  builtwith-mcp/
    src/
      mcp.ts        — MCP server entry point
    test/
      mcp.test.ts   — MCP server tests
docs/                 — VitePress docs site (deployed to builtwith.zach.dev)
```

## CI/CD

- `.github/workflows/ci.yml` — lint + build + test on push/PR to main
- `.github/workflows/docs.yml` — build and deploy VitePress docs to GitHub Pages
- `.github/workflows/release.yml` — auto-create GitHub release, compile cross-platform binaries (npm publish is manual via `/release` command)
