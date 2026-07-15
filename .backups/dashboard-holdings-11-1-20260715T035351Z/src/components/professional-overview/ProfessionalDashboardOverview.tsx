"use client";

import {
  useMemo,
} from "react";
import Link from "next/link";
import {
  Activity,
  ArrowRight,
  BarChart3,
  Bell,
  BriefcaseBusiness,
  CalendarDays,
  CheckCircle2,
  CircleDollarSign,
  Coins,
  FileBarChart,
  Gauge,
  Goal,
  HeartPulse,
  Layers3,
  LineChart,
  ListChecks,
  PieChart,
  ReceiptText,
  RefreshCcw,
  Search,
  Settings,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingDown,
  TrendingUp,
  WalletCards,
} from "lucide-react";
import {
  calculateProfessionalPortfolioOverview,
} from "./portfolioOverviewNormaliser";

type ProfessionalDashboardOverviewProps = {
  holdings?: readonly unknown[];
};

type OverviewLink = {
  title: string;
  description: string;
  href: string;

  icon:
    typeof BarChart3;

  category:
    "PORTFOLIO" |
    "INCOME" |
    "ANALYTICS" |
    "PLANNING" |
    "OPERATIONS";
};

const overviewLinks:
  OverviewLink[] = [
    {
      title: "Holdings",
      description:
        "Positions, live values, gain/loss, cost lots and holding intelligence.",
      href: "/holdings",
      icon: BriefcaseBusiness,
      category: "PORTFOLIO",
    },
    {
      title: "Transactions",
      description:
        "Review, add and manage all portfolio transactions.",
      href: "/transactions",
      icon: ReceiptText,
      category: "OPERATIONS",
    },
    {
      title: "Portfolio Allocation",
      description:
        "Sector, country, account, currency and asset allocation.",
      href: "/portfolio-allocation",
      icon: PieChart,
      category: "PORTFOLIO",
    },
    {
      title: "Portfolio Health",
      description:
        "Concentration, diversification, quality and risk indicators.",
      href: "/portfolio-health",
      icon: HeartPulse,
      category: "ANALYTICS",
    },
    {
      title: "Analytics",
      description:
        "Performance trends, comparisons and portfolio intelligence.",
      href: "/analytics",
      icon: LineChart,
      category: "ANALYTICS",
    },
    {
      title: "Dividends",
      description:
        "Income forecasts, upcoming payments and dividend calendar.",
      href: "/dividends",
      icon: Coins,
      category: "INCOME",
    },
    {
      title: "Dividend Forecast",
      description:
        "Forward income, confidence, growth and payment projections.",
      href: "/dividend-forecast",
      icon: CalendarDays,
      category: "INCOME",
    },
    {
      title: "Performance Attribution",
      description:
        "Understand which holdings, sectors and decisions created returns.",
      href: "/performance-attribution",
      icon: BarChart3,
      category: "ANALYTICS",
    },
    {
      title: "Goals",
      description:
        "Portfolio targets, income goals and progress tracking.",
      href: "/goals",
      icon: Goal,
      category: "PLANNING",
    },
    {
      title: "Watchlist",
      description:
        "Track opportunities, targets, themes and live market movement.",
      href: "/watchlist",
      icon: Search,
      category: "PLANNING",
    },
    {
      title: "Reports",
      description:
        "Professional portfolio reporting and export tools.",
      href: "/reports",
      icon: FileBarChart,
      category: "OPERATIONS",
    },
    {
      title: "Tax Centre",
      description:
        "Capital gains, realised outcomes and tax-year reporting.",
      href: "/tax-centre",
      icon: CircleDollarSign,
      category: "OPERATIONS",
    },
    {
      title: "Business Model",
      description:
        "Strategy, risk profile, rules and portfolio operating model.",
      href: "/business-model",
      icon: Target,
      category: "PLANNING",
    },
    {
      title: "Broker Sync",
      description:
        "Broker connections, imported records and synchronisation status.",
      href: "/broker-sync",
      icon: RefreshCcw,
      category: "OPERATIONS",
    },
    {
      title: "Live Prices",
      description:
        "Market providers, quote freshness and pricing reliability.",
      href: "/market-data-health",
      icon: Activity,
      category: "OPERATIONS",
    },
    {
      title: "Settings",
      description:
        "Portfolio preferences, providers and application configuration.",
      href: "/settings",
      icon: Settings,
      category: "OPERATIONS",
    },
  ];

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

