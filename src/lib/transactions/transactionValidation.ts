import {
  NormalisedTransaction,
  TransactionType,
} from "@/lib/transactions/professionalTransactions";

export type TransactionValidationField =
  | "date"
  | "symbol"
  | "type"
  | "quantity"
  | "price"
  | "fees"
  | "total"
  | "currency"
  | "broker"
  | "notes";

export type TransactionValidationErrors = Partial<
  Record<TransactionValidationField, string>
>;

export type TransactionValidationResult = {
  valid: boolean;
  errors: TransactionValidationErrors;
  warnings: string[];
};

const supportedTypes: TransactionType[] = [
  "BUY",
  "SELL",
  "DIVIDEND",
  "TRANSFER",
  "FEE",
  "OTHER",
];

function isFiniteNumber(value: unknown) {
  return (
    typeof value === "number" &&
    Number.isFinite(value)
  );
}

function isValidDateString(value: string) {
  if (!value.trim()) return false;

  const parsed = new Date(value);

  return !Number.isNaN(parsed.getTime());
}

function normaliseSymbol(value: string) {
  return value.trim().toUpperCase();
}

function normaliseCurrency(value?: string) {
  return (value ?? "AUD").trim().toUpperCase();
}

function validateRequiredNumber(
  value: number,
  label: string,
  minimum = 0
) {
  if (!isFiniteNumber(value)) {
    return `${label} must be a valid number.`;
  }

  if (value < minimum) {
    return `${label} cannot be less than ${minimum}.`;
  }

  return null;
}

export function validateTransaction(
  transaction: NormalisedTransaction
): TransactionValidationResult {
  const errors: TransactionValidationErrors = {};
  const warnings: string[] = [];

  if (!isValidDateString(transaction.date)) {
    errors.date = "Enter a valid transaction date.";
  }

  const symbol = normaliseSymbol(transaction.symbol);

  if (!symbol) {
    errors.symbol = "Symbol is required.";
  } else if (!/^[A-Z0-9.\-:_]{1,20}$/.test(symbol)) {
    errors.symbol =
      "Use letters, numbers, dots, dashes, colons or underscores only.";
  }

  if (!supportedTypes.includes(transaction.type)) {
    errors.type = "Select a supported transaction type.";
  }

  const quantityError = validateRequiredNumber(
    transaction.quantity,
    "Quantity",
    0
  );

  if (quantityError) {
    errors.quantity = quantityError;
  }

  const priceError = validateRequiredNumber(
    transaction.price,
    "Price",
    0
  );

  if (priceError) {
    errors.price = priceError;
  }

  const feesError = validateRequiredNumber(
    transaction.fees,
    "Fees",
    0
  );

  if (feesError) {
    errors.fees = feesError;
  }

  if (!isFiniteNumber(transaction.total)) {
    errors.total = "Total must be a valid number.";
  }

  const currency = normaliseCurrency(
    transaction.currency
  );

  if (!/^[A-Z]{3}$/.test(currency)) {
    errors.currency =
      "Currency must use a three-letter code such as AUD or USD.";
  }

  if (
    transaction.type === "BUY" ||
    transaction.type === "SELL"
  ) {
    if (
      isFiniteNumber(transaction.quantity) &&
      transaction.quantity === 0
    ) {
      errors.quantity =
        "Buy and sell transactions require a quantity greater than zero.";
    }

    if (
      isFiniteNumber(transaction.price) &&
      transaction.price === 0
    ) {
      warnings.push(
        "This buy or sell transaction has a zero price."
      );
    }
  }

  if (
    transaction.type === "DIVIDEND" &&
    transaction.total === 0
  ) {
    warnings.push(
      "This dividend transaction has a zero total."
    );
  }

  if (
    transaction.type === "FEE" &&
    transaction.fees === 0 &&
    transaction.total === 0
  ) {
    warnings.push(
      "This fee transaction has no fee or total value."
    );
  }

  const calculatedGross =
    transaction.quantity * transaction.price;

  if (
    (transaction.type === "BUY" ||
      transaction.type === "SELL") &&
    Number.isFinite(calculatedGross)
  ) {
    const expectedWithFees =
      transaction.type === "BUY"
        ? calculatedGross + transaction.fees
        : calculatedGross - transaction.fees;

    const difference = Math.abs(
      expectedWithFees - transaction.total
    );

    if (difference > 0.02) {
      warnings.push(
        "The entered total differs from quantity × price adjusted for fees."
      );
    }
  }

  if (
    transaction.notes &&
    transaction.notes.length > 2000
  ) {
    errors.notes =
      "Notes must be 2,000 characters or fewer.";
  }

  if (
    transaction.broker &&
    transaction.broker.length > 120
  ) {
    errors.broker =
      "Broker name must be 120 characters or fewer.";
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
    warnings,
  };
}

export function sanitiseEditableTransaction(
  transaction: NormalisedTransaction
): NormalisedTransaction {
  return {
    ...transaction,
    date: transaction.date.trim(),
    symbol: normaliseSymbol(transaction.symbol),
    name: transaction.name?.trim() ?? "",
    broker: transaction.broker?.trim() ?? "",
    notes: transaction.notes?.trim() ?? "",
    currency: normaliseCurrency(transaction.currency),
    quantity: Number(transaction.quantity),
    price: Number(transaction.price),
    fees: Number(transaction.fees),
    total: Number(transaction.total),
  };
}

export function recalculateTransactionTotal(
  transaction: NormalisedTransaction
) {
  const gross =
    Number(transaction.quantity || 0) *
    Number(transaction.price || 0);

  if (transaction.type === "BUY") {
    return gross + Number(transaction.fees || 0);
  }

  if (transaction.type === "SELL") {
    return gross - Number(transaction.fees || 0);
  }

  if (transaction.type === "FEE") {
    return Number(transaction.fees || transaction.total || 0);
  }

  return Number(transaction.total || 0);
}

export function hasTransactionChanged(
  original: NormalisedTransaction,
  draft: NormalisedTransaction
) {
  const normalisedOriginal =
    sanitiseEditableTransaction(original);

  const normalisedDraft =
    sanitiseEditableTransaction(draft);

  const keys: Array<keyof NormalisedTransaction> = [
    "date",
    "symbol",
    "name",
    "type",
    "quantity",
    "price",
    "fees",
    "total",
    "currency",
    "broker",
    "notes",
  ];

  return keys.some(
    (key) =>
      normalisedOriginal[key] !==
      normalisedDraft[key]
  );
}

export function getTransactionChangeSummary(
  original: NormalisedTransaction,
  draft: NormalisedTransaction
) {
  const labels: Partial<
    Record<keyof NormalisedTransaction, string>
  > = {
    date: "Date",
    symbol: "Symbol",
    name: "Company name",
    type: "Type",
    quantity: "Quantity",
    price: "Price",
    fees: "Fees",
    total: "Total",
    currency: "Currency",
    broker: "Broker",
    notes: "Notes",
  };

  const keys: Array<keyof NormalisedTransaction> = [
    "date",
    "symbol",
    "name",
    "type",
    "quantity",
    "price",
    "fees",
    "total",
    "currency",
    "broker",
    "notes",
  ];

  return keys
    .filter((key) => original[key] !== draft[key])
    .map((key) => labels[key] ?? String(key));
}
