import {
  NormalisedTransaction,
  TransactionSortKey,
} from "@/lib/transactions/professionalTransactions";

export type TransactionSortDirection =
  | "asc"
  | "desc";

export type TransactionSortRule = {
  id: string;
  key: TransactionSortKey;
  direction: TransactionSortDirection;
};

const STORAGE_KEY =
  "lgrbz.transaction.multi-sort.v1";

const supportedKeys:
  TransactionSortKey[] = [
    "date",
    "symbol",
    "type",
    "quantity",
    "price",
    "fees",
    "total",
  ];

function createRuleId() {
  if (
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID === "function"
  ) {
    return crypto.randomUUID();
  }

  return `sort-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 9)}`;
}

function canUseStorage() {
  return (
    typeof window !== "undefined" &&
    typeof window.localStorage !==
      "undefined"
  );
}

export function createTransactionSortRule(
  key: TransactionSortKey,
  direction: TransactionSortDirection =
    "desc"
): TransactionSortRule {
  return {
    id: createRuleId(),
    key,
    direction,
  };
}

export function sanitiseTransactionSortRules(
  value: unknown
): TransactionSortRule[] {
  if (!Array.isArray(value)) {
    return [];
  }

  const seen =
    new Set<TransactionSortKey>();

  const rules:
    TransactionSortRule[] = [];

  value.forEach((candidate) => {
    if (
      !candidate ||
      typeof candidate !== "object"
    ) {
      return;
    }

    const item =
      candidate as Partial<TransactionSortRule>;

    if (
      !item.key ||
      !supportedKeys.includes(item.key) ||
      seen.has(item.key)
    ) {
      return;
    }

    seen.add(item.key);

    rules.push({
      id:
        typeof item.id === "string" &&
        item.id
          ? item.id
          : createRuleId(),
      key: item.key,
      direction:
        item.direction === "asc"
          ? "asc"
          : "desc",
    });
  });

  return rules.slice(0, 7);
}

export function loadTransactionSortRules() {
  if (!canUseStorage()) {
    return [];
  }

  try {
    const raw =
      window.localStorage.getItem(
        STORAGE_KEY
      );

    if (!raw) {
      return [];
    }

    return sanitiseTransactionSortRules(
      JSON.parse(raw)
    );
  } catch {
    return [];
  }
}

export function saveTransactionSortRules(
  rules: TransactionSortRule[]
) {
  if (!canUseStorage()) {
    return;
  }

  try {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(
        sanitiseTransactionSortRules(
          rules
        )
      )
    );
  } catch {
    // Sort persistence must never block the workspace.
  }
}

function getComparableValue(
  row: NormalisedTransaction,
  key: TransactionSortKey
) {
  if (key === "date") {
    return (
      new Date(row.date).getTime() ||
      0
    );
  }

  if (
    key === "quantity" ||
    key === "price" ||
    key === "fees" ||
    key === "total"
  ) {
    return Number(row[key] || 0);
  }

  return String(
    row[key] ?? ""
  ).toLocaleLowerCase();
}

function compareValues(
  left: string | number,
  right: string | number
) {
  if (
    typeof left === "number" &&
    typeof right === "number"
  ) {
    return left - right;
  }

  return String(left).localeCompare(
    String(right),
    "en-AU",
    {
      numeric: true,
      sensitivity: "base",
    }
  );
}

export function multiSortTransactions(
  rows: NormalisedTransaction[],
  rules: TransactionSortRule[]
) {
  const safeRules =
    sanitiseTransactionSortRules(
      rules
    );

  if (safeRules.length === 0) {
    return [...rows];
  }

  return rows
    .map((row, index) => ({
      row,
      index,
    }))
    .sort((a, b) => {
      for (
        const rule of safeRules
      ) {
        const left =
          getComparableValue(
            a.row,
            rule.key
          );

        const right =
          getComparableValue(
            b.row,
            rule.key
          );

        const result =
          compareValues(
            left,
            right
          );

        if (result !== 0) {
          return rule.direction ===
            "asc"
            ? result
            : -result;
        }
      }

      return a.index - b.index;
    })
    .map((entry) => entry.row);
}

export function toggleTransactionSortRule(
  rules: TransactionSortRule[],
  key: TransactionSortKey,
  additive = false
) {
  const existing =
    rules.find(
      (rule) =>
        rule.key === key
    );

  if (!additive) {
    if (!existing) {
      return [
        createTransactionSortRule(
          key,
          "desc"
        ),
      ];
    }

    return [
      {
        ...existing,
        direction:
          existing.direction ===
          "desc"
            ? "asc"
            : "desc",
      },
    ];
  }

  if (!existing) {
    return [
      ...rules,
      createTransactionSortRule(
        key,
        "desc"
      ),
    ];
  }

  return rules.map((rule) =>
    rule.id === existing.id
      ? {
          ...rule,
          direction:
            rule.direction ===
            "desc"
              ? "asc"
              : "desc",
        }
      : rule
  );
}

export function removeTransactionSortRule(
  rules: TransactionSortRule[],
  id: string
) {
  return rules.filter(
    (rule) =>
      rule.id !== id
  );
}

export function moveTransactionSortRule(
  rules: TransactionSortRule[],
  id: string,
  direction:
    | "up"
    | "down"
) {
  const index =
    rules.findIndex(
      (rule) =>
        rule.id === id
    );

  if (index < 0) {
    return rules;
  }

  const targetIndex =
    direction === "up"
      ? index - 1
      : index + 1;

  if (
    targetIndex < 0 ||
    targetIndex >= rules.length
  ) {
    return rules;
  }

  const next = [
    ...rules,
  ];

  const current =
    next[index];

  next[index] =
    next[targetIndex];

  next[targetIndex] =
    current;

  return next;
}
