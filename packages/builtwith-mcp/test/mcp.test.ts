import { describe, expect, it } from "bun:test";

function mcp(messages: object[], env: Record<string, string> = {}): Promise<{ lines: string[]; exitCode: number }> {
  const input = `${messages.map((m) => JSON.stringify(m)).join("\n")}\n`;
  return new Promise((resolve) => {
    const proc = Bun.spawn(["bun", "run", "src/mcp.ts", "--api-key", "test"], {
      cwd: `${import.meta.dir}/..`,
      env: { ...process.env, ...env },
      stdin: new Blob([input]),
      stdout: "pipe",
      stderr: "pipe",
    });
    proc.exited.then(async (exitCode) => {
      const stdout = await new Response(proc.stdout).text();
      const lines = stdout.trim().split("\n").filter(Boolean);
      resolve({ lines, exitCode });
    });
  });
}

function initMessages(): object[] {
  return [
    {
      jsonrpc: "2.0",
      id: 1,
      method: "initialize",
      params: {
        protocolVersion: "2024-11-05",
        capabilities: {},
        clientInfo: { name: "test", version: "1.0.0" },
      },
    },
    { jsonrpc: "2.0", method: "notifications/initialized" },
  ];
}

describe("MCP server", () => {
  it("responds to initialize with server info", async () => {
    const { lines } = await mcp(initMessages());
    const response = JSON.parse(lines[0]);
    expect(response.result.serverInfo.name).toBe("builtwith");
    expect(response.result.serverInfo.version).toMatch(/^\d+\.\d+\.\d+$/);
    expect(response.result.capabilities.tools).toBeDefined();
  });

  it("lists all 13 tools", async () => {
    const { lines } = await mcp([...initMessages(), { jsonrpc: "2.0", id: 2, method: "tools/list", params: {} }]);
    const response = JSON.parse(lines[lines.length - 1]);
    const tools = response.result.tools;
    expect(tools).toHaveLength(13);
    const names = tools.map((t: Record<string, unknown>) => t.name);
    expect(names).toContain("builtwith_free");
    expect(names).toContain("builtwith_domain");
  });

  it("tool names are all prefixed with builtwith_", async () => {
    const { lines } = await mcp([...initMessages(), { jsonrpc: "2.0", id: 2, method: "tools/list", params: {} }]);
    const response = JSON.parse(lines[lines.length - 1]);
    for (const tool of response.result.tools) {
      expect(tool.name).toMatch(/^builtwith_/);
    }
  });

  it("each tool has inputSchema with required fields", async () => {
    const { lines } = await mcp([...initMessages(), { jsonrpc: "2.0", id: 2, method: "tools/list", params: {} }]);
    const response = JSON.parse(lines[lines.length - 1]);
    for (const tool of response.result.tools) {
      expect(tool.inputSchema).toBeDefined();
      expect(tool.inputSchema.type).toBe("object");
      expect(tool.inputSchema.required.length).toBeGreaterThanOrEqual(1);
    }
  });

  it("tool call returns isError with clean message on bad API key", async () => {
    const { lines } = await mcp([
      ...initMessages(),
      {
        jsonrpc: "2.0",
        id: 3,
        method: "tools/call",
        params: { name: "builtwith_free", arguments: { lookup: "example.com" } },
      },
    ]);
    const response = JSON.parse(lines[lines.length - 1]);
    expect(response.result.isError).toBe(true);
    const text = response.result.content[0].text;
    // API may return a schema validation error or a rate limit error
    expect(text).toMatch(/unexpected response|API error/);
    expect(text).not.toContain('"code": "invalid_type"');
  });

  it("exits 1 when no API key provided", async () => {
    const proc = Bun.spawn(["bun", "run", "src/mcp.ts"], {
      cwd: `${import.meta.dir}/..`,
      env: { ...process.env, BUILTWITH_API_KEY: "" },
      stdout: "pipe",
      stderr: "pipe",
    });
    const exitCode = await proc.exited;
    const stderr = await new Response(proc.stderr).text();
    expect(exitCode).toBe(1);
    expect(stderr).toContain("--api-key");
  });
});
