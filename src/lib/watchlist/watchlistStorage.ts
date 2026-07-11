import {
  defaultWatchlistState,
} from "@/lib/watchlist/watchlistDefaults";
import {
  WatchlistGroup,
  WatchlistSecurity,
  WatchlistState,
} from "@/lib/watchlist/watchlistTypes";

const STORAGE_KEY =
  "lgrbz.watchlist.state.v1";

function canUseStorage() {
  return (
    typeof window !== "undefined" &&
    typeof window.localStorage !== "undefined"
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

function sanitiseSecurity(
  value: unknown,
  index: number
): WatchlistSecurity | null {
  if (!isRecord(value)) {
    return null;
  }

  const symbol = String(
    value.symbol ?? ""
  )
    .trim()
    .toUpperCase();

  if (!symbol) {
    return null;
  }

  const id =
    String(value.id ?? "").trim() ||
    `watch-${symbol.toLowerCase()}-${index}`;

  return {
    id,
    symbol,
    name: String(
      value.name ?? symbol
    ).trim(),
    exchange: String(
      value.exchange ?? "ASX"
    )
      .trim()
      .toUpperCase(),
    currency: String(
      value.currency ?? "AUD"
    )
      .trim()
      .toUpperCase(),
    sector: String(
      value.sector ?? "Unclassified"
    ).trim(),
    industry: String(
      value.industry ?? "Unclassified"
    ).trim(),
    price: Number(value.price ?? 0),
    previousClose: Number(
      value.previousClose ?? 0
    ),
    change: Number(
      value.change ?? 0
    ),
    changePercent: Number(
      value.changePercent ?? 0
    ),
    dayHigh: Number(
      value.dayHigh ?? 0
    ),
    dayLow: Number(
      value.dayLow ?? 0
    ),
    fiftyTwoWeekHigh: Number(
      value.fiftyTwoWeekHigh ?? 0
    ),
    fiftyTwoWeekLow: Number(
      value.fiftyTwoWeekLow ?? 0
    ),
    volume: Number(
      value.volume ?? 0
    ),
    averageVolume: Number(
      value.averageVolume ?? 0
    ),
    marketCapitalisation: Number(
      value.marketCapitalisation ?? 0
    ),
    targetPrice:
      value.targetPrice === null ||
      value.targetPrice === undefined ||
      value.targetPrice === ""
        ? null
        : Number(value.targetPrice),
    analystRating: String(
      value.analystRating ?? "Unrated"
    ).trim(),
    note: String(
      value.note ?? ""
    ).trim(),
    tags: Array.isArray(value.tags)
      ? value.tags
          .map((tag) =>
            String(tag).trim()
          )
          .filter(Boolean)
      : [],
    alertCount: Number(
      value.alertCount ?? 0
    ),
    addedAt: String(
      value.addedAt ??
        new Date().toISOString()
    ),
    updatedAt: String(
      value.updatedAt ??
        new Date().toISOString()
    ),
  };
}

function sanitiseGroup(
  value: unknown,
  index: number,
  validSecurityIds: Set<string>
): WatchlistGroup | null {
  if (!isRecord(value)) {
    return null;
  }

  const name = String(
    value.name ?? ""
  ).trim();

  if (!name) {
    return null;
  }

  return {
    id:
      String(value.id ?? "").trim() ||
      `watchlist-group-${index}`,
    name,
    description: String(
      value.description ?? ""
    ).trim(),
    colour: String(
      value.colour ?? "slate"
    ).trim(),
    isDefault:
      value.isDefault === true,
    createdAt: String(
      value.createdAt ??
        new Date().toISOString()
    ),
    updatedAt: String(
      value.updatedAt ??
        new Date().toISOString()
    ),
    securityIds: Array.isArray(
      value.securityIds
    )
      ? value.securityIds
          .map((id) => String(id))
          .filter((id) =>
            validSecurityIds.has(id)
          )
      : [],
  };
}

export function sanitiseWatchlistState(
  value: unknown
): WatchlistState {
  if (!isRecord(value)) {
    return structuredClone(
      defaultWatchlistState
    );
  }

  const securities = Array.isArray(
    value.securities
  )
    ? value.securities
        .map(sanitiseSecurity)
        .filter(
          (
            security
          ): security is WatchlistSecurity =>
            Boolean(security)
        )
    : [];

  const securityIds =
    new Set(
      securities.map(
        (security) => security.id
      )
    );

  const groups = Array.isArray(
    value.groups
  )
    ? value.groups
        .map((group, index) =>
          sanitiseGroup(
            group,
            index,
            securityIds
          )
        )
        .filter(
          (
            group
          ): group is WatchlistGroup =>
            Boolean(group)
        )
    : [];

  const safeGroups =
    groups.length > 0
      ? groups
      : structuredClone(
          defaultWatchlistState.groups
        );

  const requestedActiveGroup =
    String(
      value.activeGroupId ?? ""
    );

  const activeGroupId =
    safeGroups.some(
      (group) =>
        group.id ===
        requestedActiveGroup
    )
      ? requestedActiveGroup
      : safeGroups[0].id;

  return {
    version: 1,
    groups: safeGroups,
    securities:
      securities.length > 0
        ? securities
        : structuredClone(
            defaultWatchlistState.securities
          ),
    activeGroupId,
    viewMode:
      value.viewMode === "cards" ||
      value.viewMode === "compact"
        ? value.viewMode
        : "table",
    sortKey:
      value.sortKey === "name" ||
      value.sortKey === "price" ||
      value.sortKey ===
        "changePercent" ||
      value.sortKey ===
        "marketValue" ||
      value.sortKey === "addedAt"
        ? value.sortKey
        : "symbol",
    sortDirection:
      value.sortDirection === "desc"
        ? "desc"
        : "asc",
  };
}

export function loadWatchlistState() {
  if (!canUseStorage()) {
    return structuredClone(
      defaultWatchlistState
    );
  }

  try {
    const raw =
      window.localStorage.getItem(
        STORAGE_KEY
      );

    if (!raw) {
      return structuredClone(
        defaultWatchlistState
      );
    }

    return sanitiseWatchlistState(
      JSON.parse(raw)
    );
  } catch {
    return structuredClone(
      defaultWatchlistState
    );
  }
}

export function saveWatchlistState(
  state: WatchlistState
) {
  if (!canUseStorage()) {
    return;
  }

  try {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(
        sanitiseWatchlistState(state)
      )
    );

    window.dispatchEvent(
      new CustomEvent(
        "lgrbz:watchlist-changed"
      )
    );
  } catch {
    // Watchlist persistence must never block the page.
  }
}
