export type FitPreference = "pas" | "regular" | "longgar";

export function recommendSize(
  heightCm: number,
  weightKg: number,
  preference: FitPreference,
): string {
  const bmi = weightKg / (heightCm / 100) ** 2;

  let base: string;
  if (bmi < 18) base = "S";
  else if (bmi < 21) base = "M";
  else if (bmi < 24) base = "L";
  else if (bmi < 27) base = "XL";
  else base = "XXL";

  const order = ["XS", "S", "M", "L", "XL", "XXL"];
  const index = order.indexOf(base);

  if (preference === "longgar") {
    return order[Math.min(index + 1, order.length - 1)]!;
  }
  if (preference === "pas") {
    return order[Math.max(index - 1, 0)]!;
  }
  return base;
}
