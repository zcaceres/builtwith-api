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

Run the CLI with `npx`:

```bash
npx --package builtwith-api builtwith free example.com --api-key YOUR_KEY
```

Or install globally:

```bash
npm install -g builtwith-api
builtwith free example.com
```

## MCP Server

The MCP server uses the separate `builtwith-mcp` package. Install it globally:

```bash
npm install -g builtwith-mcp
```

Or run it with `npx`:

```bash
npx -y builtwith-mcp
```

## Standalone binaries

[GitHub Releases](https://github.com/zcaceres/builtwith-api/releases) provides precompiled binaries for:

- Linux x64 / ARM64
- macOS x64 / ARM64 (Apple Silicon)
- Windows x64

## API Key

Get a BuiltWith API key at [api.builtwith.com](https://api.builtwith.com/).

Set it as an environment variable:

```bash
export BUILTWITH_API_KEY=your-key-here
```

You can also use `--api-key` with the CLI or MCP server, or pass the key to `createClient()`.
