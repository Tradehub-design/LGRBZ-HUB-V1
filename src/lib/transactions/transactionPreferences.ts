import {
  defaultTransactionFilters,
  TransactionFilterState,
} from "@/lib/transactions/professionalTransactions";

export type SavedTransactionPreset = {
  id: string;
  name: string;
  filters: TransactionFilterState;
  createdAt: string;
};

const PRESET_STORAGE_KEY = "lgrbz.transaction.filter-presets.v1";

function canUseStorage() {
  return typeof window !== "undefined" && Boolean(window.localStorage);
}

export function sanitiseTransactionFilters(
  value?: Partial<TransactionFilterState> | null
): TransactionFilterState {
  return {
    search:
      typeof value?.search === "string"
        ? value.search
        : defaultTransactionFilters.search,
    type:
      value?.type === "BUY" ||
      value?.type === "SELL" ||
      value?.type === "DIVIDEND" ||
      value?.type === "TRANSFER" ||
      value?.type === "FEE" ||
      value?.type === "OTHER" ||
      value?.type === "ALL"
        ? value.type
        : defaultTransactionFilters.type,
    symbol:
      typeof value?.symbol === "string" && value.symbol.trim()
        ? value.symbol
        : defaultTransactionFilters.symbol,
    dateFrom:
      typeof value?.dateFrom === "string"
        ? value.dateFrom
        : defaultTransactionFilters.dateFrom,
    dateTo:
      typeof value?.dateTo === "string"
        ? value.dateTo
        : defaultTransactionFilters.dateTo,
  };
}

export function loadTransactionFilterPresets(): SavedTransactionPreset[] {
  if (!canUseStorage()) return [];

  try {
    const raw = window.localStorage.getItem(PRESET_STORAGE_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    return parsed
      .filter((item) => item && typeof item === "object")
      .map((item) => ({
        id:
          typeof item.id === "string" && item.id
            ? item.id
            : createPresetId(),
        name:
          typeof item.name === "string" && item.name.trim()
            ? item.name.trim()
            : "Saved Filter",
        filters: sanitiseTransactionFilters(item.filters),
        createdAt:
          typeof item.createdAt === "string" && item.createdAt
            ? item.createdAt
            : new Date().toISOString(),
      }));
  } catch {
    return [];
  }
}

export function saveTransactionFilterPresets(
  presets: SavedTransactionPreset[]
) {
  if (!canUseStorage()) return;

  try {
    window.localStorage.setItem(
      PRESET_STORAGE_KEY,
      JSON.stringify(presets)
    );
  } catch {
    // Storage failures should never block the transactions workspace.
  }
}

export function createPresetId() {
  if (
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID === "function"
  ) {
    return crypto.randomUUID();
  }

  return `preset-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 10)}`;
}

export function createTransactionFilterPreset(
  name: string,
  filters: TransactionFilterState
): SavedTransactionPreset {
  return {
    id: createPresetId(),
    name: name.trim() || "Saved Filter",
    filters: sanitiseTransactionFilters(filters),
    createdAt: new Date().toISOString(),
  };
}

export function areTransactionFiltersActive(
  filters: TransactionFilterState
) {
  return (
    filters.search.trim() !== "" ||
    filters.type !== "ALL" ||
    filters.symbol !== "ALL" ||
    filters.dateFrom !== "" ||
    filters.dateTo !== ""
  );
}

export function countActiveTransactionFilters(
  filters: TransactionFilterState
) {
  let count = 0;

  if (filters.search.trim()) count += 1;
  if (filters.type !== "ALL") count += 1;
  if (filters.symbol !== "ALL") count += 1;
  if (filters.dateFrom) count += 1;
  if (filters.dateTo) count += 1;

  return count;
}
