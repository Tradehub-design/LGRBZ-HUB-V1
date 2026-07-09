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