function categoryClasses(
  category:
    OverviewLink["category"]
): string {
  if (
    category === "PORTFOLIO"
  ) {
    return "border-cyan-400/20 bg-cyan-400/10 text-cyan-200";
  }

  if (
    category === "INCOME"
  ) {
    return "border-emerald-400/20 bg-emerald-400/10 text-emerald-200";
  }

  if (
    category === "ANALYTICS"
  ) {
    return "border-violet-400/20 bg-violet-400/10 text-violet-200";
  }

  if (
    category === "PLANNING"
  ) {
    return "border-amber-400/20 bg-amber-400/10 text-amber-200";
  }

  return "border-slate-700 bg-slate-800/70 text-slate-300";
}

export function ProfessionalDashboardOverview({
  holdings = [],
}: ProfessionalDashboardOverviewProps) {
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
          right.portfolioWeight -
          left.portfolioWeight
      )
      .slice(
        0,
        5
      );

  const topSectors =
    portfolio.sectors.slice(
      0,
      5
    );

  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-3xl border border-slate-800 bg-[#06131f] shadow-[0_24px_80px_rgba(0,0,0,0.28)]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.14),transparent_38%),radial-gradient(circle_at_top_right,rgba(139,92,246,0.12),transparent_34%)]" />

        <div className="relative p-5 sm:p-7">
          <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
            <div className="max-w-3xl">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-cyan-200">
                  <Sparkles className="h-3.5 w-3.5" />

                  Portfolio Command Centre
                </span>

                <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-[11px] font-semibold text-emerald-200">
                  <CheckCircle2 className="h-3.5 w-3.5" />

                  Overview active
                </span>
              </div>

              <h1 className="mt-5 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                Your entire investment platform,
                <span className="block bg-gradient-to-r from-cyan-300 via-sky-300 to-violet-300 bg-clip-text text-transparent">
                  visible from one professional dashboard.
                </span>
              </h1>

              <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-400 sm:text-base">
                Review portfolio performance, holdings, income, allocation,
                risk, goals and operational health. Select any overview card to
                open the full professional workspace.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href="/holdings"
                  className="inline-flex items-center gap-2 rounded-xl bg-cyan-400 px-4 py-2.5 text-sm font-bold text-slate-950 transition hover:bg-cyan-300"
                >
                  Open Holdings

                  <ArrowRight className="h-4 w-4" />
                </Link>

                <Link
                  href="/transactions"
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900/70 px-4 py-2.5 text-sm font-semibold text-slate-200 transition hover:border-slate-600 hover:bg-slate-800"
                >
                  Add Transaction

                  <ReceiptText className="h-4 w-4" />
                </Link>

                <Link
                  href="/analytics"
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900/70 px-4 py-2.5 text-sm font-semibold text-slate-200 transition hover:border-slate-600 hover:bg-slate-800"
                >
                  View Analytics

                  <LineChart className="h-4 w-4" />
                </Link>
              </div>
            </div>

            <div className="grid min-w-0 gap-3 sm:grid-cols-2 xl:w-[420px]">
              <div className="rounded-2xl border border-cyan-400/20 bg-cyan-400/5 p-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-400">
                    Portfolio value
                  </span>

                  <WalletCards className="h-4 w-4 text-cyan-300" />
                </div>

                <p className="mt-3 text-2xl font-semibold text-white">
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
                  )}{" "}
                  all time
                </p>
              </div>

              <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/5 p-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-400">
                    Annual income
                  </span>

                  <Coins className="h-4 w-4 text-emerald-300" />
                </div>

                <p className="mt-3 text-2xl font-semibold text-white">
                  {money(
                    totals.annualDividendIncome
                  )}
                </p>

                <p className="mt-1 text-xs font-semibold text-emerald-300">
                  {percent(
                    totals.dividendYield
                  )}{" "}
                  portfolio yield
                </p>
              </div>

              <div className="rounded-2xl border border-violet-400/20 bg-violet-400/5 p-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-400">
                    Open holdings
                  </span>

                  <BriefcaseBusiness className="h-4 w-4 text-violet-300" />
                </div>

                <p className="mt-3 text-2xl font-semibold text-white">
                  {totals.holdingCount}
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  Across{" "}
                  {totals.sectorCount} sectors
                </p>
              </div>

              <div className="rounded-2xl border border-amber-400/20 bg-amber-400/5 p-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-400">
                    Pricing coverage
                  </span>

                  <ShieldCheck className="h-4 w-4 text-amber-300" />
                </div>

                <p className="mt-3 text-2xl font-semibold text-white">
                  {totals.pricingCoverage.toFixed(
                    0
                  )}
                  %
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  {totals.pricedHoldingCount} priced positions
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-slate-800 bg-[#071522] p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">
              Unrealised gain/loss
            </span>

            {totals.gainLoss >=
            0 ? (
              <TrendingUp className="h-4 w-4 text-emerald-300" />
            ) : (
              <TrendingDown className="h-4 w-4 text-rose-300" />
            )}
          </div>

          <p
            className={[
              "mt-3",
              "text-2xl",
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

        <div className="rounded-2xl border border-slate-800 bg-[#071522] p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">
              Monthly income
            </span>

            <CalendarDays className="h-4 w-4 text-emerald-300" />
          </div>

          <p className="mt-3 text-2xl font-semibold text-white">
            {money(
              totals.monthlyDividendIncome
            )}
          </p>

          <p className="mt-1 text-xs text-slate-500">
            Forward monthly average
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-[#071522] p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">
              Top-five concentration
            </span>

            <Gauge className="h-4 w-4 text-amber-300" />
          </div>

          <p className="mt-3 text-2xl font-semibold text-white">
            {totals.topFiveWeight.toFixed(
              1
            )}
            %
          </p>

          <p className="mt-1 text-xs text-slate-500">
            Largest holding{" "}
            {totals.topHoldingWeight.toFixed(
              1
            )}
            %
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-[#071522] p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">
              Portfolio breadth
            </span>

            <Layers3 className="h-4 w-4 text-violet-300" />
          </div>

          <p className="mt-3 text-2xl font-semibold text-white">
            {totals.countryCount}
          </p>

          <p className="mt-1 text-xs text-slate-500">
            Countries ·{" "}
            {totals.sectorCount} sectors
          </p>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.2fr_1fr]">
        <div className="rounded-2xl border border-slate-800 bg-[#071522] p-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-white">
                Largest holdings
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                Portfolio concentration by current market value
              </p>
            </div>

            <Link
              href="/holdings"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-300 transition hover:text-cyan-200"
            >
              Open holdings

              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="mt-5 space-y-4">
            {topHoldings.map(
              (
                holding,
                index
              ) => (
                <div
                  key={holding.symbol}
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex min-w-0 items-center gap-3">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-slate-700 bg-slate-900 text-xs font-bold text-slate-400">
                        {index + 1}
                      </span>

                      <div className="min-w-0">
                        <p className="font-semibold text-white">
                          {holding.symbol}
                        </p>

                        <p className="truncate text-xs text-slate-500">
                          {holding.name}
                        </p>
                      </div>
                    </div>

                    <div className="shrink-0 text-right">
                      <p className="font-semibold text-white">
                        {holding.portfolioWeight.toFixed(
                          2
                        )}
                        %
                      </p>

                      <p className="text-[11px] text-slate-500">
                        {money(
                          holding.marketValue,
                          holding.currency
                        )}
                      </p>
                    </div>
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
              <div className="rounded-xl border border-dashed border-slate-700 p-6 text-center">
                <BriefcaseBusiness className="mx-auto h-7 w-7 text-slate-600" />

                <p className="mt-2 text-sm font-medium text-slate-300">
                  No holdings available
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  Add transactions to begin building the portfolio overview.
                </p>
              </div>
            ) : null}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-[#071522] p-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-white">
                Sector allocation
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                Current portfolio exposure
              </p>
            </div>

            <Link
              href="/portfolio-allocation"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-violet-300 transition hover:text-violet-200"
            >
              Full allocation

              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="mt-5 space-y-4">
            {topSectors.map(
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

                  <div className="mt-1.5 flex items-center justify-between text-[10px] text-slate-600">
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

            {topSectors.length ===
            0 ? (
              <p className="text-sm text-slate-500">
                Sector allocation will appear when holdings are available.
              </p>
            ) : null}
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-800 bg-[#071522] p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-violet-300">
              Platform Overview
            </p>

            <h2 className="mt-2 text-xl font-semibold text-white">
              Explore every professional workspace
            </h2>

            <p className="mt-1 text-sm text-slate-400">
              Each dashboard card gives a high-level overview and opens the
              detailed page directly.
            </p>
          </div>

          <span className="inline-flex items-center gap-2 text-xs text-slate-500">
            <ListChecks className="h-4 w-4" />

            {overviewLinks.length} connected workspaces
          </span>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {overviewLinks.map(
            (
              item
            ) => {
              const Icon =
                item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group rounded-2xl border border-slate-800 bg-slate-950/40 p-4 transition duration-200 hover:-translate-y-0.5 hover:border-slate-700 hover:bg-slate-900/65"
                >
                  <div className="flex items-start justify-between gap-3">
                    <span
                      className={[
                        "inline-flex",
                        "h-10",
                        "w-10",
                        "items-center",
                        "justify-center",
                        "rounded-xl",
                        "border",
                        categoryClasses(
                          item.category
                        ),
                      ].join(" ")}
                    >
                      <Icon className="h-5 w-5" />
                    </span>

                    <ArrowRight className="h-4 w-4 text-slate-600 transition group-hover:translate-x-0.5 group-hover:text-cyan-300" />
                  </div>

                  <h3 className="mt-4 font-semibold text-white">
                    {item.title}
                  </h3>

                  <p className="mt-2 min-h-[48px] text-xs leading-5 text-slate-500">
                    {item.description}
                  </p>

                  <div className="mt-4 flex items-center justify-between border-t border-slate-800 pt-3">
                    <span
                      className={[
                        "rounded-full",
                        "border",
                        "px-2",
                        "py-0.5",
                        "text-[9px]",
                        "font-semibold",
                        "uppercase",
                        "tracking-wider",
                        categoryClasses(
                          item.category
                        ),
                      ].join(" ")}
                    >
                      {item.category}
                    </span>

                    <span className="text-[11px] font-semibold text-slate-500 transition group-hover:text-cyan-300">
                      Open workspace
                    </span>
                  </div>
                </Link>
              );
            }
          )}
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <Link
          href="/watchlist"
          className="group rounded-2xl border border-slate-800 bg-gradient-to-br from-violet-500/10 to-transparent p-5 transition hover:border-violet-400/30"
        >
          <Bell className="h-5 w-5 text-violet-300" />

          <h3 className="mt-4 font-semibold text-white">
            Review opportunities
          </h3>

          <p className="mt-2 text-xs leading-5 text-slate-500">
            Check watchlist targets, live movement and investment themes.
          </p>

          <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-violet-300">
            Open Watchlist

            <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
          </span>
        </Link>

        <Link
          href="/portfolio-health"
          className="group rounded-2xl border border-slate-800 bg-gradient-to-br from-emerald-500/10 to-transparent p-5 transition hover:border-emerald-400/30"
        >
          <ShieldCheck className="h-5 w-5 text-emerald-300" />

          <h3 className="mt-4 font-semibold text-white">
            Review portfolio health
          </h3>

          <p className="mt-2 text-xs leading-5 text-slate-500">
            Review concentration, diversification and portfolio quality.
          </p>

          <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-300">
            Open Health Centre

            <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
          </span>
        </Link>

        <Link
          href="/goals"
          className="group rounded-2xl border border-slate-800 bg-gradient-to-br from-amber-500/10 to-transparent p-5 transition hover:border-amber-400/30"
        >
          <Goal className="h-5 w-5 text-amber-300" />

          <h3 className="mt-4 font-semibold text-white">
            Track your objectives
          </h3>

          <p className="mt-2 text-xs leading-5 text-slate-500">
            Monitor portfolio-value and passive-income progress.
          </p>

          <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-amber-300">
            Open Goals

            <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
          </span>
        </Link>
      </section>
    </div>
  );
}
