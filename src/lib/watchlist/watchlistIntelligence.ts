import {
  WatchlistSecurity,
} from "@/lib/watchlist/watchlistTypes";

export type WatchlistSignalTone =
  | "POSITIVE"
  | "NEGATIVE"
  | "WARNING"
  | "NEUTRAL";

export type WatchlistSignalType =
  | "TARGET_UPSIDE"
  | "TARGET_DOWNSIDE"
  | "DAILY_GAIN"
  | "DAILY_LOSS"
  | "NEAR_52_WEEK_HIGH"
  | "NEAR_52_WEEK_LOW"
  | "ABOVE_TARGET"
  | "NO_TARGET"
  | "ACTIVE_ALERTS"
  | "BUY_RATING"
  | "SELL_RATING";

export type WatchlistSignal = {
  id: string;
  securityId: string;
  symbol: string;
  name: string;
  type: WatchlistSignalType;
  tone: WatchlistSignalTone;
  title: string;
  description: string;
  metric: number | null;
  metricLabel: string;
  priority: number;
};

export type WatchlistExposureRow = {
  key: string;
  label: string;
  count: number;
  percentage: number;
  averageChangePercent: number;
};

export type WatchlistMover = {
  securityId: string;
  symbol: string;
  name: string;
  price: number;
  changePercent: number;
  currency: string;
  sector: string;
};

export type WatchlistIntelligenceSummary = {
  securityCount: number;
  gainers: number;
  decliners: number;
  unchanged: number;
  averageMove: number;
  averageTargetUpside: number | null;
  targetCount: number;
  buySignalCount: number;
  sellSignalCount: number;
  activeAlertCount: number;
  nearHighCount: number;
  nearLowCount: number;
  topGainer: WatchlistMover | null;
  topDecliner: WatchlistMover | null;
};

export type WatchlistCatalystType =
  | "EARNINGS"
  | "DIVIDEND"
  | "RESULTS"
  | "AGM"
  | "PRODUCT"
  | "REGULATORY"
  | "OTHER";

export type WatchlistCatalyst = {
  id: string;
  securityId: string;
  symbol: string;
  type: WatchlistCatalystType;
  title: string;
  date: string;
  note: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
};

export type WatchlistCatalystDraft = {
  securityId: string;
  type: WatchlistCatalystType;
  title: string;
  date: string;
  note: string;
};

export type WatchlistCatalystStore = {
  version: number;
  catalysts: WatchlistCatalyst[];
};

const CATALYST_STORAGE_KEY =
  "lgrbz.watchlist.catalysts.v1";

const BUY_RATINGS = new Set([
  "BUY",
  "STRONG BUY",
  "OUTPERFORM",
  "OVERWEIGHT",
  "ACCUMULATE",
]);

const SELL_RATINGS = new Set([
  "SELL",
  "STRONG SELL",
  "UNDERPERFORM",
  "UNDERWEIGHT",
  "REDUCE",
]);

export const defaultWatchlistCatalystDraft:
  WatchlistCatalystDraft = {
    securityId: "",
    type: "EARNINGS",
    title: "",
    date: "",
    note: "",
  };

export const defaultWatchlistCatalystStore:
  WatchlistCatalystStore = {
    version: 1,
    catalysts: [],
  };

function finiteNumber(
  value: unknown,
  fallback = 0
) {
  const parsed =
    Number(value);

  return Number.isFinite(
    parsed
  )
    ? parsed
    : fallback;
}

function normaliseText(
  value: unknown
) {
  return String(
    value ?? ""
  )
    .trim()
    .toUpperCase();
}

function createId(
  prefix: string
) {
  if (
    typeof crypto !==
      "undefined" &&
    typeof crypto.randomUUID ===
      "function"
  ) {
    return `${prefix}-${crypto.randomUUID()}`;
  }

  return `${prefix}-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 9)}`;
}

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

export function targetUpsidePercent(
  security: WatchlistSecurity
) {
  if (
    security.targetPrice ===
      null ||
    security.targetPrice ===
      undefined ||
    security.price <= 0
  ) {
    return null;
  }

  return (
    (
      security.targetPrice -
      security.price
    ) /
    security.price
  ) * 100;
}

