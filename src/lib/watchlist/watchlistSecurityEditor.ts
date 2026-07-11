import {
  WatchlistSecurity,
  WatchlistState,
} from "@/lib/watchlist/watchlistTypes";

export type WatchlistSecurityDraft = {
  symbol: string;
  name: string;
  exchange: string;
  currency: string;
  sector: string;
  industry: string;
  targetPrice: string;
  analystRating: string;
  note: string;
  tags: string;
};

export type WatchlistSecurityValidation = {
  valid: boolean;
  errors: Partial<
    Record<
      keyof WatchlistSecurityDraft | "form",
      string
    >
  >;
};

export const defaultWatchlistSecurityDraft:
  WatchlistSecurityDraft = {
    symbol: "",
    name: "",
    exchange: "ASX",
    currency: "AUD",
    sector: "",
    industry: "",
    targetPrice: "",
    analystRating: "Unrated",
    note: "",
    tags: "",
  };

function createSecurityId(
  symbol: string
) {
  const prefix =
    symbol
      .trim()
      .toLowerCase()
      .replace(
        /[^a-z0-9]+/g,
        "-"
      )
      .replace(
        /^-+|-+$/g,
        ""
      );

  if (
    typeof crypto !==
      "undefined" &&
    typeof crypto.randomUUID ===
      "function"
  ) {
    return `watch-${prefix}-${crypto.randomUUID()}`;
  }

  return `watch-${prefix}-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 8)}`;
}

export function normaliseWatchlistSymbol(
  value: string
) {
  return value
    .trim()
    .toUpperCase();
}

export function parseWatchlistTags(
  value: string
) {
  return Array.from(
    new Set(
      value
        .split(",")
        .map((tag) =>
          tag.trim()
        )
        .filter(Boolean)
    )
  ).slice(0, 20);
}

export function watchlistSecurityToDraft(
  security: WatchlistSecurity
): WatchlistSecurityDraft {
  return {
    symbol:
      security.symbol,
    name:
      security.name,
    exchange:
      security.exchange,
    currency:
      security.currency,
    sector:
      security.sector,
    industry:
      security.industry,
    targetPrice:
      security.targetPrice ===
      null
        ? ""
        : String(
            security.targetPrice
          ),
    analystRating:
      security.analystRating,
    note:
      security.note,
    tags:
      security.tags.join(
        ", "
      ),
  };
}

export function validateWatchlistSecurityDraft(
  draft: WatchlistSecurityDraft,
  existingSecurities: WatchlistSecurity[],
  editingId?: string | null
): WatchlistSecurityValidation {
  const errors:
    WatchlistSecurityValidation["errors"] = {};

  const symbol =
    normaliseWatchlistSymbol(
      draft.symbol
    );

  if (!symbol) {
    errors.symbol =
      "Symbol is required.";
  } else if (
    !/^[A-Z0-9.\-:^]{1,20}$/.test(
      symbol
    )
  ) {
    errors.symbol =
      "Use letters, numbers, dots, dashes, colons or carets only.";
  }

  const duplicate =
    existingSecurities.find(
      (security) =>
        security.id !==
          editingId &&
        normaliseWatchlistSymbol(
          security.symbol
        ) === symbol &&
        security.exchange
          .trim()
          .toUpperCase() ===
          draft.exchange
            .trim()
            .toUpperCase()
    );

  if (duplicate) {
    errors.symbol =
      `${symbol} already exists on the ${duplicate.exchange} watchlist universe.`;
  }

  if (
    !draft.name.trim()
  ) {
    errors.name =
      "Company or security name is required.";
  }

  if (
    !draft.exchange.trim()
  ) {
    errors.exchange =
      "Exchange is required.";
  }

  const currency =
    draft.currency
      .trim()
      .toUpperCase();

  if (
    !/^[A-Z]{3}$/.test(
      currency
    )
  ) {
    errors.currency =
      "Currency must use a three-letter code such as AUD or USD.";
  }

  if (
    draft.targetPrice.trim()
  ) {
    const targetPrice =
      Number(
        draft.targetPrice
      );

    if (
      !Number.isFinite(
        targetPrice
      ) ||
      targetPrice < 0
    ) {
      errors.targetPrice =
        "Target price must be zero or greater.";
    }
  }

  if (
    draft.note.length >
    2000
  ) {
    errors.note =
      "Notes must be 2,000 characters or fewer.";
  }

  if (
    parseWatchlistTags(
      draft.tags
    ).some(
      (tag) =>
        tag.length > 40
    )
  ) {
    errors.tags =
      "Each tag must be 40 characters or fewer.";
  }

  return {
    valid:
      Object.keys(
        errors
      ).length === 0,
    errors,
  };
}

