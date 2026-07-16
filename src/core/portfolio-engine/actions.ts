import type { TransactionAction } from "./contracts";
import { TRANSACTION_ACTIONS } from "./contracts";

const ACTION_ALIASES: Readonly<Record<string, TransactionAction>> = {
  BUY: "BUY",
  BOUGHT: "BUY",
  PURCHASE: "BUY",
  PURCHASED: "BUY",
  B: "BUY",

  SELL: "SELL",
  SOLD: "SELL",
  SALE: "SELL",
  S: "SELL",

  DIVIDEND: "DIVIDEND",
  DIVIDENDS: "DIVIDEND",
  DIV: "DIVIDEND",
  DISTRIBUTION: "DIVIDEND",
  DISTRIBUTIONS: "DIVIDEND",
  CASH_DIVIDEND: "DIVIDEND",
  CASH_DISTRIBUTION: "DIVIDEND",

  DIVIDEND_REINVESTMENT: "DIVIDEND_REINVESTMENT",
  DIVIDEND_REINVEST: "DIVIDEND_REINVESTMENT",
  REINVESTMENT: "DIVIDEND_REINVESTMENT",
  REINVESTED_DIVIDEND: "DIVIDEND_REINVESTMENT",
  DRP: "DIVIDEND_REINVESTMENT",
  DRIP: "DIVIDEND_REINVESTMENT",

  INTEREST: "INTEREST",
  INTEREST_INCOME: "INTEREST",
  CREDIT_INTEREST: "INTEREST",

  DEPOSIT: "DEPOSIT",
  CASH_DEPOSIT: "DEPOSIT",
  CONTRIBUTION: "DEPOSIT",
  FUNDING: "DEPOSIT",

  WITHDRAWAL: "WITHDRAWAL",
  WITHDRAW: "WITHDRAWAL",
  CASH_WITHDRAWAL: "WITHDRAWAL",

  FEE: "FEE",
  FEES: "FEE",
  BROKERAGE: "FEE",
  COMMISSION: "FEE",
  PLATFORM_FEE: "FEE",
  MANAGEMENT_FEE: "FEE",

  TAX: "TAX",
  TAX_PAYMENT: "TAX",
  WITHHOLDING_TAX: "TAX",

  TRANSFER_IN: "TRANSFER_IN",
  TRANSFERIN: "TRANSFER_IN",
  IN_SPECIE_TRANSFER_IN: "TRANSFER_IN",
  PORTFOLIO_TRANSFER_IN: "TRANSFER_IN",

  TRANSFER_OUT: "TRANSFER_OUT",
  TRANSFEROUT: "TRANSFER_OUT",
  IN_SPECIE_TRANSFER_OUT: "TRANSFER_OUT",
  PORTFOLIO_TRANSFER_OUT: "TRANSFER_OUT",

  SPLIT: "SPLIT",
  STOCK_SPLIT: "SPLIT",
  SHARE_SPLIT: "SPLIT",

  CONSOLIDATION: "CONSOLIDATION",
  REVERSE_SPLIT: "CONSOLIDATION",
  SHARE_CONSOLIDATION: "CONSOLIDATION",

  RETURN_OF_CAPITAL: "RETURN_OF_CAPITAL",
  CAPITAL_RETURN: "RETURN_OF_CAPITAL",
  ROC: "RETURN_OF_CAPITAL",

  ADJUSTMENT: "ADJUSTMENT",
  CASH_ADJUSTMENT: "ADJUSTMENT",
  BALANCE_ADJUSTMENT: "ADJUSTMENT",
};

function canonicaliseActionText(value: unknown): string {
  return String(value ?? "")
    .trim()
    .toUpperCase()
    .replace(/&/g, " AND ")
    .replace(/[./\\-]+/g, "_")
    .replace(/[()[\]{}]+/g, " ")
    .replace(/\s+/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_+|_+$/g, "");
}

export type ActionNormalisationResult =
  | {
      ok: true;
      action: TransactionAction;
      originalValue: unknown;
      canonicalValue: string;
    }
  | {
      ok: false;
      action: null;
      originalValue: unknown;
      canonicalValue: string;
      reason: string;
    };

