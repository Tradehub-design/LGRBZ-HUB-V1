"use client";

import { useMemo, useState } from "react";

export function useWorkspaceSearch<T>(
  rows: T[],
  getSearchText: (row: T) => string,
) {
  const [query, setQuery] = useState("");

  const filteredRows = useMemo(() => {
    const cleaned = query.trim().toLowerCase();

    if (!cleaned) return rows;

    return rows.filter((row) =>
      getSearchText(row).toLowerCase().includes(cleaned),
    );
  }, [getSearchText, query, rows]);

  return {
    query,
    setQuery,
    filteredRows,
  };
}
