export type TransactionDensity = "comfortable" | "compact";

export type TransactionColumnKey =
  | "date"
  | "symbol"
  | "type"
  | "quantity"
  | "price"
  | "fees"
  | "total"
  | "broker"
  | "actions";

export type TransactionColumnVisibility = Record<
  TransactionColumnKey,
  boolean
>;

export type TransactionTablePreferences = {
  density: TransactionDensity;
  columnVisibility: TransactionColumnVisibility;
};

const STORAGE_KEY = "lgrbz.transaction.table-preferences.v1";

export const defaultTransactionColumnVisibility: TransactionColumnVisibility =
  {
    date: true,
    symbol: true,
    type: true,
    quantity: true,
    price: true,
    fees: true,
    total: true,
    broker: true,
    actions: true,
  };

export const defaultTransactionTablePreferences: TransactionTablePreferences =
  {
    density: "comfortable",
    columnVisibility: {
      ...defaultTransactionColumnVisibility,
    },
  };

export const transactionColumnDefinitions: Array<{
  key: TransactionColumnKey;
  label: string;
  required?: boolean;
}> = [
  {
    key: "date",
    label: "Date",
  },
  {
    key: "symbol",
    label: "Symbol",
    required: true,
  },
  {
    key: "type",
    label: "Type",
  },
  {
    key: "quantity",
    label: "Quantity",
  },
  {
    key: "price",
    label: "Price",
  },
  {
    key: "fees",
    label: "Fees",
  },
  {
    key: "total",
    label: "Total",
    required: true,
  },
  {
    key: "broker",
    label: "Broker",
  },
  {
    key: "actions",
    label: "Actions",
    required: true,
  },
];

function canUseStorage() {
  return (
    typeof window !== "undefined" &&
    typeof window.localStorage !== "undefined"
  );
}

function sanitiseDensity(value: unknown): TransactionDensity {
  return value === "compact" ? "compact" : "comfortable";
}

function sanitiseColumnVisibility(
  value: unknown
): TransactionColumnVisibility {
  const candidate =
    value && typeof value === "object"
      ? (value as Partial<TransactionColumnVisibility>)
      : {};

  return {
    date:
      typeof candidate.date === "boolean"
        ? candidate.date
        : defaultTransactionColumnVisibility.date,
    symbol: true,
    type:
      typeof candidate.type === "boolean"
        ? candidate.type
        : defaultTransactionColumnVisibility.type,
    quantity:
      typeof candidate.quantity === "boolean"
        ? candidate.quantity
        : defaultTransactionColumnVisibility.quantity,
    price:
      typeof candidate.price === "boolean"
        ? candidate.price
        : defaultTransactionColumnVisibility.price,
    fees:
      typeof candidate.fees === "boolean"
        ? candidate.fees
        : defaultTransactionColumnVisibility.fees,
    total: true,
    broker:
      typeof candidate.broker === "boolean"
        ? candidate.broker
        : defaultTransactionColumnVisibility.broker,
    actions: true,
  };
}

export function sanitiseTransactionTablePreferences(
  value: unknown
): TransactionTablePreferences {
  const candidate =
    value && typeof value === "object"
      ? (value as Partial<TransactionTablePreferences>)
      : {};

  return {
    density: sanitiseDensity(candidate.density),
    columnVisibility: sanitiseColumnVisibility(
      candidate.columnVisibility
    ),
  };
}

export function loadTransactionTablePreferences() {
  if (!canUseStorage()) {
    return defaultTransactionTablePreferences;
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);

    if (!raw) {
      return defaultTransactionTablePreferences;
    }

    return sanitiseTransactionTablePreferences(JSON.parse(raw));
  } catch {
    return defaultTransactionTablePreferences;
  }
}

export function saveTransactionTablePreferences(
  preferences: TransactionTablePreferences
) {
  if (!canUseStorage()) return;

  try {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(
        sanitiseTransactionTablePreferences(preferences)
      )
    );
  } catch {
    // Table preference persistence must never block the workspace.
  }
}

export function countVisibleTransactionColumns(
  visibility: TransactionColumnVisibility
) {
  return Object.values(visibility).filter(Boolean).length;
}
