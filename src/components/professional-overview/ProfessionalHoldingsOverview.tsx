"use client";

import {
  useMemo,
} from "react";
import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  BriefcaseBusiness,
  CircleDollarSign,
  Coins,
  Gauge,
  Layers3,
  Plus,
  ShieldCheck,
  TrendingDown,
  TrendingUp,
  WalletCards,
} from "lucide-react";
import {
  calculateProfessionalPortfolioOverview,
} from "./portfolioOverviewNormaliser";

type ProfessionalHoldingsOverviewProps = {
  holdings?: readonly unknown[];
};

function money(
  value: number | null | undefined,
  currency = "AUD"
): string {
  if (
    value === null ||
    value === undefined ||
    !Number.isFinite(value)
  ) {
    return "—";
  }

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
  value: number | null | undefined
): string {
  if (
    value === null ||
    value === undefined ||
    !Number.isFinite(value)
  ) {
    return "—";
  }

  return `${value > 0 ? "+" : ""}${value.toFixed(
    2
  )}%`;
}

function tone(
  value: number | null | undefined
): string {
  if (
    value === null ||
    value === undefined ||
    value === 0
  ) {
    return "text-slate-200";
  }

  return value > 0
    ? "text-emerald-300"
    : "text-rose-300";
}

export function ProfessionalHoldingsOverview({
  holdings = [],
}: ProfessionalHoldingsOverviewProps) {
  const portfolio =
    useMemo(
      () =>
        calculateProfessionalPortfolioOverview(
          holdings
        ),
      [holdings]
    );

  const totals =
    portfolio.totals;

  const topHoldings =
    [...portfolio.holdings]
      .sort(
        (
          left,
          right
        ) =>
          right.marketValue -
          left.marketValue
      )
      .slice(
        0,
        8
      );

  const strongestSectors =
    portfolio.sectors.slice(
      0,
      6
    );

  return (
    <div className="space-y-5">
      <section className="relative overflow-hidden rounded-3xl border border-slate-800 bg-[#06131f] shadow-[0_24px_80px_rgba(0,0,0,0.26)]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.14),transparent_36%),radial-gradient(circle_at_bottom_right,rgba(139,92,246,0.10),transparent_40%)]" />

        <div className="relative p-5 sm:p-7">
          <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-cyan-200">
                <BriefcaseBusiness className="h-3.5 w-3.5" />

                Holdings Intelligence
              </span>

              <h1 className="mt-4 text-3xl font-semibold tracking-tight text-white">
                Professional portfolio holdings
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">
                Review position value, performance, allocation, concentration
                and dividend income before opening individual holding details.
              </p>

              <div className="mt-5 flex flex-wrap gap-3">
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
                  View Allocation

                  <Layers3 className="h-4 w-4" />
                </Link>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 xl:w-[430px]">
              <div className="rounded-2xl border border-cyan-400/20 bg-cyan-400/5 p-4">
                <p className="text-xs text-slate-400">
                  Current market value
                </p>

                <p className="mt-2 text-2xl font-semibold text-white">
                  {money(
                    totals.marketValue
                  )}
                </p>

                <p
                  className={[
                    "mt-1",
                    "text-xs",
                    "font-semibold",
                    tone(
                      totals.gainLossPercent
                    ),
                  ].join(" ")}
                >
                  {percent(
                    totals.gainLossPercent
                  )}
                </p>
              </div>

              <div className="rounded-2xl border border-violet-400/20 bg-violet-400/5 p-4">
                <p className="text-xs text-slate-400">
                  Total cost basis
                </p>

                <p className="mt-2 text-2xl font-semibold text-white">
                  {money(
                    totals.costBasis
                  )}
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  Transaction-ledger value
                </p>
              </div>

              <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/5 p-4">
                <p className="text-xs text-slate-400">
                  Annual income
                </p>

                <p className="mt-2 text-2xl font-semibold text-white">
                  {money(
                    totals.annualDividendIncome
                  )}
                </p>

                <p className="mt-1 text-xs font-semibold text-emerald-300">
                  {percent(
                    totals.dividendYield
                  )}{" "}
                  yield
                </p>
              </div>

              <div className="rounded-2xl border border-amber-400/20 bg-amber-400/5 p-4">
                <p className="text-xs text-slate-400">
                  Portfolio concentration
                </p>

                <p className="mt-2 text-2xl font-semibold text-white">
                  {totals.topFiveWeight.toFixed(
                    1
                  )}
                  %
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  Top five positions
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-6">
        <div className="rounded-2xl border border-slate-800 bg-[#071522] p-4">
          <WalletCards className="h-4 w-4 text-cyan-300" />

          <p className="mt-3 text-xs text-slate-500">
            Holdings
          </p>

          <p className="mt-1 text-xl font-semibold text-white">
            {totals.holdingCount}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-[#071522] p-4">
          {totals.gainLoss >=
          0 ? (
            <TrendingUp className="h-4 w-4 text-emerald-300" />
          ) : (
            <TrendingDown className="h-4 w-4 text-rose-300" />
          )}

          <p className="mt-3 text-xs text-slate-500">
            Unrealised P/L
          </p>

          <p
            className={[
              "mt-1",
              "text-xl",
              "font-semibold",
              tone(
                totals.gainLoss
              ),
            ].join(" ")}
          >
            {money(
              totals.gainLoss
            )}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-[#071522] p-4">
          <CircleDollarSign className="h-4 w-4 text-emerald-300" />

          <p className="mt-3 text-xs text-slate-500">
            Monthly income
          </p>

          <p className="mt-1 text-xl font-semibold text-white">
            {money(
              totals.monthlyDividendIncome
            )}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-[#071522] p-4">
          <Gauge className="h-4 w-4 text-amber-300" />

          <p className="mt-3 text-xs text-slate-500">
            Largest holding
          </p>

          <p className="mt-1 text-xl font-semibold text-white">
            {totals.topHoldingWeight.toFixed(
              1
            )}
            %
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-[#071522] p-4">
          <Layers3 className="h-4 w-4 text-violet-300" />

          <p className="mt-3 text-xs text-slate-500">
            Sectors
          </p>

          <p className="mt-1 text-xl font-semibold text-white">
            {totals.sectorCount}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-[#071522] p-4">
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
        </div>
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.35fr_1fr]">
        <div className="rounded-2xl border border-slate-800 bg-[#071522] p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-semibold text-white">
                Position ranking
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                Largest holdings by current market value
              </p>
            </div>

            <BarChart3 className="h-5 w-5 text-cyan-300" />
          </div>

          <div className="mt-5 space-y-4">
            {topHoldings.map(
              (
                holding,
                index
              ) => (
                <div
                  key={holding.symbol}
                  className="rounded-xl border border-slate-800 bg-slate-950/40 p-4"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex min-w-0 items-start gap-3">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-slate-700 bg-slate-900 text-xs font-bold text-slate-400">
                        {index + 1}
                      </span>

                      <div className="min-w-0">
                        <p className="font-semibold text-white">
                          {holding.symbol}
                        </p>

                        <p className="truncate text-xs text-slate-500">
                          {holding.name}
                        </p>

                        <p className="mt-1 text-[10px] text-slate-600">
                          {holding.sector}
                        </p>
                      </div>
                    </div>

                    <div className="shrink-0 text-right">
                      <p className="font-semibold text-white">
                        {money(
                          holding.marketValue,
                          holding.currency
                        )}
                      </p>

                      <p
                        className={[
                          "mt-0.5",
                          "text-xs",
                          "font-semibold",
                          tone(
                            holding.gainLossPercent
                          ),
                        ].join(" ")}
                      >
                        {percent(
                          holding.gainLossPercent
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between text-[11px] text-slate-500">
                    <span>
                      Weight{" "}
                      {holding.portfolioWeight.toFixed(
                        2
                      )}
                      %
                    </span>

                    <span>
                      Income{" "}
                      {money(
                        holding.annualDividendIncome,
                        holding.currency
                      )}
                    </span>
                  </div>

                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-800">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-sky-500"
                      style={{
                        width: `${Math.min(
                          100,
                          holding.portfolioWeight
                        )}%`,
                      }}
                    />
                  </div>
                </div>
              )
            )}

            {topHoldings.length ===
            0 ? (
              <div className="rounded-xl border border-dashed border-slate-700 p-8 text-center">
                <BriefcaseBusiness className="mx-auto h-8 w-8 text-slate-600" />

                <p className="mt-3 text-sm font-medium text-slate-300">
                  No holdings found
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  Add a buy transaction to create your first holding.
                </p>
              </div>
            ) : null}
          </div>
        </div>

        <div className="space-y-5">
          <div className="rounded-2xl border border-slate-800 bg-[#071522] p-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-semibold text-white">
                  Sector exposure
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  Portfolio allocation summary
                </p>
              </div>

              <Layers3 className="h-5 w-5 text-violet-300" />
            </div>

            <div className="mt-5 space-y-4">
              {strongestSectors.map(
                (
                  sector
                ) => (
                  <div
                    key={sector.sector}
                  >
                    <div className="flex items-center justify-between gap-3 text-xs">
                      <span className="font-medium text-slate-300">
                        {sector.sector}
                      </span>

                      <span className="font-semibold text-white">
                        {sector.weight.toFixed(
                          1
                        )}
                        %
                      </span>
                    </div>

                    <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-800">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-violet-400 to-fuchsia-400"
                        style={{
                          width: `${Math.min(
                            100,
                            sector.weight
                          )}%`,
                        }}
                      />
                    </div>

                    <div className="mt-1 flex items-center justify-between text-[10px] text-slate-600">
                      <span>
                        {sector.holdingCount} holdings
                      </span>

                      <span>
                        {money(
                          sector.marketValue
                        )}
                      </span>
                    </div>
                  </div>
                )
              )}
            </div>

            <Link
              href="/portfolio-allocation"
              className="mt-5 inline-flex items-center gap-1.5 text-xs font-semibold text-violet-300"
            >
              Open full allocation

              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-[#071522] p-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-semibold text-white">
                  Portfolio position
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  Performance and concentration snapshot
                </p>
              </div>

              <Coins className="h-5 w-5 text-emerald-300" />
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-slate-800 bg-slate-950/45 p-3">
                <p className="text-[10px] uppercase tracking-wider text-slate-600">
                  Profitable
                </p>

                <p className="mt-1 text-xl font-semibold text-emerald-300">
                  {totals.profitableHoldingCount}
                </p>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950/45 p-3">
                <p className="text-[10px] uppercase tracking-wider text-slate-600">
                  Below cost
                </p>

                <p className="mt-1 text-xl font-semibold text-rose-300">
                  {totals.losingHoldingCount}
                </p>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950/45 p-3">
                <p className="text-[10px] uppercase tracking-wider text-slate-600">
                  Best performer
                </p>

                <p className="mt-1 font-semibold text-white">
                  {portfolio.bestPerformer
                    ?.symbol ||
                    "—"}
                </p>

                <p className="mt-0.5 text-xs text-emerald-300">
                  {percent(
                    portfolio.bestPerformer
                      ?.gainLossPercent
                  )}
                </p>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950/45 p-3">
                <p className="text-[10px] uppercase tracking-wider text-slate-600">
                  Largest position
                </p>

                <p className="mt-1 font-semibold text-white">
                  {portfolio.largestHolding
                    ?.symbol ||
                    "—"}
                </p>

                <p className="mt-0.5 text-xs text-slate-500">
                  {portfolio.largestHolding
                    ?.portfolioWeight.toFixed(
                      1
                    ) ||
                    "0.0"}
                  %
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
