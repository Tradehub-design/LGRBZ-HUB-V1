"use client";

import {
  PositionIntelligenceProvider,
} from "./PositionIntelligenceProvider";


import {
  InstitutionalHoldingsTable,
} from "./InstitutionalHoldingsTable";


import {
  useMemo,
} from "react";
import Link from "next/link";
import {
  ArrowRight,
  BriefcaseBusiness,
  CircleDollarSign,
  Gauge,
  Layers3,
  Plus,
  ShieldCheck,
  TrendingDown,
  TrendingUp,
  WalletCards,
} from "lucide-react";
import {
  createHoldingsVisualSnapshot,
} from "@/lib/holdings-professional/holdingsVisualEngine";
import {
  HoldingsPositionRanking,
} from "./HoldingsPositionRanking";
import {
  HoldingsSectorHeatmap,
} from "./HoldingsSectorHeatmap";
import {
  HoldingsTreemap,
} from "./HoldingsTreemap";

type HoldingsCommandCentreProps = {
  holdings?: readonly unknown[];
};

function money(
  value: number,
  currency = "AUD"
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
  positivePrefix = true
): string {
  if (value === null) {
    return "—";
  }

  return `${positivePrefix && value > 0 ? "+" : ""}${value.toFixed(
    2
  )}%`;
}

function performanceClass(
  value: number | null
): string {
  if (
    value === null ||
    value === 0
  ) {
    return "text-slate-200";
  }

  return value > 0
    ? "text-emerald-300"
    : "text-rose-300";
}

