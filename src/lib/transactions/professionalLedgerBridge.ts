import {
  NormalisedTransaction,
  normaliseTransaction,
} from "@/lib/transactions/professionalTransactions";
import {
  loadTxLedger,
  saveTxLedger,
} from "@/lib/transactions/ledgerStorage";

export type LedgerRecord = Record<string, unknown>;

export type ProfessionalLedgerMutationResult = {
  rows: LedgerRecord[];
  updatedRow?: LedgerRecord;
  removedRows?: LedgerRecord[];
};

const PROFESSIONAL_FIELDS = [
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
] as const;

function isRecord(
  value: unknown
): value is LedgerRecord {
  return (
    Boolean(value) &&
    typeof value === "object" &&
    !Array.isArray(value)
  );
}

function asLedgerRows(
  value: unknown
): LedgerRecord[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter(isRecord);
}

function firstDefined(
  record: LedgerRecord,
  keys: string[]
) {
  for (const key of keys) {
    const value = record[key];

    if (
      value !== undefined &&
      value !== null &&
      value !== ""
    ) {
      return value;
    }
  }

  return undefined;
}

function stableLedgerId(
  row: LedgerRecord,
  index: number
) {
  const existing = firstDefined(row, [
    "id",
    "transactionId",
    "transaction_id",
    "tradeId",
    "trade_id",
    "uuid",
  ]);

  if (existing !== undefined) {
    return String(existing);
  }

  const date = String(
    firstDefined(row, [
      "date",
      "tradeDate",
      "trade_date",
      "transactionDate",
      "transaction_date",
    ]) ?? ""
  );

  const symbol = String(
    firstDefined(row, [
      "symbol",
      "ticker",
      "code",
      "securityCode",
      "security_code",
    ]) ?? ""
  ).toUpperCase();

  const type = String(
    firstDefined(row, [
      "type",
      "transactionType",
      "transaction_type",
      "action",
      "side",
    ]) ?? ""
  ).toUpperCase();

  const quantity = String(
    firstDefined(row, [
      "quantity",
      "qty",
      "units",
      "shares",
    ]) ?? ""
  );

  const price = String(
    firstDefined(row, [
      "price",
      "unitPrice",
      "unit_price",
      "priceAud",
      "price_aud",
      "costPerShare",
      "cost_per_share",
    ]) ?? ""
  );

  return [
    "ledger",
    date,
    symbol,
    type,
    quantity,
    price,
    index,
  ].join("-");
}

function ensureLedgerIds(
  rows: LedgerRecord[]
) {
  return rows.map((row, index) => {
    const id = stableLedgerId(
      row,
      index
    );

    if (
      row.id !== undefined &&
      row.id !== null &&
      String(row.id).trim()
    ) {
      return row;
    }

    return {
      ...row,
      id,
    };
  });
}

export function loadProfessionalLedgerRows() {
  const loaded = loadTxLedger();

  return ensureLedgerIds(
    asLedgerRows(loaded)
  );
}

export function saveProfessionalLedgerRows(
  rows: LedgerRecord[]
) {
  saveTxLedger(rows as never);
}

export function ledgerRowsToProfessionalTransactions(
  rows: LedgerRecord[]
): NormalisedTransaction[] {
  return rows.map(
    (row, index) =>
      normaliseTransaction(
        {
          ...row,
          id: stableLedgerId(
            row,
            index
          ),
        },
        index
      )
  );
}

export function loadProfessionalTransactions() {
  return ledgerRowsToProfessionalTransactions(
    loadProfessionalLedgerRows()
  );
}

function findLedgerRowIndex(
  rows: LedgerRecord[],
  transactionId: string
) {
  return rows.findIndex(
    (row, index) =>
      stableLedgerId(
        row,
        index
      ) === transactionId
  );
}

