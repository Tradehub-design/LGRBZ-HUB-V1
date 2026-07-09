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
