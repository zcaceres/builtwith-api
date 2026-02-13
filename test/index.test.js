const { describe, it } = require("node:test");
const assert = require("node:assert/strict");
const createClient = require("../src/index");

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
];

describe("createClient", () => {
  it("throws when apiKey is missing", () => {
    assert.throws(() => createClient(), {
      message: "You must initialize the BuiltWith module with an api key",
    });
  });

  it("throws for invalid responseFormat", () => {
    assert.throws(() => createClient("key", { responseFormat: "yaml" }), {
      message: /Invalid 'responseFormat'.*yaml/,
    });
  });

  it("returns an object with all 13 method names", () => {
    const client = createClient("test-key");
    for (const name of EXPECTED_METHODS) {
      assert.ok(name in client, `missing method: ${name}`);
    }
  });

  it("each method is a function", () => {
    const client = createClient("test-key");
    for (const name of EXPECTED_METHODS) {
      assert.equal(typeof client[name], "function", `${name} is not a function`);
    }
  });
});
