import { describe, it, expect } from "bun:test";
import { commands, splitLookup } from "../src/commands";
import type { BuiltWithClient } from "../src/schemas";

const ALL_COMMAND_NAMES = [
  "free",
  "domain",
  "lists",
  "relationships",
  "keywords",
  "trends",
  "companyToUrl",
  "domainLive",
  "trust",
  "tags",
  "recommendations",
  "redirects",
  "product",
] as const;

describe("splitLookup", () => {
  it("returns a single string when no comma", () => {
    expect(splitLookup("example.com")).toBe("example.com");
  });

  it("splits comma-separated values into an array", () => {
    expect(splitLookup("a.com,b.com")).toEqual(["a.com", "b.com"]);
  });

  it("trims whitespace around comma-separated values", () => {
    expect(splitLookup("a.com , b.com , c.com")).toEqual([
      "a.com",
      "b.com",
      "c.com",
    ]);
  });

  it("coerces non-string values via String()", () => {
    expect(splitLookup(123)).toBe("123");
  });
});

describe("command registry", () => {
  it("has exactly 13 commands", () => {
    expect(commands).toHaveLength(13);
  });

  it("contains all expected command names", () => {
    const names = commands.map((c) => c.name);
    for (const name of ALL_COMMAND_NAMES) {
      expect(names).toContain(name);
    }
  });

  it("every command has at least one required arg", () => {
    for (const cmd of commands) {
      const required = cmd.args.filter((a) => a.required);
      expect(required.length).toBeGreaterThanOrEqual(1);
    }
  });

  it("every command has a non-empty description", () => {
    for (const cmd of commands) {
      expect(cmd.description.length).toBeGreaterThan(0);
    }
  });

  it("every arg has name, description, type, and required fields", () => {
    for (const cmd of commands) {
      for (const arg of cmd.args) {
        expect(arg.name).toBeTruthy();
        expect(arg.description).toBeTruthy();
        expect(["string", "number", "boolean"]).toContain(arg.type);
        expect(typeof arg.required).toBe("boolean");
      }
    }
  });

  it("no duplicate command names", () => {
    const names = commands.map((c) => c.name);
    expect(new Set(names).size).toBe(names.length);
  });
});

describe("command execute", () => {
  function mockClient(methodName: string): BuiltWithClient {
    const handler = (...args: unknown[]) => Promise.resolve({ method: methodName, args });
    return Object.fromEntries(
      ALL_COMMAND_NAMES.map((n) => [n, handler]),
    ) as unknown as BuiltWithClient;
  }

  it("free passes lookup string", async () => {
    const cmd = commands.find((c) => c.name === "free")!;
    const client = mockClient("free");
    const result = (await cmd.execute(client, { lookup: "example.com" })) as any;
    expect(result.args[0]).toBe("example.com");
  });

  it("domain splits comma-separated lookups", async () => {
    const cmd = commands.find((c) => c.name === "domain")!;
    const client = mockClient("domain");
    const result = (await cmd.execute(client, { lookup: "a.com,b.com" })) as any;
    expect(result.args[0]).toEqual(["a.com", "b.com"]);
  });

  it("domain passes optional params", async () => {
    const cmd = commands.find((c) => c.name === "domain")!;
    const client = mockClient("domain");
    const result = (await cmd.execute(client, {
      lookup: "example.com",
      hideAll: true,
      onlyLiveTechnologies: true,
    })) as any;
    expect(result.args[0]).toBe("example.com");
    expect(result.args[1]).toMatchObject({
      hideAll: true,
      onlyLiveTechnologies: true,
    });
  });

  it("domain passes undefined params when none given", async () => {
    const cmd = commands.find((c) => c.name === "domain")!;
    const client = mockClient("domain");
    const result = (await cmd.execute(client, { lookup: "example.com" })) as any;
    expect(result.args[1]).toBeUndefined();
  });

  it("lists passes technology and optional params", async () => {
    const cmd = commands.find((c) => c.name === "lists")!;
    const client = mockClient("lists");
    const result = (await cmd.execute(client, {
      technology: "Shopify",
      since: "2024-01-01",
    })) as any;
    expect(result.args[0]).toBe("Shopify");
    expect(result.args[1]).toMatchObject({ since: "2024-01-01" });
  });

  it("relationships splits comma-separated lookups", async () => {
    const cmd = commands.find((c) => c.name === "relationships")!;
    const client = mockClient("relationships");
    const result = (await cmd.execute(client, { lookup: "a.com,b.com" })) as any;
    expect(result.args[0]).toEqual(["a.com", "b.com"]);
  });

  it("companyToUrl passes companyName and optional params", async () => {
    const cmd = commands.find((c) => c.name === "companyToUrl")!;
    const client = mockClient("companyToUrl");
    const result = (await cmd.execute(client, {
      companyName: "Acme",
      amount: 5,
      tld: "com",
    })) as any;
    expect(result.args[0]).toBe("Acme");
    expect(result.args[1]).toMatchObject({ amount: 5, tld: "com" });
  });

  it("trust passes lookup and optional params", async () => {
    const cmd = commands.find((c) => c.name === "trust")!;
    const client = mockClient("trust");
    const result = (await cmd.execute(client, {
      lookup: "example.com",
      words: "shop,buy",
      live: true,
    })) as any;
    expect(result.args[0]).toBe("example.com");
    expect(result.args[1]).toMatchObject({ words: "shop,buy", live: true });
  });

  it("trends passes technology and optional date", async () => {
    const cmd = commands.find((c) => c.name === "trends")!;
    const client = mockClient("trends");
    const result = (await cmd.execute(client, {
      technology: "React",
      date: "2024-06-01",
    })) as any;
    expect(result.args[0]).toBe("React");
    expect(result.args[1]).toMatchObject({ date: "2024-06-01" });
  });

  it("product passes query string", async () => {
    const cmd = commands.find((c) => c.name === "product")!;
    const client = mockClient("product");
    const result = (await cmd.execute(client, { query: "shoes" })) as any;
    expect(result.args[0]).toBe("shoes");
  });
});
