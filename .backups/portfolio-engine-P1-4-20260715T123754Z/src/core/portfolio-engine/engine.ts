import type {
  CostBasisMethod,
  PortfolioEngineBuildResult,
  PortfolioSnapshot,
  QuoteSnapshot,
  CurrencyCode,
  ValidationIssue,
} from "./contracts";

import type {
  RawPortfolioTransaction,
} from "./raw-transaction";

import {
  buildTransactionLedger,
  type BuildTransactionLedgerOptions,
} from "./ledger";

import {
  buildPortfolioSnapshot,
} from "./snapshot";

import {
  reconcilePortfolioSnapshot,
} from "./reconcile";

export type BuildPortfolioEngineFromRawInput = {
  rawTransactions:
    readonly RawPortfolioTransaction[];

  quotes?:
    Record<string, QuoteSnapshot>;

  fxRatesToAud?:
    Partial<Record<CurrencyCode, number>>;

  costBasisMethod?:
    CostBasisMethod;

  generatedAt?:
    string;

  ledgerOptions?:
    BuildTransactionLedgerOptions;
};

export type PortfolioEngineResult =
  PortfolioEngineBuildResult & {
    reconciliationIssues:
      ValidationIssue[];

    reconciled:
      boolean;
  };

export function buildPortfolioEngineFromRaw(
  input: BuildPortfolioEngineFromRawInput,
): PortfolioEngineResult {
  const generatedAt =
    input.generatedAt ??
    new Date().toISOString();

  const ledger =
    buildTransactionLedger(
      input.rawTransactions,
      {
        ...input.ledgerOptions,
        generatedAt,
      },
    );

  const snapshot =
    buildPortfolioSnapshot({
      transactions:
        ledger.transactions,

      quotes:
        input.quotes,

      fxRatesToAud:
        input.fxRatesToAud,

      costBasisMethod:
        input.costBasisMethod,

      generatedAt,
    });

  const reconciliation =
    reconcilePortfolioSnapshot(
      snapshot,
    );

  const issues = [
    ...ledger.issues,
    ...snapshot.dataQuality.issues,
    ...reconciliation.issues,
  ];

  return {
    snapshot,

    issues,

    reconciliationIssues:
      reconciliation.issues,

    reconciled:
      reconciliation.valid,
  };
}

export function buildPortfolioEngineFromCanonical(
  input: {
    transactions:
      PortfolioSnapshot["transactions"];

    quotes?:
      Record<string, QuoteSnapshot>;

    fxRatesToAud?:
      Partial<Record<CurrencyCode, number>>;

    costBasisMethod?:
      CostBasisMethod;

    generatedAt?:
      string;
  },
): PortfolioEngineResult {
  const snapshot =
    buildPortfolioSnapshot({
      transactions:
        input.transactions,

      quotes:
        input.quotes,

      fxRatesToAud:
        input.fxRatesToAud,

      costBasisMethod:
        input.costBasisMethod,

      generatedAt:
        input.generatedAt,
    });

  const reconciliation =
    reconcilePortfolioSnapshot(
      snapshot,
    );

  return {
    snapshot,

    issues: [
      ...snapshot.dataQuality.issues,
      ...reconciliation.issues,
    ],

    reconciliationIssues:
      reconciliation.issues,

    reconciled:
      reconciliation.valid,
  };
}

export class PortfolioEngine {
  buildFromRaw(
    input: BuildPortfolioEngineFromRawInput,
  ): PortfolioEngineResult {
    return buildPortfolioEngineFromRaw(
      input,
    );
  }

  buildFromCanonical(
    input: Parameters<
      typeof buildPortfolioEngineFromCanonical
    >[0],
  ): PortfolioEngineResult {
    return buildPortfolioEngineFromCanonical(
      input,
    );
  }
}

export const portfolioEngine =
  new PortfolioEngine();
