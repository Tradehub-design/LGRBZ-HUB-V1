#!/usr/bin/env bash
set -e

echo "🔧 Portfolio Engine V2 Bash 5/5: diagnostics + import centre visibility..."

cat > src/components/portfolio/PortfolioEngineStatus.tsx <<'TSX'
"use client";

import { Trash2 } from "lucide-react";
import { usePortfolioStore } from "@/store/portfolioStore";
import { clearStoredTransactions } from "@/core/portfolio-v2/storage";

export default function PortfolioEngineStatus() {
  const transactions = usePortfolioStore((state) => state.transactions);
  const holdings = usePortfolioStore((state) => state.holdings);
  const cashAccounts = usePortfolioStore((state) => state.cashAccounts);
  const engine = usePortfolioStore((state) => state.engine);

  function clearPortfolio() {
    if (!confirm("Clear imported portfolio data from this browser?")) return;
    clearStoredTransactions();
    window.location.reload();
  }

  return (
    <div className="rounded-2xl border border-cyan-500/20 bg-slate-950/70 p-5">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-white">Portfolio Engine V2 Status</h2>
          <p className="text-sm text-slate-400">
            Confirms the imported/manual transactions are feeding the dashboard engine.
          </p>
        </div>

        <button
          type="button"
          onClick={clearPortfolio}
          className="inline-flex items-center justify-center rounded-xl border border-red-500/30 px-4 py-2 text-sm font-semibold text-red-200 hover:bg-red-500/10"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Clear Local Portfolio
        </button>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-4">
        <Stat label="Transactions" value={transactions.length} />
        <Stat label="Holdings" value={holdings.length} />
        <Stat label="Cash Accounts" value={cashAccounts.length} />
        <Stat label="Valid Rows" value={engine.validRows ?? 0} />
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-white/10 bg-black/20 p-4">
      <p className="text-sm text-slate-400">{label}</p>
      <p className="mt-1 text-2xl font-bold text-white">{Number(value).toLocaleString()}</p>
    </div>
  );
}
TSX

python3 <<'PY'
from pathlib import Path

# Add diagnostics to import centre
p = Path("src/app/(dashboard)/import-centre/page.tsx")
text = p.read_text()

if "PortfolioEngineStatus" not in text:
    text = text.replace(
        'import { importIntoPortfolio } from "@/lib/import/store/importIntoPortfolio";',
        'import { importIntoPortfolio } from "@/lib/import/store/importIntoPortfolio";\nimport PortfolioEngineStatus from "@/components/portfolio/PortfolioEngineStatus";'
    )
    text = text.replace(
        '<div className="space-y-6 p-6">',
        '<div className="space-y-6 p-6">\n      <PortfolioEngineStatus />',
        1
    )

p.write_text(text)
PY

npm run build