function detectExistingKey(
  row: LedgerRecord,
  candidates: string[],
  fallback: string
) {
  const existing = candidates.find(
    (key) =>
      Object.prototype.hasOwnProperty.call(
        row,
        key
      )
  );

  return existing ?? fallback;
}

function assignProfessionalValue(
  target: LedgerRecord,
  source: NormalisedTransaction,
  professionalField:
    (typeof PROFESSIONAL_FIELDS)[number]
) {
  if (professionalField === "date") {
    const key = detectExistingKey(
      target,
      [
        "date",
        "tradeDate",
        "trade_date",
        "transactionDate",
        "transaction_date",
      ],
      "date"
    );

    target[key] = source.date;
    return;
  }

  if (professionalField === "symbol") {
    const key = detectExistingKey(
      target,
      [
        "symbol",
        "ticker",
        "code",
        "securityCode",
        "security_code",
      ],
      "symbol"
    );

    target[key] =
      source.symbol
        .trim()
        .toUpperCase();

    return;
  }

  if (professionalField === "name") {
    const key = detectExistingKey(
      target,
      [
        "name",
        "companyName",
        "company_name",
        "securityName",
        "security_name",
      ],
      "name"
    );

    target[key] =
      source.name ?? "";

    return;
  }

  if (professionalField === "type") {
    const key = detectExistingKey(
      target,
      [
        "type",
        "transactionType",
        "transaction_type",
        "action",
        "side",
      ],
      "type"
    );

    target[key] = source.type;
    return;
  }

  if (professionalField === "quantity") {
    const key = detectExistingKey(
      target,
      [
        "quantity",
        "qty",
        "units",
        "shares",
      ],
      "quantity"
    );

    target[key] =
      Number(source.quantity);

    return;
  }

  if (professionalField === "price") {
    const key = detectExistingKey(
      target,
      [
        "price",
        "unitPrice",
        "unit_price",
        "priceAud",
        "price_aud",
        "costPerShare",
        "cost_per_share",
      ],
      "price"
    );

    target[key] =
      Number(source.price);

    return;
  }

  if (professionalField === "fees") {
    const key = detectExistingKey(
      target,
      [
        "fees",
        "fee",
        "brokerage",
        "commission",
      ],
      "fees"
    );

    target[key] =
      Number(source.fees);

    return;
  }

  if (professionalField === "total") {
    const key = detectExistingKey(
      target,
      [
        "total",
        "value",
        "amount",
        "totalAud",
        "total_aud",
        "consideration",
      ],
      "total"
    );

    target[key] =
      Number(source.total);

    return;
  }

  if (professionalField === "currency") {
    const key = detectExistingKey(
      target,
      [
        "currency",
        "currencyCode",
        "currency_code",
      ],
      "currency"
    );

    target[key] =
      String(
        source.currency ?? "AUD"
      )
        .trim()
        .toUpperCase();

    return;
  }

  if (professionalField === "broker") {
    const key = detectExistingKey(
      target,
      [
        "broker",
        "platform",
        "account",
        "accountName",
        "account_name",
      ],
      "broker"
    );

    target[key] =
      source.broker ?? "";

    return;
  }

  const key = detectExistingKey(
    target,
    [
      "notes",
      "description",
      "memo",
      "comment",
    ],
    "notes"
  );

  target[key] =
    source.notes ?? "";
}

function mergeProfessionalTransactionIntoLedgerRow(
  ledgerRow: LedgerRecord,
  transaction: NormalisedTransaction
) {
  const updated: LedgerRecord = {
    ...ledgerRow,
  };

  PROFESSIONAL_FIELDS.forEach(
    (field) => {
      assignProfessionalValue(
        updated,
        transaction,
        field
      );
    }
  );

  updated.id =
    ledgerRow.id ??
    transaction.id;

  return updated;
}

