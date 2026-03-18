import { describe, expect, it } from "bun:test";
import { formatTable } from "../src/format";

describe("formatTable", () => {
  describe("primitives", () => {
    it("formats null as (none)", () => {
      expect(formatTable(null)).toBe("(none)");
    });

    it("formats undefined as (none)", () => {
      expect(formatTable(undefined)).toBe("(none)");
    });

    it("formats strings directly", () => {
      expect(formatTable("hello")).toBe("hello");
    });

    it("formats numbers directly", () => {
      expect(formatTable(42)).toBe("42");
    });

    it("formats booleans directly", () => {
      expect(formatTable(true)).toBe("true");
    });
  });

  describe("flat objects", () => {
    it("formats key-value pairs with aligned keys", () => {
      const result = formatTable({ name: "Google", domain: "google.com" });
      expect(result).toContain("name    Google");
      expect(result).toContain("domain  google.com");
    });

    it("formats empty object as (empty)", () => {
      expect(formatTable({})).toBe("(empty)");
    });
  });

  describe("nested objects", () => {
    it("indents nested objects under their key", () => {
      const result = formatTable({ outer: { inner: "value" } });
      expect(result).toContain("outer:");
      expect(result).toContain("  inner  value");
    });

    it("handles multiple nesting levels", () => {
      const result = formatTable({ a: { b: { c: "deep" } } });
      expect(result).toContain("a:");
      expect(result).toContain("  b:");
      expect(result).toContain("    c  deep");
    });
  });

  describe("arrays of flat objects (table mode)", () => {
    it("renders a header, separator, and rows", () => {
      const data = [
        { name: "React", count: 5000 },
        { name: "Vue", count: 3000 },
      ];
      const result = formatTable(data);
      const lines = result.split("\n");
      // Header
      expect(lines[0]).toContain("name");
      expect(lines[0]).toContain("count");
      // Separator
      expect(lines[1]).toContain("─");
      // Rows
      expect(lines[2]).toContain("React");
      expect(lines[2]).toContain("5000");
      expect(lines[3]).toContain("Vue");
      expect(lines[3]).toContain("3000");
    });

    it("aligns columns by widest value", () => {
      const data = [
        { tech: "Shopify", sites: 100 },
        { tech: "WooCommerce", sites: 200 },
      ];
      const result = formatTable(data);
      const lines = result.split("\n");
      // "WooCommerce" is 11 chars, so "tech" header should be padded to at least 11
      expect(lines[0]).toMatch(/tech\s{7,}/);
    });

    it("handles missing keys across rows", () => {
      const data = [
        { a: 1, b: 2 },
        { a: 3, c: 4 },
      ];
      const result = formatTable(data);
      // All keys should appear in header
      expect(result).toContain("a");
      expect(result).toContain("b");
      expect(result).toContain("c");
    });
  });

  describe("arrays of non-objects", () => {
    it("renders indexed entries for mixed arrays", () => {
      const result = formatTable(["hello", "world"]);
      expect(result).toContain("[0]");
      expect(result).toContain("[1]");
      expect(result).toContain("hello");
      expect(result).toContain("world");
    });

    it("formats empty array as (empty)", () => {
      expect(formatTable([])).toBe("(empty)");
    });
  });

  describe("indentation", () => {
    it("respects initial indent parameter", () => {
      const result = formatTable("hello", 2);
      expect(result).toBe("    hello");
    });

    it("indents nested arrays within objects", () => {
      const data = {
        domain: "example.com",
        groups: [
          { name: "Analytics", categories: 3 },
          { name: "Widgets", categories: 1 },
        ],
      };
      const result = formatTable(data);
      expect(result).toContain("domain  example.com");
      expect(result).toContain("groups:");
      // Nested table should be indented
      expect(result).toContain("  name");
      expect(result).toContain("  ─");
    });
  });

  describe("realistic API response shapes", () => {
    it("formats a free lookup response", () => {
      const response = {
        domain: "google.com",
        first: 1199404800000,
        last: 1710288000000,
        groups: [
          { name: "Analytics and Tracking", categories: 5, live: 3, dead: 2 },
          { name: "Widgets", categories: 2, live: 2, dead: 0 },
        ],
      };
      const result = formatTable(response);
      expect(result).toContain("domain  google.com");
      expect(result).toContain("groups:");
      expect(result).toContain("Analytics and Tracking");
      expect(result).toContain("Widgets");
      // Should be a table with aligned columns
      expect(result).toContain("name");
      expect(result).toContain("categories");
      expect(result).toContain("live");
      expect(result).toContain("dead");
    });

    it("does not render [object Object] for nested arrays", () => {
      const response = {
        groups: [
          {
            name: "Analytics",
            live: 2,
            categories: [
              { name: "Tracking", live: 1 },
              { name: "Ads", live: 1 },
            ],
          },
        ],
      };
      const result = formatTable(response);
      expect(result).not.toContain("[object Object]");
      expect(result).toContain("Analytics");
      expect(result).toContain("Tracking");
      expect(result).toContain("Ads");
    });

    it("formats a companyToUrl response", () => {
      const response = {
        Results: [
          { URL: "google.com", Score: 95 },
          { URL: "google.co.uk", Score: 80 },
        ],
      };
      const result = formatTable(response);
      expect(result).toContain("Results:");
      expect(result).toContain("URL");
      expect(result).toContain("Score");
      expect(result).toContain("google.com");
    });
  });
});
