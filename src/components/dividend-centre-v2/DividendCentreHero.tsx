"use client";

import {
  ArrowDownRight,
  ArrowUpRight,
  CalendarClock,
  CheckCircle2,
  CircleDollarSign,
  Clock3,
  History,
  Landmark,
  Sparkles,
  WalletCards,
} from "lucide-react";
import type {
  DividendIntelligenceResponse,
} from "@/lib/dividend-data";
import {
  daysUntilDividend,
  formatDividendMoney,
} from "./dividendCentreFormatters";

type Props = {
  data: DividendIntelligenceResponse;
  refreshing?: boolean;
};

type HeroMetricProps = {
  label: string;
  value: string;
  detail: string;
  icon: React.ComponentType<{
    className?: string;
  }>;
};

function HeroMetric({
  label,
  value,
  detail,
  icon: Icon,
}: HeroMetricProps) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-4 backdrop-blur">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
            {label}
          </p>

          <p className="mt-2 truncate text-xl font-bold tracking-tight text-white">
            {value}
          </p>

          <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-400">
            {detail}
          </p>
        </div>

        <span className="shrink-0 rounded-xl border border-white/10 bg-white/[0.08] p-2 text-slate-200">
          <Icon className="h-4 w-4" />
        </span>
      </div>
    </div>
  );
}

function formatGeneratedAt(
  value: string
): string {
  const date =
    new Date(value);

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return "Recently";
  }

  return date.toLocaleString(
    "en-AU",
    {
      dateStyle:
        "medium",
      timeStyle:
        "short",
    }
  );
}

export function DividendCentreHero({
  data,
  refreshing = false,
}: Props) {
  const {
    summary,
  } = data;

  const currency =
    summary.currency ||
    "AUD";

  const nextEvent =
    summary.nextEvent;

  const nextDate =
    nextEvent?.paymentDate ||
    nextEvent?.exDate ||
    null;

  const daysUntilNext =
    daysUntilDividend(
      nextDate
    );

  const nextEventDetail =
    !nextEvent
      ? "No confirmed or forecast event is currently available."
      : daysUntilNext === null
        ? "Date unavailable."
        : daysUntilNext < 0
          ? "The recorded event date has passed."
          : daysUntilNext === 0
            ? "The next event is today."
            : `Expected in ${daysUntilNext} day${
                daysUntilNext === 1
                  ? ""
                  : "s"
              }.`;

  const receivedShare =
    summary.trailingTwelveMonthIncome >
    0
      ? Math.min(
          100,
          Math.max(
            0,
            (
              summary.receivedCurrentFinancialYear /
              summary.trailingTwelveMonthIncome
            ) *
              100
          )
        )
      : 0;

  const forecastShare =
    summary.forwardTwelveMonthIncome >
    0
      ? Math.min(
          100,
          Math.max(
            0,
            (
              summary.forecastForwardIncome /
              summary.forwardTwelveMonthIncome
            ) *
              100
          )
        )
      : 0;

  return (
    <header className="relative overflow-hidden rounded-[28px] border border-slate-800 bg-slate-950 text-white shadow-xl shadow-slate-950/10">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -right-24 -top-28 h-80 w-80 rounded-full bg-emerald-500/10 blur-3xl" />

        <div className="absolute -bottom-32 left-1/4 h-80 w-80 rounded-full bg-sky-500/10 blur-3xl" />

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.08),transparent_35%)]" />
      </div>

      <div className="relative p-5 sm:p-6 lg:p-7">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
          <div className="max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1.5 text-xs font-semibold text-emerald-200">
                <Sparkles className="h-3.5 w-3.5" />
                Portfolio Income Intelligence
              </span>

              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-3 py-1.5 text-xs font-medium text-slate-300">
                {refreshing ? (
                  <>
                    <Clock3 className="h-3.5 w-3.5 animate-spin" />
                    Refreshing data
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-300" />
                    Data ready
                  </>
                )}
              </span>
            </div>

            <h1 className="mt-5 text-3xl font-bold tracking-tight sm:text-4xl">
              Dividend Centre
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300 sm:text-base">
              Track received income from your transaction ledger, monitor announced distributions, forecast future payments and understand the reliability of every dividend event.
            </p>

            <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-slate-400">
              <span className="inline-flex items-center gap-2">
                <History className="h-3.5 w-3.5" />
                {summary.receivedEventCount} received event
                {summary.receivedEventCount === 1
                  ? ""
                  : "s"}
              </span>

              <span className="inline-flex items-center gap-2">
                <CalendarClock className="h-3.5 w-3.5" />
                {summary.announcedEventCount} announced event
                {summary.announcedEventCount === 1
                  ? ""
                  : "s"}
              </span>

              <span className="inline-flex items-center gap-2">
                <Sparkles className="h-3.5 w-3.5" />
                {summary.forecastEventCount} forecast event
                {summary.forecastEventCount === 1
                  ? ""
                  : "s"}
              </span>
            </div>
          </div>

          <div className="w-full rounded-2xl border border-white/10 bg-white/[0.05] p-4 xl:max-w-sm">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">
                  Next Dividend Event
                </p>

                <p className="mt-2 text-2xl font-bold">
                  {nextEvent
                    ? nextEvent.symbol.replace(
                        /\.AX$/i,
                        ""
                      )
                    : "Not available"}
                </p>

                <p className="mt-1 text-sm text-slate-400">
                  {nextEventDetail}
                </p>
              </div>

              <span className="rounded-2xl border border-white/10 bg-white/[0.08] p-3 text-emerald-300">
                <CalendarClock className="h-5 w-5" />
              </span>
            </div>

            {nextEvent && (
              <div className="mt-4 grid grid-cols-2 gap-2">
                <div className="rounded-xl bg-black/20 p-3">
                  <p className="text-[11px] uppercase tracking-wide text-slate-500">
                    Expected Cash
                  </p>

                  <p className="mt-1 text-sm font-semibold text-white">
                    {formatDividendMoney(
                      nextEvent.expectedCash,
                      nextEvent.currency ||
                        currency,
                      2
                    )}
                  </p>
                </div>

                <div className="rounded-xl bg-black/20 p-3">
                  <p className="text-[11px] uppercase tracking-wide text-slate-500">
                    Confidence
                  </p>

                  <p className="mt-1 text-sm font-semibold text-white">
                    {nextEvent.confidence}
                  </p>
                </div>
              </div>
            )}

            <p className="mt-4 text-[11px] text-slate-500">
              Generated{" "}
              {formatGeneratedAt(
                summary.generatedAt
              )}
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <HeroMetric
            label="Forward 12 Months"
            value={formatDividendMoney(
              summary.forwardTwelveMonthIncome,
              currency,
              0
            )}
            detail="Announced and estimated future portfolio income."
            icon={CircleDollarSign}
          />

          <HeroMetric
            label="Received This FY"
            value={formatDividendMoney(
              summary.receivedCurrentFinancialYear,
              currency,
              0
            )}
            detail={`${receivedShare.toFixed(
              0
            )}% of trailing twelve-month income.`}
            icon={WalletCards}
          />

          <HeroMetric
            label="Confirmed Forward"
            value={formatDividendMoney(
              summary.announcedForwardIncome,
              currency,
              0
            )}
            detail="Income supported by announced company events."
            icon={Landmark}
          />

          <HeroMetric
            label="Forecast Exposure"
            value={`${forecastShare.toFixed(
              0
            )}%`}
            detail="Share of forward income currently based on estimates."
            icon={
              forecastShare >
              50
                ? ArrowUpRight
                : ArrowDownRight
            }
          />
        </div>
      </div>
    </header>
  );
}
