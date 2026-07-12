"use client";

import {
  BadgeDollarSign,
  CalendarClock,
  CircleDollarSign,
  Landmark,
  Percent,
  ReceiptText,
} from "lucide-react";
import type {
  DividendPortfolioSummary,
} from "@/lib/dividend-data";
import {
  daysUntilDividend,
  formatDividendMoney,
  formatDividendPercent,
} from "./dividendCentreFormatters";

type Props = {
  summary:
    DividendPortfolioSummary | null;
  loading?: boolean;
};

type SummaryCardProps = {
  title: string;
  value: string;
  subtitle: string;
  icon: React.ComponentType<{
    className?: string;
  }>;
};

function SummaryCard({
  title,
  value,
  subtitle,
  icon: Icon,
}: SummaryCardProps) {
  return (
    <article className="min-w-0 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-xs font-semibold uppercase tracking-[0.1em] text-slate-500">
            {title}
          </p>

          <p className="mt-2 truncate text-xl font-bold text-slate-950 dark:text-slate-50 sm:text-2xl">
            {value}
          </p>

          <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-500">
            {subtitle}
          </p>
        </div>

        <span className="shrink-0 rounded-xl bg-slate-100 p-2 text-slate-600 dark:bg-slate-900 dark:text-slate-300">
          <Icon className="h-4 w-4" />
        </span>
      </div>
    </article>
  );
}

export function DividendExecutiveSummary({
  summary,
  loading = false,
}: Props) {
  if (loading) {
    return (
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
        {Array.from({
          length: 6,
        }).map(
          (
            _,
            index
          ) => (
            <div
              key={index}
              className="h-32 animate-pulse rounded-2xl border border-slate-200 bg-slate-100 dark:border-slate-800 dark:bg-slate-900"
            />
          )
        )}
      </div>
    );
  }

  const currency =
    summary?.currency ||
    "AUD";

  const nextEvent =
    summary?.nextEvent;

  const nextDate =
    nextEvent?.paymentDate ||
    nextEvent?.exDate ||
    null;

  const nextDays =
    daysUntilDividend(
      nextDate
    );

  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
      <SummaryCard
        title="Forward 12 Months"
        value={formatDividendMoney(
          summary?.forwardTwelveMonthIncome,
          currency,
          0
        )}
        subtitle="Announced and forecast portfolio income."
        icon={CircleDollarSign}
      />

      <SummaryCard
        title="Announced Income"
        value={formatDividendMoney(
          summary?.announcedForwardIncome,
          currency,
          0
        )}
        subtitle="Confirmed company distributions."
        icon={BadgeDollarSign}
      />

      <SummaryCard
        title="Received This FY"
        value={formatDividendMoney(
          summary?.receivedCurrentFinancialYear,
          currency,
          0
        )}
        subtitle="Matched dividend ledger receipts."
        icon={ReceiptText}
      />

      <SummaryCard
        title="Dividend Yield"
        value={formatDividendPercent(
          summary?.portfolioDividendYield
        )}
        subtitle="Forward income divided by current portfolio value."
        icon={Percent}
      />

      <SummaryCard
        title="Franking Credits"
        value={formatDividendMoney(
          summary?.projectedFrankingCredits,
          currency,
          0
        )}
        subtitle="Projected Australian franking credit value."
        icon={Landmark}
      />

      <SummaryCard
        title="Next Event"
        value={
          nextEvent
            ? nextEvent.symbol.replace(
                /\.AX$/i,
                ""
              )
            : "—"
        }
        subtitle={
          nextDays === null
            ? "No upcoming event is available."
            : nextDays < 0
              ? "Event date has passed."
              : nextDays === 0
                ? "Event is today."
                : `In ${nextDays} day${
                    nextDays === 1
                      ? ""
                      : "s"
                  }.`
        }
        icon={CalendarClock}
      />
    </div>
  );
}
