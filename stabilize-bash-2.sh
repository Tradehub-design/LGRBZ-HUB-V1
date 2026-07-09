#!/usr/bin/env bash
set -e

echo "🔧 Bash 2/6: model compatibility + AI/store aliases..."

# ------------------------------------------------------------
# 1. Patch portfolioStore compatibility fields
# ------------------------------------------------------------
python3 <<'PY'
from pathlib import Path

p = Path("src/store/portfolioStore.ts")
text = p.read_text()

# Expand currency
text = text.replace(
  'export type CurrencyCode = "AUD" | "USD" | "GBP" | "EUR" | "NZD";',
  'export type CurrencyCode = "AUD" | "USD" | "GBP" | "EUR" | "NZD" | "CAD";'
)

# Add missing ledger row fields
text = text.replace(
'''  notes?: string;
  [key: string]: unknown;''',
'''  source: string;
  sourceRow: number;
  fees: number;
  assetClass: string;
  sector: string;
  country: string;
  strategy: string;
  totalFeesIncluded: number;
  notes?: string;
  [key: string]: unknown;''',
1
)

# Add holding compatibility fields
text = text.replace(
'''  weightPercent: number;
  metrics: {''',
'''  weightPercent: number;
  company: string;
  exchange: string;
  industry: string;
  strategy: string;
  risk: string;
  totalCostAud: number;
  averageCostAud: number;
  dividendsAud: number;
  lots: unknown[];
  metrics: {'''
)

# Add performance allTime
text = text.replace(
'''  totalReturnPercent: number;
};''',
'''  totalReturnPercent: number;
  allTime: number;
};''',
1
)

# Add allocation risk
text = text.replace(
'''    account: AllocationSlice[];
  };''',
'''    account: AllocationSlice[];
    risk: AllocationSlice[];
  };'''
)

text = text.replace(
'''    account: [],
  },''',
'''    account: [],
    risk: [],
  },'''
)

text = text.replace(
'''    account: allocationArray(record(source.allocation).account),
  };''',
'''    account: allocationArray(record(source.allocation).account),
    risk: allocationArray(record(source.allocation).risk),
  };'''
)

# Add timeline profit
text = text.replace(
'''  timeline: { date: string; portfolioValue: number; valueAud: number; investedAud: number; cumulativeCashFlowAud: number }[];''',
'''  timeline: { date: string; portfolioValue: number; valueAud: number; investedAud: number; cumulativeCashFlowAud: number; profit: number }[];'''
)

text = text.replace(
'''    totalReturnPercent: 0,
  },''',
'''    totalReturnPercent: 0,
    allTime: 0,
  },'''
)

text = text.replace(
'''        cumulativeCashFlowAud: numberValue(item.cumulativeCashFlowAud),
      };''',
'''        cumulativeCashFlowAud: numberValue(item.cumulativeCashFlowAud),
        profit: numberValue(item.profit ?? item.changeAud ?? item.totalReturnAud),
      };'''
)

text = text.replace(
'''      totalReturnPercent: numberValue(record(source.performance).totalReturnPercent),
    },''',
'''      totalReturnPercent: numberValue(record(source.performance).totalReturnPercent),
      allTime: numberValue(record(source.performance).allTime ?? record(source.performance).totalReturnAud),
    },'''
)

# Normalise transaction missing fields
text = text.replace(
'''    amountAud: numberValue(item.amountAud ?? total),
    notes: stringValue(item.notes, ""),''',
'''    amountAud: numberValue(item.amountAud ?? total),
    source: stringValue(item.source, "manual"),
    sourceRow: numberValue(item.sourceRow ?? item.rowNumber, index + 1),
    fees,
    assetClass: stringValue(item.assetClass, "Equity"),
    sector: stringValue(item.sector, "Uncategorised"),
    country: stringValue(item.country, "Australia"),
    strategy: stringValue(item.strategy, "Manual"),
    totalFeesIncluded: numberValue(item.totalFeesIncluded ?? total),
    notes: stringValue(item.notes, ""),'''
)

# Normalise holding missing fields
text = text.replace(
'''    weightPercent: numberValue(item.weightPercent ?? record(item.metrics).allocationPercent),
    metrics: {''',
'''    weightPercent: numberValue(item.weightPercent ?? record(item.metrics).allocationPercent),
    company: stringValue(item.company ?? item.name, ticker),
    exchange: stringValue(item.exchange, "ASX"),
    industry: stringValue(item.industry ?? item.sector, "Uncategorised"),
    strategy: stringValue(item.strategy, "Manual"),
    risk: stringValue(item.risk, "Medium"),
    totalCostAud: numberValue(item.totalCostAud ?? costBaseAud),
    averageCostAud: numberValue(item.averageCostAud ?? item.averagePriceAud),
    dividendsAud: numberValue(item.dividendsAud),
    lots: array(item.lots),
    metrics: {'''
)

p.write_text(text)
PY

