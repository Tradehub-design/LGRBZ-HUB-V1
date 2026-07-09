"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";

import { useDashboardData } from "../useDashboardData";

import {
  formatCurrency,
} from "@/lib/formatters";

export function PortfolioSummaryCard() {
  const data =
    useDashboardData();

  return (
    <Card>

      <CardHeader>

        <CardTitle>
          Portfolio Summary
        </CardTitle>

      </CardHeader>

      <CardContent>

        <div className="space-y-5">

          <SummaryRow
            label="Portfolio Value"
            value={formatCurrency(
              data.totalValueAud,
            )}
          />

          <SummaryRow
            label="Invested"
            value={formatCurrency(
              data.totalCostAud,
            )}
          />

          <SummaryRow
            label="Cash"
            value={formatCurrency(
              data.totalCashAud,
            )}
          />

          <SummaryRow
            label="Dividends"
            value={formatCurrency(
              data.totalDividendsAud,
            )}
          />

          <SummaryRow
            label="Realised P/L"
            value={formatCurrency(
              data.realisedPlAud,
            )}
          />

        </div>

      </CardContent>

    </Card>
  );
}

type Props = {
  label: string;
  value: string;
};

function SummaryRow({
  label,
  value,
}: Props) {
  return (
    <div className="flex items-center justify-between">

      <span className="text-slate-400">
        {label}
      </span>

      <span className="font-semibold text-white">
        {value}
      </span>

    </div>
  );
}
