#!/usr/bin/env bash
set -e

echo "🔧 Fixing income chart amount type..."

python3 <<'PY'
from pathlib import Path

p = Path("src/app/(dashboard)/income-intelligence/page.tsx")
text = p.read_text()

text = text.replace(
  "amount,",
  "amount: Number(amount ?? 0),"
)

text = text.replace(
  "amount: total,",
  "amount: Number(total ?? 0),"
)

text = text.replace(
  "amount: value,",
  "amount: Number(value ?? 0),"
)

p.write_text(text)
PY

npm run build
