export type SortDirection = "asc" | "desc";

export function sortNumber<T>(
  rows: T[],
  getter: (row: T) => number,
  direction: SortDirection = "desc",
) {
  return [...rows].sort((a, b) =>
    direction === "desc" ? getter(b) - getter(a) : getter(a) - getter(b),
  );
}

export function sortText<T>(
  rows: T[],
  getter: (row: T) => string,
  direction: SortDirection = "asc",
) {
  return [...rows].sort((a, b) =>
    direction === "asc"
      ? getter(a).localeCompare(getter(b))
      : getter(b).localeCompare(getter(a)),
  );
}
