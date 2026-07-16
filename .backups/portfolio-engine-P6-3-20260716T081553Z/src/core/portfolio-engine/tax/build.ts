import type {
  PortfolioTransaction,
} from "../contracts";

import type {
  PortfolioTaxBuildInput,
  PortfolioTaxSnapshot,
  TaxFinancialYear,
  TaxTransactionRow,
} from "./contracts";

import {
  roundMoney,
  sumFinite,
} from "../money";

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

function finiteValue(
  value: unknown,
): number {
  const parsed =
    Number(value);

  return Number.isFinite(parsed)
    ? parsed
    : 0;
}

function transactionAmountAud(
  transaction:
    PortfolioTransaction,
): number {
  const amounts =
    transaction.amounts as unknown as
      Record<string, unknown>;

  const direct =
    finiteValue(
      amounts.netAmountAud ??
      amounts.grossAmountAud,
    );

  if (direct !== 0) {
    return roundMoney(direct);
  }

  const local =
    finiteValue(
      amounts.netAmount ??
      amounts.grossAmount,
    );

  const fxRate =
    finiteValue(
      amounts.fxRateToAud,
    ) ||
    finiteValue(
      (
        transaction as unknown as
          Record<string, unknown>
      ).fxRateToAud,
    ) ||
    1;

  return roundMoney(
    local *
    fxRate,
  );
}

function transactionFeesAud(
  transaction:
    PortfolioTransaction,
): number {
  const fees =
    finiteValue(
      transaction.amounts.fees,
    );

  const fxRate =
    finiteValue(
      (
        transaction.amounts as unknown as
          Record<string, unknown>
      ).fxRateToAud,
    ) ||
    1;

  return roundMoney(
    fees *
    fxRate,
  );
}

function transactionTaxAud(
  transaction:
    PortfolioTransaction,
): number {
  const amounts =
    transaction.amounts as unknown as
      Record<string, unknown>;

  return roundMoney(
    finiteValue(
      amounts.taxAud ??
      amounts.tax ??
      amounts.withholdingTaxAud,
    ),
  );
}

function transactionRow(
  transaction:
    PortfolioTransaction,
): TaxTransactionRow {
  const amountAud =
    transactionAmountAud(
      transaction,
    );

  const security =
    transaction.security;

  return {
    transactionId:
      transaction.id,

    date:
      transaction.tradeDate,

    action:
      transaction.action,

    ticker:
      security?.ticker ??
      null,

    description:
      transaction.notes ||
      transaction.action,

    grossAmountAud:
      amountAud,

    feesAud:
      transactionFeesAud(
        transaction,
      ),

    taxAud:
      transactionTaxAud(
        transaction,
      ),

    realisedGainAud:
      transaction.action ===
      "SELL"
        ? finiteValue(
            (
              transaction as unknown as
                Record<string, unknown>
            ).realisedGainAud,
          )
        : 0,

    dividendIncomeAud:
      transaction.action ===
      "DIVIDEND"
        ? amountAud
        : 0,

    interestIncomeAud:
      transaction.action ===
      "INTEREST"
        ? amountAud
        : 0,

    frankingCreditAud:
      finiteValue(
        (
          transaction as unknown as
            Record<string, unknown>
        ).frankingCreditAud,
      ),

    withholdingTaxAud:
      finiteValue(
        (
          transaction as unknown as
            Record<string, unknown>
        ).withholdingTaxAud,
      ),
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

  const rows =
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

  const frankingCreditsAud =
    sumFinite(
      rows.map(
        (row) =>
          row.frankingCreditAud,
      ),
    ) ||
    input.dashboard.dividends
      .totals
      .projectedFrankingCreditsAud;

  const withholdingTaxAud =
    sumFinite(
      rows.map(
        (row) =>
          row.withholdingTaxAud,
      ),
    ) ||
    input.dashboard.dividends
      .totals
      .estimatedWithholdingTaxAud;

  return {
    generatedAt:
      now,

    portfolioSnapshotId:
      input.dashboard
        .portfolioSnapshotId,

    dividendSnapshotId:
      input.dashboard
        .dividendSnapshotId,

    financialYear,

    rows,

    totals: {
      realisedCapitalGainAud,

      realisedCapitalLossAud,

      netRealisedCapitalGainAud:
        roundMoney(
          realisedCapitalGainAud +
          realisedCapitalLossAud,
        ),

      dividendIncomeAud,

      interestIncomeAud,

      frankingCreditsAud,

      withholdingTaxAud,

      transactionFeesAud:
        sumFinite(
          rows.map(
            (row) =>
              row.feesAud,
          ),
        ),

      recordedTaxAud:
        sumFinite(
          rows.map(
            (row) =>
              row.taxAud,
          ),
        ),

      grossTaxableIncomeAud:
        roundMoney(
          realisedCapitalGainAud +
          realisedCapitalLossAud +
          dividendIncomeAud +
          interestIncomeAud +
          frankingCreditsAud,
        ),
    },

    dashboard:
      input.dashboard,
  };
}
