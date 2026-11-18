import { describe, expect, it } from "vitest";
import { validPlacement } from "./registration";

describe("flock placement", () => {
  it("accepts 100 received and 100 placed", () => {
    expect(validPlacement(100, 100)).toBe(true);
  });
  it("rejects more placed birds than received birds", () => {
    expect(validPlacement(100, 101)).toBe(false);
  });
  it("rejects fractional bird counts and empty populations", () => {
    expect(validPlacement(100, 99.5)).toBe(false);
    expect(validPlacement(100, 0)).toBe(false);
  });
});