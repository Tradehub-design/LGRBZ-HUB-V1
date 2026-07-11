export type TransactionType = "BUY" | "SELL" | "DIVIDEND" | "TRANSFER" | "FEE" | "OTHER";

export type TransactionSortKey =
  | "date"
  | "symbol"
  | "type"
  | "quantity"
  | "price"
  | "fees"
  | "total";

export type TransactionFilterState = {
  search: string;
  type: "ALL" | TransactionType;
  symbol: string;
  dateFrom: string;
  dateTo: string;
};

export type NormalisedTransaction = {
  id: string;
  date: string;
  symbol: string;
  name?: string;
  type: TransactionType;
  quantity: number;
  price: number;
  fees: number;
  total: number;
  currency?: string;
  broker?: string;
  notes?: string;
};

export const defaultTransactionFilters: TransactionFilterState = {
  search: "",
  type: "ALL",
  symbol: "ALL",
  dateFrom: "",
  dateTo: "",
};

export function formatMoney(value: number, currency = "AUD") {
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(Number.isFinite(value) ? value : 0);
}

export function formatNumber(value: number, decimals = 2) {
  return new Intl.NumberFormat("en-AU", {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimals,
  }).format(Number.isFinite(value) ? value : 0);
}

export function normaliseTransaction(raw: any, index = 0): NormalisedTransaction {
  const type = String(raw?.type ?? raw?.transactionType ?? raw?.action ?? "OTHER").toUpperCase();

  const quantity = Number(raw?.quantity ?? raw?.qty ?? raw?.units ?? 0);
  const price = Number(raw?.price ?? raw?.unitPrice ?? raw?.costPerShare ?? 0);
  const fees = Number(raw?.fees ?? raw?.fee ?? raw?.brokerage ?? 0);
  const fallbackTotal = quantity * price + fees;

  return {
    id: String(raw?.id ?? raw?.transactionId ?? `txn-${index}`),
    date: String(raw?.date ?? raw?.tradeDate ?? raw?.createdAt ?? ""),
    symbol: String(raw?.symbol ?? raw?.ticker ?? raw?.code ?? "").toUpperCase(),
    name: raw?.name ?? raw?.companyName ?? raw?.securityName ?? "",
    type: ["BUY", "SELL", "DIVIDEND", "TRANSFER", "FEE"].includes(type)
      ? (type as TransactionType)
      : "OTHER",
    quantity,
    price,
    fees,
    total: Number(raw?.total ?? raw?.value ?? raw?.amount ?? fallbackTotal),
    currency: raw?.currency ?? "AUD",
    broker: raw?.broker ?? raw?.platform ?? "",
    notes: raw?.notes ?? raw?.description ?? "",
  };
}

export function filterTransactions(
  rows: NormalisedTransaction[],
  filters: TransactionFilterState
) {
  const q = filters.search.trim().toLowerCase();

  return rows.filter((row) => {
    const matchesSearch =
      !q ||
      row.symbol.toLowerCase().includes(q) ||
      String(row.name ?? "").toLowerCase().includes(q) ||
      String(row.broker ?? "").toLowerCase().includes(q) ||
      String(row.notes ?? "").toLowerCase().includes(q);

    const matchesType = filters.type === "ALL" || row.type === filters.type;
    const matchesSymbol = filters.symbol === "ALL" || row.symbol === filters.symbol;

    const rowDate = row.date ? new Date(row.date).getTime() : 0;
    const from = filters.dateFrom ? new Date(filters.dateFrom).getTime() : null;
    const to = filters.dateTo ? new Date(filters.dateTo).getTime() : null;

    const matchesFrom = from === null || rowDate >= from;
    const matchesTo = to === null || rowDate <= to;

    return matchesSearch && matchesType && matchesSymbol && matchesFrom && matchesTo;
  });
}

export function sortTransactions(
  rows: NormalisedTransaction[],
  key: TransactionSortKey,
  direction: "asc" | "desc"
) {
  return [...rows].sort((a, b) => {
    const modifier = direction === "asc" ? 1 : -1;

    if (key === "date") {
      return ((new Date(a.date).getTime() || 0) - (new Date(b.date).getTime() || 0)) * modifier;
    }

    const av = a[key];
    const bv = b[key];

    if (typeof av === "number" && typeof bv === "number") {
      return (av - bv) * modifier;
    }

    return String(av ?? "").localeCompare(String(bv ?? "")) * modifier;
  });
}

export function paginateTransactions<T>(rows: T[], page: number, pageSize: number) {
  const safePage = Math.max(1, page);
  const safePageSize = Math.max(1, pageSize);
  const start = (safePage - 1) * safePageSize;

  return {
    rows: rows.slice(start, start + safePageSize),
    totalPages: Math.max(1, Math.ceil(rows.length / safePageSize)),
    start,
    end: Math.min(rows.length, start + safePageSize),
  };
}

export function getTransactionSummary(rows: NormalisedTransaction[]) {
  return rows.reduce(
    (acc, row) => {
      acc.count += 1;
      acc.buyValue += row.type === "BUY" ? row.total : 0;
      acc.sellValue += row.type === "SELL" ? row.total : 0;
      acc.dividendValue += row.type === "DIVIDEND" ? row.total : 0;
      acc.fees += row.fees || 0;
      acc.netValue += row.type === "SELL" ? -row.total : row.total;
      return acc;
    },
    {
      count: 0,
      buyValue: 0,
      sellValue: 0,
      dividendValue: 0,
      fees: 0,
      netValue: 0,
    }
  );
}

export function transactionsToCsv(rows: NormalisedTransaction[]) {
  const headers = [
    "Date",
    "Symbol",
    "Name",
    "Type",
    "Quantity",
    "Price",
    "Fees",
    "Total",
    "Currency",
    "Broker",
    "Notes",
  ];

  const escape = (value: unknown) => {
    const text = String(value ?? "");
    return `"${text.replace(/"/g, '""')}"`;
  };

  return [
    headers.join(","),
    ...rows.map((row) =>
      [
        row.date,
        row.symbol,
        row.name,
        row.type,
        row.quantity,
        row.price,
        row.fees,
        row.total,
        row.currency,
        row.broker,
        row.notes,
      ]
        .map(escape)
        .join(",")
    ),
  ].join("\n");
}
