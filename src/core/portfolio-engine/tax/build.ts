import type {
  PortfolioTransaction,
  ValidationIssue,
} from "../contracts";

import type {
  PortfolioTaxBuildInput,
  PortfolioTaxSnapshot,
  TaxFinancialYear,
  TaxTransactionCategory,
  TaxTransactionRow,
} from "./contracts";

import {
  approximatelyEqual,
  roundMoney,
  sumFinite,
} from "../money";

type UnknownRecord =
  Record<string, unknown>;

function issue(input: {
  severity?:
    ValidationIssue["severity"];

  message:
    string;

  field:
    string;

  suppliedValue?:
    unknown;
}): ValidationIssue {
  return {
    code:
      "INCONSISTENT_AMOUNT",

    severity:
      input.severity ??
      "warning",

    message:
      input.message,

    field:
      input.field,

    suppliedValue:
      input.suppliedValue,
  };
}

function financialYearForDate(
  value: string,
): TaxFinancialYear {
  const date =
    new Date(value);

  const year =
    date.getUTCFullYear();

  const month =
    date.getUTCMonth();

  const startYear =
    month >= 6
      ? year
      : year - 1;

  return {
    startDate:
      `${startYear}-07-01T00:00:00.000Z`,

    endDate:
      `${startYear + 1}-06-30T23:59:59.999Z`,

    label:
      `FY${String(
        startYear + 1,
      ).slice(-2)}`,
  };
}

function record(
  value: unknown,
): UnknownRecord {
  if (
    value &&
    typeof value ===
      "object"
  ) {
    return value as
      UnknownRecord;
  }

  return {};
}

function finiteNumber(
  value: unknown,
): number | null {
  const parsed =
    typeof value ===
    "number"
      ? value
      : Number(value);

  return Number.isFinite(parsed)
    ? parsed
    : null;
}

function firstFinite(
  value: unknown,
  keys: readonly string[],
): number | null {
  const source =
    record(value);

  for (const key of keys) {
    const parsed =
      finiteNumber(
        source[key],
      );

    if (parsed !== null) {
      return parsed;
    }
  }

  return null;
}

function transactionFxRate(
  transaction:
    PortfolioTransaction,
): number {
  return (
    firstFinite(
      transaction.amounts,
      [
        "fxRateToAud",
        "audFxRate",
      ],
    ) ??
    firstFinite(
      transaction,
      [
        "fxRateToAud",
        "audFxRate",
      ],
    ) ??
    1
  );
}

function localToAud(
  value: number,
  transaction:
    PortfolioTransaction,
): number {
  return roundMoney(
    value *
    transactionFxRate(
      transaction,
    ),
  );
}

function transactionGrossAmountAud(
  transaction:
    PortfolioTransaction,
): number {
  const direct =
    firstFinite(
      transaction.amounts,
      [
        "grossAmountAud",
        "netAmountAud",
        "amountAud",
      ],
    );

  if (direct !== null) {
    return roundMoney(
      direct,
    );
  }

  const local =
    firstFinite(
      transaction.amounts,
      [
        "grossAmount",
        "netAmount",
        "amount",
      ],
    );

  if (local !== null) {
    return localToAud(
      local,
      transaction,
    );
  }

  const quantity =
    firstFinite(
      transaction.amounts,
      [
        "quantity",
      ],
    ) ??
    0;

  const price =
    firstFinite(
      transaction.amounts,
      [
        "price",
      ],
    ) ??
    0;

  return localToAud(
    quantity *
    price,
    transaction,
  );
}

function transactionFeesAud(
  transaction:
    PortfolioTransaction,
): number {
  const direct =
    firstFinite(
      transaction.amounts,
      [
        "feesAud",
      ],
    );

  if (direct !== null) {
    return roundMoney(
      direct,
    );
  }

  const fees =
    firstFinite(
      transaction.amounts,
      [
        "fees",
        "commission",
        "brokerage",
      ],
    ) ??
    0;

  return localToAud(
    fees,
    transaction,
  );
}

