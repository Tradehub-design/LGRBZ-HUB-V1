"use client";

import {
  DividendCentreRouteBridge,
} from "@/components/dividend-centre-v2";
import {
  useBusinessSnapshot,
} from "@/hooks/useBusinessSnapshot";

export default function DividendsPage() {
  const snapshot =
    useBusinessSnapshot();

  return (
    <DividendCentreRouteBridge
      snapshot={
        snapshot
      }
      holdings={
        snapshot.holdings
      }
      transactions={
        snapshot.transactions
      }
      portfolio={
        snapshot.portfolio
      }
      data={
        snapshot
      }
      baseCurrency="AUD"
    />
  );
}
