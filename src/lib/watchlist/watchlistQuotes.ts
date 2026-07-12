import {
  WatchlistSecurity,
  WatchlistState,
} from "@/lib/watchlist/watchlistTypes";

export type WatchlistQuoteProvider =
  | "MANUAL"
  | "DELAYED"
  | "LIVE_ADAPTER";

export type WatchlistQuoteFreshness =
  | "LIVE"
  | "FRESH"
  | "DELAYED"
  | "STALE"
  | "UNAVAILABLE";

export type WatchlistMarketSession =
  | "PRE_MARKET"
  | "OPEN"
  | "AFTER_HOURS"
  | "CLOSED"
  | "UNKNOWN";

export type WatchlistQuote = {
  securityId: string;
  symbol: string;
  exchange: string;
  currency: string;
  price: number;
  previousClose: number;
  change: number;
  changePercent: number;
  dayHigh: number;
  dayLow: number;
  volume: number;
  quotedAt: string;
  receivedAt: string;
  provider: WatchlistQuoteProvider;
  delayedMinutes: number;
  marketSession: WatchlistMarketSession;
  error: string | null;
};

export type WatchlistPriceHistoryPoint = {
  id: string;
  securityId: string;
  symbol: string;
  price: number;
  changePercent: number;
  quotedAt: string;
  recordedAt: string;
  provider: WatchlistQuoteProvider;
};

export type WatchlistQuoteStore = {
  version: number;
  quotes: Record<
    string,
    WatchlistQuote
  >;
  history: WatchlistPriceHistoryPoint[];
  lastRefreshAt: string | null;
  lastSuccessfulRefreshAt: string | null;
  provider: WatchlistQuoteProvider;
};

export type WatchlistQuoteRefreshResult = {
  quotes: WatchlistQuote[];
  refreshedAt: string;
  provider: WatchlistQuoteProvider;
  successCount: number;
  failureCount: number;
};

export type WatchlistManualQuoteDraft = {
  price: string;
  previousClose: string;
  dayHigh: string;
  dayLow: string;
  volume: string;
  quotedAt: string;
};

export type WatchlistManualQuoteValidation = {
  valid: boolean;
  errors: Partial<
    Record<
      keyof WatchlistManualQuoteDraft,
      string
    >
  >;
};

export type WatchlistQuoteAdapter = {
  id: WatchlistQuoteProvider;
  label: string;
  description: string;
  delayedMinutes: number;
  refresh: (
    securities: WatchlistSecurity[]
  ) => Promise<WatchlistQuoteRefreshResult>;
};

const STORAGE_KEY =
  "lgrbz.watchlist.quotes.v1";

const MAX_HISTORY_POINTS =
  1500;

const MAX_SECURITY_HISTORY =
  120;

export const defaultWatchlistQuoteStore:
  WatchlistQuoteStore = {
    version: 1,
    quotes: {},
    history: [],
    lastRefreshAt: null,
    lastSuccessfulRefreshAt: null,
    provider: "MANUAL",
  };

export const defaultWatchlistManualQuoteDraft:
  WatchlistManualQuoteDraft = {
    price: "",
    previousClose: "",
    dayHigh: "",
    dayLow: "",
    volume: "",
    quotedAt: "",
  };

function canUseStorage() {
  return (
    typeof window !== "undefined" &&
    typeof window.localStorage !==
      "undefined"
  );
}

function isRecord(
  value: unknown
): value is Record<string, unknown> {
  return (
    Boolean(value) &&
    typeof value === "object" &&
    !Array.isArray(value)
  );
}

function finiteNumber(
  value: unknown,
  fallback = 0
) {
  const number =
    Number(value);

  return Number.isFinite(number)
    ? number
    : fallback;
}

function createHistoryId(
  securityId: string
) {
  if (
    typeof crypto !==
      "undefined" &&
    typeof crypto.randomUUID ===
      "function"
  ) {
    return `quote-history-${securityId}-${crypto.randomUUID()}`;
  }

  return `quote-history-${securityId}-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 8)}`;
}

function sanitiseProvider(
  value: unknown
): WatchlistQuoteProvider {
  if (
    value === "DELAYED" ||
    value === "LIVE_ADAPTER"
  ) {
    return value;
  }

  return "MANUAL";
}

function sanitiseSession(
  value: unknown
): WatchlistMarketSession {
  if (
    value === "PRE_MARKET" ||
    value === "OPEN" ||
    value === "AFTER_HOURS" ||
    value === "CLOSED"
  ) {
    return value;
  }

  return "UNKNOWN";
}

