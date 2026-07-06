"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { Badge } from "@/components/ui/Badge";
import { formatCurrency, formatDate, formatNumber } from "@/lib/formatters";
import { useDashboardData } from "./useDashboardData";

export function RecentTransactionsCard() {
  const { recentTransactions } = useDashboardData();

  if (recentTransactions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <div>
            <CardTitle>Recent Transactions</CardTitle>
            <CardDescription>Latest activity from your master ledger.</CardDescription>
          </div>
        </CardHeader>

        <CardContent>
          <EmptyState
            title="No transactions"
            description="Import your ledger to populate this section."
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div>
          <CardTitle>Recent Transactions</CardTitle>
          <CardDescription>Latest imported activity.</CardDescription>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {recentTransactions.map((tx) => (
          <div
            key={tx.id}
            className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] p-4"
          >
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <p className="font-semibold text-white">
                  {tx.assetTicker}
                </p>

                <Badge tone="blue">
                  {tx.action}
                </Badge>
              </div>

              <p className="mt-1 text-xs text-slate-500">
                {formatDate(tx.date)}
              </p>
            </div>

            <div className="text-right">
              <p className="text-sm font-semibold text-white">
                {formatNumber(tx.quantity)}
              </p>

              <p className="mt-1 text-xs text-slate-500">
                {formatCurrency(tx.totalFeesIncludedAud)}
              </p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
}
