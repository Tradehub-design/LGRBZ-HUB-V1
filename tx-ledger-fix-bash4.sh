#!/usr/bin/env bash
set -e

echo "🔧 Transaction Ledger Fix Bash 4/4: sidebar link + ledger status..."

python3 <<'PY'
from pathlib import Path

p = Path("src/lib/constants.ts")
text = p.read_text()

if "import-centre" not in text:
    text = text.replace(
        'href: "/transactions",',
        'href: "/transactions",\n        },\n        {\n          id: "import-centre",\n          label: "Import Centre",\n          href: "/import-centre",'
    )

p.write_text(text)
PY

python3 <<'PY'
from pathlib import Path

p = Path("src/app/(dashboard)/import-centre/page.tsx")
text = p.read_text()

if "engineStatus" not in text:
    text = text.replace(
'''  summary?: {
    sheetCount: number;
    transactionCount: number;
  };
};''',
'''  engineStatus?: {
    transactions: number;
    holdings: number;
    openHoldings: number;
    dividends: number;
  };
  summary?: {
    sheetCount: number;
    transactionCount: number;
  };
};'''
)

text = text.replace(
'''            <Stat label="Apply Method" value={result.applyMethod ?? "none"} />''',
'''            <Stat label="Apply Method" value={result.applyMethod ?? "none"} />
            <Stat label="Ledger Rows" value={String(result.engineStatus?.transactions ?? 0)} />
            <Stat label="Holdings Built" value={String(result.engineStatus?.holdings ?? 0)} />'''
)

p.write_text(text)
PY

npm run build