export function HoldingsCommandCentre({
  holdings = [],
}: HoldingsCommandCentreProps) {
  const snapshot =
    useMemo(
      () =>
        createHoldingsVisualSnapshot(
          holdings
        ),
      [
        holdings,
      ]
    );

  const totals =
    snapshot.totals;

  const ReturnIcon =
    totals.gainLoss >=
    0
      ? TrendingUp
      : TrendingDown;

  return (
    <PositionIntelligenceProvider
      snapshot={
        snapshot
      }
    >
      <div className="space-y-5">
      <section className="relative overflow-hidden rounded-3xl border border-slate-800 bg-[#06131f] shadow-[0_24px_80px_rgba(0,0,0,0.28)]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.14),transparent_38%),radial-gradient(circle_at_bottom_right,rgba(139,92,246,0.12),transparent_40%)]" />

        <div className="relative p-5 sm:p-7">
          <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
            <div className="max-w-3xl">
              <span className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-cyan-200">
                <BriefcaseBusiness className="h-3.5 w-3.5" />

                Holdings Command Centre
              </span>

              <h1 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                Professional position intelligence
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">
                Review portfolio value, position performance, concentration,
                sector exposure, dividend income and pricing quality before
                opening detailed lots, transactions and holding analysis.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href="/transactions"
                  className="inline-flex items-center gap-2 rounded-xl bg-cyan-400 px-4 py-2.5 text-sm font-bold text-slate-950 transition hover:bg-cyan-300"
                >
                  <Plus className="h-4 w-4" />

                  Add Transaction
                </Link>

                <Link
                  href="/portfolio-allocation"
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900/70 px-4 py-2.5 text-sm font-semibold text-slate-200 transition hover:border-slate-600"
                >
                  <Layers3 className="h-4 w-4" />

                  View Allocation
                </Link>

                <Link
                  href="/portfolio-health"
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900/70 px-4 py-2.5 text-sm font-semibold text-slate-200 transition hover:border-slate-600"
                >
                  <ShieldCheck className="h-4 w-4" />

                  Portfolio Health
                </Link>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 xl:w-[440px]">
              <div className="rounded-2xl border border-cyan-400/20 bg-cyan-400/5 p-4">
                <WalletCards className="h-4 w-4 text-cyan-300" />

                <p className="mt-3 text-xs text-slate-400">
                  Market value
                </p>

                <p className="mt-1 text-2xl font-semibold text-white">
                  {money(
                    totals.marketValue
                  )}
                </p>
              </div>

              <div className="rounded-2xl border border-violet-400/20 bg-violet-400/5 p-4">
                <BriefcaseBusiness className="h-4 w-4 text-violet-300" />

                <p className="mt-3 text-xs text-slate-400">
                  Cost basis
                </p>

                <p className="mt-1 text-2xl font-semibold text-white">
                  {money(
                    totals.costBasis
                  )}
                </p>
              </div>

              <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/5 p-4">
                <CircleDollarSign className="h-4 w-4 text-emerald-300" />

                <p className="mt-3 text-xs text-slate-400">
                  Annual income
                </p>

                <p className="mt-1 text-2xl font-semibold text-white">
                  {money(
                    totals.annualIncome
                  )}
                </p>
              </div>

              <div className="rounded-2xl border border-amber-400/20 bg-amber-400/5 p-4">
                <Gauge className="h-4 w-4 text-amber-300" />

                <p className="mt-3 text-xs text-slate-400">
                  Top-five weight
                </p>

                <p className="mt-1 text-2xl font-semibold text-white">
                  {totals.topFiveWeight.toFixed(
                    1
                  )}
                  %
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-6">
        <article className="rounded-2xl border border-slate-800 bg-[#071522] p-4">
          <BriefcaseBusiness className="h-4 w-4 text-cyan-300" />

          <p className="mt-3 text-xs text-slate-500">
            Holdings
          </p>

          <p className="mt-1 text-xl font-semibold text-white">
            {totals.holdingCount}
          </p>
        </article>

        <article className="rounded-2xl border border-slate-800 bg-[#071522] p-4">
          <ReturnIcon
            className={[
              "h-4",
              "w-4",
              performanceClass(
                totals.gainLossPercent
              ),
            ].join(" ")}
          />

          <p className="mt-3 text-xs text-slate-500">
            Total return
          </p>

          <p
            className={[
              "mt-1",
              "text-xl",
              "font-semibold",
              performanceClass(
                totals.gainLossPercent
              ),
            ].join(" ")}
          >
            {percent(
              totals.gainLossPercent
            )}
          </p>
        </article>

        <article className="rounded-2xl border border-slate-800 bg-[#071522] p-4">
          <CircleDollarSign className="h-4 w-4 text-emerald-300" />

          <p className="mt-3 text-xs text-slate-500">
            Dividend yield
          </p>

          <p className="mt-1 text-xl font-semibold text-white">
            {percent(
              totals.dividendYield,
              false
            )}
          </p>
        </article>

        <article className="rounded-2xl border border-slate-800 bg-[#071522] p-4">
          <Gauge className="h-4 w-4 text-amber-300" />

          <p className="mt-3 text-xs text-slate-500">
            Largest position
          </p>

          <p className="mt-1 text-xl font-semibold text-white">
            {totals.largestPositionWeight.toFixed(
              1
            )}
            %
          </p>
        </article>

        <article className="rounded-2xl border border-slate-800 bg-[#071522] p-4">
          <Layers3 className="h-4 w-4 text-violet-300" />

          <p className="mt-3 text-xs text-slate-500">
            Sectors
          </p>

          <p className="mt-1 text-xl font-semibold text-white">
            {totals.sectorCount}
          </p>
        </article>

        <article className="rounded-2xl border border-slate-800 bg-[#071522] p-4">
          <ShieldCheck className="h-4 w-4 text-sky-300" />

          <p className="mt-3 text-xs text-slate-500">
            Pricing coverage
          </p>

          <p className="mt-1 text-xl font-semibold text-white">
            {totals.pricingCoverage.toFixed(
              0
            )}
            %
          </p>
        </article>
      </section>

      <section className="grid gap-5 xl:grid-cols-[minmax(0,1.35fr)_minmax(360px,0.65fr)]">
        <HoldingsTreemap
          snapshot={
            snapshot
          }
        />

        <HoldingsPositionRanking
          snapshot={
            snapshot
          }
        />
      </section>

      <HoldingsSectorHeatmap
        snapshot={
          snapshot
        }
      />

      <InstitutionalHoldingsTable
        snapshot={
          snapshot
        }
      />

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <article className="rounded-2xl border border-emerald-400/15 bg-emerald-400/5 p-4">
          <p className="text-[10px] uppercase tracking-wider text-emerald-300/70">
            Profitable positions
          </p>

          <p className="mt-2 text-2xl font-semibold text-emerald-300">
            {totals.profitableCount}
          </p>
        </article>

        <article className="rounded-2xl border border-rose-400/15 bg-rose-400/5 p-4">
          <p className="text-[10px] uppercase tracking-wider text-rose-300/70">
            Positions below cost
          </p>

          <p className="mt-2 text-2xl font-semibold text-rose-300">
            {totals.losingCount}
          </p>
        </article>

        <article className="rounded-2xl border border-violet-400/15 bg-violet-400/5 p-4">
          <p className="text-[10px] uppercase tracking-wider text-violet-300/70">
            Best performer
          </p>

          <p className="mt-2 text-xl font-semibold text-white">
            {snapshot.bestPerformer
              ?.symbol ||
              "—"}
          </p>

          <p className="mt-1 text-xs text-emerald-300">
            {percent(
              snapshot.bestPerformer
                ?.gainLossPercent ??
              null
            )}
          </p>
        </article>

        <article className="rounded-2xl border border-amber-400/15 bg-amber-400/5 p-4">
          <p className="text-[10px] uppercase tracking-wider text-amber-300/70">
            Monthly income
          </p>

          <p className="mt-2 text-xl font-semibold text-white">
            {money(
              totals.monthlyIncome
            )}
          </p>
        </article>
      </section>
      </div>
    </PositionIntelligenceProvider>
  );
}
