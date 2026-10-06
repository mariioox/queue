import { describe, expect, it } from "vitest";
import { DEFAULT_WAIT_MINUTES, estimateWaitMinutes } from "./wait";

describe("estimateWaitMinutes", () => {
  it("returns 0 for an empty queue", () => {
    expect(estimateWaitMinutes(0)).toBe(0);
  });

  it("returns 0 for negative input", () => {
    expect(estimateWaitMinutes(-3)).toBe(0);
  });

  it("uses the default 15-minute service time", () => {
    expect(estimateWaitMinutes(4)).toBe(4 * DEFAULT_WAIT_MINUTES);
  });

  it("uses a custom service time when provided", () => {
    expect(estimateWaitMinutes(3, 10)).toBe(30);
  });
});
