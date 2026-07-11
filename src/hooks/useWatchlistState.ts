"use client";

import {
  useCallback,
  useEffect,
  useState,
} from "react";
import {
  loadWatchlistState,
  saveWatchlistState,
} from "@/lib/watchlist/watchlistStorage";
import {
  WatchlistState,
} from "@/lib/watchlist/watchlistTypes";

export function useWatchlistState() {
  const [
    state,
    setState,
  ] =
    useState<WatchlistState | null>(
      null
    );

  const [loading, setLoading] =
    useState(true);

  const refresh =
    useCallback(() => {
      setLoading(true);

      try {
        setState(
          loadWatchlistState()
        );
      } finally {
        setLoading(false);
      }
    }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  useEffect(() => {
    const onChanged = () => {
      refresh();
    };

    window.addEventListener(
      "lgrbz:watchlist-changed",
      onChanged
    );

    return () =>
      window.removeEventListener(
        "lgrbz:watchlist-changed",
        onChanged
      );
  }, [refresh]);

  const updateState = (
    updater:
      | WatchlistState
      | ((
          current: WatchlistState
        ) => WatchlistState)
  ) => {
    setState((current) => {
      const base =
        current ??
        loadWatchlistState();

      const next =
        typeof updater ===
        "function"
          ? updater(base)
          : updater;

      saveWatchlistState(next);

      return next;
    });
  };

  return {
    state,
    loading,
    refresh,
    updateState,
  };
}
