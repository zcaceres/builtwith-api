import { defineConfig } from "vitepress";

export default defineConfig({
  title: "builtwith-api",
  description: "Typed Node.js client, CLI, and MCP server for the BuiltWith API",
  base: "/builtwith-api/",

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
      { text: "Guide", link: "/guide/" },
      { text: "CLI", link: "/cli" },
      { text: "MCP", link: "/mcp" },
      { text: "API Reference", link: "/api/" },
    ],

    sidebar: [
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

    socialLinks: [{ icon: "github", link: "https://github.com/zcaceres/builtwith-api" }],

    footer: {
      message: "Released under the MIT License.",
      copyright: 'Built by <a href="https://zach.dev">zach.dev</a>. Not affiliated with <a href="https://builtwith.com">builtwith.com</a>.',
    },
  },
});
