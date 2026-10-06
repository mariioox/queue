export const SHOP_CATEGORIES = [
  "Barber",
  "Food",
  "Laundry",
  "Clinic",
  "Other",
] as const;

export type Category = (typeof SHOP_CATEGORIES)[number];
