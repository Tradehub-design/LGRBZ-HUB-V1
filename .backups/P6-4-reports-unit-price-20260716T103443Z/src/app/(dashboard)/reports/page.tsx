"use client";

import {
  Download,
  FileJson,
  FileSpreadsheet,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";

import {
  usePortfolioIntelligence,
} from "@/core/portfolio-engine/client/usePortfolioIntelligence";

import {
  selectPortfolioReports,
} from "@/core/portfolio-engine/client/intelligence-selectors";

function money(
  value: number | null,
): string {
  if (
    value === null ||
    !Number.isFinite(value)
  ) {
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
  value: number | null,
): string {
  if (
    value === null ||
    !Number.isFinite(value)
  ) {
    return "—";
  }

  return `${value.toFixed(2)}%`;
}

function dateTimeLabel(
  value: string,
): string {
  const timestamp =
    Date.parse(value);

  if (!Number.isFinite(timestamp)) {
    return "—";
  }

  return new Intl.DateTimeFormat(
    "en-AU",
    {
      day:
        "2-digit",

      month:
        "short",

      year:
        "numeric",

      hour:
        "2-digit",

      minute:
        "2-digit",
    },
  ).format(
    new Date(timestamp),
  );
}

function escapeCsv(
  value:
    string |
    number |
    null,
): string {
  const text =
    value === null
      ? ""
      : String(value);

  return `"${text.replace(
    /"/g,
    '""',
  )}"`;
}

function downloadTextFile(
  filename:
    string,
  content:
    string,
  mimeType:
    string,
): void {
  const blob =
    new Blob(
      [
        content,
      ],
      {
        type:
          mimeType,
      },
    );

  const url =
    URL.createObjectURL(
      blob,
    );

  const anchor =
    document.createElement(
      "a",
    );

  anchor.href =
    url;

  anchor.download =
    filename;

  document.body.appendChild(
    anchor,
  );

  anchor.click();
  anchor.remove();

  URL.revokeObjectURL(
    url,
  );
}

function MetricCard({
  label,
  value,
  detail,
}: {
  label: string;
  value: string;
  detail: string;
}) {
  return (
    <section className="rounded-2xl border border-cyan-500/20 bg-slate-950/70 p-5">
      <p className="text-xs uppercase tracking-[0.17em] text-cyan-300">
        {label}
      </p>

      <p className="mt-3 text-2xl font-bold text-white">
        {value}
      </p>

      <p className="mt-2 text-xs leading-5 text-slate-500">
        {detail}
      </p>
    </section>
  );
}

function Panel({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-cyan-500/20 bg-slate-950/70 p-5">
      <h2 className="text-lg font-semibold text-white">
        {title}
      </h2>

      <p className="mt-1 text-xs leading-5 text-slate-500">
        {description}
      </p>

      {children}
    </section>
  );
}

export default function ReportsPage() {
  const {
    reports: reportSource,
    status,
    loading,
    refreshing,
    forceRefresh,
  } = usePortfolioIntelligence();

  const reports =
    selectPortfolioReports(
      reportSource,
    );

  const summary =
    reports.summary;

  const busy =
    loading ||
    refreshing;

  async function refreshReports() {
    await forceRefresh();
  }

  function exportJson() {
    downloadTextFile(
      `lgrbz-portfolio-report-${reports.generatedAt.slice(
        0,
        10,
      )}.json`,
      JSON.stringify(
        reports,
        null,
        2,
      ),
      "application/json;charset=utf-8",
    );
  }

  function exportHoldingsCsv() {
    const header = [
      "Ticker",
      "Name",
      "Sector",
      "Industry",
      "Country",
      "Strategy",
      "Market Value AUD",
      "Portfolio Weight %",
      "Realised Gain AUD",
      "Unrealised Gain AUD",
      "Income AUD",
      "Total Return AUD",
      "Total Return %",
    ];

    const rows =
      reports.analytics.holdings.map(
        (holding) => [
          holding.ticker,
          holding.name,
          holding.sector,
          holding.industry,
          holding.country,
          holding.strategy,
          holding.marketValueAud,
          holding.portfolioWeightPercent,
          holding.realisedGainAud,
          holding.unrealisedGainAud,
          holding.incomeAud,
          holding.totalReturnAud,
          holding.totalReturnPercent,
        ],
      );

    const csv =
      [
        header,
        ...rows,
      ]
        .map(
          (row) =>
            row
              .map(
                (
                  value,
                ) =>
                  escapeCsv(
                    value,
                  ),
              )
              .join(","),
        )
        .join("\n");

    downloadTextFile(
      `lgrbz-holdings-report-${reports.generatedAt.slice(
        0,
        10,
      )}.csv`,
      csv,
      "text/csv;charset=utf-8",
    );
  }

  function exportTransactionsCsv() {
    const header = [
      "Transaction ID",
      "Trade Date",
      "Action",
      "Ticker",
      "Quantity",
      "Price",
      "Fees",
      "Status",
    ];

    const rows =
      reports.analytics.dashboard
        .portfolio.transactions.map(
          (transaction) => [
            transaction.id,
            transaction.tradeDate,
            transaction.action,
            transaction.security?.ticker ??
              "",
            transaction.amounts.quantity,
            transaction.amounts.price,
            transaction.amounts.fees,
            transaction.status,
          ],
        );

    const csv =
      [
        header,
        ...rows,
      ]
        .map(
          (row) =>
            row
              .map(
                (
                  value,
                ) =>
                  escapeCsv(
                    value,
                  ),
              )
              .join(","),
        )
        .join("\n");

    downloadTextFile(
      `lgrbz-transactions-report-${reports.generatedAt.slice(
        0,
        10,
      )}.csv`,
      csv,
      "text/csv;charset=utf-8",
    );
  }

  return (
    <main className="space-y-6 p-6">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-cyan-300">
            Portfolio Intelligence
          </p>

          <h1 className="mt-2 text-3xl font-bold text-white">
            Reports
          </h1>

          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">
            Exportable portfolio, holdings, transaction, dividend and tax
            information generated from one canonical report snapshot.
          </p>
        </div>

        <button
          type="button"
          disabled={busy}
          onClick={() => {
            void refreshReports();
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
            : "Refresh reports"}
        </button>
      </header>

      <section
        className={
          status === "READY"
            ? "rounded-2xl border border-emerald-500/25 bg-emerald-500/5 px-5 py-4"
            : status === "ERROR"
              ? "rounded-2xl border border-rose-500/25 bg-rose-500/5 px-5 py-4"
              : "rounded-2xl border border-amber-500/25 bg-amber-500/5 px-5 py-4"
        }
      >
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <ShieldCheck className="mt-0.5 h-5 w-5 text-emerald-300" />

            <div>
              <p className="text-sm font-medium text-white">
                Report data is generated from the unified Portfolio Engine.
              </p>

              <p className="mt-1 text-xs text-slate-400">
                Status: {status}. Generated:{" "}
                {dateTimeLabel(
                  reports.generatedAt,
                )}.
              </p>
            </div>
          </div>

          <p className="text-xs text-slate-500">
            Analytics:{" "}
            {reports.analyticsSnapshotId}
          </p>
        </div>
      </section>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Portfolio Value"
          value={money(
            summary.portfolioValueAud,
          )}
          detail={`${money(
            summary.securitiesMarketValueAud,
          )} securities · ${money(
            summary.cashBalanceAud,
          )} cash`}
        />

        <MetricCard
          label="Total Return"
          value={`${money(
            summary.totalReturnAud,
          )} (${percent(
            summary.totalReturnPercent,
          )})`}
          detail={`${money(
            summary.realisedGainAud,
          )} realised · ${money(
            summary.unrealisedGainAud,
          )} unrealised`}
        />

        <MetricCard
          label="Forward Income"
          value={money(
            summary.forwardDividendIncomeAud,
          )}
          detail={`${percent(
            summary.dividendYieldPercent,
          )} portfolio dividend yield`}
        />

        <MetricCard
          label="Records"
          value={`${summary.holdingCount} / ${summary.transactionCount}`}
          detail="Open holdings / canonical transactions"
        />
      </div>

      <Panel
        title="Export Centre"
        description="Exports contain only data present in the active canonical snapshots."
      >
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <button
            type="button"
            onClick={exportJson}
            className="group rounded-xl border border-white/10 bg-white/[0.03] p-4 text-left transition hover:border-cyan-500/30 hover:bg-cyan-500/5"
          >
            <FileJson className="h-5 w-5 text-cyan-300" />

            <p className="mt-3 font-medium text-white">
              Complete JSON Report
            </p>

            <p className="mt-1 text-xs leading-5 text-slate-500">
              Dashboard, analytics, holdings, allocation, dividends and tax.
            </p>

            <span className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-cyan-300">
              <Download className="h-3.5 w-3.5" />
              Download JSON
            </span>
          </button>

          <button
            type="button"
            onClick={exportHoldingsCsv}
            className="group rounded-xl border border-white/10 bg-white/[0.03] p-4 text-left transition hover:border-cyan-500/30 hover:bg-cyan-500/5"
          >
            <FileSpreadsheet className="h-5 w-5 text-emerald-300" />

            <p className="mt-3 font-medium text-white">
              Holdings CSV
            </p>

            <p className="mt-1 text-xs leading-5 text-slate-500">
              Values, weights and return contribution for each open holding.
            </p>

            <span className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-emerald-300">
              <Download className="h-3.5 w-3.5" />
              Download CSV
            </span>
          </button>

          <button
            type="button"
            onClick={exportTransactionsCsv}
            className="group rounded-xl border border-white/10 bg-white/[0.03] p-4 text-left transition hover:border-cyan-500/30 hover:bg-cyan-500/5"
          >
            <FileSpreadsheet className="h-5 w-5 text-amber-300" />

            <p className="mt-3 font-medium text-white">
              Transactions CSV
            </p>

            <p className="mt-1 text-xs leading-5 text-slate-500">
              Posted and retained canonical transaction ledger records.
            </p>

            <span className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-amber-300">
              <Download className="h-3.5 w-3.5" />
              Download CSV
            </span>
          </button>
        </div>
      </Panel>

      <div className="grid gap-6 xl:grid-cols-2">
        <Panel
          title="Portfolio Summary"
          description="Canonical totals used by every report export."
        >
          <div className="mt-4 space-y-3">
            {[
              [
                "Securities Market Value",
                money(
                  summary.securitiesMarketValueAud,
                ),
              ],

              [
                "Open Cost Base",
                money(
                  summary.openCostBaseAud,
                ),
              ],

              [
                "Realised P/L",
                money(
                  summary.realisedGainAud,
                ),
              ],

              [
                "Unrealised P/L",
                money(
                  summary.unrealisedGainAud,
                ),
              ],

              [
                "Received Income",
                money(
                  summary.totalIncomeAud,
                ),
              ],

              [
                "Forward Dividend Income",
                money(
                  summary.forwardDividendIncomeAud,
                ),
              ],
            ].map(
              (
                [
                  label,
                  value,
                ],
              ) => (
                <div
                  key={label}
                  className="flex items-center justify-between gap-3 border-b border-white/10 pb-3 last:border-0 last:pb-0"
                >
                  <p className="text-sm text-slate-400">
                    {label}
                  </p>

                  <p className="text-sm font-semibold text-white">
                    {value}
                  </p>
                </div>
              ),
            )}
          </div>
        </Panel>

        <Panel
          title={`Tax Summary — ${reports.tax.financialYear.label}`}
          description="Current financial-year values derived from posted transactions."
        >
          <div className="mt-4 space-y-3">
            {[
              [
                "Net Realised Capital Gain",
                money(
                  reports.tax.totals
                    .netRealisedCapitalGainAud,
                ),
              ],

              [
                "Dividend Income",
                money(
                  reports.tax.totals
                    .dividendIncomeAud,
                ),
              ],

              [
                "Interest Income",
                money(
                  reports.tax.totals
                    .interestIncomeAud,
                ),
              ],

              [
                "Franking Credits",
                money(
                  reports.tax.totals
                    .frankingCreditsAud,
                ),
              ],

              [
                "Withholding Tax",
                money(
                  reports.tax.totals
                    .withholdingTaxAud,
                ),
              ],

              [
                "Transaction Fees",
                money(
                  reports.tax.totals
                    .transactionFeesAud,
                ),
              ],
            ].map(
              (
                [
                  label,
                  value,
                ],
              ) => (
                <div
                  key={label}
                  className="flex items-center justify-between gap-3 border-b border-white/10 pb-3 last:border-0 last:pb-0"
                >
                  <p className="text-sm text-slate-400">
                    {label}
                  </p>

                  <p className="text-sm font-semibold text-white">
                    {value}
                  </p>
                </div>
              ),
            )}
          </div>
        </Panel>
      </div>

      <Panel
        title="Report Lineage"
        description="Snapshot identifiers allow each report to be traced to its canonical source."
      >
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            [
              "Portfolio",
              reports.portfolioSnapshotId,
            ],

            [
              "Dashboard",
              reports.dashboardSnapshotId,
            ],

            [
              "Analytics",
              reports.analyticsSnapshotId,
            ],

            [
              "Dividends",
              reports.dividendSnapshotId,
            ],
          ].map(
            (
              [
                label,
                value,
              ],
            ) => (
              <div
                key={label}
                className="rounded-xl border border-white/10 bg-white/[0.03] p-4"
              >
                <p className="text-xs text-slate-500">
                  {label}
                </p>

                <p className="mt-2 break-all text-xs font-medium text-slate-200">
                  {value}
                </p>
              </div>
            ),
          )}
        </div>
      </Panel>
    </main>
  );
}
