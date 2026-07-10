#!/usr/bin/env bash
set -e

echo "🔧 Fixing Transactions sheet header row..."

python3 <<'PY'
from pathlib import Path

p = Path("src/lib/import/excel/readMasterWorkbook.ts")
text = p.read_text()

text = text.replace(
'''  const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(worksheet, {
    defval: "",
    raw: false,
  });''',
'''  const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(worksheet, {
    defval: "",
    raw: false,
    range: 1,
  });'''
)

p.write_text(text)
PY

npm run build