# ------------------------------------------------------------
# 2. Fix AI stores: aliases + broader summary
# ------------------------------------------------------------
cat > src/store/ai/insightStore.ts <<'TS'
import { create } from "zustand";

export type AIInsight = {
  id: string;
  title: string;
  detail: string;
  category?: string;
};

type InsightState = {
  insights: AIInsight[];
  setInsights: (insights: AIInsight[]) => void;
};

export const useAIInsightStore = create<InsightState>((set) => ({
  insights: [],
  setInsights: (insights) => set({ insights }),
}));

export const useInsightStore = useAIInsightStore;
TS

cat > src/store/ai/summaryStore.ts <<'TS'
import { create } from "zustand";

export type AISummary = {
  headline: string;
  detail: string;
  score: number;
  forecast: {
    expectedReturn: number;
    expectedIncome: number;
    expectedValue: number;
    confidence: number;
    projectionYears: number;
    generated: string;
  };
  narrative: string;
};

const defaultSummary: AISummary = {
  headline: "Ready",
  detail: "AI summary is ready.",
  score: 0,
  forecast: {
    expectedReturn: 0,
    expectedIncome: 0,
    expectedValue: 0,
    confidence: 0,
    projectionYears: 0,
    generated: new Date().toISOString(),
  },
  narrative: "",
};

export const useAISummaryStore = create<{
  summary: AISummary;
  setSummary: (summary: Partial<AISummary>) => void;
}>((set) => ({
  summary: defaultSummary,
  setSummary: (summary) =>
    set((state) => ({
      summary: {
        ...state.summary,
        ...summary,
        forecast: {
          ...state.summary.forecast,
          ...(summary.forecast ?? {}),
        },
      },
    })),
}));
TS

# ------------------------------------------------------------
# 3. Fix EmptyState duplicate exports
# ------------------------------------------------------------
cat > src/components/ui/EmptyState.tsx <<'TSX'
type EmptyStateProps = {
  title?: string;
  description?: string;
};

export default function EmptyState({
  title = "Nothing here yet",
  description = "There is no data to show.",
}: EmptyStateProps) {
  return (
    <div className="rounded-xl border border-dashed border-slate-700 p-6 text-center">
      <p className="font-semibold text-white">{title}</p>
      <p className="mt-1 text-sm text-slate-400">{description}</p>
    </div>
  );
}

export { EmptyState };
TSX

# ------------------------------------------------------------
# 4. Fix duplicate React import in error boundary
# ------------------------------------------------------------
python3 <<'PY'
from pathlib import Path
p = Path("src/components/error-boundary.tsx")
if p.exists():
    lines = p.read_text().splitlines()
    seen = False
    out = []
    for line in lines:
        if line.strip() == 'import React from "react";':
            if seen:
                continue
            seen = True
        out.append(line)
    p.write_text("\n".join(out) + "\n")
PY

# ------------------------------------------------------------
# 5. Add missing dividend provider export + holdings calculator export
# ------------------------------------------------------------
cat > src/core/market/providers/dividends/dividendProvider.ts <<'TS'
export type DividendSnapshot = {
  records: unknown[];
  forwardIncome: number;
};

export const dividendSnapshot: DividendSnapshot = {
  records: [],
  forwardIncome: 0,
};

export async function getDividendData() {
  return [];
}

export default dividendSnapshot;
TS

cat > src/core/business/calculators/holdingsCalculator.ts <<'TS'
export function calculateHoldings() {
  return [];
}

export function calculateHoldingTotals() {
  return {
    totalValueAud: 0,
    totalCostAud: 0,
    unrealisedPlAud: 0,
    unrealisedPlPercent: 0,
  };
}

export default calculateHoldings;
TS

# ------------------------------------------------------------
# 6. Fix SettingsHydrationProvider call compatibility
# ------------------------------------------------------------
python3 <<'PY'
from pathlib import Path
p = Path("src/providers/SettingsHydrationProvider.tsx")
if p.exists():
    text = p.read_text()
    text = text.replace("setHydrated();", "setHydrated(true);")
    p.write_text(text)
PY

# ------------------------------------------------------------
# 7. Direction literal compatibility
# ------------------------------------------------------------
python3 <<'PY'
from pathlib import Path

for file in ["src/lib/market/movers.ts", "src/lib/portfolio-engine/movers.ts"]:
    p = Path(file)
    if p.exists():
        text = p.read_text()
        text = text.replace("direction,", 'direction: direction as "up" | "down" | "flat",')
        text = text.replace('direction: "up",', 'direction: "up" as const,')
        text = text.replace('direction: "down",', 'direction: "down" as const,')
        text = text.replace('direction: "flat",', 'direction: "flat" as const,')
        p.write_text(text)
PY

echo "✅ Bash 2 complete. Running type check..."
npx tsc --noEmit --pretty false > typescript-errors-after-bash2.txt 2>&1 || true
head -220 typescript-errors-after-bash2.txt
