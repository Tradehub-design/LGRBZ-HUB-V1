"use client";

import {
  useMemo,
} from "react";

import {
  buildPortfolioDashboardSnapshot,
} from "../dashboard/build";

import type {
  DashboardDataStatus,
  UnifiedPortfolioDashboardState,
} from "../dashboard/contracts";

import {
  usePortfolioDividendEngine,
} from "./usePortfolioDividendEngine";

export function useUnifiedPortfolioDashboard():
  UnifiedPortfolioDashboardState {
  const dividendEngine =
    usePortfolioDividendEngine();

  const portfolio =
    dividendEngine.portfolio;

  const dividends =
    dividendEngine.dividendSnapshot;

  const dashboard =
    useMemo(
      () =>
        buildPortfolioDashboardSnapshot({
          portfolio,

          dividends,

          generatedAt:
            dividends.generatedAt,
        }),
      [
        portfolio,
        dividends,
      ],
    );

  const status:
    DashboardDataStatus =
      dividendEngine.loading
        ? "LOADING"
        : dashboard.dataQuality.status;

  return {
    dashboard,

    portfolio,

    dividends,

    status,

    loading:
      dividendEngine.loading,

    refreshing:
      dividendEngine.refreshing,

    refresh:
      dividendEngine.refresh,

    forceRefresh:
      dividendEngine.forceRefresh,
  };
}
