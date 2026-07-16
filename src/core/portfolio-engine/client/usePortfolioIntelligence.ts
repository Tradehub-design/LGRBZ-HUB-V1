"use client";

import {
  useMemo,
} from "react";

import {
  buildPortfolioAnalyticsSnapshot,
} from "../analytics/build";

import {
  buildPortfolioTaxSnapshot,
} from "../tax/build";

import {
  buildPortfolioReportSnapshot,
} from "../reports/build";

import {
  reconcilePortfolioAnalytics,
} from "../analytics/reconcile";

import {
  reconcilePortfolioTax,
} from "../tax/reconcile";

import {
  useUnifiedPortfolioDashboard,
} from "./useUnifiedPortfolioDashboard";

export function usePortfolioIntelligence() {
  const unified =
    useUnifiedPortfolioDashboard();

  const analytics =
    useMemo(
      () =>
        buildPortfolioAnalyticsSnapshot({
          dashboard:
            unified.dashboard,

          generatedAt:
            unified.dashboard
              .generatedAt,
        }),
      [
        unified.dashboard,
      ],
    );

  const tax =
    useMemo(
      () =>
        buildPortfolioTaxSnapshot({
          dashboard:
            unified.dashboard,
        }),
      [
        unified.dashboard,
      ],
    );

  const reports =
    useMemo(
      () =>
        buildPortfolioReportSnapshot({
          analytics,

          tax,
        }),
      [
        analytics,
        tax,
      ],
    );

  const reconciliation =
    useMemo(
      () =>
        reconcilePortfolioAnalytics(
          analytics,
        ),
      [
        analytics,
      ],
    );

  const taxReconciliation =
    useMemo(
      () =>
        reconcilePortfolioTax(
          tax,
        ),
      [
        tax,
      ],
    );

  return {
    ...unified,

    analytics,

    tax,

    reports,

    reconciliation,

    taxReconciliation,
  };
}
