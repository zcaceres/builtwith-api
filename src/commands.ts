import type { BuiltWithClient } from "./schemas.js";

export interface ArgDefinition {
  name: string;
  description: string;
  type: "string" | "number" | "boolean";
  required: boolean;
}

export interface CommandDefinition {
  name: keyof BuiltWithClient;
  description: string;
  args: ArgDefinition[];
  execute: (client: BuiltWithClient, args: Record<string, unknown>) => Promise<unknown>;
}

function splitLookup(value: unknown): string | string[] {
  const str = String(value);
  return str.includes(",") ? str.split(",").map((s) => s.trim()) : str;
}

export const commands: CommandDefinition[] = [
  {
    name: "free",
    description: "Free lookup — basic technology profile for a domain",
    args: [
      { name: "lookup", description: "Domain to look up", type: "string", required: true },
    ],
    execute: (client, args) => client.free(String(args.lookup)),
  },
  {
    name: "domain",
    description: "Detailed technology profile for one or more domains (comma-separated)",
    args: [
      { name: "lookup", description: "Domain(s) to look up (comma-separated for multiple)", type: "string", required: true },
      { name: "hideAll", description: "Hide description text and links", type: "boolean", required: false },
      { name: "hideDescriptionAndLinks", description: "Hide description and links only", type: "boolean", required: false },
      { name: "onlyLiveTechnologies", description: "Only return live technologies", type: "boolean", required: false },
      { name: "noMetaData", description: "Exclude metadata", type: "boolean", required: false },
      { name: "noAttributeData", description: "Exclude attribute data", type: "boolean", required: false },
      { name: "noPII", description: "Exclude personally identifiable information", type: "boolean", required: false },
      { name: "firstDetectedRange", description: "Filter by first detected date range", type: "string", required: false },
      { name: "lastDetectedRange", description: "Filter by last detected date range", type: "string", required: false },
    ],
    execute: (client, args) => {
      const lookup = splitLookup(args.lookup);
      const { lookup: _, ...params } = args;
      return client.domain(lookup, Object.keys(params).length > 0 ? params as any : undefined);
    },
  },
  {
    name: "lists",
    description: "List domains using a specific technology",
    args: [
      { name: "technology", description: "Technology name to search for", type: "string", required: true },
      { name: "includeMetaData", description: "Include metadata in results", type: "boolean", required: false },
      { name: "offset", description: "Pagination offset", type: "string", required: false },
      { name: "since", description: "Only return results since this date", type: "string", required: false },
    ],
    execute: (client, args) => {
      const { technology, ...params } = args;
      return client.lists(String(technology), Object.keys(params).length > 0 ? params as any : undefined);
    },
  },
  {
    name: "relationships",
    description: "Find related domains via shared identifiers",
    args: [
      { name: "lookup", description: "Domain(s) to look up (comma-separated for multiple)", type: "string", required: true },
    ],
    execute: (client, args) => client.relationships(splitLookup(args.lookup)),
  },
  {
    name: "keywords",
    description: "Get keywords for one or more domains",
    args: [
      { name: "lookup", description: "Domain(s) to look up (comma-separated for multiple)", type: "string", required: true },
    ],
    execute: (client, args) => client.keywords(splitLookup(args.lookup)),
  },
  {
    name: "trends",
    description: "Technology adoption trends",
    args: [
      { name: "technology", description: "Technology name", type: "string", required: true },
      { name: "date", description: "Date filter", type: "string", required: false },
    ],
    execute: (client, args) => {
      const { technology, ...params } = args;
      return client.trends(String(technology), Object.keys(params).length > 0 ? params as any : undefined);
    },
  },
  {
    name: "companyToUrl",
    description: "Find domains associated with a company name",
    args: [
      { name: "companyName", description: "Company name to search", type: "string", required: true },
      { name: "tld", description: "Filter by top-level domain", type: "string", required: false },
      { name: "amount", description: "Number of results to return", type: "number", required: false },
    ],
    execute: (client, args) => {
      const { companyName, ...params } = args;
      return client.companyToUrl(String(companyName), Object.keys(params).length > 0 ? params as any : undefined);
    },
  },
  {
    name: "domainLive",
    description: "Live technology lookup for a domain",
    args: [
      { name: "lookup", description: "Domain to look up", type: "string", required: true },
    ],
    execute: (client, args) => client.domainLive(String(args.lookup)),
  },
  {
    name: "trust",
    description: "Trust/verification score for a domain",
    args: [
      { name: "lookup", description: "Domain to look up", type: "string", required: true },
      { name: "words", description: "Comma-separated keywords to check", type: "string", required: false },
      { name: "live", description: "Include live analysis", type: "boolean", required: false },
    ],
    execute: (client, args) => {
      const { lookup, ...params } = args;
      return client.trust(String(lookup), Object.keys(params).length > 0 ? params as any : undefined);
    },
  },
  {
    name: "tags",
    description: "Get tracking/analytics tags for a domain",
    args: [
      { name: "lookup", description: "Domain to look up", type: "string", required: true },
    ],
    execute: (client, args) => client.tags(String(args.lookup)),
  },
  {
    name: "recommendations",
    description: "Get technology recommendations for a domain",
    args: [
      { name: "lookup", description: "Domain to look up", type: "string", required: true },
    ],
    execute: (client, args) => client.recommendations(String(args.lookup)),
  },
  {
    name: "redirects",
    description: "Get redirect chains for a domain",
    args: [
      { name: "lookup", description: "Domain to look up", type: "string", required: true },
    ],
    execute: (client, args) => client.redirects(String(args.lookup)),
  },
  {
    name: "product",
    description: "Search for products across e-commerce sites",
    args: [
      { name: "query", description: "Product search query", type: "string", required: true },
    ],
    execute: (client, args) => client.product(String(args.query)),
  },
];
