"use client";

import {
  Download,
  FileSpreadsheet,
  History,
  ShieldCheck,
} from "lucide-react";
import type {
  DividendIntelligenceResponse,
} from "@/lib/dividend-data";
import {
  formatDividendMoney,
} from "./dividendCentreFormatters";

type Props = {
  data:
    DividendIntelligenceResponse;
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

function downloadCsv(
  filename: string,
  rows: unknown[][]
): void {
  const csv =
    rows
      .map(
        (
          row
        ) =>
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
    filename;

  document.body.appendChild(
    anchor
  );

  anchor.click();

  anchor.remove();

  URL.revokeObjectURL(
    url
  );
}

function currentDate(): string {
  return new Date()
    .toISOString()
    .slice(
      0,
      10
    );
}

export function DividendAnalyticsExport({
  data,
}: Props) {
  const currency =
    data.summary.currency ||
    "AUD";

  const exportEvents =
    () => {
      downloadCsv(
        `lgrbz-dividend-events-${currentDate()}.csv`,
        [
          [
            "Symbol",
            "Provider",
            "Status",
            "Confidence",
            "Frequency",
            "Declaration Date",
            "Ex-Dividend Date",
            "Record Date",
            "Payment Date",
            "Dividend Per Share",
            "Adjusted Dividend Per Share",
            "Currency",
            "Franking Percentage",
            "Special Dividend",
            "Source Updated",
            "Notes",
          ],

          ...data.events.map(
            (
              event
            ) => [
              event.displaySymbol,
              event.provider,
              event.status,
              event.confidence,
              event.frequency,
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
              event.adjustedDividendPerShare ??
                "",
              event.currency,
              event.frankingPercentage ??
                "",
              event.isSpecial
                ? "Yes"
                : "No",
              event.sourceUpdatedAt ||
                "",
              event.note ||
                "",
            ]
          ),
        ]
      );
    };

  const exportMonthly =
    () => {
      downloadCsv(
        `lgrbz-dividend-monthly-forecast-${currentDate()}.csv`,
        [
          [
            "Month",
            "Label",
            "Received Income",
            "Announced Income",
            "Forecast Income",
            "Total Income",
            "Franking Credits",
            "Event Count",
            "Currency",
          ],

          ...data.summary.monthlyForecast.map(
            (
              month
            ) => [
              month.month,
              month.label,
              month.receivedIncome,
              month.announcedIncome,
              month.forecastIncome,
              month.totalIncome,
              month.frankingCredits,
              month.eventCount,
              currency,
            ]
          ),
        ]
      );
    };

  const exportHoldings =
    () => {
      downloadCsv(
        `lgrbz-dividend-holdings-${currentDate()}.csv`,
        [
          [
            "Symbol",
            "Currency",
            "Quantity",
            "Trailing 12 Month Income",
            "Forward 12 Month Income",
            "Received Income",
            "Announced Income",
            "Forecast Income",
            "Annualised Dividend Per Share",
            "Forward Yield",
            "Yield on Cost",
            "Next Ex-Date",
            "Next Payment Date",
            "Franking Credits",
            "Event Count",
          ],

          ...data.summary.holdingSummaries.map(
            (
              holding
            ) => [
              holding.displaySymbol,
              holding.currency,
              holding.quantity,
              holding.trailingTwelveMonthIncome,
              holding.forwardTwelveMonthIncome,
              holding.receivedIncome,
              holding.announcedIncome,
              holding.forecastIncome,
              holding.annualisedDividendPerShare,
              holding.forwardYield ??
                "",
              holding.yieldOnCost ??
                "",
              holding.nextExDate ||
                "",
              holding.nextPaymentDate ||
                "",
              holding.frankingCredits,
              holding.eventCount,
            ]
          ),
        ]
      );
    };

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950">
      <div className="flex flex-col gap-4 border-b border-slate-200 p-4 dark:border-slate-800 sm:p-5 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex min-w-0 items-start gap-3">
          <span className="shrink-0 rounded-xl bg-emerald-100 p-2.5 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300">
            <FileSpreadsheet className="h-5 w-5" />
          </span>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.1em] text-slate-500">
              Dividend Reports
            </p>

            <h2 className="mt-1 text-lg font-bold text-slate-950 dark:text-slate-50">
              Export Portfolio Income Data
            </h2>

            <p className="mt-1 max-w-2xl text-xs leading-5 text-slate-500">
              Download normalized dividend events, monthly forecasts or holding-level income analytics for external reporting.
            </p>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 px-3 py-2 text-right dark:border-slate-800">
          <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
            Forward Income
          </p>

          <p className="mt-1 text-sm font-bold text-slate-950 dark:text-slate-50">
            {formatDividendMoney(
              data.summary.forwardTwelveMonthIncome,
              currency
            )}
          </p>
        </div>
      </div>

      <div className="grid gap-3 p-4 sm:p-5 lg:grid-cols-3">
        <button
          type="button"
          onClick={
            exportEvents
          }
          className="group rounded-2xl border border-slate-200 p-4 text-left transition duration-200 motion-safe:hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md dark:border-slate-800 dark:hover:border-slate-700"
        >
          <div className="flex items-start justify-between gap-3">
            <span className="rounded-xl bg-sky-100 p-2.5 text-sky-700 dark:bg-sky-950/50 dark:text-sky-300">
              <History className="h-4 w-4" />
            </span>

            <Download className="h-4 w-4 text-slate-400 transition group-hover:text-slate-700 dark:group-hover:text-slate-200" />
          </div>

          <h3 className="mt-4 text-sm font-bold text-slate-950 dark:text-slate-50">
            Dividend Events
          </h3>

          <p className="mt-1 text-xs leading-5 text-slate-500">
            Export all historical, announced and forecast dividend events.
          </p>

          <p className="mt-3 text-[10px] font-bold uppercase tracking-wide text-slate-400">
            {data.events.length} rows
          </p>
        </button>

        <button
          type="button"
          onClick={
            exportMonthly
          }
          className="group rounded-2xl border border-slate-200 p-4 text-left transition duration-200 motion-safe:hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md dark:border-slate-800 dark:hover:border-slate-700"
        >
          <div className="flex items-start justify-between gap-3">
            <span className="rounded-xl bg-violet-100 p-2.5 text-violet-700 dark:bg-violet-950/50 dark:text-violet-300">
              <FileSpreadsheet className="h-4 w-4" />
            </span>

            <Download className="h-4 w-4 text-slate-400 transition group-hover:text-slate-700 dark:group-hover:text-slate-200" />
          </div>

          <h3 className="mt-4 text-sm font-bold text-slate-950 dark:text-slate-50">
            Monthly Forecast
          </h3>

          <p className="mt-1 text-xs leading-5 text-slate-500">
            Export monthly received, announced, forecast and franking totals.
          </p>

          <p className="mt-3 text-[10px] font-bold uppercase tracking-wide text-slate-400">
            {data.summary.monthlyForecast.length} rows
          </p>
        </button>

        <button
          type="button"
          onClick={
            exportHoldings
          }
          className="group rounded-2xl border border-slate-200 p-4 text-left transition duration-200 motion-safe:hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md dark:border-slate-800 dark:hover:border-slate-700"
        >
          <div className="flex items-start justify-between gap-3">
            <span className="rounded-xl bg-emerald-100 p-2.5 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300">
              <ShieldCheck className="h-4 w-4" />
            </span>

            <Download className="h-4 w-4 text-slate-400 transition group-hover:text-slate-700 dark:group-hover:text-slate-200" />
          </div>

          <h3 className="mt-4 text-sm font-bold text-slate-950 dark:text-slate-50">
            Holding Income
          </h3>

          <p className="mt-1 text-xs leading-5 text-slate-500">
            Export forward income, yield, franking and next-event metrics by holding.
          </p>

          <p className="mt-3 text-[10px] font-bold uppercase tracking-wide text-slate-400">
            {data.summary.holdingSummaries.length} rows
          </p>
        </button>
      </div>
    </section>
  );
}