export function updateProfessionalLedgerTransaction(
  transaction: NormalisedTransaction
): ProfessionalLedgerMutationResult {
  const rows =
    loadProfessionalLedgerRows();

  const index =
    findLedgerRowIndex(
      rows,
      transaction.id
    );

  if (index < 0) {
    throw new Error(
      `Transaction ${transaction.id} was not found in the ledger.`
    );
  }

  const updatedRow =
    mergeProfessionalTransactionIntoLedgerRow(
      rows[index],
      transaction
    );

  const nextRows = [
    ...rows,
  ];

  nextRows[index] =
    updatedRow;

  saveProfessionalLedgerRows(
    nextRows
  );

  return {
    rows: nextRows,
    updatedRow,
  };
}

export function deleteProfessionalLedgerTransaction(
  transaction: NormalisedTransaction
): ProfessionalLedgerMutationResult {
  const rows =
    loadProfessionalLedgerRows();

  const index =
    findLedgerRowIndex(
      rows,
      transaction.id
    );

  if (index < 0) {
    throw new Error(
      `Transaction ${transaction.id} was not found in the ledger.`
    );
  }

  const removedRows = [
    rows[index],
  ];

  const nextRows =
    rows.filter(
      (_, rowIndex) =>
        rowIndex !== index
    );

  saveProfessionalLedgerRows(
    nextRows
  );

  return {
    rows: nextRows,
    removedRows,
  };
}

export function deleteProfessionalLedgerTransactions(
  transactions: NormalisedTransaction[]
): ProfessionalLedgerMutationResult {
  if (
    transactions.length === 0
  ) {
    return {
      rows:
        loadProfessionalLedgerRows(),
      removedRows: [],
    };
  }

  const rows =
    loadProfessionalLedgerRows();

  const requestedIds =
    new Set(
      transactions.map(
        (transaction) =>
          transaction.id
      )
    );

  const removedRows:
    LedgerRecord[] = [];

  const nextRows =
    rows.filter(
      (row, index) => {
        const id =
          stableLedgerId(
            row,
            index
          );

        if (
          requestedIds.has(id)
        ) {
          removedRows.push(
            row
          );

          return false;
        }

        return true;
      }
    );

  if (
    removedRows.length !==
    requestedIds.size
  ) {
    throw new Error(
      `Unable to locate all selected transactions. Found ${removedRows.length} of ${requestedIds.size}.`
    );
  }

  saveProfessionalLedgerRows(
    nextRows
  );

  return {
    rows: nextRows,
    removedRows,
  };
}

function professionalTransactionToLedgerRow(
  transaction: NormalisedTransaction
): LedgerRecord {
  return {
    id: transaction.id,
    date: transaction.date,
    symbol:
      transaction.symbol
        .trim()
        .toUpperCase(),
    name:
      transaction.name ?? "",
    type: transaction.type,
    quantity:
      Number(
        transaction.quantity
      ),
    price:
      Number(
        transaction.price
      ),
    fees:
      Number(
        transaction.fees
      ),
    total:
      Number(
        transaction.total
      ),
    currency:
      String(
        transaction.currency ??
          "AUD"
      )
        .trim()
        .toUpperCase(),
    broker:
      transaction.broker ??
      "",
    notes:
      transaction.notes ??
      "",
  };
}

export function restoreProfessionalLedgerTransactions(
  transactions: NormalisedTransaction[]
): ProfessionalLedgerMutationResult {
  const rows =
    loadProfessionalLedgerRows();

  const existingIds =
    new Set(
      rows.map(
        (row, index) =>
          stableLedgerId(
            row,
            index
          )
      )
    );

  const restoredRows =
    transactions
      .filter(
        (transaction) =>
          !existingIds.has(
            transaction.id
          )
      )
      .map(
        professionalTransactionToLedgerRow
      );

  const nextRows = [
    ...rows,
    ...restoredRows,
  ];

  saveProfessionalLedgerRows(
    nextRows
  );

  return {
    rows: nextRows,
    updatedRow:
      restoredRows[0],
  };
}
