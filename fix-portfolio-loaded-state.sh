#!/usr/bin/env bash
set -e

echo "🔧 Adding missing portfolio loaded state..."

python3 <<'PY'
from pathlib import Path

candidates = list(Path("src").rglob("*portfolio*Store*.ts")) + list(Path("src/store").rglob("*.ts"))

target = None
for p in candidates:
    text = p.read_text(errors="ignore")
    if "PortfolioState" in text and "rawLedgerCsv" in text:
        target = p
        break

if target is None:
    raise SystemExit("Could not find PortfolioState store file")

print(f"Patching {target}")
text = target.read_text()

# Add loaded to PortfolioState type/interface if missing
if "loaded:" not in text:
    text = text.replace(
        "rawLedgerCsv:",
        "loaded: boolean;\n  rawLedgerCsv:",
        1
    )

# Add loaded to Zustand initial object if missing
if "loaded: false" not in text and "loaded: true" not in text:
    text = text.replace(
        "rawLedgerCsv:",
        "loaded: false,\n  rawLedgerCsv:",
        1
    )

# Whenever raw ledger is loaded/set, mark loaded true if obvious setter exists
text = text.replace(
    "rawLedgerCsv: csv",
    "loaded: true,\n      rawLedgerCsv: csv"
)

text = text.replace(
    "rawLedgerCsv: value",
    "loaded: true,\n      rawLedgerCsv: value"
)

target.write_text(text)
PY

npm run build
