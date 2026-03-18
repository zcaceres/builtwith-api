import { describe, expect, it } from "bun:test";
import { z } from "zod/v4";
import { formatError } from "../src/errors";

describe("formatError", () => {
  it("formats ZodError into readable message", () => {
    const schema = z.object({ name: z.string(), age: z.number() });
    try {
      schema.parse({ name: 123, age: "not a number" });
    } catch (err) {
      const msg = formatError(err);
      expect(msg).toContain("unexpected response");
      expect(msg).toContain("name:");
      expect(msg).toContain("age:");
      expect(msg).not.toContain('"code"');
    }
  });

  it("returns message from regular Error", () => {
    const msg = formatError(new Error("something broke"));
    expect(msg).toBe("something broke");
  });

  it("converts non-Error values to string", () => {
    expect(formatError("raw string")).toBe("raw string");
    expect(formatError(42)).toBe("42");
  });

  it("formats API HTTP errors cleanly", () => {
    const msg = formatError(new Error("BuiltWith API error 401: Unauthorized"));
    expect(msg).toContain("401");
    expect(msg).toContain("Unauthorized");
  });
});
