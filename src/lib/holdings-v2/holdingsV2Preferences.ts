import {
  HoldingsV2ColumnKey,
  HoldingsV2Preferences,
} from "./holdingsV2Types";

const STORAGE_KEY =
  "lgrbz.holdings-v2.preferences.v1";

export const defaultHoldingsV2ColumnOrder:
  HoldingsV2ColumnKey[] = [
    "symbol",
    "quantity",
    "averageCost",
    "currentPrice",
    "marketValue",
    "costBase",
    "unrealisedGainLoss",
    "dailyGainLoss",
    "portfolioWeight",
    "sector",
    "currency",
    "account",
    "risk",
    "priceStatus",
    "actions",
  ];

export const defaultHoldingsV2Preferences:
  HoldingsV2Preferences = {
    version: 1,

    density:
      "comfortable",

    viewMode:
      "table",

    sortKey:
      "marketValue",

    sortDirection:
      "desc",

    pageSize: 25,

    columnVisibility: {
      symbol: true,
      quantity: true,
      averageCost: true,
      currentPrice: true,
      marketValue: true,
      costBase: true,
      unrealisedGainLoss: true,
      dailyGainLoss: true,
      portfolioWeight: true,
      sector: true,
      currency: true,
      account: false,
      risk: false,
      priceStatus: true,
      actions: true,
    },

    columnOrder: [
      ...defaultHoldingsV2ColumnOrder,
    ],

    columnWidths: {},

    showSummary: true,
    showFilters: true,
    showClosedPositions: false,
    stickyHeader: true,
    compactNumbers: false,
    reduceMotion: false,

    updatedAt:
      new Date(0).toISOString(),
  };

function canUseStorage() {
  return (
    typeof window !==
      "undefined" &&
    typeof window.localStorage !==
      "undefined"
  );
}

function isRecord(
  value: unknown
): value is Record<
  string,
  unknown
> {
  return (
    Boolean(value) &&
    typeof value ===
      "object" &&
    !Array.isArray(value)
  );
}

function isColumnKey(
  value: unknown
): value is HoldingsV2ColumnKey {
  return defaultHoldingsV2ColumnOrder.includes(
    value as HoldingsV2ColumnKey
  );
}

export function normaliseHoldingsV2Preferences(
  value: unknown
): HoldingsV2Preferences {
  if (
    !isRecord(value)
  ) {
    return {
      ...defaultHoldingsV2Preferences,
      columnVisibility: {
        ...defaultHoldingsV2Preferences.columnVisibility,
      },
      columnOrder: [
        ...defaultHoldingsV2Preferences.columnOrder,
      ],
      columnWidths: {},
    };
  }

  const visibility =
    isRecord(
      value.columnVisibility
    )
      ? value.columnVisibility
      : {};

  const columnVisibility =
    defaultHoldingsV2ColumnOrder.reduce(
      (
        result,
        key
      ) => {
        result[key] =
          typeof visibility[
            key
          ] === "boolean"
            ? Boolean(
                visibility[
                  key
                ]
              )
            : defaultHoldingsV2Preferences
                .columnVisibility[
                  key
                ];

        return result;
      },
      {} as HoldingsV2Preferences["columnVisibility"]
    );

  const requestedOrder =
    Array.isArray(
      value.columnOrder
    )
      ? value.columnOrder.filter(
          isColumnKey
        )
      : [];

  const columnOrder = [
    ...requestedOrder,
    ...defaultHoldingsV2ColumnOrder.filter(
      (key) =>
        !requestedOrder.includes(
          key
        )
    ),
  ];

  return {
    version: 1,

    density:
      value.density ===
        "compact" ||
      value.density ===
        "spacious"
        ? value.density
        : "comfortable",

    viewMode:
      value.viewMode ===
        "cards" ||
      value.viewMode ===
        "compact"
        ? value.viewMode
        : "table",

    sortKey:
      typeof value.sortKey ===
      "string"
        ? value.sortKey as HoldingsV2Preferences["sortKey"]
        : "marketValue",

    sortDirection:
      value.sortDirection ===
      "asc"
        ? "asc"
        : "desc",

    pageSize:
      typeof value.pageSize ===
        "number" &&
      value.pageSize >
        0
        ? value.pageSize
        : 25,

    columnVisibility,
    columnOrder,

    columnWidths:
      isRecord(
        value.columnWidths
      )
        ? value.columnWidths as HoldingsV2Preferences["columnWidths"]
        : {},

    showSummary:
      typeof value.showSummary ===
      "boolean"
        ? value.showSummary
        : true,

    showFilters:
      typeof value.showFilters ===
      "boolean"
        ? value.showFilters
        : true,

    showClosedPositions:
      typeof value.showClosedPositions ===
      "boolean"
        ? value.showClosedPositions
        : false,

    stickyHeader:
      typeof value.stickyHeader ===
      "boolean"
        ? value.stickyHeader
        : true,

    compactNumbers:
      typeof value.compactNumbers ===
      "boolean"
        ? value.compactNumbers
        : false,

    reduceMotion:
      typeof value.reduceMotion ===
      "boolean"
        ? value.reduceMotion
        : false,

    updatedAt:
      typeof value.updatedAt ===
        "string"
        ? value.updatedAt
        : new Date().toISOString(),
  };
}

export function loadHoldingsV2Preferences() {
  if (!canUseStorage()) {
    return normaliseHoldingsV2Preferences(
      defaultHoldingsV2Preferences
    );
  }

  try {
    const raw =
      window.localStorage.getItem(
        STORAGE_KEY
      );

    return raw
      ? normaliseHoldingsV2Preferences(
          JSON.parse(raw)
        )
      : normaliseHoldingsV2Preferences(
          defaultHoldingsV2Preferences
        );
  } catch {
    return normaliseHoldingsV2Preferences(
      defaultHoldingsV2Preferences
    );
  }
}

export function saveHoldingsV2Preferences(
  preferences: HoldingsV2Preferences
) {
  if (!canUseStorage()) {
    return;
  }

  const next = {
    ...normaliseHoldingsV2Preferences(
      preferences
    ),
    updatedAt:
      new Date().toISOString(),
  };

  try {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(
        next
      )
    );

    window.dispatchEvent(
      new CustomEvent(
        "lgrbz:holdings-v2-preferences-changed",
        {
          detail:
            next,
        }
      )
    );
  } catch {
    // Holdings preferences must not block the page.
  }
}

export function resetHoldingsV2Preferences() {
  const next =
    normaliseHoldingsV2Preferences(
      defaultHoldingsV2Preferences
    );

  saveHoldingsV2Preferences(
    next
  );

  return next;
}
