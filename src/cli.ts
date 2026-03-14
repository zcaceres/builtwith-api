#!/usr/bin/env node
import { parseArgs } from "node:util";
import { createClient } from "./index.js";
import { commands } from "./commands.js";

const USAGE = `Usage: builtwith <command> <primary-arg> [--flag value ...]

Commands:
${commands.map((c) => `  ${c.name.padEnd(16)} ${c.description}`).join("\n")}

Environment:
  BUILTWITH_API_KEY  Required. Your BuiltWith API key.

Examples:
  builtwith free example.com
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

  const apiKey = process.env.BUILTWITH_API_KEY;
  if (!apiKey) {
    console.error("Error: BUILTWITH_API_KEY environment variable is required.");
    process.exit(1);
  }

  const primaryArg = cmd.args.find((a) => a.required);
  const primaryValue = argv[1];

  if (primaryArg && (!primaryValue || primaryValue.startsWith("--"))) {
    console.error(`Error: missing required argument <${primaryArg.name}>`);
    process.exit(1);
  }

  // Build parseArgs options from the command's optional flags
  const flagArgs = cmd.args.filter((a) => !a.required);
  const options: Record<string, { type: "string" | "boolean" }> = {};
  for (const f of flagArgs) {
    options[f.name] = { type: f.type === "boolean" ? "boolean" : "string" };
  }

  const { values } = parseArgs({
    args: argv.slice(2), // skip command + primary arg
    options,
    strict: false,
  });

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
      console.log(JSON.stringify(result, null, 2));
    })
    .catch((err: Error) => {
      console.error(`Error: ${err.message}`);
      process.exit(1);
    });
}

run();
