"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  applyWatchlistQuotesToState,
  createManualWatchlistQuote,
  loadWatchlistQuoteStore,
  mergeQuotesIntoStore,
  resolveQuoteAdapter,
  saveWatchlistQuoteStore,
  WatchlistManualQuoteDraft,
  WatchlistQuoteProvider,
  WatchlistQuoteStore,
} from "@/lib/watchlist/watchlistQuotes";
import {
  WatchlistSecurity,
  WatchlistState,
} from "@/lib/watchlist/watchlistTypes";

export function useWatchlistQuotes(
  securities: WatchlistSecurity[]
) {
  const [
    store,
    setStore,
  ] =
    useState<WatchlistQuoteStore>(
      () => ({
        version: 1,
        quotes: {},
        history: [],
        lastRefreshAt: null,
        lastSuccessfulRefreshAt: null,
        provider:
          "MANUAL",
      })
    );

  const [
    hydrated,
    setHydrated,
  ] = useState(false);

  const [
    refreshing,
    setRefreshing,
  ] = useState(false);

  const [
    error,
    setError,
  ] =
    useState<string | null>(
      null
    );

  const refreshFromStorage =
    useCallback(() => {
      setStore(
        loadWatchlistQuoteStore()
      );

      setHydrated(true);
    }, []);

  useEffect(() => {
    refreshFromStorage();
  }, [
    refreshFromStorage,
  ]);

  useEffect(() => {
    const onChanged =
      () => {
        setStore(
          loadWatchlistQuoteStore()
        );
      };

    window.addEventListener(
      "lgrbz:watchlist-quotes-changed",
      onChanged
    );

    return () =>
      window.removeEventListener(
        "lgrbz:watchlist-quotes-changed",
        onChanged
      );
  }, []);

  const persist = (
    next: WatchlistQuoteStore
  ) => {
    setStore(next);

    saveWatchlistQuoteStore(
      next
    );
  };

  const refreshQuotes =
    async (
      provider:
        WatchlistQuoteProvider =
          store.provider
    ) => {
      if (refreshing) {
        return null;
      }

      setRefreshing(true);
      setError(null);

      try {
        const adapter =
          resolveQuoteAdapter(
            provider
          );

        const result =
          await adapter.refresh(
            securities
          );

        const next =
          mergeQuotesIntoStore(
            store,
            result
          );

        persist(next);

        return next;
      } catch (
        unknownError
      ) {
        const message =
          unknownError instanceof
          Error
            ? unknownError.message
            : "Quote refresh failed.";

        setError(message);

        return null;
      } finally {
        setRefreshing(
          false
        );
      }
    };

  const saveManualQuote = (
    security: WatchlistSecurity,
    draft: WatchlistManualQuoteDraft
  ) => {
    const quote =
      createManualWatchlistQuote(
        security,
        draft
      );

    const refreshedAt =
      new Date().toISOString();

    const next =
      mergeQuotesIntoStore(
        store,
        {
          quotes: [
            quote,
          ],
          refreshedAt,
          provider:
            "MANUAL",
          successCount: 1,
          failureCount: 0,
        }
      );

    persist(next);

    return next;
  };

  const setProvider = (
    provider:
      WatchlistQuoteProvider
  ) => {
    persist({
      ...store,
      provider,
    });
  };

  const applyToWatchlistState = (
    state: WatchlistState,
    quoteStore = store
  ) =>
    applyWatchlistQuotesToState(
      state,
      quoteStore.quotes
    );

  const quotesBySecurity =
    useMemo(
      () =>
        store.quotes,
      [store.quotes]
    );

  return {
    store,
    hydrated,
    refreshing,
    error,
    quotesBySecurity,
    refreshQuotes,
    saveManualQuote,
    setProvider,
    applyToWatchlistState,
    refreshFromStorage,
  };
}
