"use client";

import { useEffect, useRef } from "react";
import { applyLedger } from "@/lib/transactions/applyLedger";
import { loadTxLedger } from "@/lib/transactions/ledgerStorage";

export default function PortfolioPersistenceProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const hydrated = useRef(false);

  useEffect(() => {
    if (hydrated.current) return;
    hydrated.current = true;

    const saved = loadTxLedger();

    if (saved.length > 0) {
      applyLedger(saved, "local-ledger");
    }
  }, []);

  return <>{children}</>;
}
