export const ALLOWED_SIZES = ["S", "M", "L", "XL", "XXL"] as const;
export type GarmentSize = (typeof ALLOWED_SIZES)[number];