export function distanceFromHighPercent(
  security: WatchlistSecurity
) {
  if (
    security.fiftyTwoWeekHigh <=
      0 ||
    security.price <= 0
  ) {
    return null;
  }

  return (
    (
      security.price -
      security.fiftyTwoWeekHigh
    ) /
    security.fiftyTwoWeekHigh
  ) * 100;
}

export function distanceFromLowPercent(
  security: WatchlistSecurity
) {
  if (
    security.fiftyTwoWeekLow <=
      0 ||
    security.price <= 0
  ) {
    return null;
  }

  return (
    (
      security.price -
      security.fiftyTwoWeekLow
    ) /
    security.fiftyTwoWeekLow
  ) * 100;
}

export function isBuyRating(
  rating: string
) {
  return BUY_RATINGS.has(
    normaliseText(rating)
  );
}

export function isSellRating(
  rating: string
) {
  return SELL_RATINGS.has(
    normaliseText(rating)
  );
}

export function createWatchlistSignals(
  securities: WatchlistSecurity[]
): WatchlistSignal[] {
  const signals:
    WatchlistSignal[] = [];

  securities.forEach(
    (security) => {
      const upside =
        targetUpsidePercent(
          security
        );

      const distanceHigh =
        distanceFromHighPercent(
          security
        );

      const distanceLow =
        distanceFromLowPercent(
          security
        );

      if (
        upside !== null &&
        upside >= 15
      ) {
        signals.push({
          id: `${security.id}-target-upside`,
          securityId:
            security.id,
          symbol:
            security.symbol,
          name:
            security.name,
          type:
            "TARGET_UPSIDE",
          tone:
            "POSITIVE",
          title:
            "Target-price opportunity",
          description: `${security.symbol} trades below its recorded target price.`,
          metric:
            upside,
          metricLabel:
            `${upside.toFixed(
              1
            )}% upside`,
          priority:
            Math.min(
              100,
              70 + upside
            ),
        });
      }

      if (
        upside !== null &&
        upside <= -5
      ) {
        signals.push({
          id: `${security.id}-target-downside`,
          securityId:
            security.id,
          symbol:
            security.symbol,
          name:
            security.name,
          type:
            "TARGET_DOWNSIDE",
          tone:
            "NEGATIVE",
          title:
            "Above recorded target",
          description: `${security.symbol} trades above its recorded analyst target.`,
          metric:
            upside,
          metricLabel:
            `${Math.abs(
              upside
            ).toFixed(
              1
            )}% above target`,
          priority:
            80 +
            Math.min(
              20,
              Math.abs(
                upside
              )
            ),
        });
      }

      if (
        upside === null
      ) {
        signals.push({
          id: `${security.id}-no-target`,
          securityId:
            security.id,
          symbol:
            security.symbol,
          name:
            security.name,
          type:
            "NO_TARGET",
          tone:
            "NEUTRAL",
          title:
            "Target price missing",
          description:
            "Add a target price to calculate implied upside or downside.",
          metric: null,
          metricLabel:
            "Research needed",
          priority: 25,
        });
      }

      if (
        security.changePercent >=
        3
      ) {
        signals.push({
          id: `${security.id}-daily-gain`,
          securityId:
            security.id,
          symbol:
            security.symbol,
          name:
            security.name,
          type:
            "DAILY_GAIN",
          tone:
            "POSITIVE",
          title:
            "Strong daily gain",
          description: `${security.symbol} is one of the strongest movers in the watchlist.`,
          metric:
            security.changePercent,
          metricLabel:
            `+${security.changePercent.toFixed(
              2
            )}%`,
          priority:
            65 +
            Math.min(
              20,
              security.changePercent
            ),
        });
      }

      if (
        security.changePercent <=
        -3
      ) {
        signals.push({
          id: `${security.id}-daily-loss`,
          securityId:
            security.id,
          symbol:
            security.symbol,
          name:
            security.name,
          type:
            "DAILY_LOSS",
          tone:
            "WARNING",
          title:
            "Material daily decline",
          description: `${security.symbol} has fallen materially during the current session.`,
          metric:
            security.changePercent,
          metricLabel:
            `${security.changePercent.toFixed(
              2
            )}%`,
          priority:
            72 +
            Math.min(
              20,
              Math.abs(
                security.changePercent
              )
            ),
        });
      }

      if (
        distanceHigh !== null &&
        distanceHigh >= -3
      ) {
        signals.push({
          id: `${security.id}-near-high`,
          securityId:
            security.id,
          symbol:
            security.symbol,
          name:
            security.name,
          type:
            "NEAR_52_WEEK_HIGH",
          tone:
            "POSITIVE",
          title:
            "Near 52-week high",
          description: `${security.symbol} is trading close to its 52-week high.`,
          metric:
            distanceHigh,
          metricLabel:
            `${Math.abs(
              distanceHigh
            ).toFixed(
              1
            )}% below high`,
          priority: 60,
        });
      }

      if (
        distanceLow !== null &&
        distanceLow <= 5
      ) {
        signals.push({
          id: `${security.id}-near-low`,
          securityId:
            security.id,
          symbol:
            security.symbol,
          name:
            security.name,
          type:
            "NEAR_52_WEEK_LOW",
          tone:
            "WARNING",
          title:
            "Near 52-week low",
          description: `${security.symbol} is trading close to its 52-week low.`,
          metric:
            distanceLow,
          metricLabel:
            `${distanceLow.toFixed(
              1
            )}% above low`,
          priority: 75,
        });
      }

      if (
        security.alertCount >
        0
      ) {
        signals.push({
          id: `${security.id}-alerts`,
          securityId:
            security.id,
          symbol:
            security.symbol,
          name:
            security.name,
          type:
            "ACTIVE_ALERTS",
          tone:
            "NEUTRAL",
          title:
            "Active price alerts",
          description: `${security.symbol} has configured watchlist alerts.`,
          metric:
            security.alertCount,
          metricLabel:
            `${security.alertCount} alert${
              security.alertCount ===
              1
                ? ""
                : "s"
            }`,
          priority: 50,
        });
      }

      if (
        isBuyRating(
          security.analystRating
        )
      ) {
        signals.push({
          id: `${security.id}-buy-rating`,
          securityId:
            security.id,
          symbol:
            security.symbol,
          name:
            security.name,
          type:
            "BUY_RATING",
          tone:
            "POSITIVE",
          title:
            "Positive analyst rating",
          description: `${security.symbol} carries a recorded ${security.analystRating} rating.`,
          metric: null,
          metricLabel:
            security.analystRating,
          priority: 55,
        });
      }

      if (
        isSellRating(
          security.analystRating
        )
      ) {
        signals.push({
          id: `${security.id}-sell-rating`,
          securityId:
            security.id,
          symbol:
            security.symbol,
          name:
            security.name,
          type:
            "SELL_RATING",
          tone:
            "NEGATIVE",
          title:
            "Negative analyst rating",
          description: `${security.symbol} carries a recorded ${security.analystRating} rating.`,
          metric: null,
          metricLabel:
            security.analystRating,
          priority: 85,
        });
      }
    }
  );

  return signals.sort(
    (
      left,
      right
    ) =>
      right.priority -
      left.priority
  );
}

