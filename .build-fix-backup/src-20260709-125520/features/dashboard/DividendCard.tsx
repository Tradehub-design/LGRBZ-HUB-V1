"use client";

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { Badge } from "@/components/ui/Badge";
import { formatCurrency, formatDate } from "@/lib/formatters";
import { useDashboardData } from "./useDashboardData";

export function DividendCard() {
  const { latestDividends } = useDashboardData();

  return (
    <Card>
      <CardHeader>
        <div>
          <CardTitle>Latest Dividends</CardTitle>
          <CardDescription>
            Dividend and interest payments.
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent>
        {latestDividends.length === 0 ? (
          <EmptyState
            title="No dividends"
            description="Dividend payments will appear here."
          />
        ) : (
          <div className="space-y-3">
            {latestDividends.map((dividend) => (
              <div
                key={dividend.id}
                className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] p-4"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-white">
                      {dividend.ticker}
                    </p>

                    <Badge tone="green">
                      Dividend
                    </Badge>
                  </div>

                  <p className="mt-1 text-xs text-slate-500">
                    {formatDate(dividend.date)}
                  </p>
                </div>

                <p className="font-semibold text-emerald-300">
                  {formatCurrency(dividend.amountAud)}
                </p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
