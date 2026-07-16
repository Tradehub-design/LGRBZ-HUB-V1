"use client";

import React from "react";

import {
  Layers3,
  Map,
  PieChart,
  RefreshCw,
  ShieldAlert,
  WalletCards,
} from "lucide-react";

import {
  useUnifiedPortfolioDashboard,
} from "@/core/portfolio-engine/client/useUnifiedPortfolioDashboard";

import {
  selectDashboardAllocation,
  selectDashboardReconciliation,
} from "@/core/portfolio-engine/client/dashboard-selectors";

import type {
  AllocationDimension,
} from "@/core/portfolio-engine/contracts";

import type {
  DashboardAllocationRow,
} from "@/core/portfolio-engine/dashboard/contracts";

const DIMENSIONS: Array<{
  key: AllocationDimension;
  label: string;
}> = [
  {
    key:
      "security",

    label:
      "Security",
  },

  {
    key:
      "sector",

    label:
      "Sector",
  },

  {
    key:
      "industry",

    label:
      "Industry",
  },

  {
    key:
      "country",

    label:
      "Country",
  },

  {
    key:
      "currency",

    label:
      "Currency",
  },

  {
    key:
      "platform",

    label:
      "Platform",
  },

  {
    key:
      "account",

    label:
      "Account",
  },

  {
    key:
      "strategy",

    label:
      "Strategy",
  },

  {
    key:
      "assetClass",

    label:
      "Asset Class",
  },
];

function money(
  value: number,
): string {
  if (!Number.isFinite(value)) {
    return "—";
  }

  return new Intl.NumberFormat(
    "en-AU",
    {
      style: "currency",
      currency: "AUD",
      maximumFractionDigits: 2,
    },
  ).format(value);
}

function percent(
  value: number,
): string {
  if (!Number.isFinite(value)) {
    return "—";
  }

  return `${value.toFixed(2)}%`;
}

function MetricCard({
  icon,
  label,
  value,
  detail,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  detail: string;
}) {
  return (
    <section className="rounded-2xl border border-cyan-500/20 bg-slate-950/70 p-5">
      <div className="flex items-center gap-2 text-cyan-300">
        <span className="[&>svg]:h-4 [&>svg]:w-4">
          {icon}
        </span>

        <p className="text-xs uppercase tracking-[0.17em]">
          {label}
        </p>
      </div>

      <p className="mt-3 text-2xl font-bold text-white">
        {value}
      </p>

      <p className="mt-2 text-xs leading-5 text-slate-500">
        {detail}
      </p>
    </section>
  );
}