export function createWatchlistSecurity(
  draft: WatchlistSecurityDraft
): WatchlistSecurity {
  const now =
    new Date().toISOString();

  const symbol =
    normaliseWatchlistSymbol(
      draft.symbol
    );

  return {
    id:
      createSecurityId(
        symbol
      ),
    symbol,
    name:
      draft.name.trim(),
    exchange:
      draft.exchange
        .trim()
        .toUpperCase(),
    currency:
      draft.currency
        .trim()
        .toUpperCase(),
    sector:
      draft.sector.trim() ||
      "Unclassified",
    industry:
      draft.industry.trim() ||
      "Unclassified",
    price: 0,
    previousClose: 0,
    change: 0,
    changePercent: 0,
    dayHigh: 0,
    dayLow: 0,
    fiftyTwoWeekHigh: 0,
    fiftyTwoWeekLow: 0,
    volume: 0,
    averageVolume: 0,
    marketCapitalisation: 0,
    targetPrice:
      draft.targetPrice.trim()
        ? Number(
            draft.targetPrice
          )
        : null,
    analystRating:
      draft.analystRating.trim() ||
      "Unrated",
    note:
      draft.note.trim(),
    tags:
      parseWatchlistTags(
        draft.tags
      ),
    alertCount: 0,
    addedAt: now,
    updatedAt: now,
  };
}

export function updateWatchlistSecurityFromDraft(
  security: WatchlistSecurity,
  draft: WatchlistSecurityDraft
): WatchlistSecurity {
  return {
    ...security,
    symbol:
      normaliseWatchlistSymbol(
        draft.symbol
      ),
    name:
      draft.name.trim(),
    exchange:
      draft.exchange
        .trim()
        .toUpperCase(),
    currency:
      draft.currency
        .trim()
        .toUpperCase(),
    sector:
      draft.sector.trim() ||
      "Unclassified",
    industry:
      draft.industry.trim() ||
      "Unclassified",
    targetPrice:
      draft.targetPrice.trim()
        ? Number(
            draft.targetPrice
          )
        : null,
    analystRating:
      draft.analystRating.trim() ||
      "Unrated",
    note:
      draft.note.trim(),
    tags:
      parseWatchlistTags(
        draft.tags
      ),
    updatedAt:
      new Date().toISOString(),
  };
}

export function addSecurityToWatchlistState(
  state: WatchlistState,
  security: WatchlistSecurity,
  groupId: string
): WatchlistState {
  return {
    ...state,
    securities: [
      ...state.securities,
      security,
    ],
    groups:
      state.groups.map(
        (group) =>
          group.id ===
          groupId
            ? {
                ...group,
                securityIds:
                  group.securityIds.includes(
                    security.id
                  )
                    ? group.securityIds
                    : [
                        ...group.securityIds,
                        security.id,
                      ],
                updatedAt:
                  new Date().toISOString(),
              }
            : group
      ),
  };
}

export function updateSecurityInWatchlistState(
  state: WatchlistState,
  security: WatchlistSecurity
): WatchlistState {
  return {
    ...state,
    securities:
      state.securities.map(
        (entry) =>
          entry.id ===
          security.id
            ? security
            : entry
      ),
  };
}

export function removeSecurityFromWatchlistGroup(
  state: WatchlistState,
  securityId: string,
  groupId: string,
  removeFromUniverse = false
): WatchlistState {
  const nextGroups =
    state.groups.map(
      (group) =>
        group.id ===
        groupId
          ? {
              ...group,
              securityIds:
                group.securityIds.filter(
                  (id) =>
                    id !==
                    securityId
                ),
              updatedAt:
                new Date().toISOString(),
            }
          : group
    );

  const stillReferenced =
    nextGroups.some(
      (group) =>
        group.securityIds.includes(
          securityId
        )
    );

  return {
    ...state,
    groups:
      nextGroups,
    securities:
      removeFromUniverse &&
      !stillReferenced
        ? state.securities.filter(
            (security) =>
              security.id !==
              securityId
          )
        : state.securities,
  };
}