export function createWatchlistMovers(
  securities: WatchlistSecurity[]
) {
  const movers =
    securities
      .map(
        (
          security
        ): WatchlistMover => ({
          securityId:
            security.id,
          symbol:
            security.symbol,
          name:
            security.name,
          price:
            finiteNumber(
              security.price
            ),
          changePercent:
            finiteNumber(
              security.changePercent
            ),
          currency:
            security.currency,
          sector:
            security.sector,
        })
      )
      .sort(
        (
          left,
          right
        ) =>
          right.changePercent -
          left.changePercent
      );

  return {
    gainers:
      movers.filter(
        (mover) =>
          mover.changePercent >
          0
      ),
    decliners:
      [...movers]
        .reverse()
        .filter(
          (mover) =>
            mover.changePercent <
            0
        ),
    all:
      movers,
  };
}

export function createWatchlistIntelligenceSummary(
  securities: WatchlistSecurity[]
): WatchlistIntelligenceSummary {
  const movers =
    createWatchlistMovers(
      securities
    );

  const targetUpsides =
    securities
      .map(
        targetUpsidePercent
      )
      .filter(
        (
          value
        ): value is number =>
          value !== null
      );

  const averageMove =
    securities.length > 0
      ? securities.reduce(
          (
            total,
            security
          ) =>
            total +
            finiteNumber(
              security.changePercent
            ),
          0
        ) /
        securities.length
      : 0;

  const averageTargetUpside =
    targetUpsides.length >
    0
      ? targetUpsides.reduce(
          (
            total,
            value
          ) =>
            total + value,
          0
        ) /
        targetUpsides.length
      : null;

  return {
    securityCount:
      securities.length,
    gainers:
      securities.filter(
        (security) =>
          security.changePercent >
          0
      ).length,
    decliners:
      securities.filter(
        (security) =>
          security.changePercent <
          0
      ).length,
    unchanged:
      securities.filter(
        (security) =>
          security.changePercent ===
          0
      ).length,
    averageMove,
    averageTargetUpside,
    targetCount:
      targetUpsides.length,
    buySignalCount:
      securities.filter(
        (security) =>
          isBuyRating(
            security.analystRating
          ) ||
          (
            targetUpsidePercent(
              security
            ) ?? 0
          ) >= 15
      ).length,
    sellSignalCount:
      securities.filter(
        (security) =>
          isSellRating(
            security.analystRating
          ) ||
          (
            targetUpsidePercent(
              security
            ) ?? 0
          ) <= -5
      ).length,
    activeAlertCount:
      securities.reduce(
        (
          total,
          security
        ) =>
          total +
          finiteNumber(
            security.alertCount
          ),
        0
      ),
    nearHighCount:
      securities.filter(
        (security) => {
          const distance =
            distanceFromHighPercent(
              security
            );

          return (
            distance !== null &&
            distance >= -3
          );
        }
      ).length,
    nearLowCount:
      securities.filter(
        (security) => {
          const distance =
            distanceFromLowPercent(
              security
            );

          return (
            distance !== null &&
            distance <= 5
          );
        }
      ).length,
    topGainer:
      movers.gainers[0] ??
      null,
    topDecliner:
      movers.decliners[0] ??
      null,
  };
}

