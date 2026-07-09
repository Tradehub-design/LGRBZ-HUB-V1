#!/usr/bin/env bash
set -e

echo "🔧 Forcing income chart data amount to number..."

python3 <<'PY'
from pathlib import Path

p = Path("src/app/(dashboard)/income-intelligence/page.tsx")
text = p.read_text()

text = text.replace(
  "<IncomeBarChart data={chartData} />",
  "<IncomeBarChart data={chartData.map((item) => ({ month: item.month, amount: Number(item.amount ?? 0) }))} />"
)

p.write_text(text)
PY

npm run build
