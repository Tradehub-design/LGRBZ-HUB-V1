import {
  TransactionColumnKey,
} from "@/lib/transactions/transactionTablePreferences";

export type TransactionColumnWidthMap =
  Partial<
    Record<
      TransactionColumnKey,
      number
    >
  >;

export type TransactionColumnLayout = {
  order: TransactionColumnKey[];
  widths: TransactionColumnWidthMap;
  freezeSelection: boolean;
  freezeSymbol: boolean;
};

const STORAGE_KEY =
  "lgrbz.transaction.column-layout.v1";

export const defaultTransactionColumnOrder:
  TransactionColumnKey[] = [
    "date",
    "symbol",
    "type",
    "quantity",
    "price",
    "fees",
    "total",
    "broker",
    "actions",
  ];

export const defaultTransactionColumnWidths:
  TransactionColumnWidthMap = {
    date: 132,
    symbol: 220,
    type: 118,
    quantity: 120,
    price: 132,
    fees: 112,
    total: 144,
    broker: 160,
    actions: 116,
  };

export const defaultTransactionColumnLayout:
  TransactionColumnLayout = {
    order: [
      ...defaultTransactionColumnOrder,
    ],
    widths: {
      ...defaultTransactionColumnWidths,
    },
    freezeSelection: true,
    freezeSymbol: true,
  };

const minimumColumnWidths:
  Record<
    TransactionColumnKey,
    number
  > = {
    date: 100,
    symbol: 150,
    type: 90,
    quantity: 90,
    price: 100,
    fees: 90,
    total: 110,
    broker: 110,
    actions: 96,
  };

const maximumColumnWidths:
  Record<
    TransactionColumnKey,
    number
  > = {
    date: 220,
    symbol: 420,
    type: 220,
    quantity: 220,
    price: 240,
    fees: 220,
    total: 260,
    broker: 360,
    actions: 180,
  };

function canUseStorage() {
  return (
    typeof window !==
      "undefined" &&
    typeof window.localStorage !==
      "undefined"
  );
}

export function clampTransactionColumnWidth(
  key: TransactionColumnKey,
  width: number
) {
  return Math.max(
    minimumColumnWidths[key],
    Math.min(
      maximumColumnWidths[key],
      Math.round(width)
    )
  );
}

function sanitiseOrder(
  value: unknown
): TransactionColumnKey[] {
  if (
    !Array.isArray(value)
  ) {
    return [
      ...defaultTransactionColumnOrder,
    ];
  }

  const allowed =
    new Set<TransactionColumnKey>(
      defaultTransactionColumnOrder
    );

  const unique:
    TransactionColumnKey[] = [];

  value.forEach((entry) => {
    if (
      allowed.has(
        entry as TransactionColumnKey
      ) &&
      !unique.includes(
        entry as TransactionColumnKey
      )
    ) {
      unique.push(
        entry as TransactionColumnKey
      );
    }
  });

  defaultTransactionColumnOrder.forEach(
    (key) => {
      if (
        !unique.includes(key)
      ) {
        unique.push(key);
      }
    }
  );

  return unique;
}

function sanitiseWidths(
  value: unknown
): TransactionColumnWidthMap {
  const candidate =
    value &&
    typeof value ===
      "object"
      ? (value as TransactionColumnWidthMap)
      : {};

  const widths:
    TransactionColumnWidthMap = {};

  defaultTransactionColumnOrder.forEach(
    (key) => {
      const raw =
        candidate[key];

      const fallback =
        defaultTransactionColumnWidths[
          key
        ] ?? 120;

      widths[key] =
        clampTransactionColumnWidth(
          key,
          typeof raw ===
            "number" &&
            Number.isFinite(raw)
            ? raw
            : fallback
        );
    }
  );

  return widths;
}

export function sanitiseTransactionColumnLayout(
  value: unknown
): TransactionColumnLayout {
  const candidate =
    value &&
    typeof value ===
      "object"
      ? (value as Partial<TransactionColumnLayout>)
      : {};

  return {
    order:
      sanitiseOrder(
        candidate.order
      ),
    widths:
      sanitiseWidths(
        candidate.widths
      ),
    freezeSelection:
      candidate.freezeSelection !==
      false,
    freezeSymbol:
      candidate.freezeSymbol !==
      false,
  };
}

export function loadTransactionColumnLayout() {
  if (
    !canUseStorage()
  ) {
    return {
      ...defaultTransactionColumnLayout,
      order: [
        ...defaultTransactionColumnLayout.order,
      ],
      widths: {
        ...defaultTransactionColumnLayout.widths,
      },
    };
  }

  try {
    const raw =
      window.localStorage.getItem(
        STORAGE_KEY
      );

    if (!raw) {
      return {
        ...defaultTransactionColumnLayout,
        order: [
          ...defaultTransactionColumnLayout.order,
        ],
        widths: {
          ...defaultTransactionColumnLayout.widths,
        },
      };
    }

    return sanitiseTransactionColumnLayout(
      JSON.parse(raw)
    );
  } catch {
    return {
      ...defaultTransactionColumnLayout,
      order: [
        ...defaultTransactionColumnLayout.order,
      ],
      widths: {
        ...defaultTransactionColumnLayout.widths,
      },
    };
  }
}

export function saveTransactionColumnLayout(
  layout: TransactionColumnLayout
) {
  if (
    !canUseStorage()
  ) {
    return;
  }

  try {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(
        sanitiseTransactionColumnLayout(
          layout
        )
      )
    );
  } catch {
    // Table layout persistence must never block the workspace.
  }
}

export function moveTransactionColumn(
  order: TransactionColumnKey[],
  source:
    TransactionColumnKey,
  target:
    TransactionColumnKey
) {
  if (
    source === target
  ) {
    return [
      ...order,
    ];
  }

  const next =
    order.filter(
      (key) =>
        key !== source
    );

  const targetIndex =
    next.indexOf(
      target
    );

  if (
    targetIndex < 0
  ) {
    next.push(source);
    return next;
  }

  next.splice(
    targetIndex,
    0,
    source
  );

  return next;
}