export function createExposureRows(
  securities: WatchlistSecurity[],
  field:
    | "sector"
    | "industry"
    | "exchange"
    | "currency"
): WatchlistExposureRow[] {
  const groups =
    new Map<
      string,
      WatchlistSecurity[]
    >();

  securities.forEach(
    (security) => {
      const raw =
        String(
          security[field] ??
            ""
        ).trim();

      const key =
        raw ||
        "Unclassified";

      const current =
        groups.get(key) ??
        [];

      current.push(
        security
      );

      groups.set(
        key,
        current
      );
    }
  );

  return Array.from(
    groups.entries()
  )
    .map(
      ([
        key,
        entries,
      ]) => ({
        key,
        label: key,
        count:
          entries.length,
        percentage:
          securities.length > 0
            ? (
                entries.length /
                securities.length
              ) *
              100
            : 0,
        averageChangePercent:
          entries.length > 0
            ? entries.reduce(
                (
                  total,
                  security
                ) =>
                  total +
                  finiteNumber(
                    security.changePercent
                  ),
                0
              ) /
              entries.length
            : 0,
      })
    )
    .sort(
      (
        left,
        right
      ) =>
        right.count -
        left.count
    );
}

export function createWatchlistCatalyst(
  draft: WatchlistCatalystDraft,
  securities: WatchlistSecurity[]
): WatchlistCatalyst {
  const security =
    securities.find(
      (entry) =>
        entry.id ===
        draft.securityId
    );

  const now =
    new Date().toISOString();

  return {
    id:
      createId(
        "watchlist-catalyst"
      ),
    securityId:
      draft.securityId,
    symbol:
      security?.symbol ??
      "",
    type:
      draft.type,
    title:
      draft.title.trim(),
    date:
      draft.date,
    note:
      draft.note.trim(),
    completed: false,
    createdAt: now,
    updatedAt: now,
  };
}

