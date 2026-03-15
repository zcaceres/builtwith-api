#!/usr/bin/env node
import { createRequire } from "node:module";
import { parseArgs } from "node:util";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod/v4";
import { commands } from "./commands.js";
import { formatError } from "./errors.js";
import { createClient } from "./index.js";

const require = createRequire(import.meta.url);
const { version } = require("../package.json");

// Accept --api-key flag or BUILTWITH_API_KEY env var
const { values } = parseArgs({
  args: process.argv.slice(2),
  options: { "api-key": { type: "string" } },
  strict: false,
});
const apiKey = (values["api-key"] as string) || process.env.BUILTWITH_API_KEY;
if (!apiKey) {
  console.error("Error: pass --api-key or set BUILTWITH_API_KEY environment variable.");
  process.exit(1);
}

const client = createClient(apiKey);

const server = new McpServer({
  name: "builtwith",
  version,
});

for (const cmd of commands) {
  // Build Zod schema from arg definitions
  const shape: Record<string, z.ZodType> = {};
  for (const arg of cmd.args) {
    let schema: z.ZodType;
    switch (arg.type) {
      case "number":
        schema = z.number().describe(arg.description);
        break;
      case "boolean":
        schema = z.boolean().describe(arg.description);
        break;
      default:
        schema = z.string().describe(arg.description);
        break;
    }
    shape[arg.name] = arg.required ? schema : schema.optional();
  }

  server.tool(`builtwith_${cmd.name}`, cmd.description, shape, async (params) => {
    try {
      const result = await cmd.execute(client, params);
      return {
        content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }],
      };
    } catch (err) {
      return {
        content: [{ type: "text" as const, text: formatError(err) }],
        isError: true,
      };
    }
  });
}

const transport = new StdioServerTransport();
server.connect(transport);
