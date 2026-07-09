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
