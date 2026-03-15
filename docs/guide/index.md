# Introduction

**builtwith-api** is a typed wrapper around the [BuiltWith API](https://api.builtwith.com/) that works as a library, CLI, and MCP server.

## What is BuiltWith?

BuiltWith tracks the technologies used by websites across the internet — frameworks, analytics, CMS platforms, e-commerce tools, CDNs, and more. Their API gives you programmatic access to this intelligence.

## Three ways to use it

### Library

Import `createClient` and call methods directly. Responses are validated with Zod and fully typed.

```ts
import { createClient } from "builtwith-api";

const client = createClient(process.env.BUILTWITH_API_KEY!);
const profile = await client.free("example.com");
```

### CLI

Query from your terminal. Output is JSON, ready for piping.

```bash
builtwith free example.com
builtwith domain example.com --onlyLiveTechnologies
```

### MCP Server

Connect BuiltWith to AI tools that support the Model Context Protocol.

```json
{
  "mcpServers": {
    "builtwith": {
      "command": "npx",
      "args": ["-y", "builtwith-api"],
      "env": { "BUILTWITH_API_KEY": "your-key" }
    }
  }
}
```

## Requirements

- Node.js 18+
- A [BuiltWith API key](https://api.builtwith.com/)