function sanitiseQuote(
  value: unknown
): WatchlistQuote | null {
  if (!isRecord(value)) {
    return null;
  }

  const securityId =
    String(
      value.securityId ?? ""
    ).trim();

  if (!securityId) {
    return null;
  }

  return {
    securityId,
    symbol:
      String(
        value.symbol ?? ""
      ).trim(),
    exchange:
      String(
        value.exchange ?? ""
      ).trim(),
    currency:
      String(
        value.currency ?? "AUD"
      )
        .trim()
        .toUpperCase(),
    price:
      finiteNumber(
        value.price
      ),
    previousClose:
      finiteNumber(
        value.previousClose
      ),
    change:
      finiteNumber(
        value.change
      ),
    changePercent:
      finiteNumber(
        value.changePercent
      ),
    dayHigh:
      finiteNumber(
        value.dayHigh
      ),
    dayLow:
      finiteNumber(
        value.dayLow
      ),
    volume:
      finiteNumber(
        value.volume
      ),
    quotedAt:
      String(
        value.quotedAt ??
          new Date(0).toISOString()
      ),
    receivedAt:
      String(
        value.receivedAt ??
          new Date(0).toISOString()
      ),
    provider:
      sanitiseProvider(
        value.provider
      ),
    delayedMinutes:
      Math.max(
        0,
        finiteNumber(
          value.delayedMinutes
        )
      ),
    marketSession:
      sanitiseSession(
        value.marketSession
      ),
    error:
      value.error === null ||
      value.error === undefined ||
      value.error === ""
        ? null
        : String(
            value.error
          ),
  };
}

function sanitiseHistoryPoint(
  value: unknown
): WatchlistPriceHistoryPoint | null {
  if (!isRecord(value)) {
    return null;
  }

  const securityId =
    String(
      value.securityId ?? ""
    ).trim();

  if (!securityId) {
    return null;
  }

  return {
    id:
      String(
        value.id ?? ""
      ).trim() ||
      createHistoryId(
        securityId
      ),
    securityId,
    symbol:
      String(
        value.symbol ?? ""
      ).trim(),
    price:
      finiteNumber(
        value.price
      ),
    changePercent:
      finiteNumber(
        value.changePercent
      ),
    quotedAt:
      String(
        value.quotedAt ??
          new Date(0).toISOString()
      ),
    recordedAt:
      String(
        value.recordedAt ??
          new Date().toISOString()
      ),
    provider:
      sanitiseProvider(
        value.provider
      ),
  };
}

export function loadWatchlistQuoteStore():
  WatchlistQuoteStore {
  if (!canUseStorage()) {
    return {
      ...defaultWatchlistQuoteStore,
    };
  }

  try {
    const raw =
      window.localStorage.getItem(
        STORAGE_KEY
      );

    if (!raw) {
      return {
        ...defaultWatchlistQuoteStore,
      };
    }

    const parsed =
      JSON.parse(raw);

    if (!isRecord(parsed)) {
      return {
        ...defaultWatchlistQuoteStore,
      };
    }

    const quotes:
      Record<string, WatchlistQuote> = {};

    if (
      isRecord(
        parsed.quotes
      )
    ) {
      Object.entries(
        parsed.quotes
      ).forEach(
        ([
          securityId,
          value,
        ]) => {
          const quote =
            sanitiseQuote(
              value
            );

          if (quote) {
            quotes[
              securityId
            ] = quote;
          }
        }
      );
    }

    const history =
      Array.isArray(
        parsed.history
      )
        ? parsed.history
            .map(
              sanitiseHistoryPoint
            )
            .filter(
              (
                point
              ): point is WatchlistPriceHistoryPoint =>
                Boolean(
                  point
                )
            )
            .slice(
              -MAX_HISTORY_POINTS
            )
        : [];

    return {
      version: 1,
      quotes,
      history,
      lastRefreshAt:
        parsed.lastRefreshAt
          ? String(
              parsed.lastRefreshAt
            )
          : null,
      lastSuccessfulRefreshAt:
        parsed.lastSuccessfulRefreshAt
          ? String(
              parsed.lastSuccessfulRefreshAt
            )
          : null,
      provider:
        sanitiseProvider(
          parsed.provider
        ),
    };
  } catch {
    return {
      ...defaultWatchlistQuoteStore,
    };
  }
}

