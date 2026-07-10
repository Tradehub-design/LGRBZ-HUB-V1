#!/usr/bin/env bash
set -e

echo "🔧 Fixing constants nav syntax..."

python3 <<'PY'
from pathlib import Path

p = Path("src/lib/constants.ts")
text = p.read_text()

text = text.replace(
'''      { id: "transactions", label: "Transactions", href: "/transactions", icon: "ReceiptText", description: "Ledger and trade history." },
      { id: "import-centre", label: "Import Centre", href: "/import-centre", icon: "UploadCloud", description: "One-time workbook import." }, icon: "ArrowLeftRight", description: "Source ledger." },''',
'''      { id: "transactions", label: "Transactions", href: "/transactions", icon: "ArrowLeftRight", description: "Source ledger." },
      { id: "import-centre", label: "Import Centre", href: "/import-centre", icon: "UploadCloud", description: "One-time workbook import." },'''
)

p.write_text(text)
PY

npm run build
