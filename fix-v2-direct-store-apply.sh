#!/usr/bin/env bash
set -e

echo "🔧 Fixing Portfolio V2 apply to avoid recursive normalise loop..."

cat > src/core/portfolio-v2/apply.ts <<'TS'
import type { MasterTransaction } from "./types";
import { normaliseTransactions } from "./normalise";
import { buildPortfolioEngineV2 } from "./engine";
import { toLegacyPortfolioEngine } from "./toLegacyStore";
import { saveStoredTransactions } from "./storage";
import { usePortfolioStore } from "@/store/portfolioStore";

export function applyPortfolioTransactions(rows: any[], source = "portfolio-v2") {
  const transactions: MasterTransaction[] = normaliseTransactions(rows);
  const engineV2 = buildPortfolioEngineV2(transactions);
  const legacyEngine = toLegacyPortfolioEngine(engineV2);

  usePortfolioStore.setState({
    loaded: true,
    rawLedgerCsv: source,
    engine: legacyEngine,
    portfolio: legacyEngine.portfolio,
    transactions: legacyEngine.transactions,
    holdings: legacyEngine.holdings,
    openHoldings: legacyEngine.openHoldings,
    closedHoldings: legacyEngine.closedHoldings,
    dividends: legacyEngine.dividends,
    cashAccounts: legacyEngine.cashAccounts,
  });

  saveStoredTransactions(transactions);

  return {
    transactions,
    engineV2,
    legacyEngine,
  };
}
TS

cat > src/providers/PortfolioPersistenceProvider.tsx <<'TSX'
"use client";

import { useEffect, useRef } from "react";
import { applyPortfolioTransactions } from "@/core/portfolio-v2/apply";
import { loadStoredTransactions } from "@/core/portfolio-v2/storage";

export default function PortfolioPersistenceProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const hydrated = useRef(false);

  useEffect(() => {
    if (hydrated.current) return;
    hydrated.current = true;

    const stored = loadStoredTransactions();

    if (stored.length > 0) {
      applyPortfolioTransactions(stored, "local-storage-v2");
    }
  }, []);

  return <>{children}</>;
}
TSX

npm run build
