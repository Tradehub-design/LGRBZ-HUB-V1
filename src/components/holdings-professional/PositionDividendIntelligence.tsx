"use client";

import {
  CalendarClock,
  CircleDollarSign,
  Coins,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import type {
  HoldingsVisualSnapshot,
} from "@/lib/holdings-professional/holdingsVisualModels";
import type {
  PositionIntelligenceSummary,
} from "@/lib/holdings-professional/positionIntelligenceModels";
import {
  createPositionDividendSnapshot,
} from "@/lib/holdings-professional/positionDividendEngine";
import {
  PositionDividendHistoryTable,
} from "./PositionDividendHistoryTable";
import {
  PositionIncomeHistoryChart,
} from "./PositionIncomeHistoryChart";
import {
  PositionMonthlyIncomeProfile,
} from "./PositionMonthlyIncomeProfile";
import {
  PositionUpcomingDividends,
} from "./PositionUpcomingDividends";

type PositionDividendIntelligenceProps = {
  summary:
    PositionIntelligenceSummary;

  portfolioSnapshot:
    HoldingsVisualSnapshot;
};

function money(
  value: number,
  currency: string
): string {
  return new Intl.NumberFormat(
    "en-AU",
    {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }
  ).format(value);
}

function percent(
  value: number | null,
  positivePrefix = false
): string {
  if (value === null) {
    return "—";
  }

  return `${positivePrefix && value > 0 ? "+" : ""}${value.toFixed(
    2
  )}%`;
}

export function PositionDividendIntelligence({
  summary,
  portfolioSnapshot,
}: PositionDividendIntelligenceProps) {
  const snapshot =
    createPositionDividendSnapshot({
      position:
        summary.position,

      portfolioSnapshot,
    });

  const GrowthIcon =
    (
      snapshot.totals.latestAnnualGrowth ||
      0
    ) >= 0
      ? TrendingUp
      : TrendingDown;

  return (
    <div className="space-y-5">
      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <article className="rounded-2xl border border-emerald-400/15 bg-emerald-400/5 p-4">
          <Coins className="h-4 w-4 text-emerald-300" />

          <p className="mt-3 text-[10px] uppercase tracking-wider text-slate-600">
            Forward annual income
          </p>

          <p className="mt-1 text-xl font-semibold text-white">
            {money(
              snapshot.totals.forwardAnnualIncome,
              summary.position.currency
            )}
          </p>
        </article>

        <article className="rounded-2xl border border-sky-400/15 bg-sky-400/5 p-4">
          <CircleDollarSign className="h-4 w-4 text-sky-300" />

          <p className="mt-3 text-[10px] uppercase tracking-wider text-slate-600">
            Current yield
          </p>

          <p className="mt-1 text-xl font-semibold text-white">
            {percent(
              snapshot.totals.currentYield
            )}
          </p>
        </article>

        <article className="rounded-2xl border border-violet-400/15 bg-violet-400/5 p-4">
          <CircleDollarSign className="h-4 w-4 text-violet-300" />

          <p className="mt-3 text-[10px] uppercase tracking-wider text-slate-600">
            Yield on cost
          </p>

          <p className="mt-1 text-xl font-semibold text-white">
            {percent(
              snapshot.totals.yieldOnCost
            )}
          </p>
        </article>

        <article className="rounded-2xl border border-amber-400/15 bg-amber-400/5 p-4">
          <GrowthIcon
            className={
              (
                snapshot.totals.latestAnnualGrowth ||
                0
              ) >= 0
                ? "h-4 w-4 text-emerald-300"
                : "h-4 w-4 text-rose-300"
            }
          />

          <p className="mt-3 text-[10px] uppercase tracking-wider text-slate-600">
            Latest income growth
          </p>

          <p
            className={[
              "mt-1",
              "text-xl",
              "font-semibold",
              (
                snapshot.totals.latestAnnualGrowth ||
                0
              ) >= 0
                ? "text-emerald-300"
                : "text-rose-300",
            ].join(" ")}
          >
            {percent(
              snapshot.totals.latestAnnualGrowth,
              true
            )}
          </p>
        </article>
      </section>

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <article className="rounded-xl border border-slate-800 bg-slate-950/35 p-4">
          <p className="text-[10px] uppercase tracking-wider text-slate-700">
            Monthly average
          </p>

          <p className="mt-1 font-semibold text-white">
            {money(
              snapshot.totals.monthlyAverageIncome,
              summary.position.currency
            )}
          </p>
        </article>

        <article className="rounded-xl border border-slate-800 bg-slate-950/35 p-4">
          <p className="text-[10px] uppercase tracking-wider text-slate-700">
            Portfolio income contribution
          </p>

          <p className="mt-1 font-semibold text-white">
            {percent(
              snapshot.totals.incomeContribution
            )}
          </p>
        </article>

        <article className="rounded-xl border border-slate-800 bg-slate-950/35 p-4">
          <p className="text-[10px] uppercase tracking-wider text-slate-700">
            Forecast confidence
          </p>

          <p className="mt-1 font-semibold text-white">
            {snapshot.totals.averageConfidence.toFixed(
              0
            )}
            /100
          </p>
        </article>

        <article className="rounded-xl border border-slate-800 bg-slate-950/35 p-4">
          <CalendarClock className="h-4 w-4 text-amber-300" />

          <p className="mt-2 text-[10px] uppercase tracking-wider text-slate-700">
            Upcoming payments
          </p>

          <p className="mt-1 font-semibold text-white">
            {snapshot.totals.upcomingPaymentCount}
          </p>
        </article>
      </section>

      <div className="grid gap-5 xl:grid-cols-2">
        <PositionIncomeHistoryChart
          history={
            snapshot.annualHistory
          }
          currency={
            summary.position.currency
          }
        />

        <PositionMonthlyIncomeProfile
          months={
            snapshot.monthlyProfile
          }
          currency={
            summary.position.currency
          }
        />
      </div>

      <PositionUpcomingDividends
        events={
          snapshot.upcomingEvents
        }
        daysUntilPayment={
          snapshot.totals.daysUntilNextPayment
        }
        daysUntilExDividend={
          snapshot.totals.daysUntilNextExDividend
        }
      />

      <PositionDividendHistoryTable
        events={
          snapshot.historicalEvents
        }
      />
    </div>
  );
}
