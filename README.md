# BuiltWith API

`builtwith-api` is a utility wrapper for the BuiltWith API suite. Find out what any website is built with!

Available as a **library**, **CLI**, and **MCP server**.

## Installation

```
npm install builtwith-api
```

Requires Node.js >= 18 (uses native `fetch`).

## Breaking Changes in v3

- **ESM-only** - no more CommonJS/`require()` support
- **Named export** - `import { createClient } from 'builtwith-api'` (not default/`require`)
- **Zod validation** - invalid inputs throw `ZodError` instead of manual error messages
- **Typed responses** - methods return typed response objects (when using JSON format)

## Features

### Response Formats
- JSON support
- XML support
- CSV support
- TSV support (lists, relationships)
- TXT support (lists only)

### APIs
| Method | Description |
|--------|-------------|
| `free` | Free technology summary |
| `domain` | Full domain technology lookup |
| `lists` | Sites using a technology |
| `relationships` | Related domains |
| `keywords` | Domain keyword extraction |
| `trends` | Technology adoption trends |
| `companyToUrl` | Company name to domains |
| `domainLive` | Live domain detection |
| `trust` | Trust & fraud signals |
| `tags` | IP & attribute lookups |
| `recommendations` | Technology suggestions |
| `redirects` | Redirect chain history |
| `product` | E-commerce product search |

________________

## Library Usage

```js
import { createClient } from 'builtwith-api'

// Initialize with your API key
const builtwith = createClient(process.env.YOUR_BUILTWITH_API_KEY, {
  responseFormat: 'json' // 'json' 'xml' 'csv' 'tsv' 'txt' (txt only for lists API)
})

const url = 'facebook.com'

// Free lookup - quick summary
await builtwith.free(url)

// Full domain analysis
await builtwith.domain(url, {
  // This will hide technology description, link, tag and category fields
  hideAll: false,
  // This will hide technology description and link fields (but keep tag and categories)
  hideDescriptionAndLinks: false,
  // This will only return technologies we consider to be live
  onlyLiveTechnologies: true,
  // No meta data (like address, names etc..) will be returned. Improves performance.
  noMetaData: true,
  // No attributes data will be returned
  noAttributeData: true,
  // No personally identifiable information will be returned
  noPII: true,
  // Filter by first detected date range (e.g. '2020-01-01-2024-12-31')
  firstDetectedRange: undefined,
  // Filter by last detected date range
  lastDetectedRange: undefined
})

// List sites using a technology
const technology = 'Shopify'
// The name of a technology. Spaces automatically replaced with dashes (-).
await builtwith.lists(technology, {
  // Brings back meta data with the results, which includes names, titles, social links, addresses, emails, telephone numbers, traffic ranks etc.
  includeMetaData: true,
  // Gets the next page of results - use the exact value from NextOffset in response. If the value of NextOffset is END there are no more results.
  offset: 'oQEwEnH2FJuIzeXOEk2T',
  // Gets live sites using the technology since a certain time, accepts dates and queries i.e. 30 Days Ago or Last January for example.
  since: '2016-01-20'
})

// Find related domains
await builtwith.relationships(url)

// Multi-domain keyword lookup (up to 16 domains)
const urls = ['hotelscombined.com', 'builtwith.com']
await builtwith.keywords(urls)

// Technology trends over time
await builtwith.trends(technology, {
  // Totals will be the closest to this date - providing the ability to get historical totals
  date: '2016-01-20'
})

// Find a company's website
const companyName = 'Shell'
await builtwith.companyToUrl(companyName, {
  // Bring back domains in order of priority - the first result is generally the one we think the website is
  amount: 1,
  // Set the priority extension - if you know the country of the company supply the most likely TLD. i.e. for United Kingdom use 'uk'
  tld: 'com'
})

// Live domain detection
await builtwith.domainLive(url)

// Trust & fraud detection
await builtwith.trust(url, {
  // If the words specified here are in the HTML of the website the result will have Stopwords set to true for LIVE lookups.
  words: 'medicine,masks',
  // Performs a live lookup of the website in question. This slows down the response. A result with a status of 'needLive' requires the LIVE option to determine if the website is suspect or not.
  live: false
})

// Get domains related to IPs and site attributes. Use 'IP-1.2.3.4' format for IP lookups.
await builtwith.tags(url)

// Get technology recommendations for a domain
await builtwith.recommendations(url)

// Get live and historical redirect data for a domain
await builtwith.redirects(url)

// Search for e-commerce sites selling specific products
await builtwith.product('shoes')
```

## CLI

The CLI wraps all 13 API methods. No extra dependencies beyond the package itself.

```bash
builtwith <command> <primary-arg> [--flag value ...]
```

### Authentication

Pass your API key via `--api-key` or the `BUILTWITH_API_KEY` environment variable:

```bash
# Flag
builtwith free example.com --api-key YOUR_KEY

# Environment variable
export BUILTWITH_API_KEY=YOUR_KEY
builtwith free example.com
```

### Examples

```bash
builtwith free example.com
builtwith domain example.com --hideAll --onlyLiveTechnologies
builtwith domain "example.com,other.com"
builtwith lists Shopify --since 2024-01-01
builtwith companyToUrl "Acme Corp" --amount 5 --tld com
builtwith trust example.com --words "shop,buy" --live
builtwith trends React --date 2024-06-01
```

Use `--help` for full usage or `builtwith <command> --help` for command-specific options:

```bash
builtwith --help
builtwith domain --help
builtwith --version
```

## MCP Server

The package includes an [MCP](https://modelcontextprotocol.io) server that exposes all 13 API methods as tools for LLM clients (Claude Desktop, etc.).

### Claude Desktop Configuration

First install the package globally:

```bash
npm install -g builtwith-api
```

Then add to your Claude Desktop config (`~/Library/Application Support/Claude/claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "builtwith": {
      "command": "builtwith-mcp",
      "env": {
        "BUILTWITH_API_KEY": "YOUR_KEY"
      }
    }
  }
}
```

Or passing the key directly:

```json
{
  "mcpServers": {
    "builtwith": {
      "command": "builtwith-mcp",
      "args": ["--api-key", "YOUR_KEY"]
    }
  }
}
```

### Tools

All tools are prefixed with `builtwith_`:

| Tool | Description |
|------|-------------|
| `builtwith_free` | Free technology profile for a domain |
| `builtwith_domain` | Detailed technology profile (supports comma-separated multi-domain) |
| `builtwith_lists` | List domains using a specific technology |
| `builtwith_relationships` | Find related domains via shared identifiers |
| `builtwith_keywords` | Get keywords for domains |
| `builtwith_trends` | Technology adoption trends |
| `builtwith_companyToUrl` | Find domains for a company name |
| `builtwith_domainLive` | Live technology lookup |
| `builtwith_trust` | Trust/verification score |
| `builtwith_tags` | Tracking/analytics tags |
| `builtwith_recommendations` | Technology recommendations |
| `builtwith_redirects` | Redirect chain history |
| `builtwith_product` | E-commerce product search |

### Testing with MCP Inspector

```bash
npx @modelcontextprotocol/inspector node dist/mcp.js
```

## Learn More

Check out the full API docs at [api.builtwith.com](https://api.builtwith.com)

For LLM-friendly API documentation, see [api.builtwith.com/llms.txt](https://api.builtwith.com/llms.txt)
