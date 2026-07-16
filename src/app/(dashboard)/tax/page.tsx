"use client";

import {
  AlertTriangle,
  CheckCircle2,
  Download,
  ReceiptText,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";

import {
  usePortfolioIntelligence,
} from "@/core/portfolio-engine/client/usePortfolioIntelligence";

import {
  selectPortfolioTax,
  selectPortfolioTaxReconciliation,
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

function dateLabel(
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

      timeZone:
        "UTC",
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
  tone = "neutral",
}: {
  label: string;
  value: string;
  detail: string;
  tone?:
    | "neutral"
    | "positive"
    | "negative";
}) {
  const valueClassName =
    tone === "positive"
      ? "text-emerald-300"
      : tone === "negative"
        ? "text-rose-300"
        : "text-white";

  return (
    <section className="rounded-2xl border border-cyan-500/20 bg-slate-950/70 p-5">
      <p className="text-xs uppercase tracking-[0.17em] text-cyan-300">
        {label}
      </p>

      <p
        className={`mt-3 text-2xl font-bold ${valueClassName}`}
      >
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

export default function TaxPage() {
  const {
    tax: taxSource,
    status,
    loading,
    refreshing,
    forceRefresh,
  } = usePortfolioIntelligence();

  const tax =
    selectPortfolioTax(
      taxSource,
    );

  const reconciliation =
    selectPortfolioTaxReconciliation(
      tax,
    );

  const busy =
    loading ||
    refreshing;

  async function refreshTax() {
    await forceRefresh();
  }

  function exportTaxCsv() {
    const header = [
      "Transaction ID",
      "Date",
      "Action",
      "Category",
      "Ticker",
      "Description",
      "Gross Amount AUD",
      "Fees AUD",
      "Recorded Tax AUD",
      "Realised Gain AUD",
      "Dividend Income AUD",
      "Interest Income AUD",
      "Franking Credit AUD",
      "Withholding Tax AUD",
      "Source",
    ];

    const rows =
      tax.rows.map(
        (row) => [
          row.transactionId,
          row.date,
          row.action,
          row.category,
          row.ticker,
          row.description,
          row.grossAmountAud,
          row.feesAud,
          row.taxAud,
          row.realisedGainAud,
          row.dividendIncomeAud,
          row.interestIncomeAud,
          row.frankingCreditAud,
          row.withholdingTaxAud,
          row.source,
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
      `lgrbz-tax-${tax.financialYear.label}.csv`,
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
            Tax Centre
          </h1>

          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">
            Financial-year transaction, disposal and income records derived
            from the canonical Portfolio Engine.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            disabled={busy}
            onClick={() => {
              void refreshTax();
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
              : "Refresh tax"}
          </button>

          <button
            type="button"
            onClick={exportTaxCsv}
            className="inline-flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-sm font-medium text-emerald-200 transition hover:bg-emerald-500/20"
          >
            <Download className="h-4 w-4" />
            Export CSV
          </button>
        </div>
      </header>

      <section
        className={
          reconciliation.valid &&
          status !== "ERROR"
            ? "rounded-2xl border border-emerald-500/25 bg-emerald-500/5 px-5 py-4"
            : "rounded-2xl border border-rose-500/25 bg-rose-500/5 px-5 py-4"
        }
      >
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            {reconciliation.valid ? (
              <CheckCircle2 className="mt-0.5 h-5 w-5 text-emerald-300" />
            ) : (
              <AlertTriangle className="mt-0.5 h-5 w-5 text-rose-300" />
            )}

            <div>
              <p className="text-sm font-medium text-white">
                {reconciliation.valid
                  ? "Tax rows reconcile with the Tax Snapshot."
                  : `${reconciliation.issues.length} tax reconciliation issue${
                      reconciliation.issues.length === 1
                        ? ""
                        : "s"
                    } detected.`}
              </p>

              <p className="mt-1 text-xs text-slate-400">
                {tax.financialYear.label}:{" "}
                {dateLabel(
                  tax.financialYear.startDate,
                )}{" "}
                to{" "}
                {dateLabel(
                  tax.financialYear.endDate,
                )}. Engine status: {status}.
              </p>
            </div>
          </div>

          <div className="text-right text-xs text-slate-500">
            <p>
              Transactions:{" "}
              {tax.dataQuality.transactionCount}
            </p>

            <p className="mt-1">
              Unresolved sells:{" "}
              {tax.dataQuality
                .unresolvedRealisedGainCount}
            </p>
          </div>
        </div>
      </section>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Net Realised Capital Gain"
          value={money(
            tax.totals
              .netRealisedCapitalGainAud,
          )}
          detail={`${money(
            tax.totals
              .realisedCapitalGainAud,
          )} gains · ${money(
            tax.totals
              .realisedCapitalLossAud,
          )} losses`}
          tone={
            tax.totals
              .netRealisedCapitalGainAud >=
            0
              ? "positive"
              : "negative"
          }
        />

        <MetricCard
          label="Dividend Income"
          value={money(
            tax.totals
              .dividendIncomeAud,
          )}
          detail={`${tax.dataQuality.dividendTransactionCount} posted dividend transactions`}
        />

        <MetricCard
          label="Interest Income"
          value={money(
            tax.totals
              .interestIncomeAud,
          )}
          detail={`${tax.dataQuality.interestTransactionCount} posted interest transactions`}
        />

        <MetricCard
          label="Gross Assessable Income"
          value={money(
            tax.totals
              .grossAssessableIncomeAud,
          )}
          detail="Capital gains + dividends + interest + franking credits"
        />
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Franking Credits"
          value={money(
            tax.totals
              .frankingCreditsAud,
          )}
          detail={
            tax.dataQuality
              .usedDividendEngineFrankingFallback
              ? "Dividend Engine estimate fallback"
              : "Posted transaction records"
          }
        />

        <MetricCard
          label="Foreign Withholding"
          value={money(
            tax.totals
              .withholdingTaxAud,
          )}
          detail={
            tax.dataQuality
              .usedDividendEngineWithholdingFallback
              ? "Dividend Engine estimate fallback"
              : "Posted transaction records"
          }
        />

        <MetricCard
          label="Transaction Fees"
          value={money(
            tax.totals
              .transactionFeesAud,
          )}
          detail="Fees recorded on financial-year transactions"
        />

        <MetricCard
          label="Recorded Tax"
          value={money(
            tax.totals
              .recordedTaxAud,
          )}
          detail="Tax amounts explicitly recorded in transactions"
        />
      </div>

      <Panel
        title="Financial-Year Tax Ledger"
        description="This table reports source amounts only. It does not estimate personal tax payable or apply CGT discounts."
      >
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="text-slate-400">
              <tr>
                <th className="px-3 py-2">
                  Date
                </th>

                <th className="px-3 py-2">
                  Transaction
                </th>

                <th className="px-3 py-2">
                  Category
                </th>

                <th className="px-3 py-2 text-right">
                  Gross Amount
                </th>

                <th className="px-3 py-2 text-right">
                  Realised Gain
                </th>

                <th className="px-3 py-2 text-right">
                  Dividend
                </th>

                <th className="px-3 py-2 text-right">
                  Interest
                </th>

                <th className="px-3 py-2 text-right">
                  Franking
                </th>

                <th className="px-3 py-2 text-right">
                  Withholding
                </th>

                <th className="px-3 py-2 text-right">
                  Fees
                </th>
              </tr>
            </thead>

            <tbody>
              {tax.rows.length === 0 ? (
                <tr>
                  <td
                    colSpan={10}
                    className="px-3 py-8 text-center text-slate-400"
                  >
                    No posted tax-relevant transactions exist in this
                    financial year.
                  </td>
                </tr>
              ) : (
                tax.rows.map(
                  (row) => (
                    <tr
                      key={row.transactionId}
                      className="border-t border-white/10 text-slate-200"
                    >
                      <td className="px-3 py-3">
                        {dateLabel(
                          row.date,
                        )}
                      </td>

                      <td className="px-3 py-3">
                        <p className="font-semibold text-white">
                          {row.ticker ??
                            row.action}
                        </p>

                        <p className="mt-0.5 text-[11px] text-slate-500">
                          {row.action} ·{" "}
                          {row.source}
                        </p>
                      </td>

                      <td className="px-3 py-3">
                        {row.category}
                      </td>

                      <td className="px-3 py-3 text-right">
                        {money(
                          row.grossAmountAud,
                        )}
                      </td>

                      <td
                        className={
                          row.realisedGainAud >=
                          0
                            ? "px-3 py-3 text-right text-emerald-300"
                            : "px-3 py-3 text-right text-rose-300"
                        }
                      >
                        {money(
                          row.realisedGainAud,
                        )}
                      </td>

                      <td className="px-3 py-3 text-right">
                        {money(
                          row.dividendIncomeAud,
                        )}
                      </td>

                      <td className="px-3 py-3 text-right">
                        {money(
                          row.interestIncomeAud,
                        )}
                      </td>

                      <td className="px-3 py-3 text-right">
                        {money(
                          row.frankingCreditAud,
                        )}
                      </td>

                      <td className="px-3 py-3 text-right">
                        {money(
                          row.withholdingTaxAud,
                        )}
                      </td>

                      <td className="px-3 py-3 text-right">
                        {money(
                          row.feesAud,
                        )}
                      </td>
                    </tr>
                  ),
                )
              )}
            </tbody>
          </table>
        </div>
      </Panel>

      {tax.dataQuality.issues.length > 0 ? (
        <Panel
          title="Tax Data Quality"
          description="Warnings identify missing transaction-level tax details or fallback data."
        >
          <div className="mt-4 space-y-2">
            {tax.dataQuality.issues.map(
              (
                item,
                index,
              ) => (
                <div
                  key={`${item.code}-${item.field}-${index}`}
                  className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3"
                >
                  <AlertTriangle
                    className={
                      item.severity ===
                      "error"
                        ? "mt-0.5 h-4 w-4 shrink-0 text-rose-300"
                        : "mt-0.5 h-4 w-4 shrink-0 text-amber-300"
                    }
                  />

                  <div>
                    <p className="text-sm text-slate-200">
                      {item.message}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      {item.field}
                    </p>
                  </div>
                </div>
              ),
            )}
          </div>
        </Panel>
      ) : null}

      <Panel
        title="Snapshot Lineage"
        description="Tax records are traceable to the active canonical snapshots."
      >
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {[
            [
              "Portfolio",
              tax.portfolioSnapshotId,
            ],

            [
              "Dashboard",
              tax.dashboardSnapshotId,
            ],

            [
              "Dividends",
              tax.dividendSnapshotId,
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
                <div className="flex items-center gap-2 text-cyan-300">
                  {label ===
                  "Portfolio" ? (
                    <ShieldCheck className="h-4 w-4" />
                  ) : (
                    <ReceiptText className="h-4 w-4" />
                  )}

                  <p className="text-xs text-slate-500">
                    {label}
                  </p>
                </div>

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
