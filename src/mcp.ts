#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod/v4";
import { createClient } from "./index.js";
import { commands } from "./commands.js";

// Accept --api-key flag or BUILTWITH_API_KEY env var
const keyFlagIndex = process.argv.indexOf("--api-key");
const apiKey =
  (keyFlagIndex !== -1 ? process.argv[keyFlagIndex + 1] : undefined) ||
  process.env.BUILTWITH_API_KEY;
if (!apiKey) {
  console.error("Error: pass --api-key or set BUILTWITH_API_KEY environment variable.");
  process.exit(1);
}

const client = createClient(apiKey);

const server = new McpServer({
  name: "builtwith",
  version: "3.0.0",
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

  server.tool(
    `builtwith_${cmd.name}`,
    cmd.description,
    shape,
    async (params) => {
      const result = await cmd.execute(client, params);
      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(result, null, 2),
          },
        ],
      };
    },
  );
}

const transport = new StdioServerTransport();
server.connect(transport);