export function saveWatchlistQuoteStore(
  store: WatchlistQuoteStore
) {
  if (!canUseStorage()) {
    return;
  }

  try {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        ...store,
        version: 1,
        history:
          store.history.slice(
            -MAX_HISTORY_POINTS
          ),
      })
    );

    window.dispatchEvent(
      new CustomEvent(
        "lgrbz:watchlist-quotes-changed"
      )
    );
  } catch {
    // Quote persistence must never block the Watchlist.
  }
}

export function calculateQuoteChange(
  price: number,
  previousClose: number
) {
  const safePrice =
    finiteNumber(price);

  const safePreviousClose =
    finiteNumber(
      previousClose
    );

  const change =
    safePrice -
    safePreviousClose;

  const changePercent =
    safePreviousClose > 0
      ? (
          change /
          safePreviousClose
        ) *
        100
      : 0;

  return {
    change,
    changePercent,
  };
}

export function determineMarketSession(
  exchange: string,
  date = new Date()
): WatchlistMarketSession {
  const day =
    date.getUTCDay();

  if (
    day === 0 ||
    day === 6
  ) {
    return "CLOSED";
  }

  const exchangeCode =
    exchange
      .trim()
      .toUpperCase();

  const utcMinutes =
    date.getUTCHours() *
      60 +
    date.getUTCMinutes();

  if (
    exchangeCode === "ASX"
  ) {
    const open =
      23 * 60;

    const close =
      6 * 60;

    if (
      utcMinutes >= open ||
      utcMinutes < close
    ) {
      return "OPEN";
    }

    return "CLOSED";
  }

  if (
    exchangeCode === "NYSE" ||
    exchangeCode === "NASDAQ" ||
    exchangeCode === "US"
  ) {
    const open =
      13 * 60 + 30;

    const close =
      20 * 60;

    if (
      utcMinutes >= open &&
      utcMinutes < close
    ) {
      return "OPEN";
    }

    if (
      utcMinutes >=
        open - 240 &&
      utcMinutes < open
    ) {
      return "PRE_MARKET";
    }

    if (
      utcMinutes >= close &&
      utcMinutes <
        close + 240
    ) {
      return "AFTER_HOURS";
    }

    return "CLOSED";
  }

  return "UNKNOWN";
}

export function quoteFreshness(
  quote:
    | WatchlistQuote
    | null
    | undefined,
  now = new Date()
): WatchlistQuoteFreshness {
  if (
    !quote ||
    quote.error
  ) {
    return "UNAVAILABLE";
  }

  const quotedAt =
    new Date(
      quote.quotedAt
    );

  const ageMinutes =
    Math.max(
      0,
      (
        now.getTime() -
        quotedAt.getTime()
      ) /
        60000
    );

  if (
    quote.provider ===
      "LIVE_ADAPTER" &&
    ageMinutes <= 2
  ) {
    return "LIVE";
  }

  if (
    ageMinutes <= 15
  ) {
    return "FRESH";
  }

  if (
    ageMinutes <= 60
  ) {
    return "DELAYED";
  }

  return "STALE";
}

export function quoteFreshnessLabel(
  freshness: WatchlistQuoteFreshness
) {
  if (
    freshness === "LIVE"
  ) {
    return "Live";
  }

  if (
    freshness === "FRESH"
  ) {
    return "Fresh";
  }

  if (
    freshness === "DELAYED"
  ) {
    return "Delayed";
  }

  if (
    freshness === "STALE"
  ) {
    return "Stale";
  }

  return "Unavailable";
}

export function marketSessionLabel(
  session: WatchlistMarketSession
) {
  if (
    session === "PRE_MARKET"
  ) {
    return "Pre-market";
  }

  if (
    session === "OPEN"
  ) {
    return "Market open";
  }

  if (
    session === "AFTER_HOURS"
  ) {
    return "After hours";
  }

  if (
    session === "CLOSED"
  ) {
    return "Market closed";
  }

  return "Session unknown";
}

export function createQuoteFromSecurity(
  security: WatchlistSecurity,
  provider:
    WatchlistQuoteProvider = "MANUAL"
): WatchlistQuote {
  const now =
    new Date();

  const {
    change,
    changePercent,
  } =
    calculateQuoteChange(
      security.price,
      security.previousClose
    );

  return {
    securityId:
      security.id,
    symbol:
      security.symbol,
    exchange:
      security.exchange,
    currency:
      security.currency,
    price:
      security.price,
    previousClose:
      security.previousClose,
    change,
    changePercent,
    dayHigh:
      security.dayHigh,
    dayLow:
      security.dayLow,
    volume:
      security.volume,
    quotedAt:
      security.updatedAt ||
      now.toISOString(),
    receivedAt:
      now.toISOString(),
    provider,
    delayedMinutes:
      provider ===
      "DELAYED"
        ? 20
        : 0,
    marketSession:
      determineMarketSession(
        security.exchange,
        now
      ),
    error: null,
  };
}

