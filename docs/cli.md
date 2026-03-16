# Command Line

Query the BuiltWith API from your terminal. All 13 methods with flags for every parameter.

## Installation

```bash
# Via npm (global)
npm install -g builtwith-api

# Or run without installing
npx --package builtwith-api builtwith free example.com --api-key YOUR_KEY
```

Standalone binaries are also available on the [GitHub Releases](https://github.com/zcaceres/builtwith-api/releases) page.

## Authentication

Set your API key as an environment variable:

```bash
export BUILTWITH_API_KEY=your-key-here
```

Or pass it with each command:

```bash
builtwith free example.com --api-key your-key-here
```

## Commands

### `free`

Basic technology profile for a domain.

```bash
builtwith free example.com
```

### `domain`

Detailed technology profile with optional filters.

```bash
builtwith domain example.com
builtwith domain example.com --onlyLiveTechnologies --hideAll
builtwith domain "example.com,other.com"
```

| Flag | Description |
|------|-------------|
| `--hideAll` | Hide description text and links |
| `--hideDescriptionAndLinks` | Hide description and links only |
| `--onlyLiveTechnologies` | Only return live technologies |
| `--noMetaData` | Exclude metadata |
| `--noAttributeData` | Exclude attribute data |
| `--noPII` | Exclude personally identifiable information |
| `--firstDetectedRange` | Filter by first detected date range |
| `--lastDetectedRange` | Filter by last detected date range |

### `domainLive`

Real-time technology scan.

```bash
builtwith domainLive example.com
```

### `lists`

List domains using a technology.

```bash
builtwith lists Shopify
builtwith lists React --since 2024-01-01 --includeMetaData
```

### `trends`

Technology adoption trends.

```bash
builtwith trends jQuery
builtwith trends React --date 2024-06
```

### `relationships`

Find related domains via shared identifiers.

```bash
builtwith relationships example.com
```

### `keywords`

Get SEO keywords for a domain.

```bash
builtwith keywords example.com
```

### `trust`

Domain trust and verification score.

```bash
builtwith trust example.com
builtwith trust example.com --words "shop,buy" --live
```

### `companyToUrl`

Find domains associated with a company.

```bash
builtwith companyToUrl Google
builtwith companyToUrl Google --tld com --amount 5
```

### `tags`

Tracking and analytics tags.

```bash
builtwith tags example.com
```

### `recommendations`

Technology recommendations.

```bash
builtwith recommendations example.com
```

### `redirects`

Redirect chains (inbound and outbound).

```bash
builtwith redirects example.com
```

### `product`

Search e-commerce products.

```bash
builtwith product "wireless headphones"
```

## Piping and scripting

```bash
# Extract technology names with jq
builtwith free stripe.com | jq '.groups[].name'

# Save to file
builtwith domain example.com > profile.json

# Process multiple domains
for domain in stripe.com shopify.com vercel.com; do
  builtwith free "$domain" > "${domain}.json"
done
```

## Help

```bash
builtwith --help
builtwith domain --help
builtwith --version
```
