#!/usr/bin/env node
import { createRequire } from "node:module";
import { parseArgs } from "node:util";
import { commands } from "./commands.js";
import { formatError } from "./errors.js";
import { formatTable } from "./format.js";
import { createClient } from "./index.js";

const require = createRequire(import.meta.url);
const { version } = require("../package.json");

const USAGE = `Usage: builtwith <command> <primary-arg> [--flag value ...]

Commands:
${commands.map((c) => `  ${c.name.padEnd(16)} ${c.description}`).join("\n")}

Options:
  --api-key <key>  BuiltWith API key (or set BUILTWITH_API_KEY env var)
  --table          Pretty-print output as a readable table instead of JSON
  --version        Show version number
  --help           Show help

Examples:
  builtwith free example.com
  builtwith free example.com --table
  builtwith domain example.com --hideAll --onlyLiveTechnologies
  builtwith domain "example.com,other.com"
  builtwith lists Shopify --since 2024-01-01
  builtwith trust example.com --words "shop,buy" --live
`;

function printCommandHelp(cmd: (typeof commands)[number]): void {
  const primary = cmd.args.find((a) => a.required);
  const flags = cmd.args.filter((a) => !a.required);
  console.log(`Usage: builtwith ${cmd.name} <${primary?.name ?? "arg"}>${flags.length ? " [options]" : ""}\n`);
  console.log(`  ${cmd.description}\n`);
  if (flags.length) {
    console.log("Options:");
    for (const f of flags) {
      console.log(`  --${f.name.padEnd(28)} ${f.description} (${f.type})`);
    }
  }
}

function run(): void {
  const argv = process.argv.slice(2);

  if (argv.includes("--version") || argv.includes("-V")) {
    console.log(version);
    process.exit(0);
  }

  if (argv.length === 0 || argv[0] === "--help" || argv[0] === "-h") {
    console.log(USAGE);
    process.exit(0);
  }

  const commandName = argv[0];
  const cmd = commands.find((c) => c.name === commandName);

  if (!cmd) {
    console.error(`Unknown command: ${commandName}\n`);
    console.log(USAGE);
    process.exit(1);
  }

  if (argv.includes("--help") || argv.includes("-h")) {
    printCommandHelp(cmd);
    process.exit(0);
  }

  const primaryArg = cmd.args.find((a) => a.required);
  const primaryValue = argv[1];

  if (primaryArg && (!primaryValue || primaryValue.startsWith("--"))) {
    console.error(`Error: missing required argument <${primaryArg.name}>`);
    process.exit(1);
  }

  // Build parseArgs options from the command's optional flags + global --api-key
  const flagArgs = cmd.args.filter((a) => !a.required);
  const options: Record<string, { type: "string" | "boolean" }> = {
    "api-key": { type: "string" },
    table: { type: "boolean" },
  };
  for (const f of flagArgs) {
    options[f.name] = { type: f.type === "boolean" ? "boolean" : "string" };
  }

  const { values } = parseArgs({
    args: argv.slice(2), // skip command + primary arg
    options,
    strict: false,
  });

  const useTable = Boolean(values.table);
  const apiKey = (values["api-key"] as string) || process.env.BUILTWITH_API_KEY;
  if (!apiKey) {
    console.error("Error: pass --api-key or set BUILTWITH_API_KEY environment variable.");
    process.exit(1);
  }

  // Build the args record
  const args: Record<string, unknown> = {};
  if (primaryArg) {
    args[primaryArg.name] = primaryValue;
  }

  for (const f of flagArgs) {
    if (values[f.name] !== undefined) {
      if (f.type === "number") {
        args[f.name] = Number(values[f.name]);
      } else {
        args[f.name] = values[f.name];
      }
    }
  }

  const client = createClient(apiKey);
  cmd
    .execute(client, args)
    .then((result) => {
      if (useTable) {
        console.log(formatTable(result));
      } else {
        console.log(JSON.stringify(result, null, 2));
      }
    })
    .catch((err) => {
      console.error(formatError(err));
      process.exit(1);
    });
}

run();
