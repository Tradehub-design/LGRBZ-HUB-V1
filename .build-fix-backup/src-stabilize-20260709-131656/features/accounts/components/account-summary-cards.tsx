import { accounts } from "../mock-data";
import {
  formatAccountMoney,
  formatAccountPercent,
} from "../format";

export function AccountSummaryCards() {
  const totalValue = accounts.reduce(
    (sum, account) => sum + account.currentValue,
    0
  );

  const totalCash = accounts.reduce(
    (sum, account) => sum + account.cashBalance,
    0
  );

  const totalPnL = accounts.reduce(
    (sum, account) => sum + account.unrealisedPnl,
    0
  );

  const avgReturn =
    accounts.reduce(
      (sum, account) => sum + account.totalReturnPercent,
      0
    ) / accounts.length;

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <Card title="Portfolio Value" value={formatAccountMoney(totalValue)} />
      <Card title="Cash Balance" value={formatAccountMoney(totalCash)} />
      <Card title="Unrealised P/L" value={formatAccountMoney(totalPnL)} />
      <Card title="Average Return" value={formatAccountPercent(avgReturn)} />
    </div>
  );
}

function Card({
  title,
  value,
}: {
  title: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="text-sm text-slate-500">{title}</div>
      <div className="mt-3 text-2xl font-semibold text-slate-950">
        {value}
      </div>
    </div>
  );
}
