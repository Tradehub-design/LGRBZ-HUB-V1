#!/usr/bin/env bash
set -e

echo "🔧 Fixing analytics transaction total using safe runtime fields..."

python3 <<'PY'
from pathlib import Path

p = Path("src/app/(dashboard)/analytics/page.tsx")
text = p.read_text()

old = '''      const transactionTotal =
        Math.abs(transaction.totalAud ?? 0) ||
        Math.abs(transaction.valueAud ?? 0) ||
        Math.abs((transaction.quantity ?? 0) * (transaction.priceAud ?? 0)) ||
        0;'''

new = '''      const transactionRecord = transaction as unknown as Record<string, number | string | undefined>;
      const quantity = Number(transactionRecord.quantity ?? transactionRecord.units ?? 0);
      const price = Number(transactionRecord.priceAud ?? transactionRecord.price ?? transactionRecord.unitPrice ?? 0);
      const transactionTotal =
        Math.abs(Number(transactionRecord.totalFeesIncludedAud ?? 0)) ||
        Math.abs(Number(transactionRecord.totalAud ?? 0)) ||
        Math.abs(Number(transactionRecord.valueAud ?? 0)) ||
        Math.abs(Number(transactionRecord.amountAud ?? 0)) ||
        Math.abs(Number(transactionRecord.amount ?? 0)) ||
        Math.abs(quantity * price) ||
        0;'''

if old not in text:
    raise SystemExit("Expected block not found in analytics page")

text = text.replace(old, new)
p.write_text(text)
PY

npm run build
