"use client";

import {
  create,
} from "zustand";
import {
  subscribeWithSelector,
} from "zustand/middleware";
import {
  fetchLiveMarketQuote,
  fetchLiveMarketQuotes,
} from "./liveQuoteApiClient";
import type {
  LiveQuoteBatchFetchResult,
  LiveQuoteClientDiagnosticSummary,
  LiveQuoteFetchResult,
  LiveQuoteRefreshReason,
  LiveQuoteStoreEntry,
  LiveQuoteSymbolOptions,
} from "./liveQuoteClientTypes";
import {
  createLiveQuoteClientDiagnostics,
} from "./liveQuoteDiagnostics";

type RefreshSingleInput = {
  symbol: string;

  options?: LiveQuoteSymbolOptions;

  forceRefresh?: boolean;

  reason?: LiveQuoteRefreshReason;
};

type RefreshManyInput = {
  symbols: string[];

  options?: LiveQuoteSymbolOptions;

  forceRefresh?: boolean;

  reason?: LiveQuoteRefreshReason;

  concurrency?: number;
};

type LiveQuoteStoreState = {
  entries:
    Record<
      string,
      LiveQuoteStoreEntry
    >;

  activeControllers:
    Record<
      string,
      AbortController
    >;

  globalOnline:
    boolean;

  globalVisible:
    boolean;

  lastBatchRefreshAt:
    string |
    null;

  normaliseSymbol:
    (
      symbol: string
    ) => string;

  ensureEntry:
    (
      symbol: string,
      options?: LiveQuoteSymbolOptions
    ) => LiveQuoteStoreEntry;

  setOnline:
    (
      online: boolean
    ) => void;

  setVisible:
    (
      visible: boolean
    ) => void;

  setOptions:
    (
      symbol: string,
      options: LiveQuoteSymbolOptions
    ) => void;

  refreshQuote:
    (
      input: RefreshSingleInput
    ) => Promise<LiveQuoteFetchResult>;

  refreshQuotes:
    (
      input: RefreshManyInput
    ) => Promise<LiveQuoteBatchFetchResult>;

  cancelQuote:
    (
      symbol: string
    ) => void;

  cancelQuotes:
    (
      symbols?: string[]
    ) => void;

  removeQuote:
    (
      symbol: string
    ) => void;

  clearQuotes:
    () => void;

  markPaused:
    (
      symbols: string[]
    ) => void;

  markOffline:
    (
      symbols: string[]
    ) => void;

  diagnostics:
    () => LiveQuoteClientDiagnosticSummary;
};

function normaliseSymbol(
  symbol: string
): string {
  return symbol
    .trim()
    .toUpperCase();
}

function createEntry(
  symbol: string,
  options:
    LiveQuoteSymbolOptions = {}
): LiveQuoteStoreEntry {
  const canonical =
    normaliseSymbol(
      symbol
    );

  return {
    symbol:
      canonical,

    canonicalSymbol:
      canonical,

    quote:
      null,

    state:
      "IDLE",

    errorCode:
      null,

    errorMessage:
      null,

    requestedAt:
      null,

    receivedAt:
      null,

    lastSuccessAt:
      null,

    lastFailureAt:
      null,

    nextRefreshAt:
      null,

    refreshReason:
      "UNKNOWN",

    requestCount:
      0,

    successCount:
      0,

    failureCount:
      0,

    staleReadCount:
      0,

    activeRequestId:
      null,

    options,

    warnings:
      [],
  };
}

function requestId(
  symbol: string
): string {
  return [
    symbol,
    Date.now(),
    Math.random()
      .toString(
        36
      )
      .slice(
        2,
        9
      ),
  ].join(
    "-"
  );
}

function mergedOptions(
  existing:
    LiveQuoteSymbolOptions,
  incoming:
    LiveQuoteSymbolOptions |
    undefined
): LiveQuoteSymbolOptions {
  return {
    ...existing,
    ...incoming,

    providers:
      incoming?.providers ||
      existing.providers,
  };
}

