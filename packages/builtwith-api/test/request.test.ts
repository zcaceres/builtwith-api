import { afterEach, describe, expect, it, mock } from "bun:test";
import { z } from "zod/v4";
import { request, requestSafe } from "../src/request";

const TestSchema = z.strictObject({ id: z.number(), name: z.string() });

// Save original fetch so we can restore it
const originalFetch = globalThis.fetch;

afterEach(() => {
  globalThis.fetch = originalFetch;
});

describe("request", () => {
  it("parses valid JSON response", async () => {
    globalThis.fetch = mock(() =>
      Promise.resolve(new Response(JSON.stringify({ id: 1, name: "test" }), { status: 200 })),
    );
    const result = await request("https://api.example.com/test", "json", TestSchema);
    expect(result).toEqual({ id: 1, name: "test" });
  });

  it("returns raw text for XML format", async () => {
    globalThis.fetch = mock(() => Promise.resolve(new Response("<root><id>1</id></root>", { status: 200 })));
    const result = await request("https://api.example.com/test", "xml", TestSchema);
    expect(result).toBe("<root><id>1</id></root>");
  });

  it("returns raw text for CSV format", async () => {
    globalThis.fetch = mock(() => Promise.resolve(new Response("id,name\n1,test", { status: 200 })));
    const result = await request("https://api.example.com/test", "csv", TestSchema);
    expect(result).toBe("id,name\n1,test");
  });

  it("returns raw text for TSV format", async () => {
    globalThis.fetch = mock(() => Promise.resolve(new Response("id\tname\n1\ttest", { status: 200 })));
    const result = await request("https://api.example.com/test", "tsv", TestSchema);
    expect(result).toBe("id\tname\n1\ttest");
  });

  it("returns raw text for TXT format", async () => {
    globalThis.fetch = mock(() => Promise.resolve(new Response("example.com\nother.com", { status: 200 })));
    const result = await request("https://api.example.com/test", "txt", TestSchema);
    expect(result).toBe("example.com\nother.com");
  });

  it("skips schema validation for all text formats", async () => {
    const invalidJson = "not valid json at all";
    for (const format of ["xml", "csv", "tsv", "txt"] as const) {
      globalThis.fetch = mock(() => Promise.resolve(new Response(invalidJson, { status: 200 })));
      const result = await request("https://api.example.com/test", format, TestSchema);
      expect(result).toBe(invalidJson);
    }
  });

  it("throws on HTTP 400", async () => {
    globalThis.fetch = mock(() => Promise.resolve(new Response("Bad Request", { status: 400 })));
    await expect(request("https://api.example.com/test", "json", TestSchema)).rejects.toThrow(
      "BuiltWith API error 400: Bad Request",
    );
  });

  it("throws on HTTP 401", async () => {
    globalThis.fetch = mock(() => Promise.resolve(new Response("Unauthorized", { status: 401 })));
    await expect(request("https://api.example.com/test", "json", TestSchema)).rejects.toThrow(
      "BuiltWith API error 401: Unauthorized",
    );
  });

  it("throws on HTTP 500", async () => {
    globalThis.fetch = mock(() => Promise.resolve(new Response("Internal Server Error", { status: 500 })));
    await expect(request("https://api.example.com/test", "json", TestSchema)).rejects.toThrow(
      "BuiltWith API error 500: Internal Server Error",
    );
  });

  it("throws ZodError on schema mismatch", async () => {
    globalThis.fetch = mock(() =>
      Promise.resolve(new Response(JSON.stringify({ id: "not-a-number", name: "test" }), { status: 200 })),
    );
    await expect(request("https://api.example.com/test", "json", TestSchema)).rejects.toThrow();
  });

  it("throws on network failure", async () => {
    globalThis.fetch = mock(() => Promise.reject(new TypeError("fetch failed")));
    await expect(request("https://api.example.com/test", "json", TestSchema)).rejects.toThrow("fetch failed");
  });

  it("throws clear error for API error returned as HTTP 200", async () => {
    const apiError = { Errors: [{ Message: "API Key is incorrect" }] };
    globalThis.fetch = mock(() => Promise.resolve(new Response(JSON.stringify(apiError), { status: 200 })));
    await expect(request("https://api.example.com/test", "json", TestSchema)).rejects.toThrow(
      "BuiltWith API error: API Key is incorrect",
    );
  });

  it("throws clear error for multiple API errors as HTTP 200", async () => {
    const apiError = { Errors: [{ Message: "Error one" }, { Message: "Error two" }] };
    globalThis.fetch = mock(() => Promise.resolve(new Response(JSON.stringify(apiError), { status: 200 })));
    await expect(request("https://api.example.com/test", "json", TestSchema)).rejects.toThrow(
      "BuiltWith API error: Error one; Error two",
    );
  });

  it("throws on invalid JSON with descriptive message", async () => {
    globalThis.fetch = mock(() => Promise.resolve(new Response("this is not json {{{", { status: 200 })));
    await expect(request("https://api.example.com/test", "json", TestSchema)).rejects.toThrow(
      "BuiltWith returned invalid JSON",
    );
  });
});

