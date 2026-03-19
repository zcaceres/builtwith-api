import { defineConfig } from "vitepress";

export default defineConfig({
  title: "builtwith-api",
  description: "A typed TypeScript wrapper for the BuiltWith API — library, CLI, and MCP server",
  base: "/",

  head: [
    ["link", { rel: "preconnect", href: "https://fonts.googleapis.com" }],
    ["link", { rel: "preconnect", href: "https://fonts.gstatic.com", crossorigin: "" }],
    [
      "link",
      {
        href: "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap",
        rel: "stylesheet",
      },
    ],
  ],

  themeConfig: {
    nav: [
      { text: "Library", link: "/guide/library" },
      { text: "CLI", link: "/cli" },
      { text: "MCP Server", link: "/mcp" },
      { text: "API Reference", link: "/api/" },
    ],

    sidebar: {
      "/guide/library": [
        {
          text: "Getting Started",
          items: [
            { text: "Installation", link: "/guide/installation" },
            { text: "Quick Start", link: "/guide/library", },
            { text: "Configuration", link: "/guide/library#response-format" },
          ],
        },
        {
          text: "Methods",
          items: [
            { text: "free()", link: "/guide/library#free-lookup" },
            { text: "domain()", link: "/guide/library#domain-lookup-params" },
            { text: "domainLive()", link: "/guide/library#domainlive-lookup" },
            { text: "lists()", link: "/guide/library#lists-technology-params" },
            { text: "relationships()", link: "/guide/library#relationships-lookup" },
            { text: "keywords()", link: "/guide/library#keywords-lookup" },
            { text: "trends()", link: "/guide/library#trends-technology-params" },
            { text: "trust()", link: "/guide/library#trust-lookup-params" },
            { text: "companyToUrl()", link: "/guide/library#companytourl-companyname-params" },
            { text: "tags()", link: "/guide/library#tags-lookup" },
            { text: "recommendations()", link: "/guide/library#recommendations-lookup" },
            { text: "redirects()", link: "/guide/library#redirects-lookup" },
            { text: "product()", link: "/guide/library#product-query" },
          ],
        },
      ],
      "/cli": [
        {
          text: "Getting Started",
          items: [
            { text: "Installation", link: "/cli#installation" },
            { text: "Authentication", link: "/cli#authentication" },
            { text: "Usage", link: "/cli#examples" },
          ],
        },
        {
          text: "Commands",
          items: [
            { text: "free", link: "/cli#free" },
            { text: "domain", link: "/cli#domain" },
            { text: "domainLive", link: "/cli#domainlive" },
            { text: "lists", link: "/cli#lists" },
            { text: "trust", link: "/cli#trust" },
            { text: "trends", link: "/cli#trends" },
            { text: "keywords", link: "/cli#keywords" },
            { text: "relationships", link: "/cli#relationships" },
            { text: "companyToUrl", link: "/cli#companytourl" },
            { text: "tags", link: "/cli#tags" },
            { text: "recommendations", link: "/cli#recommendations" },
            { text: "redirects", link: "/cli#redirects" },
            { text: "product", link: "/cli#product" },
          ],
        },
        {
          text: "Options",
          items: [
            { text: "--help", link: "/cli#help" },
            { text: "--version", link: "/cli#help" },
            { text: "--api-key", link: "/cli#authentication" },
          ],
        },
      ],
      "/mcp": [
        {
          text: "Setup",
          items: [
            { text: "Claude Desktop", link: "/mcp#claude-desktop" },
            { text: "Cursor", link: "/mcp#cursor" },
            { text: "Claude Code", link: "/mcp#claude-code" },
            { text: "Other Clients", link: "/mcp#other-clients" },
          ],
        },
        {
          text: "Tools",
          items: [
            { text: "builtwith_free", link: "/mcp#available-tools" },
            { text: "builtwith_domain", link: "/mcp#available-tools" },
            { text: "builtwith_domainLive", link: "/mcp#available-tools" },
            { text: "builtwith_lists", link: "/mcp#available-tools" },
            { text: "builtwith_trends", link: "/mcp#available-tools" },
            { text: "builtwith_relationships", link: "/mcp#available-tools" },
            { text: "builtwith_keywords", link: "/mcp#available-tools" },
            { text: "builtwith_trust", link: "/mcp#available-tools" },
            { text: "builtwith_companyToUrl", link: "/mcp#available-tools" },
            { text: "builtwith_tags", link: "/mcp#available-tools" },
            { text: "builtwith_recommendations", link: "/mcp#available-tools" },
            { text: "builtwith_redirects", link: "/mcp#available-tools" },
            { text: "builtwith_product", link: "/mcp#available-tools" },
          ],
        },
        {
          text: "Testing",
          items: [
            { text: "MCP Inspector", link: "/mcp#testing" },
          ],
        },
      ],
      "/": [
        {
          text: "Getting Started",
          items: [
            { text: "Introduction", link: "/guide/" },
            { text: "Installation", link: "/guide/installation" },
          ],
        },
        {
          text: "Usage",
          items: [
            { text: "Library", link: "/guide/library" },
            { text: "CLI", link: "/cli" },
            { text: "MCP Server", link: "/mcp" },
          ],
        },
        {
          text: "API Reference",
          link: "/api/",
        },
      ],
    },

    socialLinks: [{ icon: "github", link: "https://github.com/zcaceres/builtwith-api" }],

    footer: {
      message: "Released under the MIT License.",
      copyright: 'Built by <a href="https://zach.dev" target="_blank" rel="noopener">zach.dev</a>. Not affiliated with <a href="https://builtwith.com" target="_blank" rel="noopener">builtwith.com</a>.',
    },
  },
});
