import { describe, expect, it } from "bun:test";

function cli(
  args: string[],
  env: Record<string, string> = {},
): Promise<{ stdout: string; stderr: string; exitCode: number }> {
  return new Promise((resolve) => {
    const proc = Bun.spawn(["bun", "run", "src/cli.ts", ...args], {
      cwd: `${import.meta.dir}/..`,
      env: { ...process.env, ...env },
      stdout: "pipe",
      stderr: "pipe",
    });
    proc.exited.then(async (exitCode) => {
      const stdout = await new Response(proc.stdout).text();
      const stderr = await new Response(proc.stderr).text();
      resolve({ stdout, stderr, exitCode });
    });
  });
}

describe("CLI", () => {
  describe("--help", () => {
    it("shows usage with no args", async () => {
      const { stdout, exitCode } = await cli([], { BUILTWITH_API_KEY: "" });
      expect(stdout).toContain("Usage: builtwith");
      expect(stdout).toContain("Commands:");
      expect(exitCode).toBe(0);
    });

    it("shows usage with --help flag", async () => {
      const { stdout, exitCode } = await cli(["--help"], { BUILTWITH_API_KEY: "" });
      expect(stdout).toContain("Usage: builtwith");
      expect(exitCode).toBe(0);
    });

    it("shows command-specific help", async () => {
      const { stdout, exitCode } = await cli(["domain", "--help"], { BUILTWITH_API_KEY: "test" });
      expect(stdout).toContain("builtwith domain");
      expect(stdout).toContain("--hideAll");
      expect(exitCode).toBe(0);
    });
  });

  describe("--version", () => {
    it("prints the version number", async () => {
      const { stdout, exitCode } = await cli(["--version"]);
      expect(stdout.trim()).toMatch(/^\d+\.\d+\.\d+$/);
      expect(exitCode).toBe(0);
    });
  });

  describe("error handling", () => {
    it("exits 1 for unknown command", async () => {
      const { stderr, exitCode } = await cli(["bogus"], { BUILTWITH_API_KEY: "test" });
      expect(stderr).toContain("Unknown command: bogus");
      expect(exitCode).toBe(1);
    });

    it("exits 1 when missing required arg", async () => {
      const { stderr, exitCode } = await cli(["free"], { BUILTWITH_API_KEY: "test" });
      expect(stderr).toContain("missing required argument");
      expect(exitCode).toBe(1);
    });

    it("exits 1 when no API key provided", async () => {
      const { stderr, exitCode } = await cli(["free", "example.com"], { BUILTWITH_API_KEY: "" });
      expect(stderr).toContain("--api-key");
      expect(stderr).toContain("BUILTWITH_API_KEY");
      expect(exitCode).toBe(1);
    });

    it("accepts --api-key flag", async () => {
      // Will fail at the API level but should not fail at the arg-parsing level
      const { stderr } = await cli(["free", "example.com", "--api-key", "test-key"]);
      // Should get past arg parsing — any error is from the API, not missing key
      expect(stderr).not.toContain("BUILTWITH_API_KEY");
    });
  });

  describe("--table flag", () => {
    it("shows --table in help output", async () => {
      const { stdout } = await cli(["--help"]);
      expect(stdout).toContain("--table");
      expect(stdout).toContain("Pretty-print");
    });

    it("shows --table example in help", async () => {
      const { stdout } = await cli(["--help"]);
      expect(stdout).toContain("--table");
    });

    it("--table flag does not cause arg parse error", async () => {
      // Will fail at the API level, but should not fail at arg parsing
      const { stderr } = await cli(["free", "example.com", "--table", "--api-key", "test-key"]);
      expect(stderr).not.toContain("BUILTWITH_API_KEY");
      expect(stderr).not.toContain("missing required argument");
    });
  });

  describe("error formatting", () => {
    it("formats API errors cleanly, not raw JSON", async () => {
      const { stderr } = await cli(["free", "example.com", "--api-key", "badkey"]);
      // Should not dump raw Zod error array
      expect(stderr).not.toContain('"code": "invalid_type"');
      // Should contain human-readable message
      expect(stderr).toMatch(/unexpected response|API error/i);
    });
  });
});
