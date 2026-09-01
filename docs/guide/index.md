# Introduction

**builtwith-api** provides typed access to the [BuiltWith API](https://api.builtwith.com/) through a library, CLI, and MCP server.

## What is BuiltWith?

BuiltWith tracks the frameworks, analytics, CMS platforms, e-commerce tools, CDNs, and other technologies used by websites. Its API makes this data available to code.

## Three ways to use it

### Library

Import `createClient` and call any of the 13 methods. Zod validates each typed response.

```ts
import { createClient } from "builtwith-api";

const client = createClient(process.env.BUILTWITH_API_KEY!);
const profile = await client.free("example.com");
```

### CLI

Run lookups from your terminal. JSON output works with pipes and scripts.

```bash
builtwith free example.com
builtwith domain example.com --onlyLiveTechnologies
```

### MCP Server

Add BuiltWith tools to any MCP client.

```json
{
  "mcpServers": {
    "builtwith": {
      "command": "npx",
      "args": ["-y", "builtwith-mcp"],
      "env": { "BUILTWITH_API_KEY": "your-key" }
    }
  }
}
```

## Requirements

- Node.js 18+
- A [BuiltWith API key](https://api.builtwith.com/)
