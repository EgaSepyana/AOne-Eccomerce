import type { Review } from "../model/types";

export interface RatingDistributionRow {
  star: number;
  count: number;
  percent: number;
}

export function ratingDistribution(reviews: Review[]): RatingDistributionRow[] {
  const total = reviews.length;
  return [5, 4, 3, 2, 1].map((star) => {
    const count = reviews.filter((r) => r.rating === star).length;
    return {
      star,
      count,
      percent: total > 0 ? Math.round((count / total) * 100) : 0,
    };
  });
}

export function fitDistribution(reviews: Review[]): {
  kekecilan: number;
  pas: number;
  kebesaran: number;
  dominant: Review["fit"];
} {
  const total = reviews.length || 1;
  const kekecilan = reviews.filter((r) => r.fit === "kekecilan").length;
  const pas = reviews.filter((r) => r.fit === "pas").length;
  const kebesaran = reviews.filter((r) => r.fit === "kebesaran").length;

  const counts = { kekecilan, pas, kebesaran };
  const dominant = (Object.keys(counts) as Review["fit"][]).reduce((a, b) =>
    counts[a] >= counts[b] ? a : b,
  );

  return {
    kekecilan: Math.round((kekecilan / total) * 100),
    pas: Math.round((pas / total) * 100),
    kebesaran: Math.round((kebesaran / total) * 100),
    dominant,
  };
}