function transactionTaxAud(
  transaction:
    PortfolioTransaction,
): number {
  const direct =
    firstFinite(
      transaction.amounts,
      [
        "taxAud",
        "withholdingTaxAud",
      ],
    );

  if (direct !== null) {
    return roundMoney(
      direct,
    );
  }

  const local =
    firstFinite(
      transaction.amounts,
      [
        "tax",
        "withholdingTax",
      ],
    ) ??
    0;

  return localToAud(
    local,
    transaction,
  );
}

function transactionRealisedGainAud(
  transaction:
    PortfolioTransaction,
): number | null {
  return (
    firstFinite(
      transaction,
      [
        "realisedGainAud",
        "realizedGainAud",
        "capitalGainAud",
      ],
    ) ??
    firstFinite(
      transaction.amounts,
      [
        "realisedGainAud",
        "realizedGainAud",
        "capitalGainAud",
      ],
    )
  );
}

function transactionFrankingCreditAud(
  transaction:
    PortfolioTransaction,
): number {
  return (
    firstFinite(
      transaction,
      [
        "frankingCreditAud",
      ],
    ) ??
    firstFinite(
      transaction.amounts,
      [
        "frankingCreditAud",
      ],
    ) ??
    0
  );
}

function transactionWithholdingTaxAud(
  transaction:
    PortfolioTransaction,
): number {
  return (
    firstFinite(
      transaction,
      [
        "withholdingTaxAud",
      ],
    ) ??
    firstFinite(
      transaction.amounts,
      [
        "withholdingTaxAud",
      ],
    ) ??
    transactionTaxAud(
      transaction,
    )
  );
}

function transactionCategory(input: {
  action:
    PortfolioTransaction["action"];

  realisedGainAud:
    number;

  grossAmountAud:
    number;
}): TaxTransactionCategory {
  switch (input.action) {
    case "SELL":
      return input.realisedGainAud <
        0
        ? "CAPITAL_LOSS"
        : "CAPITAL_GAIN";

    case "DIVIDEND":
      return "DIVIDEND";

    case "INTEREST":
      return "INTEREST";

    case "FEE":
      return "FEE";

    case "TAX":
      return "TAX";

    default:
      return "OTHER";
  }
}

function transactionDescription(
  transaction:
    PortfolioTransaction,
): string {
  const transactionRecord =
    record(transaction);

  const notes =
    transactionRecord.notes;

  if (
    typeof notes ===
      "string" &&
    notes.trim()
  ) {
    return notes.trim();
  }

  return transaction.action;
}

function transactionRow(
  transaction:
    PortfolioTransaction,
): {
  row: TaxTransactionRow;
  realisedGainResolved: boolean;
} {
  const grossAmountAud =
    transactionGrossAmountAud(
      transaction,
    );

  const realisedGain =
    transaction.action ===
      "SELL"
      ? transactionRealisedGainAud(
          transaction,
        )
      : 0;

  const realisedGainAud =
    realisedGain ??
    0;

  const category =
    transactionCategory({
      action:
        transaction.action,

      realisedGainAud,

      grossAmountAud,
    });

  const security =
    transaction.security;

  return {
    row: {
      transactionId:
        transaction.id,

      date:
        transaction.tradeDate,

      action:
        transaction.action,

      category,

      ticker:
        security?.ticker ??
        null,

      description:
        transactionDescription(
          transaction,
        ),

      grossAmountAud,

      feesAud:
        transactionFeesAud(
          transaction,
        ),

      taxAud:
        transactionTaxAud(
          transaction,
        ),

      realisedGainAud,

      dividendIncomeAud:
        transaction.action ===
        "DIVIDEND"
          ? grossAmountAud
          : 0,

      interestIncomeAud:
        transaction.action ===
        "INTEREST"
          ? grossAmountAud
          : 0,

      frankingCreditAud:
        transactionFrankingCreditAud(
          transaction,
        ),

      withholdingTaxAud:
        transaction.action ===
        "DIVIDEND"
          ? transactionWithholdingTaxAud(
              transaction,
            )
          : 0,

      source:
        transaction.action ===
        "SELL"
          ? "PORTFOLIO_REPLAY"
          : "TRANSACTION",
    },

    realisedGainResolved:
      transaction.action !==
        "SELL" ||
      realisedGain !==
        null,
  };
}

