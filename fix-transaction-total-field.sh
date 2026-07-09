#!/usr/bin/env bash
set -e

echo "🔧 Fixing transaction total field mismatch..."

# Replace old field with safe computed helper in analytics page
python3 <<'PY'
from pathlib import Path

p = Path("src/app/(dashboard)/analytics/page.tsx")
text = p.read_text()

text = text.replace(
'''      if (transaction.action === "Buy") current.buys += transaction.totalFeesIncludedAud;
      if (transaction.action === "Sell") current.sells += transaction.totalFeesIncludedAud;
      if (transaction.action === "Cash Dividend") current.dividends += transaction.totalFeesIncludedAud;
      if (transaction.action === "Cash Deposit") current.deposits += transaction.totalFeesIncludedAud;''',
'''      const transactionTotal =
        Math.abs(transaction.totalAud ?? 0) ||
        Math.abs(transaction.valueAud ?? 0) ||
        Math.abs((transaction.quantity ?? 0) * (transaction.priceAud ?? 0)) ||
        0;

      if (transaction.action === "Buy") current.buys += transactionTotal;
      if (transaction.action === "Sell") current.sells += transactionTotal;
      if (transaction.action === "Cash Dividend") current.dividends += transactionTotal;
      if (transaction.action === "Cash Deposit") current.deposits += transactionTotal;'''
)

p.write_text(text)
PY

npm run build
