import {
  NormalisedTransaction,
  transactionsToCsv,
} from "@/lib/transactions/professionalTransactions";

export type TransactionCopyField =
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

export async function writeTransactionClipboard(
  value: string
) {
  if (
    typeof navigator !== "undefined" &&
    navigator.clipboard &&
    typeof navigator.clipboard.writeText === "function"
  ) {
    await navigator.clipboard.writeText(
      value
    );

    return;
  }

  if (
    typeof document === "undefined"
  ) {
    throw new Error(
      "Clipboard access is unavailable."
    );
  }

  const textarea =
    document.createElement(
      "textarea"
    );

  textarea.value = value;
  textarea.setAttribute(
    "readonly",
    ""
  );

  textarea.style.position =
    "fixed";
  textarea.style.opacity =
    "0";
  textarea.style.pointerEvents =
    "none";

  document.body.appendChild(
    textarea
  );

  textarea.select();

  const copied =
    document.execCommand(
      "copy"
    );

  textarea.remove();

  if (!copied) {
    throw new Error(
      "Clipboard copy failed."
    );
  }
}

export function getTransactionFieldValue(
  transaction: NormalisedTransaction,
  field: TransactionCopyField
) {
  const value =
    transaction[field];

  if (
    value === undefined ||
    value === null
  ) {
    return "";
  }

  return String(value);
}

export function transactionToClipboardText(
  transaction: NormalisedTransaction
) {
  const rows = [
    [
      "Date",
      transaction.date,
    ],
    [
      "Symbol",
      transaction.symbol,
    ],
    [
      "Company",
      transaction.name ?? "",
    ],
    [
      "Type",
      transaction.type,
    ],
    [
      "Quantity",
      transaction.quantity,
    ],
    [
      "Price",
      transaction.price,
    ],
    [
      "Fees",
      transaction.fees,
    ],
    [
      "Total",
      transaction.total,
    ],
    [
      "Currency",
      transaction.currency ?? "AUD",
    ],
    [
      "Broker",
      transaction.broker ?? "",
    ],
    [
      "Notes",
      transaction.notes ?? "",
    ],
  ];

  return rows
    .map(
      ([label, value]) =>
        `${label}: ${String(
          value ?? ""
        )}`
    )
    .join("\n");
}

export function transactionToClipboardCsv(
  transaction: NormalisedTransaction
) {
  return transactionsToCsv([
    transaction,
  ]);
}
