export const LGRBZ_LEDGER_CHANGED_EVENT =
  "lgrbz:ledger-changed";

export const LGRBZ_TRANSACTIONS_CHANGED_EVENT =
  "lgrbz:transactions-changed";

export function dispatchLedgerChanged() {
  if (
    typeof window ===
    "undefined"
  ) {
    return;
  }

  window.dispatchEvent(
    new CustomEvent(
      LGRBZ_LEDGER_CHANGED_EVENT
    )
  );

  window.dispatchEvent(
    new CustomEvent(
      LGRBZ_TRANSACTIONS_CHANGED_EVENT
    )
  );
}
