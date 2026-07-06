import { transactions } from "../mock-data";
import { formatTransactionMoney } from "../format";

export function TransactionSummaryCards() {
  const totalValue = transactions.reduce(
    (sum, tx) => sum + tx.total,
    0
  );

  const buys = transactions.filter(
    (tx) => tx.type === "Buy"
  ).length;

  const dividends = transactions.filter(
    (tx) => tx.type === "Dividend"
  ).length;

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <Card title="Transactions" value={transactions.length.toString()} />

      <Card title="Buys" value={buys.toString()} />

      <Card title="Dividends" value={dividends.toString()} />

      <Card
        title="Total Value"
        value={formatTransactionMoney(totalValue)}
      />
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
