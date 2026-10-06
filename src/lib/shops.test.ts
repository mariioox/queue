import { describe, expect, it } from "vitest";
import { filterShops } from "./shops";
import type { Shop } from "../types/queue";

const shop = (overrides: Partial<Shop>): Shop => ({
  id: "1",
  name: "Downtown Barber",
  category: "Barber",
  location: "Main St",
  description: "Sharp cuts, fair prices",
  avgWaitMinutes: 15,
  image_url: "",
  owner_id: "owner",
  currentQueue: 0,
  ...overrides,
});

const shops = [
  shop({ id: "1", name: "Downtown Barber", category: "Barber" }),
  shop({
    id: "2",
    name: "Noodle House",
    category: "Food",
    description: "Ramen and dumplings",
  }),
  shop({ id: "3", name: "Quick Wash", category: "Laundry" }),
];

describe("filterShops", () => {
  it("returns everything when query is empty and category is All", () => {
    expect(filterShops(shops, "", "All")).toHaveLength(3);
  });

  it("filters by category", () => {
    const result = filterShops(shops, "", "Food");
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe("Noodle House");
  });

  it("matches the query against name, case-insensitively", () => {
    const result = filterShops(shops, "BARBER", "All");
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("1");
  });

  it("matches the query against description", () => {
    const result = filterShops(shops, "ramen", "All");
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("2");
  });

  it("combines category and query", () => {
    expect(filterShops(shops, "noodle", "Barber")).toHaveLength(0);
    expect(filterShops(shops, "noodle", "Food")).toHaveLength(1);
  });

  it("ignores surrounding whitespace in the query", () => {
    expect(filterShops(shops, "  wash  ", "All")).toHaveLength(1);
  });
});