export function buildPortfolioTaxSnapshot(
  input:
    PortfolioTaxBuildInput,
): PortfolioTaxSnapshot {
  const now =
    input.now ??
    new Date().toISOString();

  const financialYear =
    financialYearForDate(
      now,
    );

  const start =
    Date.parse(
      financialYear.startDate,
    );

  const end =
    Date.parse(
      financialYear.endDate,
    );

  const transactionRows =
    input.dashboard.portfolio
      .transactions
      .filter(
        (transaction) => {
          if (
            transaction.status !==
            "posted"
          ) {
            return false;
          }

          const timestamp =
            Date.parse(
              transaction.tradeDate,
            );

          return (
            Number.isFinite(
              timestamp,
            ) &&
            timestamp >= start &&
            timestamp <= end
          );
        },
      )
      .map(
        transactionRow,
      );

  const rows =
    transactionRows
      .map(
        (entry) =>
          entry.row,
      )
      .sort(
        (left, right) =>
          Date.parse(
            right.date,
          ) -
          Date.parse(
            left.date,
          ),
      );

  const issues:
    ValidationIssue[] = [];

  const unresolvedRealisedGainCount =
    transactionRows.filter(
      (entry) =>
        !entry.realisedGainResolved,
    ).length;

  if (
    unresolvedRealisedGainCount >
    0
  ) {
    issues.push(
      issue({
        message:
          `${unresolvedRealisedGainCount} sell transaction${
            unresolvedRealisedGainCount ===
            1
              ? ""
              : "s"
          } do not expose a transaction-level realised gain. Portfolio-level realised P/L remains canonical, but the tax row cannot allocate that result to the individual disposal.`,

        field:
          "rows.realisedGainAud",

        suppliedValue:
          unresolvedRealisedGainCount,
      }),
    );
  }

  const realisedCapitalGainAud =
    sumFinite(
      rows
        .filter(
          (row) =>
            row.realisedGainAud >
            0,
        )
        .map(
          (row) =>
            row.realisedGainAud,
        ),
    );

  const realisedCapitalLossAud =
    sumFinite(
      rows
        .filter(
          (row) =>
            row.realisedGainAud <
            0,
        )
        .map(
          (row) =>
            row.realisedGainAud,
        ),
    );

  const netRealisedCapitalGainAud =
    roundMoney(
      realisedCapitalGainAud +
      realisedCapitalLossAud,
    );

  const dividendIncomeAud =
    sumFinite(
      rows.map(
        (row) =>
          row.dividendIncomeAud,
      ),
    );

  const interestIncomeAud =
    sumFinite(
      rows.map(
        (row) =>
          row.interestIncomeAud,
      ),
    );

  const transactionFrankingCreditsAud =
    sumFinite(
      rows.map(
        (row) =>
          row.frankingCreditAud,
      ),
    );

  const transactionWithholdingTaxAud =
    sumFinite(
      rows.map(
        (row) =>
          row.withholdingTaxAud,
      ),
    );

  const dividendEngineFrankingCreditsAud =
    input.dashboard.dividends
      .totals
      .projectedFrankingCreditsAud;

  const dividendEngineWithholdingTaxAud =
    input.dashboard.dividends
      .totals
      .estimatedWithholdingTaxAud;

  const usedDividendEngineFrankingFallback =
    transactionFrankingCreditsAud ===
      0 &&
    dividendEngineFrankingCreditsAud >
      0;

  const usedDividendEngineWithholdingFallback =
    transactionWithholdingTaxAud ===
      0 &&
    dividendEngineWithholdingTaxAud >
      0;

  const frankingCreditsAud =
    usedDividendEngineFrankingFallback
      ? dividendEngineFrankingCreditsAud
      : transactionFrankingCreditsAud;

  const withholdingTaxAud =
    usedDividendEngineWithholdingFallback
      ? dividendEngineWithholdingTaxAud
      : transactionWithholdingTaxAud;

  if (
    usedDividendEngineFrankingFallback
  ) {
    issues.push(
      issue({
        severity:
          "warning",

        message:
          "Transaction rows contain no historical franking credits, so the Tax Snapshot is displaying the Dividend Engine franking estimate as a fallback.",

        field:
          "totals.frankingCreditsAud",

        suppliedValue:
          frankingCreditsAud,
      }),
    );
  }

  if (
    usedDividendEngineWithholdingFallback
  ) {
    issues.push(
      issue({
        severity:
          "warning",

        message:
          "Transaction rows contain no historical foreign withholding tax, so the Tax Snapshot is displaying the Dividend Engine withholding estimate as a fallback.",

        field:
          "totals.withholdingTaxAud",

        suppliedValue:
          withholdingTaxAud,
      }),
    );
  }

  const transactionFeesAud =
    sumFinite(
      rows.map(
        (row) =>
          row.feesAud,
      ),
    );

  const recordedTaxAud =
    sumFinite(
      rows.map(
        (row) =>
          row.taxAud,
      ),
    );

  const grossAssessableIncomeAud =
    roundMoney(
      netRealisedCapitalGainAud +
      dividendIncomeAud +
      interestIncomeAud +
      frankingCreditsAud,
    );

  if (
    !approximatelyEqual(
      netRealisedCapitalGainAud,
      realisedCapitalGainAud +
        realisedCapitalLossAud,
      0.02,
    )
  ) {
    issues.push(
      issue({
        severity:
          "error",

        message:
          "Net realised capital gain does not reconcile with realised gains and losses.",

        field:
          "totals.netRealisedCapitalGainAud",

        suppliedValue: {
          gains:
            realisedCapitalGainAud,

          losses:
            realisedCapitalLossAud,

          net:
            netRealisedCapitalGainAud,
        },
      }),
    );
  }

  return {
    generatedAt:
      now,

    portfolioSnapshotId:
      input.dashboard
        .portfolioSnapshotId,

    dividendSnapshotId:
      input.dashboard
        .dividendSnapshotId,

    dashboardSnapshotId:
      input.dashboard
        .dashboardSnapshotId,

    financialYear,

    rows,

    totals: {
      realisedCapitalGainAud,

      realisedCapitalLossAud,

      netRealisedCapitalGainAud,

      dividendIncomeAud,

      interestIncomeAud,

      frankingCreditsAud,

      withholdingTaxAud,

      transactionFeesAud,

      recordedTaxAud,

      grossAssessableIncomeAud,
    },

    dataQuality: {
      valid:
        !issues.some(
          (entry) =>
            entry.severity ===
            "error",
        ),

      issues,

      transactionCount:
        rows.length,

      sellTransactionCount:
        rows.filter(
          (row) =>
            row.action ===
            "SELL",
        ).length,

      dividendTransactionCount:
        rows.filter(
          (row) =>
            row.action ===
            "DIVIDEND",
        ).length,

      interestTransactionCount:
        rows.filter(
          (row) =>
            row.action ===
            "INTEREST",
        ).length,

      unresolvedRealisedGainCount,

      usedDividendEngineFrankingFallback,

      usedDividendEngineWithholdingFallback,
    },

    dashboard:
      input.dashboard,
  };
}
