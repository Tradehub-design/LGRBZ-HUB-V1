export function toNumber(value: unknown): number {

  if (typeof value === "number") return value;

  if (value == null) return 0;

  const cleaned = String(value)
    .replace(/,/g, "")
    .replace(/\$/g, "")
    .trim();

  const n = Number(cleaned);

  return Number.isFinite(n) ? n : 0;
}
