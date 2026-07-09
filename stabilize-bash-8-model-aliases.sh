#!/usr/bin/env bash
set -e

echo "🔧 Bash 8: fixing model aliases and transaction shape..."

# 1. Add missing shared aliases and CNY
python3 <<'PY'
from pathlib import Path

p = Path("src/types/portfolio.ts")
text = p.read_text()

text = text.replace(
  '| "CHF";',
  '| "CHF"\n  | "CNY";'
)

if "export type RiskLevel" not in text:
    text += '''

export type RiskLevel = string;
export type TransactionAction = string;
'''
p.write_text(text)
PY

# 2. Patch portfolioStore LedgerRow/Dividend shape
python3 <<'PY'
from pathlib import Path

p = Path("src/store/portfolioStore.ts")
text = p.read_text()

text = text.replace(
  '| "CHF";',
  '| "CHF"\n  | "CNY";'
)

text = text.replace(
  'value === "CHF"',
  'value === "CHF" ||\n    value === "CNY"'
)

# Add LedgerRow missing fields if needed
if "marketPriceAud: number;" not in text:
    text = text.replace("priceAud: number;", "priceAud: number;\n  marketPriceAud: number;", 1)

if "amount: number;" not in text.split("export type PortfolioDividend")[0]:
    text = text.replace("amountAud: number;", "amount: number;\n  amountAud: number;", 1)

# Add PortfolioDividend amount type if missing
section_start = text.find("export type PortfolioDividend")
section_end = text.find("export type PortfolioCashAccount")
div_section = text[section_start:section_end]
if "amount: number;" not in div_section:
    div_section = div_section.replace("amountAud: number;", "amount: number;\n  amountAud: number;")
    text = text[:section_start] + div_section + text[section_end:]

# Add normalised transaction fields
text = text.replace(
'''    priceAud: numberValue(item.priceAud ?? price),
    fiatFees: fees,''',
'''    priceAud: numberValue(item.priceAud ?? price),
    marketPriceAud: numberValue(item.marketPriceAud ?? item.priceAud ?? price),
    fiatFees: fees,'''
)

text = text.replace(
'''    amountAud: numberValue(item.amountAud ?? total),''',
'''    amount: numberValue(item.amount ?? item.amountAud ?? total),
    amountAud: numberValue(item.amountAud ?? item.amount ?? total),'''
)

# Add normalised dividend amount
text = text.replace(
'''    amountAud: numberValue(item.amountAud ?? item.amount),''',
'''    amount: numberValue(item.amount ?? item.amountAud),
    amountAud: numberValue(item.amountAud ?? item.amount),'''
)

p.write_text(text)
PY

# 3. Replace AddTransactionDialog with safe complete LedgerRow creation
python3 <<'PY'
from pathlib import Path

p = Path("src/components/transactions/AddTransactionDialog.tsx")
text = p.read_text()

start = text.find("addTransaction({")
if start != -1:
    depth = 0
    end = None
    for i in range(start, len(text)):
        if text[i] == "{":
            depth += 1
        elif text[i] == "}":
            depth -= 1
            if depth == 0:
                end = i + 1
                break

    if end:
        replacement = '''addTransaction({
id: crypto.randomUUID(),
raw: {},
rowNumber: Date.now(),
source: "manual",
sourceRow: Date.now(),
date: form.date!,
action: form.action!,
type: form.action!,
assetTicker: form.assetTicker!,
ticker: form.assetTicker!,
quantity: Number(form.quantity),
price: Number(form.price),
priceAud: Number(form.price),
marketPriceAud: Number(form.price),
fees: Number(form.fees),
fiatFees: Number(form.fees),
feesAud: Number(form.fees),
currency: form.currency as any,
platform: form.platform!,
assetClass: "Equity",
sector: "Uncategorised",
country: "Australia",
strategy: "Manual",
total: Number(form.quantity) * Number(form.price) + Number(form.fees),
totalAud: Number(form.quantity) * Number(form.price) + Number(form.fees),
totalFeesIncluded: Number(form.quantity) * Number(form.price) + Number(form.fees),
totalFeesIncludedAud: Number(form.quantity) * Number(form.price) + Number(form.fees),
amount: Number(form.quantity) * Number(form.price) + Number(form.fees),
amountAud: Number(form.quantity) * Number(form.price) + Number(form.fees),
notes: form.notes ?? "",
}'''
        text = text[:start] + replacement + text[end:]

p.write_text(text)
PY

echo "✅ Bash 8 complete. Running type check..."
npx tsc --noEmit --pretty false > typescript-errors-after-bash8.txt 2>&1 || true
head -220 typescript-errors-after-bash8.txt
