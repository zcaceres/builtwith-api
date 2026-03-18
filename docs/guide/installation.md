# Installation

## npm / yarn / pnpm

```bash
npm install builtwith-api
```

```bash
yarn add builtwith-api
```

```bash
pnpm add builtwith-api
```

## Bun

```bash
bun add builtwith-api
```

## Homebrew

```bash
brew install zcaceres/tap/builtwith
```

## CLI (no install)

Run the CLI directly with `npx`:

```bash
npx --package builtwith-api builtwith free example.com --api-key YOUR_KEY
```

Or install globally:

```bash
npm install -g builtwith-api
builtwith free example.com
```

## MCP Server

The MCP server is a separate package. Install standalone:

```bash
npm install -g builtwith-mcp
```

Or use directly with `npx`:

```bash
npx -y builtwith-mcp
```

## Standalone binaries

Pre-compiled binaries are available on the [GitHub Releases](https://github.com/zcaceres/builtwith-api/releases) page for:

- Linux x64 / ARM64
- macOS x64 / ARM64 (Apple Silicon)
- Windows x64

## API Key

You need a BuiltWith API key. Get one at [api.builtwith.com](https://api.builtwith.com/).

Set it as an environment variable:

```bash
export BUILTWITH_API_KEY=your-key-here
```

Or pass it directly via `--api-key` (CLI/MCP) or as the first argument to `createClient()` (library).