export function loadWatchlistCatalysts():
  WatchlistCatalystStore {
  if (!canUseStorage()) {
    return {
      ...defaultWatchlistCatalystStore,
    };
  }

  try {
    const raw =
      window.localStorage.getItem(
        CATALYST_STORAGE_KEY
      );

    if (!raw) {
      return {
        ...defaultWatchlistCatalystStore,
      };
    }

    const parsed =
      JSON.parse(raw);

    if (
      !isRecord(parsed) ||
      !Array.isArray(
        parsed.catalysts
      )
    ) {
      return {
        ...defaultWatchlistCatalystStore,
      };
    }

    const catalysts =
      parsed.catalysts
        .filter(
          isRecord
        )
        .map(
          (
            catalyst
          ): WatchlistCatalyst => ({
            id:
              String(
                catalyst.id ??
                  createId(
                    "watchlist-catalyst"
                  )
              ),
            securityId:
              String(
                catalyst.securityId ??
                  ""
              ),
            symbol:
              String(
                catalyst.symbol ??
                  ""
              ),
            type:
              (
                catalyst.type ===
                  "DIVIDEND" ||
                catalyst.type ===
                  "RESULTS" ||
                catalyst.type ===
                  "AGM" ||
                catalyst.type ===
                  "PRODUCT" ||
                catalyst.type ===
                  "REGULATORY" ||
                catalyst.type ===
                  "OTHER"
                  ? catalyst.type
                  : "EARNINGS"
              ) as WatchlistCatalystType,
            title:
              String(
                catalyst.title ??
                  ""
              ),
            date:
              String(
                catalyst.date ??
                  ""
              ),
            note:
              String(
                catalyst.note ??
                  ""
              ),
            completed:
              Boolean(
                catalyst.completed
              ),
            createdAt:
              String(
                catalyst.createdAt ??
                  new Date().toISOString()
              ),
            updatedAt:
              String(
                catalyst.updatedAt ??
                  new Date().toISOString()
              ),
          })
        );

    return {
      version: 1,
      catalysts,
    };
  } catch {
    return {
      ...defaultWatchlistCatalystStore,
    };
  }
}

export function saveWatchlistCatalysts(
  store: WatchlistCatalystStore
) {
  if (!canUseStorage()) {
    return;
  }

  try {
    window.localStorage.setItem(
      CATALYST_STORAGE_KEY,
      JSON.stringify({
        version: 1,
        catalysts:
          store.catalysts,
      })
    );

    window.dispatchEvent(
      new CustomEvent(
        "lgrbz:watchlist-catalysts-changed"
      )
    );
  } catch {
    // Catalyst persistence must not block the Watchlist.
  }
}

export function addWatchlistCatalyst(
  store: WatchlistCatalystStore,
  catalyst: WatchlistCatalyst
): WatchlistCatalystStore {
  return {
    ...store,
    catalysts: [
      ...store.catalysts,
      catalyst,
    ].sort(
      (
        left,
        right
      ) =>
        new Date(
          left.date
        ).getTime() -
        new Date(
          right.date
        ).getTime()
    ),
  };
}

export function toggleWatchlistCatalyst(
  store: WatchlistCatalystStore,
  catalystId: string
): WatchlistCatalystStore {
  return {
    ...store,
    catalysts:
      store.catalysts.map(
        (catalyst) =>
          catalyst.id ===
          catalystId
            ? {
                ...catalyst,
                completed:
                  !catalyst.completed,
                updatedAt:
                  new Date().toISOString(),
              }
            : catalyst
      ),
  };
}

export function removeWatchlistCatalyst(
  store: WatchlistCatalystStore,
  catalystId: string
): WatchlistCatalystStore {
  return {
    ...store,
    catalysts:
      store.catalysts.filter(
        (catalyst) =>
          catalyst.id !==
          catalystId
      ),
  };
}

export function upcomingWatchlistCatalysts(
  store: WatchlistCatalystStore,
  limit = 8
) {
  const now =
    new Date();

  now.setHours(
    0,
    0,
    0,
    0
  );

  return store.catalysts
    .filter(
      (catalyst) =>
        !catalyst.completed &&
        new Date(
          catalyst.date
        ).getTime() >=
          now.getTime()
    )
    .sort(
      (
        left,
        right
      ) =>
        new Date(
          left.date
        ).getTime() -
        new Date(
          right.date
        ).getTime()
    )
    .slice(
      0,
      limit
    );
}
