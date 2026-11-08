import { describe, it, expect } from "vitest";
import { isNearBottom, NEAR_BOTTOM_PX } from "./scrollPin";

describe("isNearBottom", () => {
  it("is true when exactly at the bottom", () => {
    expect(isNearBottom(900, 100, 1000)).toBe(true);
  });

  it("is true within the threshold", () => {
    expect(isNearBottom(900 - NEAR_BOTTOM_PX, 100, 1000)).toBe(true);
  });

  it("is false just past the threshold", () => {
    expect(isNearBottom(900 - NEAR_BOTTOM_PX - 1, 100, 1000)).toBe(false);
  });

  it("is false when scrolled to the top of long content", () => {
    expect(isNearBottom(0, 100, 1000)).toBe(false);
  });

  it("is true when the content is shorter than the view", () => {
    expect(isNearBottom(0, 500, 200)).toBe(true);
  });

  it("respects a custom threshold", () => {
    expect(isNearBottom(800, 100, 1000, 100)).toBe(true);
    expect(isNearBottom(799, 100, 1000, 100)).toBe(false);
  });
});
