"use client";

import {
  BadgeDollarSign,
  BriefcaseBusiness,
  ChartNoAxesCombined,
  CircleDollarSign,
  ReceiptText,
  WalletCards,
} from "lucide-react";
import { Metric } from "@/components/ui/Metric";
import { formatCurrency, formatPercent } from "@/lib/formatters";
import { useDashboardData } from "./useDashboardData";

export function DashboardMetricGrid() {
  const data = useDashboardData();

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-6">
      <Metric
        label="Portfolio value"
        value={formatCurrency(data.totalValueAud)}
        change={data.loaded ? "Ledger value" : "Import ledger"}
        tone="neutral"
        icon={<CircleDollarSign className="h-5 w-5" />}
        className="xl:col-span-2"
      />

      <Metric
        label="Invested cost"
        value={formatCurrency(data.totalCostAud)}
        change={`${data.openHoldings.length} open`}
        tone="neutral"
        icon={<BriefcaseBusiness className="h-5 w-5" />}
      />

      <Metric
        label="Cash"
        value={formatCurrency(data.totalCashAud)}
        change={`${data.cashAccounts.length} accounts`}
        tone="neutral"
        icon={<WalletCards className="h-5 w-5" />}
      />

      <Metric
        label="Return"
        value={formatCurrency(data.totalReturnAud)}
        change={formatPercent(data.totalReturnPercent)}
        tone={data.totalReturnAud > 0 ? "positive" : data.totalReturnAud < 0 ? "negative" : "neutral"}
        icon={<ChartNoAxesCombined className="h-5 w-5" />}
      />

      <Metric
        label="Dividends"
        value={formatCurrency(data.totalDividendsAud)}
        change={`${data.dividends.length} records`}
        tone="positive"
        icon={<BadgeDollarSign className="h-5 w-5" />}
      />

      <Metric
        label="Transactions"
        value={data.transactions.length}
        change="Master ledger"
        tone="neutral"
        icon={<ReceiptText className="h-5 w-5" />}
      />
    </div>
  );
}