function successfulEntry(
  entry:
    LiveQuoteStoreEntry,
  result:
    LiveQuoteFetchResult,
  reason:
    LiveQuoteRefreshReason
): LiveQuoteStoreEntry {
  const now =
    new Date()
      .toISOString();

  return {
    ...entry,

    quote:
      result.quote,

    state:
      "SUCCESS",

    errorCode:
      null,

    errorMessage:
      null,

    receivedAt:
      now,

    lastSuccessAt:
      now,

    refreshReason:
      reason,

    successCount:
      entry.successCount +
      1,

    staleReadCount:
      entry.staleReadCount +
      (
        result.quote?.isStale
          ? 1
          : 0
      ),

    activeRequestId:
      null,

    warnings:
      Array.from(
        new Set(
          result.warnings
        )
      ),
  };
}

function failedEntry(
  entry:
    LiveQuoteStoreEntry,
  result:
    LiveQuoteFetchResult,
  reason:
    LiveQuoteRefreshReason
): LiveQuoteStoreEntry {
  const now =
    new Date()
      .toISOString();

  return {
    ...entry,

    state:
      result.errorCode ===
      "REQUEST_ABORTED"
        ? entry.quote
          ? "SUCCESS"
          : "IDLE"
        : "ERROR",

    errorCode:
      result.errorCode,

    errorMessage:
      result.errorMessage,

    receivedAt:
      now,

    lastFailureAt:
      now,

    refreshReason:
      reason,

    failureCount:
      entry.failureCount +
      (
        result.errorCode ===
        "REQUEST_ABORTED"
          ? 0
          : 1
      ),

    activeRequestId:
      null,

    warnings:
      Array.from(
        new Set([
          ...entry.warnings,
          ...result.warnings,
        ])
      ),
  };
}

