import { dashboardSummary } from "../mock-data";
import { formatMoney, formatPercent } from "../format";
import { MetricCard } from "./metric-card";

export function SummaryCards() {
  const summary = dashboardSummary;

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <MetricCard
        title="Portfolio Value"
        value={formatMoney(summary.portfolioValue, summary.currency)}
        change={formatPercent(summary.dailyPnLPercent)}
        positive={summary.dailyPnL >= 0}
      />

      <MetricCard
        title="Invested Value"
        value={formatMoney(summary.investedValue, summary.currency)}
      />

      <MetricCard
        title="Cash Balance"
        value={formatMoney(summary.cashBalance, summary.currency)}
      />

      <MetricCard
        title="Total Profit / Loss"
        value={formatMoney(summary.totalPnL, summary.currency)}
        change={formatPercent(summary.totalPnLPercent)}
        positive={summary.totalPnL >= 0}
      />
    </div>
  );
}
