const { describe, it } = require("node:test");
const assert = require("node:assert/strict");
const {
  toQueryString,
  booleanParams,
  cleanWords,
  buildURL,
  validateLookup,
} = require("../src/params");

describe("toQueryString", () => {
  it("filters out undefined values", () => {
    assert.equal(toQueryString({ a: "1", b: undefined, c: "3" }), "a=1&c=3");
  });

  it("encodes special characters", () => {
    assert.equal(toQueryString({ q: "hello world" }), "q=hello%20world");
  });

  it("preserves commas (does not encode as %2C)", () => {
    assert.equal(toQueryString({ LOOKUP: "a.com,b.com" }), "LOOKUP=a.com,b.com");
  });

  it("returns empty string for all-undefined params", () => {
    assert.equal(toQueryString({ a: undefined, b: undefined }), "");
  });

  it("returns empty string for empty object", () => {
    assert.equal(toQueryString({}), "");
  });
});

describe("booleanParams", () => {
  const mapping = { hideAll: "HIDETEXT", noMetaData: "NOMETA" };

  it("maps truthy values to 'yes'", () => {
    const result = booleanParams({ hideAll: true, noMetaData: 1 }, mapping);
    assert.equal(result.HIDETEXT, "yes");
    assert.equal(result.NOMETA, "yes");
  });

  it("maps falsy values to undefined", () => {
    const result = booleanParams({ hideAll: false, noMetaData: 0 }, mapping);
    assert.equal(result.HIDETEXT, undefined);
    assert.equal(result.NOMETA, undefined);
  });

  it("maps missing keys to undefined", () => {
    const result = booleanParams({}, mapping);
    assert.equal(result.HIDETEXT, undefined);
    assert.equal(result.NOMETA, undefined);
  });

  it("does not throw when params is null or undefined", () => {
    assert.doesNotThrow(() => booleanParams(null, mapping));
    assert.doesNotThrow(() => booleanParams(undefined, mapping));
  });
});

describe("cleanWords", () => {
  it("trims whitespace around comma-separated words", () => {
    assert.equal(cleanWords("  foo , bar , baz "), "foo,bar,baz");
  });

  it("returns undefined for undefined input", () => {
    assert.equal(cleanWords(undefined), undefined);
  });

  it("handles a single word with no commas", () => {
    assert.equal(cleanWords("hello"), "hello");
  });
});

describe("buildURL", () => {
  it("assembles correct base URL with apiKey, format, path", () => {
    const result = buildURL("KEY123", "json", "free1", {});
    assert.equal(result, "https://api.builtwith.com/free1/api.json?KEY=KEY123");
  });

  it("appends query string when params have values", () => {
    const result = buildURL("KEY123", "json", "v22", { LOOKUP: "example.com" });
    assert.equal(
      result,
      "https://api.builtwith.com/v22/api.json?KEY=KEY123&LOOKUP=example.com",
    );
  });

  it("no trailing & when params are all undefined", () => {
    const result = buildURL("KEY123", "xml", "free1", { a: undefined });
    assert.equal(result, "https://api.builtwith.com/free1/api.xml?KEY=KEY123");
  });

  it("supports custom subdomain", () => {
    const result = buildURL("KEY123", "json", "lists12", {}, "pro");
    assert.equal(result, "https://pro.builtwith.com/lists12/api.json?KEY=KEY123");
  });
});

describe("validateLookup", () => {
  it("does not throw for string input", () => {
    assert.doesNotThrow(() => validateLookup("example.com"));
  });

  it("throws for array input when multi is false (default)", () => {
    assert.throws(
      () => validateLookup(["a.com", "b.com"]),
      { message: "API does not allow for multi-domain LOOKUP" },
    );
  });

  it("does not throw for array input when multi is true and length <= 16", () => {
    const domains = Array.from({ length: 16 }, (_, i) => `d${i}.com`);
    assert.doesNotThrow(() => validateLookup(domains, { multi: true }));
  });

  it("throws when array length > 16", () => {
    const domains = Array.from({ length: 17 }, (_, i) => `d${i}.com`);
    assert.throws(
      () => validateLookup(domains, { multi: true }),
      { message: "Domain LOOKUP size too big (16 max)" },
    );
  });
});
