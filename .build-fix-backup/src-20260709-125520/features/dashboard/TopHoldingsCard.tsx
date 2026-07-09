"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { formatCurrency, formatNumber } from "@/lib/formatters";
import { useDashboardData } from "./useDashboardData";

export function TopHoldingsCard() {
  const { topHoldings } = useDashboardData();

  return (
    <Card>
      <CardHeader>
        <div>
          <CardTitle>Top holdings</CardTitle>
          <CardDescription>Largest open positions by cost base.</CardDescription>
        </div>
      </CardHeader>

      <CardContent>
        {topHoldings.length === 0 ? (
          <EmptyState
            title="No holdings yet"
            description="Import your master ledger to calculate holdings automatically."
          />
        ) : (
          <div className="space-y-3">
            {topHoldings.map((holding) => (
              <div
                key={holding.id}
                className="flex items-center justify-between gap-4 rounded-[22px] border border-white/8 bg-white/[0.03] p-4"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="truncate text-sm font-semibold text-white">{holding.ticker}</p>
                    <Badge tone="neutral">{holding.assetClass}</Badge>
                  </div>
                  <p className="mt-1 text-xs text-slate-500">
                    {formatNumber(holding.quantity, 4)} units · {holding.platform}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-sm font-semibold text-white">
                    {formatCurrency(holding.totalCostAud)}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">{holding.weightPercent}% weight</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
