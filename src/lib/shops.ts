import type { Shop } from "../types/queue";

/** Case-insensitive match of the query against a shop's name and description. */
function matchesQuery(shop: Shop, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  return (
    shop.name.toLowerCase().includes(q) ||
    shop.description.toLowerCase().includes(q)
  );
}

/** Search + category filter used by the Explore page. "All" disables the category filter. */
export function filterShops(
  shops: Shop[],
  query: string,
  category: string,
): Shop[] {
  return shops.filter((shop) => {
    const matchesCategory = category === "All" || shop.category === category;
    return matchesCategory && matchesQuery(shop, query);
  });
}
