import { dashboardSummary } from "../mock-data";
import { formatMoney, formatPercent } from "../format";

export function DashboardFooterSummary() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-950 p-5 text-white shadow-sm">
      <div className="grid gap-4 md:grid-cols-4">
        <div>
          <div className="text-xs font-medium uppercase tracking-wide text-slate-400">
            Portfolio Value
          </div>
          <div className="mt-2 text-xl font-semibold">
            {formatMoney(dashboardSummary.portfolioValue)}
          </div>
        </div>

        <div>
          <div className="text-xs font-medium uppercase tracking-wide text-slate-400">
            Total P/L
          </div>
          <div className="mt-2 text-xl font-semibold text-emerald-300">
            {formatMoney(dashboardSummary.totalPnL)}
          </div>
        </div>

        <div>
          <div className="text-xs font-medium uppercase tracking-wide text-slate-400">
            Return
          </div>
          <div className="mt-2 text-xl font-semibold text-emerald-300">
            {formatPercent(dashboardSummary.totalPnLPercent)}
          </div>
        </div>

        <div>
          <div className="text-xs font-medium uppercase tracking-wide text-slate-400">
            Cash
          </div>
          <div className="mt-2 text-xl font-semibold">
            {formatMoney(dashboardSummary.cashBalance)}
          </div>
        </div>
      </div>
    </div>
  );
}
