import { z } from "zod/v4";

export function formatError(err: unknown): string {
  if (err instanceof z.ZodError) {
    const fields = err.issues.map((i) => {
      const path = i.path.length > 0 ? i.path.join(".") : "response";
      return `  ${path}: ${i.message}`;
    });
    return `BuiltWith API returned an unexpected response:\n${fields.join("\n")}`;
  }
  if (err instanceof Error) {
    return err.message;
  }
  return String(err);
}
