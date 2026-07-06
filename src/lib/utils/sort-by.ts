export function sortBy<T>(
  rows: T[],
  selector: (row: T) => number,
  direction: "asc" | "desc" = "desc"
) {
  return [...rows].sort((a, b) => {
    const result = selector(a) - selector(b);
    return direction === "asc" ? result : -result;
  });
}
