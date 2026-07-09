#!/usr/bin/env bash
set -e

echo "🔧 Bash 4/6: safe UI compatibility components..."

# ------------------------------------------------------------
# 1. Fix core currency + performance compatibility
# ------------------------------------------------------------
python3 <<'PY'
from pathlib import Path

p = Path("src/store/portfolioStore.ts")
text = p.read_text()

text = text.replace(
  'export type CurrencyCode = "AUD" | "USD" | "GBP" | "EUR" | "NZD" | "CAD";',
  'export type CurrencyCode = "AUD" | "USD" | "GBP" | "EUR" | "NZD" | "CAD" | "JPY" | "HKD" | "SGD";'
)

p.write_text(text)
PY

# ------------------------------------------------------------
# 2. Safe dashboard cards
# ------------------------------------------------------------
cat > src/components/dashboard/CashPositionCard.tsx <<'TSX'
"use client";

import { useBusinessSnapshot } from "@/hooks/useBusinessSnapshot";

export default function CashPositionCard() {
  const { cashAccounts } = useBusinessSnapshot();

  const rows = [
    ["Cash", cashAccounts.totalCash],
    ["Deposits", cashAccounts.totalDeposits],
    ["Withdrawals", cashAccounts.totalWithdrawals],
    ["Dividends", cashAccounts.totalDividends],
    ["Interest", cashAccounts.totalInterest],
  ];

  return (
    <div className="rounded-2xl border bg-card p-5">
      <h3 className="font-semibold">Cash Position</h3>
      <div className="mt-4 space-y-3">
        {rows.map(([label, value]) => (
          <div key={String(label)} className="flex justify-between text-sm">
            <span className="text-muted-foreground">{label}</span>
            <span className="font-medium">${Number(value).toLocaleString()}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
TSX

cat > src/components/dashboard/DividendIncomeCard.tsx <<'TSX'
"use client";

import { useBusinessSnapshot } from "@/hooks/useBusinessSnapshot";

export default function DividendIncomeCard() {
  const { dividends } = useBusinessSnapshot();

  const rows = [
    ["Yearly", dividends.yearly],
    ["Monthly", dividends.monthly],
    ["Forward Income", dividends.forwardIncome],
    ["Total", dividends.total],
  ];

  return (
    <div className="rounded-2xl border bg-card p-5">
      <h3 className="font-semibold">Dividend Income</h3>
      <div className="mt-4 space-y-3">
        {rows.map(([label, value]) => (
          <div key={String(label)} className="flex justify-between text-sm">
            <span className="text-muted-foreground">{label}</span>
            <span className="font-medium">${Number(value).toLocaleString()}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
TSX

cat > src/components/dividends/IncomeCalendar.tsx <<'TSX'
"use client";

import { useBusinessSnapshot } from "@/hooks/useBusinessSnapshot";

type Props = {
  dividends?: unknown;
};

export default function IncomeCalendar(_props: Props) {
  const { dividends } = useBusinessSnapshot();
  const records = dividends.records ?? [];

  return (
    <div className="space-y-3">
      {records.length === 0 ? (
        <p className="text-sm text-muted-foreground">No dividend records yet.</p>
      ) : (
        records.map((dividend) => (
          <div key={dividend.id} className="flex justify-between rounded-lg border p-3 text-sm">
            <span>{dividend.ticker} · {dividend.date}</span>
            <span>${dividend.amountAud.toLocaleString()}</span>
          </div>
        ))
      )}
    </div>
  );
}
TSX

cat > src/components/dividends/FutureIncome.tsx <<'TSX'
"use client";

import { useBusinessSnapshot } from "@/hooks/useBusinessSnapshot";

export default function FutureIncome() {
  const { dividends } = useBusinessSnapshot();

  return (
    <div className="rounded-2xl border bg-card p-5">
      <p className="text-sm text-muted-foreground">Forward Income</p>
      <p className="mt-2 text-2xl font-bold">${dividends.forwardIncome.toLocaleString()}</p>
    </div>
  );
}
TSX

cat > src/components/holdings/HoldingDividends.tsx <<'TSX'
"use client";

import { useBusinessSnapshot } from "@/hooks/useBusinessSnapshot";

export default function HoldingDividends() {
  const { dividends } = useBusinessSnapshot();
  const records = dividends.records ?? [];

  return (
    <div className="space-y-3">
      {records.map((item) => (
        <div key={item.id} className="flex justify-between rounded-lg border p-3 text-sm">
          <span>{item.ticker}</span>
          <span>${item.amountAud.toLocaleString()}</span>
        </div>
      ))}
    </div>
  );
}
TSX

# ------------------------------------------------------------
# 3. Safe replay components
# ------------------------------------------------------------
cat > src/components/replay/AnimatedPortfolioValue.tsx <<'TSX'
"use client";

import CountUp from "react-countup";
import { useBusinessSnapshot } from "@/hooks/useBusinessSnapshot";

export default function AnimatedPortfolioValue() {
  const { portfolioValue, cashAccounts } = useBusinessSnapshot();

  return (
    <div className="rounded-2xl border bg-card p-5">
      <p className="text-sm text-muted-foreground">Portfolio Value</p>
      <p className="mt-2 text-3xl font-bold">
        $<CountUp end={portfolioValue} separator="," duration={0.8} />
      </p>
      <p className="mt-1 text-sm text-muted-foreground">
        Cash ${cashAccounts.totalCash.toLocaleString()}
      </p>
    </div>
  );
}
TSX

cat > src/components/replay/ReplayStatistics.tsx <<'TSX'
"use client";

import { useBusinessSnapshot } from "@/hooks/useBusinessSnapshot";

export default function ReplayStatistics() {
  const { cashAccounts, timeline } = useBusinessSnapshot();

  return (
    <div className="grid gap-3 md:grid-cols-3">
      <Stat label="Cash" value={cashAccounts.totalCash} />
      <Stat label="Timeline Points" value={timeline.length} />
      <Stat label="Dividends" value={cashAccounts.totalDividends} />
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border bg-card p-4">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="mt-1 text-xl font-semibold">{Number(value).toLocaleString()}</p>
    </div>
  );
}
TSX

cat > src/components/replay/HistoricalHoldings.tsx <<'TSX'
"use client";

import { useBusinessSnapshot } from "@/hooks/useBusinessSnapshot";

export default function HistoricalHoldings() {
  const { holdings } = useBusinessSnapshot();

  return (
    <div className="space-y-3">
      {holdings.map((holding) => (
        <div key={holding.id} className="flex justify-between rounded-lg border p-3 text-sm">
          <span>{holding.ticker}</span>
          <span>${holding.valueAud.toLocaleString()}</span>
        </div>
      ))}
    </div>
  );
}
TSX

cat > src/components/replay/ReplayBanner.tsx <<'TSX'
"use client";

import { useBusinessSnapshot } from "@/hooks/useBusinessSnapshot";

export default function ReplayBanner() {
  const { portfolioValue } = useBusinessSnapshot();

  return (
    <div className="rounded-2xl border bg-card p-5">
      <p className="text-sm text-muted-foreground">Replay Snapshot</p>
      <p className="mt-2 text-2xl font-bold">${portfolioValue.toLocaleString()}</p>
    </div>
  );
}
TSX

# ------------------------------------------------------------
# 4. Safe AI/health cards that were fighting old core Portfolio type
# ------------------------------------------------------------
cat > src/components/ai/PortfolioInsights.tsx <<'TSX'
"use client";

import { useBusinessSnapshot } from "@/hooks/useBusinessSnapshot";

export default function PortfolioInsights() {
  const { holdings, riskScore, healthScore } = useBusinessSnapshot();

  return (
    <div className="rounded-2xl border bg-card p-5">
      <h3 className="font-semibold">Portfolio Insights</h3>
      <p className="mt-2 text-sm text-muted-foreground">
        {holdings.length} holdings tracked. Health score {healthScore}/100. Risk score {riskScore}.
      </p>
    </div>
  );
}
TSX

cat > src/components/dashboard/PortfolioHealthCard.tsx <<'TSX'
"use client";

import { useBusinessSnapshot } from "@/hooks/useBusinessSnapshot";

export default function PortfolioHealthCard() {
  const { healthScore, riskScore } = useBusinessSnapshot();

  return (
    <div className="rounded-2xl border bg-card p-5">
      <h3 className="font-semibold">Portfolio Health</h3>
      <p className="mt-3 text-3xl font-bold">{healthScore}/100</p>
      <p className="mt-1 text-sm text-muted-foreground">Risk score: {riskScore}</p>
    </div>
  );
}
TSX

# ------------------------------------------------------------
# 5. Fix duplicate React import again, strongly
# ------------------------------------------------------------
python3 <<'PY'
from pathlib import Path

p = Path("src/components/error-boundary.tsx")
if p.exists():
    lines = p.read_text().splitlines()
    seen_react = False
    out = []
    for line in lines:
        if line.strip() == 'import React from "react";':
            if seen_react:
                continue
            seen_react = True
        out.append(line)
    p.write_text("\n".join(out) + "\n")
PY

echo "✅ Bash 4 complete. Running type check..."
npx tsc --noEmit --pretty false > typescript-errors-after-bash4.txt 2>&1 || true
head -220 typescript-errors-after-bash4.txt
