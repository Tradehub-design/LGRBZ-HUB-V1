#!/usr/bin/env bash
set -e

echo "🔧 Replacing dashboard old transaction total field..."

python3 <<'PY'
from pathlib import Path

p = Path("src/app/(dashboard)/dashboard/page.tsx")
text = p.read_text()

text = text.replace(
  "formatMoney(tx.totalFeesIncludedAud, 2)",
  "formatMoney(getTransactionTotal(tx), 2)"
)

if "function getTransactionTotal(" not in text:
    text += r'''

function getTransactionTotal(transaction: unknown): number {
  const record = transaction as Record<string, number | string | undefined>;
  const quantity = Number(record.quantity ?? record.units ?? 0);
  const price = Number(record.priceAud ?? record.price ?? record.unitPrice ?? 0);

  return (
    Math.abs(Number(record.totalFeesIncludedAud ?? 0)) ||
    Math.abs(Number(record.totalAud ?? 0)) ||
    Math.abs(Number(record.valueAud ?? 0)) ||
    Math.abs(Number(record.amountAud ?? 0)) ||
    Math.abs(Number(record.amount ?? 0)) ||
    Math.abs(quantity * price) ||
    0
  );
}
'''

p.write_text(text)
PY

npm run build