export function createManualWatchlistQuote(
  security: WatchlistSecurity,
  draft: WatchlistManualQuoteDraft
): WatchlistQuote {
  const price =
    Number(
      draft.price
    );

  const previousClose =
    draft.previousClose.trim()
      ? Number(
          draft.previousClose
        )
      : security.previousClose;

  const {
    change,
    changePercent,
  } =
    calculateQuoteChange(
      price,
      previousClose
    );

  const now =
    new Date();

  const quotedAt =
    draft.quotedAt.trim()
      ? new Date(
          draft.quotedAt
        ).toISOString()
      : now.toISOString();

  return {
    securityId:
      security.id,
    symbol:
      security.symbol,
    exchange:
      security.exchange,
    currency:
      security.currency,
    price,
    previousClose,
    change,
    changePercent,
    dayHigh:
      draft.dayHigh.trim()
        ? Number(
            draft.dayHigh
          )
        : Math.max(
            price,
            security.dayHigh
          ),
    dayLow:
      draft.dayLow.trim()
        ? Number(
            draft.dayLow
          )
        : security.dayLow > 0
          ? Math.min(
              price,
              security.dayLow
            )
          : price,
    volume:
      draft.volume.trim()
        ? Number(
            draft.volume
          )
        : security.volume,
    quotedAt,
    receivedAt:
      now.toISOString(),
    provider: "MANUAL",
    delayedMinutes: 0,
    marketSession:
      determineMarketSession(
        security.exchange,
        new Date(
          quotedAt
        )
      ),
    error: null,
  };
}

export function validateManualWatchlistQuote(
  draft: WatchlistManualQuoteDraft
): WatchlistManualQuoteValidation {
  const errors:
    WatchlistManualQuoteValidation["errors"] = {};

  const price =
    Number(
      draft.price
    );

  if (
    !draft.price.trim()
  ) {
    errors.price =
      "Price is required.";
  } else if (
    !Number.isFinite(
      price
    ) ||
    price < 0
  ) {
    errors.price =
      "Price must be zero or greater.";
  }

  const numericFields:
    Array<
      keyof Pick<
        WatchlistManualQuoteDraft,
        | "previousClose"
        | "dayHigh"
        | "dayLow"
        | "volume"
      >
    > = [
      "previousClose",
      "dayHigh",
      "dayLow",
      "volume",
    ];

  numericFields.forEach(
    (field) => {
      const value =
        draft[field].trim();

      if (!value) {
        return;
      }

      const number =
        Number(value);

      if (
        !Number.isFinite(
          number
        ) ||
        number < 0
      ) {
        errors[field] =
          "Must be zero or greater.";
      }
    }
  );

  if (
    draft.quotedAt.trim() &&
    Number.isNaN(
      new Date(
        draft.quotedAt
      ).getTime()
    )
  ) {
    errors.quotedAt =
      "Enter a valid date and time.";
  }

  return {
    valid:
      Object.keys(
        errors
      ).length === 0,
    errors,
  };
}

export function appendQuoteHistory(
  store: WatchlistQuoteStore,
  quotes: WatchlistQuote[]
): WatchlistQuoteStore {
  const newPoints =
    quotes
      .filter(
        (quote) =>
          !quote.error
      )
      .map(
        (
          quote
        ): WatchlistPriceHistoryPoint => ({
          id:
            createHistoryId(
              quote.securityId
            ),
          securityId:
            quote.securityId,
          symbol:
            quote.symbol,
          price:
            quote.price,
          changePercent:
            quote.changePercent,
          quotedAt:
            quote.quotedAt,
          recordedAt:
            new Date().toISOString(),
          provider:
            quote.provider,
        })
      );

  const combined = [
    ...store.history,
    ...newPoints,
  ];

  const grouped =
    new Map<
      string,
      WatchlistPriceHistoryPoint[]
    >();

  combined.forEach(
    (point) => {
      const current =
        grouped.get(
          point.securityId
        ) ?? [];

      current.push(
        point
      );

      grouped.set(
        point.securityId,
        current
      );
    }
  );

  const limited =
    Array.from(
      grouped.values()
    )
      .flatMap(
        (points) =>
          points.slice(
            -MAX_SECURITY_HISTORY
          )
      )
      .sort(
        (
          left,
          right
        ) =>
          new Date(
            left.recordedAt
          ).getTime() -
          new Date(
            right.recordedAt
          ).getTime()
      )
      .slice(
        -MAX_HISTORY_POINTS
      );

  return {
    ...store,
    history: limited,
  };
}

