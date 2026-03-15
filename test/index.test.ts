import { describe, expect, it } from "bun:test";
import { createClient } from "../src/index";

const EXPECTED_METHODS = [
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

describe("createClient", () => {
  it("throws when apiKey is missing", () => {
    // @ts-expect-error testing missing required argument
    expect(() => createClient()).toThrow("You must initialize the BuiltWith module with an api key");
  });

  it("throws for invalid responseFormat", () => {
    expect(() => createClient("key", { responseFormat: "yaml" as any })).toThrow();
  });

  it("returns an object with all 13 method names", () => {
    const client = createClient("test-key");
    for (const name of EXPECTED_METHODS) {
      expect(name in client).toBe(true);
    }
  });

  it("each method is a function", () => {
    const client = createClient("test-key");
    for (const name of EXPECTED_METHODS) {
      expect(typeof client[name]).toBe("function");
    }
  });
});
