import { describe, it, expect } from "vitest";
import { cn } from "./utils";

describe("cn", () => {
  it("keeps later Tailwind classes over conflicting earlier ones", () => {
    const result = cn("px-2 py-1", "px-4");
    expect(result).toContain("px-4");
    expect(result).toContain("py-1");
    expect(result).not.toContain("px-2");
  });

  it("drops falsy values", () => {
    expect(cn("a", false, undefined, "b")).toBe("a b");
  });
});
