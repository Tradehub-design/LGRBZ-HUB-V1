import type {
  ValidationIssue,
} from "../contracts";

import type {
  PortfolioTaxSnapshot,
} from "./contracts";

import {
  approximatelyEqual,
  roundMoney,
  sumFinite,
} from "../money";

export type PortfolioTaxReconciliation = {
  valid: boolean;

  issues:
    ValidationIssue[];

  rowRealisedGainAud: number;
  totalRealisedGainAud: number;

  rowDividendIncomeAud: number;
  totalDividendIncomeAud: number;

  rowInterestIncomeAud: number;
  totalInterestIncomeAud: number;

  rowFeesAud: number;
  totalFeesAud: number;

  rowRecordedTaxAud: number;
  totalRecordedTaxAud: number;

  calculatedGrossAssessableIncomeAud: number;
  totalGrossAssessableIncomeAud: number;
};

function issue(
  message: string,
  field: string,
  suppliedValue: unknown,
): ValidationIssue {
  return {
    code:
      "INCONSISTENT_AMOUNT",

    severity:
      "error",

    message,

    field,

    suppliedValue,
  };
}

export function reconcilePortfolioTax(
  tax:
    PortfolioTaxSnapshot,
  tolerance =
    0.02,
): PortfolioTaxReconciliation {
  const issues:
    ValidationIssue[] = [];

  const rowRealisedGainAud =
    sumFinite(
      tax.rows.map(
        (row) =>
          row.realisedGainAud,
      ),
    );

  const rowDividendIncomeAud =
    sumFinite(
      tax.rows.map(
        (row) =>
          row.dividendIncomeAud,
      ),
    );

  const rowInterestIncomeAud =
    sumFinite(
      tax.rows.map(
        (row) =>
          row.interestIncomeAud,
      ),
    );

  const rowFeesAud =
    sumFinite(
      tax.rows.map(
        (row) =>
          row.feesAud,
      ),
    );

  const rowRecordedTaxAud =
    sumFinite(
      tax.rows.map(
        (row) =>
          row.taxAud,
      ),
    );

  const calculatedGrossAssessableIncomeAud =
    roundMoney(
      tax.totals
        .netRealisedCapitalGainAud +
      tax.totals
        .dividendIncomeAud +
      tax.totals
        .interestIncomeAud +
      tax.totals
        .frankingCreditsAud,
    );

  for (
    const [
      label,
      rows,
      total,
      field,
    ] of [
      [
        "Realised gain",
        rowRealisedGainAud,
        tax.totals
          .netRealisedCapitalGainAud,
        "totals.netRealisedCapitalGainAud",
      ],

      [
        "Dividend income",
        rowDividendIncomeAud,
        tax.totals
          .dividendIncomeAud,
        "totals.dividendIncomeAud",
      ],

      [
        "Interest income",
        rowInterestIncomeAud,
        tax.totals
          .interestIncomeAud,
        "totals.interestIncomeAud",
      ],

      [
        "Transaction fees",
        rowFeesAud,
        tax.totals
          .transactionFeesAud,
        "totals.transactionFeesAud",
      ],

      [
        "Recorded tax",
        rowRecordedTaxAud,
        tax.totals
          .recordedTaxAud,
        "totals.recordedTaxAud",
      ],
    ] as const
  ) {
    if (
      !approximatelyEqual(
        rows,
        total,
        tolerance,
      )
    ) {
      issues.push(
        issue(
          `${label} rows do not reconcile with the Tax Snapshot total.`,
          field,
          {
            rows,
            total,
          },
        ),
      );
    }
  }

  if (
    !approximatelyEqual(
      calculatedGrossAssessableIncomeAud,
      tax.totals
        .grossAssessableIncomeAud,
      tolerance,
    )
  ) {
    issues.push(
      issue(
        "Gross assessable income does not reconcile with capital gains, dividends, interest and franking credits.",
        "totals.grossAssessableIncomeAud",
        {
          calculated:
            calculatedGrossAssessableIncomeAud,

          total:
            tax.totals
              .grossAssessableIncomeAud,
        },
      ),
    );
  }

  return {
    valid:
      issues.length ===
        0 &&
      tax.dataQuality.valid,

    issues: [
      ...tax.dataQuality
        .issues.filter(
          (entry) =>
            entry.severity ===
            "error",
        ),

      ...issues,
    ],

    rowRealisedGainAud,

    totalRealisedGainAud:
      tax.totals
        .netRealisedCapitalGainAud,

    rowDividendIncomeAud,

    totalDividendIncomeAud:
      tax.totals
        .dividendIncomeAud,

    rowInterestIncomeAud,

    totalInterestIncomeAud:
      tax.totals
        .interestIncomeAud,

    rowFeesAud,

    totalFeesAud:
      tax.totals
        .transactionFeesAud,

    rowRecordedTaxAud,

    totalRecordedTaxAud:
      tax.totals
        .recordedTaxAud,

    calculatedGrossAssessableIncomeAud,

    totalGrossAssessableIncomeAud:
      tax.totals
        .grossAssessableIncomeAud,
  };
}
