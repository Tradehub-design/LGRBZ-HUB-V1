"use client";

import { useBusinessSnapshot } from "@/hooks/useBusinessSnapshot";

type Props = {
  dividends?: unknown;
};

export default function IncomeCalendar(_props: Props) {
  const { dividends } = useBusinessSnapshot();
  const records = dividends.records;

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
