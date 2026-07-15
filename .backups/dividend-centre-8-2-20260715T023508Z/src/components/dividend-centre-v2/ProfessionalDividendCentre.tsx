"use client";

import {
  useMemo,
  useState,
} from "react";
import {
  AlertTriangle,
} from "lucide-react";
import type {
  DividendIntelligenceResponse,
} from "@/lib/dividend-data";
import {
  DividendCalendar,
} from "./DividendCalendar";
import {
  DividendCentreHero,
} from "./DividendCentreHero";
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
  DividendProviderBanner,
} from "./DividendProviderBanner";
import {
  DividendReconciliationPanel,
} from "./DividendReconciliationPanel";
import {
  DividendUpcomingTimeline,
} from "./DividendUpcomingTimeline";
import {
  DividendUpcomingPaymentsTable,
} from "./DividendUpcomingPaymentsTable";
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
): string {
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
          "Declaration Date",
          "Ex Date",
          "Record Date",
          "Payment Date",
          "Dividend Per Share",
          "Eligible Quantity",
          "Expected Cash",
          "Franking Credit",
          "Currency",
          "Provider",
          "Notes",
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
              event.declarationDate ||
                "",
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
              event.note ||
                "",
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
                .join(
                  ","
                )
          )
          .join(
            "\n"
          );

      const blob =
        new Blob(
          [
            `\uFEFF${csv}`,
          ],
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

      document.body.appendChild(
        anchor
      );

      anchor.click();

      anchor.remove();

      URL.revokeObjectURL(
        url
      );
    };

  return (
    <main className="mx-auto w-full max-w-[1800px] px-3 pb-12 sm:px-4 lg:px-6 xl:px-8">
      <div className="space-y-4 sm:space-y-5">
        <DividendCentreHero
          data={
            data
          }
          refreshing={
            refreshing
          }
        />

        <DividendExecutiveSummary
          summary={
            data.summary
          }
          loading={
            loading
          }
        />

        <DividendProviderBanner
          data={
            data
          }
          loading={
            loading
          }
          refreshing={
            refreshing
          }
          onRefresh={
            onRefresh
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

        <section
          aria-label="Professional dividend payments table"
          className="min-w-0"
        >
          <DividendUpcomingPaymentsTable
            rows={
              resolved.timeline
            }
            title="Dividend Payments"
            description="Review historical receipts, confirmed distributions and forecast payments in one searchable schedule."
          />
        </section>

        {data.message && (
          <div className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800 shadow-sm dark:border-amber-900 dark:bg-amber-950/20 dark:text-amber-300">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />

            <div>
              <p className="font-semibold">
                Dividend data notice
              </p>

              <p className="mt-1 leading-6">
                {data.message}
              </p>
            </div>
          </div>
        )}

        <section
          aria-label="Dividend calendar and upcoming events"
          className="grid min-w-0 gap-4 xl:grid-cols-[minmax(0,1.45fr)_minmax(340px,0.55fr)]"
        >
          <div className="min-w-0">
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
          </div>

          <div className="min-w-0">
            <DividendUpcomingTimeline
              rows={
                resolved.timeline
              }
            />
          </div>
        </section>

        <section
          aria-label="Dividend forecasts and reconciliation"
          className="grid min-w-0 gap-4 xl:grid-cols-[minmax(0,1.35fr)_minmax(340px,0.65fr)]"
        >
          <div className="min-w-0">
            <DividendMonthlyForecast
              items={
                data.summary.monthlyForecast
              }
              currency={
                data.summary.currency
              }
            />
          </div>

          <div className="min-w-0">
            <DividendReconciliationPanel
              reconciliation={
                resolved.reconciliation
              }
              currency={
                data.summary.currency
              }
            />
          </div>
        </section>

        <section
          aria-label="Dividend income by holding"
          className="min-w-0"
        >
          <DividendHoldingBreakdown
            items={
              data.summary.holdingSummaries
            }
          />
        </section>
      </div>
    </main>
  );
}
