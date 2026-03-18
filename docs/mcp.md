# MCP Server

Expose BuiltWith API lookups as MCP tools for Claude Desktop, Cursor, and any MCP-compatible AI client.

## How It Works

The MCP server exposes all 13 BuiltWith API methods as tools. Your AI assistant can call them directly during conversation.

**1. Configure** — Add the server config to your AI client's settings file.

**2. Ask** — "What technologies does stripe.com use?" — your assistant calls the right tool.

**3. Get Results** — Structured data returned inline. No copy-pasting from browser tabs.

## Setup

### Claude Desktop

Add to your Claude Desktop config (`~/Library/Application Support/Claude/claude_desktop_config.json` on macOS):

```json
{
  "mcpServers": {
    "builtwith": {
      "command": "npx",
      "args": ["-y", "builtwith-mcp"],
      "env": {
        "BUILTWITH_API_KEY": "your-key-here"
      }
    }
  }
}
```

### Cursor

Add to your Cursor MCP config (`.cursor/mcp.json` in your project or `~/.cursor/mcp.json` globally):

```json
{
  "mcpServers": {
    "builtwith": {
      "command": "npx",
      "args": ["-y", "builtwith-mcp"],
      "env": {
        "BUILTWITH_API_KEY": "your-key-here"
      }
    }
  }
}
```

### Claude Code

Add to your Claude Code settings:

```json
{
  "mcpServers": {
    "builtwith": {
      "command": "npx",
      "args": ["-y", "builtwith-mcp"],
      "env": {
        "BUILTWITH_API_KEY": "your-key-here"
      }
    }
  }
}
```

### Other Clients

Any MCP-compatible client can use the server. The general pattern:

- **Command:** `npx`
- **Args:** `["-y", "builtwith-mcp"]`
- **Env:** `BUILTWITH_API_KEY=your-key-here`

Or pass the key as a flag:

```json
{
  "mcpServers": {
    "builtwith": {
      "command": "npx",
      "args": ["-y", "builtwith-mcp", "--api-key", "your-key-here"]
    }
  }
}
```

For a local install instead of `npx`:

```bash
npm install -g builtwith-mcp
```

Then use `builtwith-mcp` as the command directly.

## Available Tools

All tools are prefixed with `builtwith_` and accept typed input schemas validated by Zod.

| Tool | Input | Description |
|------|-------|-------------|
| `builtwith_free` | `{ lookup: string }` | Basic technology profile |
| `builtwith_domain` | `{ lookup, ...opts }` | Detailed tech profile with spend |
| `builtwith_domainLive` | `{ lookup: string }` | Real-time technology scan |
| `builtwith_lists` | `{ technology, ...opts }` | Domains using a technology |
| `builtwith_trends` | `{ technology, ...opts }` | Technology adoption trends |
| `builtwith_relationships` | `{ lookup }` | Related domains via shared identifiers |
| `builtwith_keywords` | `{ lookup }` | Domain keywords |
| `builtwith_trust` | `{ lookup, ...opts }` | Trust and verification score |
| `builtwith_companyToUrl` | `{ companyName, ...opts }` | Domains for a company name |
| `builtwith_tags` | `{ lookup }` | Tracking/analytics tags |
| `builtwith_recommendations` | `{ lookup }` | Technology recommendations |
| `builtwith_redirects` | `{ lookup }` | Redirect chains |
| `builtwith_product` | `{ query }` | E-commerce product search |

## Testing

Use the MCP Inspector to test the server:

```bash
npx @modelcontextprotocol/inspector node dist/mcp.js --api-key YOUR_KEY
```

## Example prompts

Once configured, you can ask your AI assistant things like:

- "What technologies does stripe.com use?"
- "Find all domains using Shopify"
- "What are the technology trends for React?"
- "Is example.com a trustworthy domain?"
- "What companies are related to example.com?"
