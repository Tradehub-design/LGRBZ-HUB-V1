"use client";

import {
  useMemo,
  useState,
} from "react";
import {
  AlertTriangle,
  CircleDollarSign,
} from "lucide-react";
import type {
  DividendIntelligenceResponse,
} from "@/lib/dividend-data";
import {
  DividendDataStatus,
} from "@/components/dividend-data";
import {
  DividendCalendar,
} from "./DividendCalendar";
import {
  DividendCentreToolbar,
} from "./DividendCentreToolbar";
import {
  DividendExecutiveSummary,
} from "./DividendExecutiveSummary";
import {
  DividendHoldingBreakdown,
} from "./DividendHoldingBreakdown";
import {
  DividendMonthlyForecast,
} from "./DividendMonthlyForecast";
import {
  DividendReconciliationPanel,
} from "./DividendReconciliationPanel";
import {
  DividendUpcomingTimeline,
} from "./DividendUpcomingTimeline";
import type {
  DividendCentreFilter,
} from "./dividendCentreTypes";
import {
  resolveDividendCentreData,
} from "./resolveDividendCentreData";

type Props = {
  data:
    DividendIntelligenceResponse;
  loading?: boolean;
  refreshing?: boolean;
  onRefresh?: () => void;
};

function escapeCsv(
  value: unknown
) {
  const text =
    String(
      value ??
      ""
    );

  return `"${text.replace(
    /"/g,
    '""'
  )}"`;
}

export function ProfessionalDividendCentre({
  data,
  loading = false,
  refreshing = false,
  onRefresh,
}: Props) {
  const [
    filter,
    setFilter,
  ] =
    useState<DividendCentreFilter>(
      "ALL"
    );

  const [
    calendarMonth,
    setCalendarMonth,
  ] =
    useState(
      new Date()
    );

  const resolved =
    useMemo(
      () =>
        resolveDividendCentreData(
          data.events,
          data.eligibility,
          filter
        ),
      [
        data.events,
        data.eligibility,
        filter,
      ]
    );

  const exportCsv =
    () => {
      const rows = [
        [
          "Symbol",
          "Status",
          "Confidence",
          "Ex Date",
          "Record Date",
          "Payment Date",
          "Dividend Per Share",
          "Eligible Quantity",
          "Expected Cash",
          "Franking Credit",
          "Currency",
          "Provider",
        ],
        ...resolved.filteredEvents.map(
          (event) => {
            const matched =
              data.eligibility.find(
                (entry) =>
                  entry.symbol ===
                    event.symbol &&
                  (
                    entry.exDate ||
                    ""
                  ) ===
                    (
                      event.exDate ||
                      ""
                    ) &&
                  (
                    entry.paymentDate ||
                    ""
                  ) ===
                    (
                      event.paymentDate ||
                      ""
                    )
              );

            return [
              event.symbol,
              event.status,
              event.confidence,
              event.exDate ||
                "",
              event.recordDate ||
                "",
              event.paymentDate ||
                "",
              event.dividendPerShare ??
                "",
              matched?.eligibleQuantity ??
                "",
              matched?.expectedCash ??
                "",
              matched?.frankingCredit ??
                "",
              event.currency,
              event.provider,
            ];
          }
        ),
      ];

      const csv =
        rows
          .map(
            (row) =>
              row
                .map(
                  escapeCsv
                )
                .join(",")
          )
          .join("\n");

      const blob =
        new Blob(
          [csv],
          {
            type:
              "text/csv;charset=utf-8",
          }
        );

      const url =
        URL.createObjectURL(
          blob
        );

      const anchor =
        document.createElement(
          "a"
        );

      anchor.href =
        url;

      anchor.download =
        `lgrbz-dividend-centre-${new Date()
          .toISOString()
          .slice(
            0,
            10
          )}.csv`;

      anchor.click();

      URL.revokeObjectURL(
        url
      );
    };

  return (
    <main className="mx-auto w-full max-w-[1800px] space-y-4 px-3 pb-12 sm:px-4 lg:px-6 xl:px-8">
      <header className="overflow-hidden rounded-3xl border border-slate-200 bg-slate-950 p-5 text-white shadow-sm dark:border-slate-800 sm:p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 text-slate-300">
              <CircleDollarSign className="h-4 w-4" />

              <p className="text-xs font-semibold uppercase tracking-[0.14em]">
                Portfolio Income Intelligence
              </p>
            </div>

            <h1 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">
              Dividend Centre
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">
              Track declared distributions, forecast future income, confirm eligibility, monitor payment dates and reconcile received dividends against your transaction ledger.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
            <p className="text-xs text-slate-400">
              Data generated
            </p>

            <p className="mt-1 text-sm font-semibold">
              {new Date(
                data.summary.generatedAt
              ).toLocaleString(
                "en-AU"
              )}
            </p>
          </div>
        </div>
      </header>

      <DividendExecutiveSummary
        summary={
          data.summary
        }
        loading={
          loading
        }
      />

      <DividendCentreToolbar
        filter={
          filter
        }
        events={
          data.events
        }
        refreshing={
          refreshing
        }
        onFilterChange={
          setFilter
        }
        onRefresh={
          onRefresh
        }
        onExport={
          exportCsv
        }
      />

      {data.message && (
        <div className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800 dark:border-amber-900 dark:bg-amber-950/20 dark:text-amber-300">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />

          <p>
            {data.message}
          </p>
        </div>
      )}

      <DividendDataStatus
        summary={
          data.summary
        }
        providersUsed={
          data.providersUsed
        }
        unresolvedSymbols={
          data.unresolvedSymbols
        }
        loading={
          loading
        }
      />

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.4fr)_minmax(320px,0.6fr)]">
        <DividendCalendar
          month={
            calendarMonth
          }
          markers={
            resolved.calendarMarkers
          }
          onMonthChange={
            setCalendarMonth
          }
        />

        <DividendUpcomingTimeline
          rows={
            resolved.timeline
          }
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.65fr)]">
        <DividendMonthlyForecast
          items={
            data.summary.monthlyForecast
          }
          currency={
            data.summary.currency
          }
        />

        <DividendReconciliationPanel
          reconciliation={
            resolved.reconciliation
          }
          currency={
            data.summary.currency
          }
        />
      </div>

      <DividendHoldingBreakdown
        items={
          data.summary.holdingSummaries
        }
      />
    </main>
  );
}