export function mergeQuotesIntoStore(
  store: WatchlistQuoteStore,
  result: WatchlistQuoteRefreshResult
): WatchlistQuoteStore {
  const quotes = {
    ...store.quotes,
  };

  result.quotes.forEach(
    (quote) => {
      quotes[
        quote.securityId
      ] = quote;
    }
  );

  return appendQuoteHistory(
    {
      ...store,
      quotes,
      provider:
        result.provider,
      lastRefreshAt:
        result.refreshedAt,
      lastSuccessfulRefreshAt:
        result.successCount > 0
          ? result.refreshedAt
          : store.lastSuccessfulRefreshAt,
    },
    result.quotes
  );
}

export function applyWatchlistQuotesToState(
  state: WatchlistState,
  quotes:
    Record<
      string,
      WatchlistQuote
    >
): WatchlistState {
  return {
    ...state,
    securities:
      state.securities.map(
        (security) => {
          const quote =
            quotes[
              security.id
            ];

          if (
            !quote ||
            quote.error
          ) {
            return security;
          }

          return {
            ...security,
            price:
              quote.price,
            previousClose:
              quote.previousClose,
            change:
              quote.change,
            changePercent:
              quote.changePercent,
            dayHigh:
              quote.dayHigh,
            dayLow:
              quote.dayLow,
            volume:
              quote.volume,
            updatedAt:
              quote.quotedAt,
          };
        }
      ),
  };
}

export function historyForSecurity(
  store: WatchlistQuoteStore,
  securityId: string
) {
  return store.history
    .filter(
      (point) =>
        point.securityId ===
        securityId
    )
    .sort(
      (
        left,
        right
      ) =>
        new Date(
          left.recordedAt
        ).getTime() -
        new Date(
          right.recordedAt
        ).getTime()
    );
}

export function quoteStoreSummary(
  store: WatchlistQuoteStore,
  securities: WatchlistSecurity[]
) {
  const counts:
    Record<
      WatchlistQuoteFreshness,
      number
    > = {
      LIVE: 0,
      FRESH: 0,
      DELAYED: 0,
      STALE: 0,
      UNAVAILABLE: 0,
    };

  securities.forEach(
    (security) => {
      const freshness =
        quoteFreshness(
          store.quotes[
            security.id
          ]
        );

      counts[
        freshness
      ] += 1;
    }
  );

  return {
    total:
      securities.length,
    live:
      counts.LIVE,
    fresh:
      counts.FRESH,
    delayed:
      counts.DELAYED,
    stale:
      counts.STALE,
    unavailable:
      counts.UNAVAILABLE,
  };
}

export const manualQuoteAdapter:
  WatchlistQuoteAdapter = {
    id: "MANUAL",
    label:
      "Manual quotes",
    description:
      "Uses manually entered or existing stored prices.",
    delayedMinutes: 0,
    async refresh(
      securities
    ) {
      const refreshedAt =
        new Date().toISOString();

      const quotes =
        securities.map(
          (security) =>
            createQuoteFromSecurity(
              security,
              "MANUAL"
            )
        );

      return {
        quotes,
        refreshedAt,
        provider:
          "MANUAL",
        successCount:
          quotes.length,
        failureCount: 0,
      };
    },
  };

export const delayedQuoteAdapter:
  WatchlistQuoteAdapter = {
    id: "DELAYED",
    label:
      "Delayed adapter",
    description:
      "Provider-ready delayed quote adapter using the latest stored security prices.",
    delayedMinutes: 20,
    async refresh(
      securities
    ) {
      const refreshedAt =
        new Date().toISOString();

      const quotes =
        securities.map(
          (security) => {
            const quote =
              createQuoteFromSecurity(
                security,
                "DELAYED"
              );

            return {
              ...quote,
              delayedMinutes: 20,
            };
          }
        );

      return {
        quotes,
        refreshedAt,
        provider:
          "DELAYED",
        successCount:
          quotes.length,
        failureCount: 0,
      };
    },
  };

export function resolveQuoteAdapter(
  provider: WatchlistQuoteProvider
): WatchlistQuoteAdapter {
  if (
    provider ===
    "DELAYED"
  ) {
    return delayedQuoteAdapter;
  }

  return manualQuoteAdapter;
}
