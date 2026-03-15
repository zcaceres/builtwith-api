import { describe, expect, it } from "bun:test";
import { createClient } from "../src/index";

const apiKey = process.env.BUILTWITH_API_KEY;

describe.if(!!apiKey)("integration (live API)", () => {
  // Lazy init — createClient throws without a key, and describe.if still evaluates the body
  let client: ReturnType<typeof createClient>;
  function getClient() {
    if (!client) client = createClient(apiKey!);
    return client;
  }

  it("free returns a valid response for a known domain", async () => {
    const result = await getClient().free("google.com");
    expect(typeof result).toBe("object");
    const data = result as Record<string, unknown>;
    expect(data.domain).toBe("google.com");
    expect(Array.isArray(data.groups)).toBe(true);
    expect((data.groups as unknown[]).length).toBeGreaterThan(0);
  });

  it("domain returns results for a known domain", async () => {
    const result = await getClient().domain("google.com");
    expect(typeof result).toBe("object");
    const data = result as Record<string, unknown>;
    expect(data.Results).toBeDefined();
    expect(Array.isArray(data.Results)).toBe(true);
  });

  it("trust returns a valid response", async () => {
    const result = await getClient().trust("google.com");
    expect(typeof result).toBe("object");
    const data = result as Record<string, unknown>;
    expect(data.Domain).toBe("google.com");
    expect(data.DBRecord).toBeDefined();
  });

  it("trends returns data for a known technology", async () => {
    const result = await getClient().trends("jQuery");
    expect(typeof result).toBe("object");
    const data = result as Record<string, unknown>;
    expect(data.Tech).toBeDefined();
  });

  it("keywords returns data for a known domain", async () => {
    const result = await getClient().keywords("google.com");
    expect(typeof result).toBe("object");
    const data = result as Record<string, unknown>;
    expect(data.Keywords).toBeDefined();
    expect(Array.isArray(data.Keywords)).toBe(true);
  });

  it("redirects returns inbound/outbound arrays", async () => {
    const result = await getClient().redirects("google.com");
    expect(typeof result).toBe("object");
    const data = result as Record<string, unknown>;
    expect(data.Lookup).toBe("google.com");
    expect(Array.isArray(data.Inbound)).toBe(true);
    expect(Array.isArray(data.Outbound)).toBe(true);
  });
});
