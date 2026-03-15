# MCP Server

The `builtwith-mcp` server exposes all 13 BuiltWith API endpoints as tools via the [Model Context Protocol](https://modelcontextprotocol.io/), making them available to Claude, Cursor, and other MCP-compatible AI tools.

## Setup

### Claude Desktop

Add to your Claude Desktop config (`~/Library/Application Support/Claude/claude_desktop_config.json` on macOS):

```json
{
  "mcpServers": {
    "builtwith": {
      "command": "npx",
      "args": ["-y", "builtwith-api"],
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
      "args": ["-y", "builtwith-api"],
      "env": {
        "BUILTWITH_API_KEY": "your-key-here"
      }
    }
  }
}
```

### With `--api-key` flag

You can also pass the API key as a flag instead of an env var:

```json
{
  "mcpServers": {
    "builtwith": {
      "command": "npx",
      "args": ["-y", "builtwith-api", "--api-key", "your-key-here"]
    }
  }
}
```

### Local installation

If you prefer a local install over `npx`:

```bash
npm install -g builtwith-api
```

Then use `builtwith-mcp` as the command:

```json
{
  "mcpServers": {
    "builtwith": {
      "command": "builtwith-mcp",
      "env": {
        "BUILTWITH_API_KEY": "your-key-here"
      }
    }
  }
}
```

## Available Tools

All tools are prefixed with `builtwith_`:

| Tool | Description |
|------|-------------|
| `builtwith_free` | Basic technology profile for a domain |
| `builtwith_domain` | Detailed technology profile with filters |
| `builtwith_domainLive` | Real-time technology scan |
| `builtwith_lists` | Domains using a specific technology |
| `builtwith_trends` | Technology adoption trends |
| `builtwith_relationships` | Related domains via shared identifiers |
| `builtwith_keywords` | SEO keywords for a domain |
| `builtwith_trust` | Domain trust and verification score |
| `builtwith_companyToUrl` | Domains associated with a company |
| `builtwith_tags` | Tracking/analytics tags on a domain |
| `builtwith_recommendations` | Technology recommendations |
| `builtwith_redirects` | Redirect chains |
| `builtwith_product` | E-commerce product search |

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