function AllocationTable({
  title,
  rows,
}: {
  title: string;
  rows: DashboardAllocationRow[];
}) {
  return (
    <section className="rounded-2xl border border-cyan-500/20 bg-slate-950/70 p-5">
      <div>
        <h2 className="text-lg font-semibold text-white">
          {title} Allocation
        </h2>

        <p className="mt-1 text-xs leading-5 text-slate-500">
          Market value, cost base and weight are supplied by the canonical
          allocation engine.
        </p>
      </div>

      <div className="mt-4 overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="text-slate-400">
            <tr>
              <th className="px-3 py-2">
                Allocation
              </th>

              <th className="px-3 py-2 text-right">
                Holdings
              </th>

              <th className="px-3 py-2 text-right">
                Market Value
              </th>

              <th className="px-3 py-2 text-right">
                Cost Base
              </th>

              <th className="px-3 py-2 text-right">
                Unrealised P/L
              </th>

              <th className="px-3 py-2 text-right">
                Realised P/L
              </th>

              <th className="px-3 py-2 text-right">
                Weight
              </th>
            </tr>
          </thead>

          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="px-3 py-8 text-center text-slate-400"
                >
                  No allocation records are available.
                </td>
              </tr>
            ) : (
              rows.map(
                (row) => (
                  <tr
                    key={`${row.dimension}-${row.key}`}
                    className="border-t border-white/10 text-slate-200"
                  >
                    <td className="px-3 py-3">
                      <p className="font-semibold text-white">
                        {row.label}
                      </p>

                      <div className="mt-2 h-1.5 w-40 max-w-full overflow-hidden rounded-full bg-white/5">
                        <div
                          className="h-full rounded-full bg-cyan-400"
                          style={{
                            width:
                              `${Math.min(
                                100,
                                Math.max(
                                  0,
                                  row.weightPercent,
                                ),
                              )}%`,
                          }}
                        />
                      </div>
                    </td>

                    <td className="px-3 py-3 text-right">
                      {row.holdingCount}
                    </td>

                    <td className="px-3 py-3 text-right font-medium text-white">
                      {money(
                        row.marketValueAud,
                      )}
                    </td>

                    <td className="px-3 py-3 text-right">
                      {money(
                        row.costBaseAud,
                      )}
                    </td>

                    <td
                      className={
                        row.unrealisedGainAud >= 0
                          ? "px-3 py-3 text-right text-emerald-300"
                          : "px-3 py-3 text-right text-rose-300"
                      }
                    >
                      {money(
                        row.unrealisedGainAud,
                      )}
                    </td>

                    <td
                      className={
                        row.realisedGainAud >= 0
                          ? "px-3 py-3 text-right text-emerald-300"
                          : "px-3 py-3 text-right text-rose-300"
                      }
                    >
                      {money(
                        row.realisedGainAud,
                      )}
                    </td>

                    <td className="px-3 py-3 text-right font-semibold text-cyan-200">
                      {percent(
                        row.weightPercent,
                      )}
                    </td>
                  </tr>
                ),
              )
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default function PortfolioAllocationPage() {
  const {
    dashboard,
    status,
    loading,
    refreshing,
    forceRefresh,
  } = useUnifiedPortfolioDashboard();

  const [
    selectedDimension,
    setSelectedDimension,
  ] = React.useState<AllocationDimension>(
    "sector",
  );

  const selectedRows =
    selectDashboardAllocation(
      dashboard,
      selectedDimension,
    );

  const securityRows =
    selectDashboardAllocation(
      dashboard,
      "security",
    );

  const sectorRows =
    selectDashboardAllocation(
      dashboard,
      "sector",
    );

  const countryRows =
    selectDashboardAllocation(
      dashboard,
      "country",
    );

  const platformRows =
    selectDashboardAllocation(
      dashboard,
      "platform",
    );

  const reconciliation =
    selectDashboardReconciliation(
      dashboard,
    );

  const largestHolding =
    securityRows[0] ??
    null;

  const largestSector =
    sectorRows[0] ??
    null;

  const largestCountry =
    countryRows[0] ??
    null;

  const largestPlatform =
    platformRows[0] ??
    null;

  const busy =
    loading ||
    refreshing;

  async function refreshAllocation() {
    await forceRefresh();
  }

  return (
    <main className="space-y-6 p-6">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-cyan-300">
            Exposure Engine
          </p>

          <h1 className="mt-2 text-3xl font-bold text-white">
            Portfolio Allocation
          </h1>

          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">
            Every allocation dimension is generated from canonical holding
            market values and portfolio weights.
          </p>
        </div>

        <button
          type="button"
          disabled={busy}
          onClick={() => {
            void refreshAllocation();
          }}
          className="inline-flex items-center gap-2 rounded-xl border border-cyan-500/30 bg-cyan-500/10 px-4 py-2 text-sm font-medium text-cyan-200 transition hover:bg-cyan-500/20 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <RefreshCw
            className={
              busy
                ? "h-4 w-4 animate-spin"
                : "h-4 w-4"
            }
          />

          {busy
            ? "Refreshing…"
            : "Refresh allocation"}
        </button>
      </header>

      <section
        className={
          reconciliation.valid &&
          status === "READY"
            ? "rounded-2xl border border-emerald-500/25 bg-emerald-500/5 px-5 py-4"
            : status === "ERROR"
              ? "rounded-2xl border border-rose-500/25 bg-rose-500/5 px-5 py-4"
              : "rounded-2xl border border-amber-500/25 bg-amber-500/5 px-5 py-4"
        }
      >
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-sm font-medium text-white">
              {reconciliation.valid
                ? "Allocation reconciles with canonical holdings."
                : `${reconciliation.issues.length} allocation reconciliation issue${
                    reconciliation.issues.length === 1
                      ? ""
                      : "s"
                  } detected.`}
            </p>

            <p className="mt-1 text-xs leading-5 text-slate-400">
              Security weight:{" "}
              {reconciliation.securityWeightPercent.toFixed(
                2,
              )}
              %. Sector weight:{" "}
              {reconciliation.sectorWeightPercent.toFixed(
                2,
              )}
              %. Market value:{" "}
              {money(
                dashboard.totals.securitiesMarketValueAud,
              )}.
            </p>
          </div>

          <p className="text-xs text-slate-500">
            Status: {status}
          </p>
        </div>
      </section>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          icon={<PieChart />}
          label="Largest Holding"
          value={
            largestHolding
              ? percent(
                  largestHolding.weightPercent,
                )
              : "—"
          }
          detail={
            largestHolding
              ? `${largestHolding.label} · ${money(
                  largestHolding.marketValueAud,
                )}`
              : "No holding exposure"
          }
        />

        <MetricCard
          icon={<Layers3 />}
          label="Largest Sector"
          value={
            largestSector
              ? percent(
                  largestSector.weightPercent,
                )
              : "—"
          }
          detail={
            largestSector
              ? `${largestSector.label} · ${largestSector.holdingCount} holdings`
              : "No sector exposure"
          }
        />

        <MetricCard
          icon={<Map />}
          label="Largest Country"
          value={
            largestCountry
              ? percent(
                  largestCountry.weightPercent,
                )
              : "—"
          }
          detail={
            largestCountry
              ? largestCountry.label
              : "No country exposure"
          }
        />

        <MetricCard
          icon={<WalletCards />}
          label="Largest Platform"
          value={
            largestPlatform
              ? percent(
                  largestPlatform.weightPercent,
                )
              : "—"
          }
          detail={
            largestPlatform
              ? largestPlatform.label
              : "No platform exposure"
          }
        />
      </div>

      <section className="rounded-2xl border border-cyan-500/20 bg-slate-950/70 p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-white">
              Allocation Dimension
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              Switch dimensions without recalculating portfolio data.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {DIMENSIONS.map(
              (dimension) => (
                <button
                  key={dimension.key}
                  type="button"
                  onClick={() => {
                    setSelectedDimension(
                      dimension.key,
                    );
                  }}
                  className={
                    selectedDimension ===
                    dimension.key
                      ? "rounded-lg border border-cyan-400/40 bg-cyan-400/15 px-3 py-1.5 text-xs font-medium text-cyan-200"
                      : "rounded-lg border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs text-slate-400 transition hover:border-white/20 hover:text-white"
                  }
                >
                  {dimension.label}
                </button>
              ),
            )}
          </div>
        </div>
      </section>

      <AllocationTable
        title={
          DIMENSIONS.find(
            (dimension) =>
              dimension.key ===
              selectedDimension,
          )?.label ??
          selectedDimension
        }
        rows={selectedRows}
      />

      <div className="grid gap-6 xl:grid-cols-2">
        <AllocationTable
          title="Sector"
          rows={
            sectorRows.slice(
              0,
              10,
            )
          }
        />

        <AllocationTable
          title="Country"
          rows={
            countryRows.slice(
              0,
              10,
            )
          }
        />
      </div>

      <section className="rounded-2xl border border-cyan-500/20 bg-slate-950/70 p-5">
        <div className="flex items-start gap-3">
          <ShieldAlert className="mt-0.5 h-5 w-5 text-amber-300" />

          <div>
            <h2 className="text-lg font-semibold text-white">
              Concentration Summary
            </h2>

            <p className="mt-1 text-xs leading-5 text-slate-500">
              These are descriptive concentration measurements generated from
              canonical weights. Investment limits and risk tolerances will be
              configured through Portfolio Health rather than calculated here.
            </p>
          </div>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {[
            {
              label:
                "Largest holding",

              value:
                dashboard.concentration
                  .largestHoldingWeightPercent,
            },

            {
              label:
                "Top five",

              value:
                dashboard.concentration
                  .topFiveWeightPercent,
            },

            {
              label:
                "Largest sector",

              value:
                dashboard.concentration
                  .largestSectorWeightPercent,
            },

            {
              label:
                "Largest country",

              value:
                dashboard.concentration
                  .largestCountryWeightPercent,
            },

            {
              label:
                "Largest platform",

              value:
                dashboard.concentration
                  .largestPlatformWeightPercent,
            },
          ].map(
            (item) => (
              <div
                key={item.label}
                className="rounded-xl border border-white/10 bg-white/[0.03] p-4"
              >
                <p className="text-xs text-slate-500">
                  {item.label}
                </p>

                <p className="mt-1 text-xl font-semibold text-white">
                  {percent(
                    item.value,
                  )}
                </p>
              </div>
            ),
          )}
        </div>
      </section>
    </main>
  );
}