describe("requestSafe", () => {
  it("parses valid JSON response", async () => {
    globalThis.fetch = mock(() =>
      Promise.resolve(new Response(JSON.stringify({ id: 1, name: "test" }), { status: 200 })),
    );
    const result = await requestSafe("https://api.example.com/test", "json", TestSchema);
    expect(result).toEqual({ id: 1, name: "test" });
  });

  it("falls back to raw text on malformed JSON", async () => {
    globalThis.fetch = mock(() => Promise.resolve(new Response("this is not json {{{", { status: 200 })));
    const result = await requestSafe("https://api.example.com/test", "json", TestSchema);
    expect(result).toBe("this is not json {{{");
  });

  it("throws on HTTP errors", async () => {
    globalThis.fetch = mock(() => Promise.resolve(new Response("Service Unavailable", { status: 503 })));
    await expect(requestSafe("https://api.example.com/test", "json", TestSchema)).rejects.toThrow(
      "BuiltWith API error 503: Service Unavailable",
    );
  });

  it("returns raw text for TSV format", async () => {
    globalThis.fetch = mock(() => Promise.resolve(new Response("id\tname\n1\ttest", { status: 200 })));
    const result = await requestSafe("https://api.example.com/test", "tsv", TestSchema);
    expect(result).toBe("id\tname\n1\ttest");
  });

  it("returns raw text for XML format", async () => {
    globalThis.fetch = mock(() => Promise.resolve(new Response("<root><id>1</id></root>", { status: 200 })));
    const result = await requestSafe("https://api.example.com/test", "xml", TestSchema);
    expect(result).toBe("<root><id>1</id></root>");
  });

  it("returns raw text for CSV format", async () => {
    globalThis.fetch = mock(() => Promise.resolve(new Response("id,name\n1,test", { status: 200 })));
    const result = await requestSafe("https://api.example.com/test", "csv", TestSchema);
    expect(result).toBe("id,name\n1,test");
  });

  it("returns raw text for TXT format", async () => {
    globalThis.fetch = mock(() => Promise.resolve(new Response("example.com\nother.com", { status: 200 })));
    const result = await requestSafe("https://api.example.com/test", "txt", TestSchema);
    expect(result).toBe("example.com\nother.com");
  });

  it("skips schema validation for all text formats", async () => {
    const invalidJson = "not valid json at all";
    for (const format of ["xml", "csv", "tsv", "txt"] as const) {
      globalThis.fetch = mock(() => Promise.resolve(new Response(invalidJson, { status: 200 })));
      const result = await requestSafe("https://api.example.com/test", format, TestSchema);
      expect(result).toBe(invalidJson);
    }
  });

  it("throws ZodError on valid JSON that doesn't match schema", async () => {
    globalThis.fetch = mock(() => Promise.resolve(new Response(JSON.stringify({ wrong: "shape" }), { status: 200 })));
    await expect(requestSafe("https://api.example.com/test", "json", TestSchema)).rejects.toThrow();
  });

  it("throws on network failure", async () => {
    globalThis.fetch = mock(() => Promise.reject(new Error("DNS resolution failed")));
    await expect(requestSafe("https://api.example.com/test", "json", TestSchema)).rejects.toThrow(
      "DNS resolution failed",
    );
  });

  it("throws clear error for API error returned as HTTP 200", async () => {
    const apiError = { Errors: [{ Message: "API Key is incorrect" }] };
    globalThis.fetch = mock(() => Promise.resolve(new Response(JSON.stringify(apiError), { status: 200 })));
    await expect(requestSafe("https://api.example.com/test", "json", TestSchema)).rejects.toThrow(
      "BuiltWith API error: API Key is incorrect",
    );
  });
});
