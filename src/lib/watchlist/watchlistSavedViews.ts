import {
  WatchlistSortDirection,
  WatchlistSortKey,
} from "@/lib/watchlist/watchlistTypes";

export type WatchlistSavedView = {
  id: string;
  name: string;
  search: string;
  sector: string;
  exchange: string;
  rating: string;
  sortKey: WatchlistSortKey;
  sortDirection: WatchlistSortDirection;
  viewMode: string;
  createdAt: string;
  updatedAt: string;
};

export type WatchlistSavedViewDraft = {
  name: string;
};

export type WatchlistSavedViewStore = {
  version: number;
  views: WatchlistSavedView[];
  activeViewId: string | null;
};

export type WatchlistViewSnapshot = {
  search: string;
  sector: string;
  exchange: string;
  rating: string;
  sortKey: WatchlistSortKey;
  sortDirection: WatchlistSortDirection;
  viewMode: string;
};

const STORAGE_KEY =
  "lgrbz.watchlist.saved-views.v1";

export const defaultWatchlistSavedViewStore:
  WatchlistSavedViewStore = {
    version: 1,
    views: [],
    activeViewId: null,
  };

function canUseStorage() {
  return (
    typeof window !==
      "undefined" &&
    typeof window.localStorage !==
      "undefined"
  );
}

function createId() {
  if (
    typeof crypto !==
      "undefined" &&
    typeof crypto.randomUUID ===
      "function"
  ) {
    return `watch-view-${crypto.randomUUID()}`;
  }

  return `watch-view-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 9)}`;
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

function normaliseSortKey(
  value: unknown
): WatchlistSortKey {
  const allowed = new Set([
    "symbol",
    "name",
    "price",
    "changePercent",
    "targetPrice",
    "sector",
    "exchange",
    "updatedAt",
  ]);

  return allowed.has(
    String(value)
  )
    ? String(
        value
      ) as WatchlistSortKey
    : "symbol";
}

function normaliseSortDirection(
  value: unknown
): WatchlistSortDirection {
  return value ===
    "desc"
    ? "desc"
    : "asc";
}

export function loadWatchlistSavedViews():
  WatchlistSavedViewStore {
  if (!canUseStorage()) {
    return {
      ...defaultWatchlistSavedViewStore,
    };
  }

  try {
    const raw =
      window.localStorage.getItem(
        STORAGE_KEY
      );

    if (!raw) {
      return {
        ...defaultWatchlistSavedViewStore,
      };
    }

    const parsed =
      JSON.parse(raw);

    if (
      !isRecord(parsed) ||
      !Array.isArray(
        parsed.views
      )
    ) {
      return {
        ...defaultWatchlistSavedViewStore,
      };
    }

    return {
      version: 1,
      activeViewId:
        parsed.activeViewId
          ? String(
              parsed.activeViewId
            )
          : null,
      views:
        parsed.views
          .filter(
            isRecord
          )
          .map(
            (
              view
            ): WatchlistSavedView => ({
              id:
                String(
                  view.id ??
                    createId()
                ),
              name:
                String(
                  view.name ??
                    "Saved view"
                ),
              search:
                String(
                  view.search ??
                    ""
                ),
              sector:
                String(
                  view.sector ??
                    ""
                ),
              exchange:
                String(
                  view.exchange ??
                    ""
                ),
              rating:
                String(
                  view.rating ??
                    ""
                ),
              sortKey:
                normaliseSortKey(
                  view.sortKey
                ),
              sortDirection:
                normaliseSortDirection(
                  view.sortDirection
                ),
              viewMode:
                String(
                  view.viewMode ??
                    "TABLE"
                ),
              createdAt:
                String(
                  view.createdAt ??
                    new Date().toISOString()
                ),
              updatedAt:
                String(
                  view.updatedAt ??
                    new Date().toISOString()
                ),
            })
          ),
    };
  } catch {
    return {
      ...defaultWatchlistSavedViewStore,
    };
  }
}

export function saveWatchlistSavedViews(
  store: WatchlistSavedViewStore
) {
  if (!canUseStorage()) {
    return;
  }

  try {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        version: 1,
        views:
          store.views,
        activeViewId:
          store.activeViewId,
      })
    );

    window.dispatchEvent(
      new CustomEvent(
        "lgrbz:watchlist-saved-views-changed"
      )
    );
  } catch {
    // Saved view persistence must not block the Watchlist page.
  }
}

export function createWatchlistSavedView(
  name: string,
  snapshot: WatchlistViewSnapshot
): WatchlistSavedView {
  const now =
    new Date().toISOString();

  return {
    id: createId(),
    name:
      name.trim() ||
      "Saved view",
    ...snapshot,
    createdAt: now,
    updatedAt: now,
  };
}

export function addWatchlistSavedView(
  store: WatchlistSavedViewStore,
  view: WatchlistSavedView
): WatchlistSavedViewStore {
  return {
    ...store,
    activeViewId:
      view.id,
    views: [
      ...store.views,
      view,
    ],
  };
}

export function removeWatchlistSavedView(
  store: WatchlistSavedViewStore,
  viewId: string
): WatchlistSavedViewStore {
  return {
    ...store,
    activeViewId:
      store.activeViewId ===
      viewId
        ? null
        : store.activeViewId,
    views:
      store.views.filter(
        (view) =>
          view.id !==
          viewId
      ),
  };
}

export function setActiveWatchlistSavedView(
  store: WatchlistSavedViewStore,
  viewId: string | null
): WatchlistSavedViewStore {
  return {
    ...store,
    activeViewId:
      viewId,
  };
}
