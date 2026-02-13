import { describe, it, expect } from "bun:test";
import {
  toQueryString,
  booleanParams,
  cleanWords,
  buildURL,
  validateLookup,
} from "../src/params";

describe("toQueryString", () => {
  it("filters out undefined values", () => {
    expect(toQueryString({ a: "1", b: undefined, c: "3" })).toBe("a=1&c=3");
  });

  it("encodes special characters", () => {
    expect(toQueryString({ q: "hello world" })).toBe("q=hello%20world");
  });

  it("preserves commas (does not encode as %2C)", () => {
    expect(toQueryString({ LOOKUP: "a.com,b.com" })).toBe(
      "LOOKUP=a.com,b.com",
    );
  });

  it("returns empty string for all-undefined params", () => {
    expect(toQueryString({ a: undefined, b: undefined })).toBe("");
  });

  it("returns empty string for empty object", () => {
    expect(toQueryString({})).toBe("");
  });
});

describe("booleanParams", () => {
  const mapping = { hideAll: "HIDETEXT", noMetaData: "NOMETA" };

  it("maps truthy values to 'yes'", () => {
    const result = booleanParams({ hideAll: true, noMetaData: 1 }, mapping);
    expect(result.HIDETEXT).toBe("yes");
    expect(result.NOMETA).toBe("yes");
  });

  it("maps falsy values to undefined", () => {
    const result = booleanParams({ hideAll: false, noMetaData: 0 }, mapping);
    expect(result.HIDETEXT).toBeUndefined();
    expect(result.NOMETA).toBeUndefined();
  });

  it("maps missing keys to undefined", () => {
    const result = booleanParams({}, mapping);
    expect(result.HIDETEXT).toBeUndefined();
    expect(result.NOMETA).toBeUndefined();
  });

  it("does not throw when params is null or undefined", () => {
    expect(() => booleanParams(null, mapping)).not.toThrow();
    expect(() => booleanParams(undefined, mapping)).not.toThrow();
  });
});

describe("cleanWords", () => {
  it("trims whitespace around comma-separated words", () => {
    expect(cleanWords("  foo , bar , baz ")).toBe("foo,bar,baz");
  });

  it("returns undefined for undefined input", () => {
    expect(cleanWords(undefined)).toBeUndefined();
  });

  it("handles a single word with no commas", () => {
    expect(cleanWords("hello")).toBe("hello");
  });
});

describe("buildURL", () => {
  it("assembles correct base URL with apiKey, format, path", () => {
    const result = buildURL("KEY123", "json", "free1", {});
    expect(result).toBe("https://api.builtwith.com/free1/api.json?KEY=KEY123");
  });

  it("appends query string when params have values", () => {
    const result = buildURL("KEY123", "json", "v22", {
      LOOKUP: "example.com",
    });
    expect(result).toBe(
      "https://api.builtwith.com/v22/api.json?KEY=KEY123&LOOKUP=example.com",
    );
  });

  it("no trailing & when params are all undefined", () => {
    const result = buildURL("KEY123", "xml", "free1", { a: undefined });
    expect(result).toBe("https://api.builtwith.com/free1/api.xml?KEY=KEY123");
  });

  it("supports custom subdomain", () => {
    const result = buildURL("KEY123", "json", "lists12", {}, "pro");
    expect(result).toBe(
      "https://pro.builtwith.com/lists12/api.json?KEY=KEY123",
    );
  });
});

describe("validateLookup", () => {
  it("does not throw for string input", () => {
    expect(() => validateLookup("example.com")).not.toThrow();
  });

  it("throws for array input when multi is false (default)", () => {
    expect(() => validateLookup(["a.com", "b.com"])).toThrow(
      "API does not allow for multi-domain LOOKUP",
    );
  });

  it("does not throw for array input when multi is true and length <= 16", () => {
    const domains = Array.from({ length: 16 }, (_, i) => `d${i}.com`);
    expect(() => validateLookup(domains, { multi: true })).not.toThrow();
  });

  it("throws when array length > 16", () => {
    const domains = Array.from({ length: 17 }, (_, i) => `d${i}.com`);
    expect(() => validateLookup(domains, { multi: true })).toThrow(
      "Domain LOOKUP size too big (16 max)",
    );
  });
});