export const useLiveQuoteStore =
  create<LiveQuoteStoreState>()(
    subscribeWithSelector(
      (
        set,
        get
      ) => ({
        entries:
          {},

        activeControllers:
          {},

        globalOnline:
          typeof navigator ===
          "undefined"
            ? true
            : navigator.onLine,

        globalVisible:
          typeof document ===
          "undefined"
            ? true
            : document.visibilityState ===
              "visible",

        lastBatchRefreshAt:
          null,

        normaliseSymbol,

        ensureEntry:
          (
            symbol,
            options = {}
          ) => {
            const canonical =
              normaliseSymbol(
                symbol
              );

            const current =
              get().entries[
                canonical
              ];

            if (
              current
            ) {
              if (
                Object.keys(
                  options
                ).length >
                0
              ) {
                const updated = {
                  ...current,

                  options:
                    mergedOptions(
                      current.options,
                      options
                    ),
                };

                set(
                  (
                    state
                  ) => ({
                    entries: {
                      ...state.entries,

                      [
                        canonical
                      ]:
                        updated,
                    },
                  })
                );

                return updated;
              }

              return current;
            }

            const created =
              createEntry(
                canonical,
                options
              );

            set(
              (
                state
              ) => ({
                entries: {
                  ...state.entries,

                  [
                    canonical
                  ]:
                    created,
                },
              })
            );

            return created;
          },

        setOnline:
          (
            online
          ) => {
            set({
              globalOnline:
                online,
            });
          },

        setVisible:
          (
            visible
          ) => {
            set({
              globalVisible:
                visible,
            });
          },

        setOptions:
          (
            symbol,
            options
          ) => {
            const canonical =
              normaliseSymbol(
                symbol
              );

            const existing =
              get().ensureEntry(
                canonical
              );

            set(
              (
                state
              ) => ({
                entries: {
                  ...state.entries,

                  [
                    canonical
                  ]: {
                    ...existing,

                    options:
                      mergedOptions(
                        existing.options,
                        options
                      ),
                  },
                },
              })
            );
          },

        refreshQuote:
          async ({
            symbol,
            options,
            forceRefresh =
              false,
            reason =
              "MANUAL",
          }) => {
            const canonical =
              normaliseSymbol(
                symbol
              );

            const existing =
              get().ensureEntry(
                canonical,
                options
              );

            if (
              !get().globalOnline
            ) {
              set(
                (
                  state
                ) => ({
                  entries: {
                    ...state.entries,

                    [
                      canonical
                    ]: {
                      ...existing,

                      state:
                        "OFFLINE",

                      errorCode:
                        "OFFLINE",

                      errorMessage:
                        "The device is offline.",

                      refreshReason:
                        reason,
                    },
                  },
                })
              );

              return {
                symbol:
                  canonical,

                quote:
                  existing.quote,

                successful:
                  Boolean(
                    existing.quote
                  ),

                errorCode:
                  "OFFLINE",

                errorMessage:
                  "The device is offline.",

                warnings:
                  existing.warnings,
              };
            }

            const existingController =
              get()
                .activeControllers[
                  canonical
                ];

            if (
              existingController
            ) {
              return {
                symbol:
                  canonical,

                quote:
                  existing.quote,

                successful:
                  Boolean(
                    existing.quote
                  ),

                errorCode:
                  null,

                errorMessage:
                  null,

                warnings: [
                  "An existing quote request is already active.",
                ],
              };
            }

            const controller =
              new AbortController();

            const activeId =
              requestId(
                canonical
              );

            const requestedAt =
              new Date()
                .toISOString();

            set(
              (
                state
              ) => ({
                activeControllers: {
                  ...state.activeControllers,

                  [
                    canonical
                  ]:
                    controller,
                },

                entries: {
                  ...state.entries,

                  [
                    canonical
                  ]: {
                    ...existing,

                    state:
                      existing.quote
                        ? "REFRESHING"
                        : "LOADING",

                    requestedAt,

                    refreshReason:
                      reason,

                    requestCount:
                      existing.requestCount +
                      1,

                    activeRequestId:
                      activeId,

                    errorCode:
                      null,

                    errorMessage:
                      null,

                    options:
                      mergedOptions(
                        existing.options,
                        options
                      ),
                  },
                },
              })
            );

            const result =
              await fetchLiveMarketQuote({
                symbol:
                  canonical,

                options:
                  mergedOptions(
                    existing.options,
                    options
                  ),

                forceRefresh,

                signal:
                  controller.signal,
              });

            const latest =
              get().entries[
                canonical
              ] ||
              existing;

            if (
              latest.activeRequestId !==
              activeId
            ) {
              return result;
            }

            set(
              (
                state
              ) => {
                const {
                  [
                    canonical
                  ]:
                    _removed,
                  ...controllers
                } =
                  state.activeControllers;

                return {
                  activeControllers:
                    controllers,

                  entries: {
                    ...state.entries,

                    [
                      canonical
                    ]:
                      result.successful
                        ? successfulEntry(
                            latest,
                            result,
                            reason
                          )
                        : failedEntry(
                            latest,
                            result,
                            reason
                          ),
                  },
                };
              }
            );

            return result;
          },

        refreshQuotes:
          async ({
            symbols,
            options,
            forceRefresh =
              false,
            reason =
              "MANUAL",
            concurrency =
              6,
          }) => {
            const canonicalSymbols =
              Array.from(
                new Set(
                  symbols
                    .map(
                      normaliseSymbol
                    )
                    .filter(
                      Boolean
                    )
                )
              );

            if (
              canonicalSymbols.length ===
              0
            ) {
              return {
                results:
                  [],

                successfulSymbols:
                  [],

                failedSymbols:
                  [],

                successfulCount:
                  0,

                failedCount:
                  0,

                partial:
                  false,
              };
            }

            if (
              !get().globalOnline
            ) {
              get().markOffline(
                canonicalSymbols
              );

              return {
                results:
                  canonicalSymbols.map(
                    (
                      symbol
                    ) => ({
                      symbol,

                      quote:
                        get().entries[
                          symbol
                        ]?.quote ||
                        null,

                      successful:
                        Boolean(
                          get().entries[
                            symbol
                          ]?.quote
                        ),

                      errorCode:
                        "OFFLINE",

                      errorMessage:
                        "The device is offline.",

                      warnings:
                        [],
                    })
                  ),

                successfulSymbols:
                  canonicalSymbols.filter(
                    (
                      symbol
                    ) =>
                      Boolean(
                        get().entries[
                          symbol
                        ]?.quote
                      )
                  ),

                failedSymbols:
                  canonicalSymbols.filter(
                    (
                      symbol
                    ) =>
                      !get().entries[
                        symbol
                      ]?.quote
                  ),

                successfulCount:
                  canonicalSymbols.filter(
                    (
                      symbol
                    ) =>
                      Boolean(
                        get().entries[
                          symbol
                        ]?.quote
                      )
                  ).length,

                failedCount:
                  canonicalSymbols.filter(
                    (
                      symbol
                    ) =>
                      !get().entries[
                        symbol
                      ]?.quote
                  ).length,

                partial:
                  true,
              };
            }

            const availableSymbols =
              canonicalSymbols.filter(
                (
                  symbol
                ) =>
                  !get()
                    .activeControllers[
                      symbol
                    ]
              );

            const controllers:
              Record<
                string,
                AbortController
              > =
                {};

            const requestIds:
              Record<
                string,
                string
              > =
                {};

            for (
              const symbol of
              availableSymbols
            ) {
              const entry =
                get().ensureEntry(
                  symbol,
                  options
                );

              controllers[
                symbol
              ] =
                new AbortController();

              requestIds[
                symbol
              ] =
                requestId(
                  symbol
                );

              set(
                (
                  state
                ) => ({
                  activeControllers: {
                    ...state.activeControllers,

                    [
                      symbol
                    ]:
                      controllers[
                        symbol
                      ],
                  },

                  entries: {
                    ...state.entries,

                    [
                      symbol
                    ]: {
                      ...entry,

                      state:
                        entry.quote
                          ? "REFRESHING"
                          : "LOADING",

                      requestedAt:
                        new Date()
                          .toISOString(),

                      refreshReason:
                        reason,

                      requestCount:
                        entry.requestCount +
                        1,

                      activeRequestId:
                        requestIds[
                          symbol
                        ],

                      options:
                        mergedOptions(
                          entry.options,
                          options
                        ),

                      errorCode:
                        null,

                      errorMessage:
                        null,
                    },
                  },
                })
              );
            }

            if (
              availableSymbols.length ===
              0
            ) {
              return {
                results:
                  canonicalSymbols.map(
                    (
                      symbol
                    ) => ({
                      symbol,

                      quote:
                        get().entries[
                          symbol
                        ]?.quote ||
                        null,

                      successful:
                        Boolean(
                          get().entries[
                            symbol
                          ]?.quote
                        ),

                      errorCode:
                        null,

                      errorMessage:
                        null,

                      warnings: [
                        "A request for this symbol is already active.",
                      ],
                    })
                  ),

                successfulSymbols:
                  canonicalSymbols.filter(
                    (
                      symbol
                    ) =>
                      Boolean(
                        get().entries[
                          symbol
                        ]?.quote
                      )
                  ),

                failedSymbols:
                  [],

                successfulCount:
                  canonicalSymbols.length,

                failedCount:
                  0,

                partial:
                  false,
              };
            }

            const batchController =
              new AbortController();

            const result =
              await fetchLiveMarketQuotes({
                symbols:
                  availableSymbols,

                options,

                forceRefresh,

                concurrency,

                signal:
                  batchController.signal,
              });

            const resultMap =
              new Map(
                result.results.map(
                  (
                    item
                  ) => [
                    item.symbol,
                    item,
                  ]
                )
              );

            set(
              (
                state
              ) => {
                const nextEntries = {
                  ...state.entries,
                };

                const nextControllers = {
                  ...state.activeControllers,
                };

                for (
                  const symbol of
                  availableSymbols
                ) {
                  const latest =
                    nextEntries[
                      symbol
                    ];

                  const symbolResult =
                    resultMap.get(
                      symbol
                    );

                  if (
                    !latest ||
                    latest.activeRequestId !==
                    requestIds[
                      symbol
                    ] ||
                    !symbolResult
                  ) {
                    delete nextControllers[
                      symbol
                    ];

                    continue;
                  }

                  nextEntries[
                    symbol
                  ] =
                    symbolResult.successful
                      ? successfulEntry(
                          latest,
                          symbolResult,
                          reason
                        )
                      : failedEntry(
                          latest,
                          symbolResult,
                          reason
                        );

                  delete nextControllers[
                    symbol
                  ];
                }

                return {
                  entries:
                    nextEntries,

                  activeControllers:
                    nextControllers,

                  lastBatchRefreshAt:
                    new Date()
                      .toISOString(),
                };
              }
            );

            return result;
          },

        cancelQuote:
          (
            symbol
          ) => {
            const canonical =
              normaliseSymbol(
                symbol
              );

            const controller =
              get()
                .activeControllers[
                  canonical
                ];

            controller?.abort();

            set(
              (
                state
              ) => {
                const {
                  [
                    canonical
                  ]:
                    _removed,
                  ...controllers
                } =
                  state.activeControllers;

                const entry =
                  state.entries[
                    canonical
                  ];

                return {
                  activeControllers:
                    controllers,

                  entries:
                    entry
                      ? {
                          ...state.entries,

                          [
                            canonical
                          ]: {
                            ...entry,

                            state:
                              entry.quote
                                ? "SUCCESS"
                                : "IDLE",

                            activeRequestId:
                              null,
                          },
                        }
                      : state.entries,
                };
              }
            );
          },

        cancelQuotes:
          (
            symbols
          ) => {
            const targets =
              symbols
                ? symbols.map(
                    normaliseSymbol
                  )
                : Object.keys(
                    get()
                      .activeControllers
                  );

            for (
              const symbol of
              targets
            ) {
              get().cancelQuote(
                symbol
              );
            }
          },

        removeQuote:
          (
            symbol
          ) => {
            const canonical =
              normaliseSymbol(
                symbol
              );

            get().cancelQuote(
              canonical
            );

            set(
              (
                state
              ) => {
                const {
                  [
                    canonical
                  ]:
                    _removed,
                  ...entries
                } =
                  state.entries;

                return {
                  entries,
                };
              }
            );
          },

        clearQuotes:
          () => {
            get().cancelQuotes();

            set({
              entries:
                {},

              activeControllers:
                {},

              lastBatchRefreshAt:
                null,
            });
          },

        markPaused:
          (
            symbols
          ) => {
            set(
              (
                state
              ) => {
                const entries = {
                  ...state.entries,
                };

                for (
                  const rawSymbol of
                  symbols
                ) {
                  const symbol =
                    normaliseSymbol(
                      rawSymbol
                    );

                  const entry =
                    entries[
                      symbol
                    ];

                  if (
                    entry &&
                    ![
                      "LOADING",
                      "REFRESHING",
                    ].includes(
                      entry.state
                    )
                  ) {
                    entries[
                      symbol
                    ] = {
                      ...entry,

                      state:
                        "PAUSED",
                    };
                  }
                }

                return {
                  entries,
                };
              }
            );
          },

        markOffline:
          (
            symbols
          ) => {
            set(
              (
                state
              ) => {
                const entries = {
                  ...state.entries,
                };

                for (
                  const rawSymbol of
                  symbols
                ) {
                  const symbol =
                    normaliseSymbol(
                      rawSymbol
                    );

                  const entry =
                    entries[
                      symbol
                    ] ||
                    createEntry(
                      symbol
                    );

                  entries[
                    symbol
                  ] = {
                    ...entry,

                    state:
                      "OFFLINE",

                    errorCode:
                      "OFFLINE",

                    errorMessage:
                      "The device is offline.",
                  };
                }

                return {
                  entries,
                };
              }
            );
          },

        diagnostics:
          () =>
            createLiveQuoteClientDiagnostics(
              get().entries
            ),
      })
    )
  );

export function liveQuoteEntry(
  symbol: string
): LiveQuoteStoreEntry | null {
  return (
    useLiveQuoteStore
      .getState()
      .entries[
        normaliseSymbol(
          symbol
        )
      ] ||
    null
  );
}

export function liveQuoteEntries(
  symbols: string[]
): LiveQuoteStoreEntry[] {
  const state =
    useLiveQuoteStore
      .getState();

  return symbols
    .map(
      (
        symbol
      ) =>
        state.entries[
          normaliseSymbol(
            symbol
          )
        ]
    )
    .filter(
      (
        entry
      ): entry is LiveQuoteStoreEntry =>
        Boolean(
          entry
        )
    );
}