export function normaliseTransactionAction(
  value: unknown,
): ActionNormalisationResult {
  const canonicalValue = canonicaliseActionText(value);

  if (!canonicalValue) {
    return {
      ok: false,
      action: null,
      originalValue: value,
      canonicalValue,
      reason: "Transaction action is empty.",
    };
  }

  const directMatch = ACTION_ALIASES[canonicalValue];

  if (directMatch) {
    return {
      ok: true,
      action: directMatch,
      originalValue: value,
      canonicalValue,
    };
  }

  if (
    (TRANSACTION_ACTIONS as readonly string[]).includes(canonicalValue)
  ) {
    return {
      ok: true,
      action: canonicalValue as TransactionAction,
      originalValue: value,
      canonicalValue,
    };
  }

  const words = new Set(canonicalValue.split("_").filter(Boolean));

  if (
    words.has("DIVIDEND") &&
    (words.has("REINVESTMENT") ||
      words.has("REINVESTED") ||
      words.has("DRP") ||
      words.has("DRIP"))
  ) {
    return {
      ok: true,
      action: "DIVIDEND_REINVESTMENT",
      originalValue: value,
      canonicalValue,
    };
  }

  if (
    words.has("RETURN") &&
    words.has("CAPITAL")
  ) {
    return {
      ok: true,
      action: "RETURN_OF_CAPITAL",
      originalValue: value,
      canonicalValue,
    };
  }

  if (
    words.has("TRANSFER") &&
    (words.has("IN") || words.has("INCOMING"))
  ) {
    return {
      ok: true,
      action: "TRANSFER_IN",
      originalValue: value,
      canonicalValue,
    };
  }

  if (
    words.has("TRANSFER") &&
    (words.has("OUT") || words.has("OUTGOING"))
  ) {
    return {
      ok: true,
      action: "TRANSFER_OUT",
      originalValue: value,
      canonicalValue,
    };
  }

  if (
    words.has("REVERSE") &&
    words.has("SPLIT")
  ) {
    return {
      ok: true,
      action: "CONSOLIDATION",
      originalValue: value,
      canonicalValue,
    };
  }

  if (
    words.has("SPLIT") &&
    (words.has("STOCK") || words.has("SHARE"))
  ) {
    return {
      ok: true,
      action: "SPLIT",
      originalValue: value,
      canonicalValue,
    };
  }

  if (
    words.has("WITHHOLDING") &&
    words.has("TAX")
  ) {
    return {
      ok: true,
      action: "TAX",
      originalValue: value,
      canonicalValue,
    };
  }

  if (
    words.has("DIVIDEND") ||
    words.has("DISTRIBUTION")
  ) {
    return {
      ok: true,
      action: "DIVIDEND",
      originalValue: value,
      canonicalValue,
    };
  }

  if (
    words.has("BUY") ||
    words.has("BOUGHT") ||
    words.has("PURCHASE")
  ) {
    return {
      ok: true,
      action: "BUY",
      originalValue: value,
      canonicalValue,
    };
  }

  if (
    words.has("SELL") ||
    words.has("SOLD") ||
    words.has("SALE")
  ) {
    return {
      ok: true,
      action: "SELL",
      originalValue: value,
      canonicalValue,
    };
  }

  if (words.has("INTEREST")) {
    return {
      ok: true,
      action: "INTEREST",
      originalValue: value,
      canonicalValue,
    };
  }

  if (
    words.has("DEPOSIT") ||
    words.has("CONTRIBUTION")
  ) {
    return {
      ok: true,
      action: "DEPOSIT",
      originalValue: value,
      canonicalValue,
    };
  }

  if (
    words.has("WITHDRAWAL") ||
    words.has("WITHDRAW")
  ) {
    return {
      ok: true,
      action: "WITHDRAWAL",
      originalValue: value,
      canonicalValue,
    };
  }

  if (
    words.has("FEE") ||
    words.has("FEES") ||
    words.has("BROKERAGE") ||
    words.has("COMMISSION")
  ) {
    return {
      ok: true,
      action: "FEE",
      originalValue: value,
      canonicalValue,
    };
  }

  return {
    ok: false,
    action: null,
    originalValue: value,
    canonicalValue,
    reason: `Unsupported transaction action: ${String(value ?? "")}`,
  };
}

export function requireTransactionAction(
  value: unknown,
): TransactionAction {
  const result = normaliseTransactionAction(value);

  if (!result.ok) {
    throw new Error(("reason" in result ? result.reason : "Normalisation failed."));
  }

  return result.action;
}

export function actionRequiresSecurity(
  action: TransactionAction,
): boolean {
  switch (action) {
    case "BUY":
    case "SELL":
    case "DIVIDEND":
    case "DIVIDEND_REINVESTMENT":
    case "TRANSFER_IN":
    case "TRANSFER_OUT":
    case "SPLIT":
    case "CONSOLIDATION":
    case "RETURN_OF_CAPITAL":
      return true;

    case "INTEREST":
    case "DEPOSIT":
    case "WITHDRAWAL":
    case "FEE":
    case "TAX":
    case "ADJUSTMENT":
      return false;
  }
}

export function actionRequiresQuantity(
  action: TransactionAction,
): boolean {
  switch (action) {
    case "BUY":
    case "SELL":
    case "DIVIDEND_REINVESTMENT":
    case "TRANSFER_IN":
    case "TRANSFER_OUT":
      return true;

    case "SPLIT":
    case "CONSOLIDATION":
      return false;

    case "DIVIDEND":
    case "INTEREST":
    case "DEPOSIT":
    case "WITHDRAWAL":
    case "FEE":
    case "TAX":
    case "RETURN_OF_CAPITAL":
    case "ADJUSTMENT":
      return false;
  }
}

export function actionRequiresUnitPrice(
  action: TransactionAction,
): boolean {
  return (
    action === "BUY" ||
    action === "SELL" ||
    action === "DIVIDEND_REINVESTMENT"
  );
}

export function actionAffectsPosition(
  action: TransactionAction,
): boolean {
  switch (action) {
    case "BUY":
    case "SELL":
    case "DIVIDEND_REINVESTMENT":
    case "TRANSFER_IN":
    case "TRANSFER_OUT":
    case "SPLIT":
    case "CONSOLIDATION":
    case "RETURN_OF_CAPITAL":
      return true;

    case "DIVIDEND":
    case "INTEREST":
    case "DEPOSIT":
    case "WITHDRAWAL":
    case "FEE":
    case "TAX":
    case "ADJUSTMENT":
      return false;
  }
}

export function actionCashDirection(
  action: TransactionAction,
): -1 | 0 | 1 {
  switch (action) {
    case "SELL":
    case "DIVIDEND":
    case "INTEREST":
    case "DEPOSIT":
    case "TRANSFER_IN":
    case "RETURN_OF_CAPITAL":
      return 1;

    case "BUY":
    case "DIVIDEND_REINVESTMENT":
    case "WITHDRAWAL":
    case "FEE":
    case "TAX":
    case "TRANSFER_OUT":
      return -1;

    case "SPLIT":
    case "CONSOLIDATION":
      return 0;

    case "ADJUSTMENT":
      return 0;
  }
}
